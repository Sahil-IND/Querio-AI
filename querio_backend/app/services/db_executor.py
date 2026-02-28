import psycopg2
import psycopg2.extras
from app.config import settings

class DBExecutor:
    def execute(self, sql: str):
        conn = psycopg2.connect(
            host=settings.SUPABASE_DB_HOST,
            port=settings.SUPABASE_DB_PORT,
            dbname=settings.SUPABASE_DB_NAME,
            user=settings.SUPABASE_DB_USER,
            password=settings.SUPABASE_DB_PASSWORD
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        try:
            cur.execute(sql)
            rows = cur.fetchall()
            return rows
        except Exception as e:
            # Re-raise with more context
            raise Exception(f"SQL execution error: {str(e)}\nSQL: {sql}")
        finally:
            cur.close()
            conn.close()