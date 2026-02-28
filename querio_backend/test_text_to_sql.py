from app.services.sql_schema_service import SQLSchemaService
from app.services.ollama_llm_service import OllamaLLMService
from app.services.db_executor import DBExecutor
from app.services.text_to_sql_service import TextToSQLService

service = TextToSQLService(
    schema_service=SQLSchemaService(),
    llm_service=OllamaLLMService(),
    db_executor=DBExecutor()
)

result = service.run("Show all customers")
print(result)