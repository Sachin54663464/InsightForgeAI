from app.services.rag_service import ask_question
from app.services.retrieval_service import retrieve_relevant_chunks
from app.services.memory_service import clear_history
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.api.upload import router as upload_router
from app.services.embedding_service import create_embeddings

app = FastAPI(title="InsightForge AI")

# Frontend Setup
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

templates = Jinja2Templates(
    directory="templates"
)

app.include_router(upload_router)


@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


@app.get("/test-embedding")
def test_embedding():

    sample_chunks = [
        "Python SQL FastAPI",
        "Machine Learning and AI"
    ]

    embeddings = create_embeddings(sample_chunks)

    return {
        "chunks": len(sample_chunks),
        "embedding_dimension": len(embeddings[0])
    }


@app.get("/search")
def search(question: str):

    results = retrieve_relevant_chunks(
        question
    )

    return {
        "question": question,
        "results": results
    }


@app.get("/ask")
def ask(question: str):

    result = ask_question(
        question
    )

    return {
        "question": question,
        "answer": result["answer"],
        "sources": result["sources"]
    }


@app.post("/clear-memory")
def clear_chat():

    clear_history()

    return {
        "message": "Conversation memory cleared"
    }