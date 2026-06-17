from app.services.retrieval_service import retrieve_relevant_chunks
from app.services.llm_service import generate_answer
from app.services.memory_service import (
    add_message,
    get_history
)


def ask_question(question):

    retrieved = retrieve_relevant_chunks(
        question
    )

    history = get_history()

    history_text = ""

    for msg in history:
        history_text += (
            f"{msg['role']}: "
            f"{msg['content']}\n"
        )

    full_context = f"""
Conversation History:
{history_text}

Knowledge Base:
{retrieved['context']}
"""

    answer = generate_answer(
        question,
        full_context
    )

    add_message(
        "user",
        question
    )

    add_message(
        "assistant",
        answer
    )

    return {
        "answer": answer,
        "sources": retrieved["sources"]
    }