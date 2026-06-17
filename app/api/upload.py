from app.services.embedding_service import create_embeddings
from app.services.vector_service import store_chunks
from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_pdf_text
from app.services.chunking_service import create_chunks
import os

router = APIRouter()

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_pdf_text(file_path)

    chunks = create_chunks(text)

    embeddings = create_embeddings(chunks)

    stored_chunks = store_chunks(
        chunks,
        embeddings,
        file.filename
    )

    word_count = len(text.split())
    character_count = len(text)

    print("Saved file to:", os.path.abspath(file_path))
    print("Number of chunks:", len(chunks))

    return {
        "filename": file.filename,
        "characters": character_count,
        "words": word_count,
        "chunks": len(chunks),
        "stored_chunks": stored_chunks,
        "embedding_dimension": len(embeddings[0]),
        "first_chunk": chunks[0][:300] if chunks else "",
        "preview": text[:500]
    }


@router.get("/documents")
def get_documents():

    files = []

    for file in os.listdir(UPLOAD_FOLDER):

        if file.endswith(".pdf"):

            files.append(file)

    return {
        "documents": files
    }