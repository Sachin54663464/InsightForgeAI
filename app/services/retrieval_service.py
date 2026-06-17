from app.services.embedding_service import create_embeddings
from app.services.vector_service import search_chunks


def retrieve_relevant_chunks(question):

    query_embedding = create_embeddings(
        [question]
    )[0]

    results = search_chunks(
        query_embedding
    )

    context = "\n\n".join(
        results["documents"]
    )

    return {
        "context": context,
        "sources": results["metadatas"]
    }