import psycopg2

conn = psycopg2.connect(
    dbname="postgres",
    user="govtech",
    password="govtech@123",
    host="localhost",
    port="5432"
)
conn.autocommit = True
cursor = conn.cursor()
cursor.execute("DROP DATABASE IF EXISTS hcrf_test_migrations")
cursor.execute("CREATE DATABASE hcrf_test_migrations")
conn.close()
print("Database created.")
