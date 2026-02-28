# test_upload.py

from app.services.ingest_service import IngestService

def main():
    ingest_service = IngestService()
    result = ingest_service.ingest_text_file("sample.txt")
    print("✅ Ingestion result:", result)

if __name__ == "__main__":
    main()