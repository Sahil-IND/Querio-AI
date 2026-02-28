# app/services/sql_schema_service.py
import psycopg2
from app.config import settings

class SQLSchemaService:
    def fetch_schema(self):
        conn = psycopg2.connect(
            host=settings.SUPABASE_DB_HOST,
            port=settings.SUPABASE_DB_PORT,
            dbname=settings.SUPABASE_DB_NAME,
            user=settings.SUPABASE_DB_USER,
            password=settings.SUPABASE_DB_PASSWORD
        )
        cur = conn.cursor()
        cur.execute("""
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows

    def get_schema_prompt(self) -> str:
        rows = self.fetch_schema()
        schema = {}
        for table, column, dtype in rows:
            schema.setdefault(table, []).append(f"{column} ({dtype})")

        prompt = ["Database Schema:", ""]
        for table, cols in schema.items():
            prompt.append(f"Table: {table}")
            for col in cols:
                prompt.append(f"  - {col}")
            prompt.append("")
        
        # Add sample data context for better SQL generation
        prompt.append("Sample Context:")
        prompt.append("- Companies: enterprise SaaS customers with plans (free, starter, pro, enterprise)")
        prompt.append("- Users: employees of companies with roles (admin, billing, member, viewer)")
        prompt.append("- Subscriptions: recurring revenue with monthly/annual billing")
        prompt.append("- Invoices: payment records with status (paid, overdue, sent)")
        prompt.append("- Support Tickets: customer issues with priority and status")
        prompt.append("- Products: SaaS products with categories and pricing")
        prompt.append("- Product Reviews: customer feedback with ratings 1-5")
        
        return "\n".join(prompt)