"""DEMO DATA ONLY for local testing. Do not use real student data without school authorisation.
Delete these rows before real use."""
from datetime import date, timedelta
from werkzeug.security import generate_password_hash as h
from app import get_db

conn = get_db(); cur = conn.cursor()
cur.execute("INSERT IGNORE INTO student VALUES ('DEMO001','Demo Student',5,'A',%s)", (h("student123"),))
cur.execute("INSERT IGNORE INTO teacher (teacher_name,username,password_hash) VALUES ('Demo Teacher','teacher1',%s)", (h("teacher123"),))
cur.execute("INSERT IGNORE INTO admin (admin_name,username,password_hash) VALUES ('Demo Admin','admin1',%s)", (h("admin123"),))
for i in range(1, 8):
    cur.execute("INSERT IGNORE INTO attendance (admission_no,attendance_date,status) VALUES ('DEMO001',%s,%s)",
                (date.today() - timedelta(days=i), "Absent" if i == 4 else "Present"))
conn.commit(); conn.close(); print("Demo data inserted.")
