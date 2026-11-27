import os
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from werkzeug.security import check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from functools import wraps

load_dotenv()
app = Flask(__name__)
CORS(app, origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")])
serializer = URLSafeTimedSerializer(os.getenv("SECRET_KEY", ""))

def get_db():
    opts = {}
    if os.getenv("DB_SSL") == "true":
        import certifi
        opts = {"ssl_ca": certifi.where(), "ssl_verify_cert": True}
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"), port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"), password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"), connection_timeout=8, **opts)

def query(sql, params=(), one=False):
    conn = get_db()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params)
        return cur.fetchone() if one else cur.fetchall()
    finally:
        conn.close()

# Fixed whitelist: SQL identifiers never come from user input.
ROLES = {
    "student": ("SELECT admission_no AS id, student_name AS name, class_number, section, password_hash FROM student WHERE admission_no = %s"),
    "teacher": ("SELECT teacher_id AS id, teacher_name AS name, username, password_hash FROM teacher WHERE username = %s"),
    "admin":   ("SELECT admin_id AS id, admin_name AS name, username, password_hash FROM admin WHERE username = %s"),
}

def login(role):
    data = request.get_json(silent=True) or {}
    ident = str(data.get("username", "")).strip()
    pw = str(data.get("password", ""))
    if not ident or not pw:
        return jsonify(error="Please enter both the ID/username and the password."), 400
    if len(ident) > 50 or len(pw) > 128:
        return jsonify(error="Input is too long."), 400
    user = query(ROLES[role], (ident,), one=True)
    if not user or not check_password_hash(user.pop("password_hash"), pw):
        return jsonify(error="Invalid credentials. Please check and try again."), 401
    token = serializer.dumps({"role": role, "id": str(user["id"])})
    return jsonify(token=token, role=role, user=user), 200

def require(*roles):
    def deco(fn):
        @wraps(fn)
        def wrapper(*a, **kw):
            auth = request.headers.get("Authorization", "")
            if not auth.startswith("Bearer "):
                return jsonify(error="Authentication required."), 401
            try:
                payload = serializer.loads(auth[7:], max_age=8 * 3600)
            except (BadSignature, SignatureExpired):
                return jsonify(error="Session expired. Please log in again."), 401
            if payload["role"] not in roles:
                return jsonify(error="Access denied."), 403
            g.auth = payload
            return fn(*a, **kw)
        return wrapper
    return deco

@app.get("/api/health")
def health():
    return jsonify(status="ok")

@app.get("/api/db-test")
def db_test():
    query("SELECT 1 AS ok", one=True)
    return jsonify(database="connected")

@app.post("/api/student/login")
def student_login(): return login("student")

@app.post("/api/teacher/login")
def teacher_login(): return login("teacher")

@app.post("/api/admin/login")
def admin_login(): return login("admin")

@app.get("/api/student/attendance")
@require("student")
def attendance():
    rows = query("SELECT attendance_date, status FROM attendance WHERE admission_no = %s ORDER BY attendance_date DESC",
                 (g.auth["id"],))
    present = sum(1 for r in rows if r["status"] == "Present")
    total = len(rows)
    return jsonify(
        records=[{"date": r["attendance_date"].isoformat(), "status": r["status"]} for r in rows],
        total=total, present=present, absent=total - present,
        percentage=round(present * 100 / total, 1) if total else None)

@app.get("/api/summary")
@require("teacher", "admin")
def summary():
    s = query("SELECT COUNT(*) AS n FROM student", one=True)["n"]
    t = query("SELECT COUNT(*) AS n FROM teacher", one=True)["n"]
    by_class = query("SELECT class_number, COUNT(*) AS n FROM student GROUP BY class_number ORDER BY class_number")
    return jsonify(students=s, teachers=t, by_class=by_class)

@app.errorhandler(mysql.connector.Error)
def db_error(e):
    app.logger.error("DB error: %s", e)
    return jsonify(error="Database is unavailable. Please try again later."), 503

@app.errorhandler(404)
def nf(e): return jsonify(error="Not found."), 404

@app.errorhandler(Exception)
def unexpected(e):
    app.logger.exception(e)
    return jsonify(error="Unexpected server error."), 500

if __name__ == "__main__":
    app.run(port=5000, debug=os.getenv("FLASK_DEBUG") == "1")