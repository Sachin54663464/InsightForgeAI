from app.services.llm_service import generate_answer

answer = generate_answer(
    "Who is Sachin?",
    "Sachin is a Computer Science student from LPU."
)

print(answer)