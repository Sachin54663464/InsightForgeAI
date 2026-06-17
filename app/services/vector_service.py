import chromadb

client = chromadb.PersistentClient(
    path="app/database/chroma_db"
)

collection = client.get_or_create_collection(
    name="documents"
)


def store_chunks(chunks, embeddings, pdf_name):

    ids = [
        f"{pdf_name}_chunk_{i}"
        for i in range(len(chunks))
    ]

    metadata = [
        {
            "source": pdf_name,
            "chunk_id": i
        }
        for i in range(len(chunks))
    ]

    try:
        collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadata
        )
    except Exception as e:
        print("Chroma Error:", e)

    return len(ids)


def search_chunks(query_embedding, top_k=5):

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    documents = results["documents"][0]

    metadatas = [
        metadata
        for metadata in results["metadatas"][0]
        if metadata is not None
    ]

    return {
        "documents": documents,
        "metadatas": metadatas
    }