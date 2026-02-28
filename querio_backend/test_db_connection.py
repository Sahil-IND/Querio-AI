import psycopg2
from app.config import settings

conn = psycopg2.connect(
    host=settings.SUPABASE_DB_HOST,
    port=settings.SUPABASE_DB_PORT,
    dbname=settings.SUPABASE_DB_NAME,
    user=settings.SUPABASE_DB_USER,
    password=settings.SUPABASE_DB_PASSWORD,
    sslmode="require"
)

cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
print(cur.fetchall())

conn.close()