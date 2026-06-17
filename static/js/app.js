async function loadDocuments() {

    const response =
        await fetch("/documents");

    const data =
        await response.json();

    const table =
        document.getElementById(
            "documentsTable"
        );

    table.innerHTML = "";

    data.documents.forEach(file => {

        table.innerHTML += `
            <tr>
                <td>${file}</td>
                <td>Processed</td>
            </tr>
        `;

    });

}


async function askQuestion() {

    const question = document.getElementById("question").value;

    if (!question) {
        alert("Enter a question");
        return;
    }

    const response = await fetch(
        `/ask?question=${encodeURIComponent(question)}`
    );

    const data = await response.json();

    document.getElementById("answer").innerText =
        data.answer;

    let sourceHtml = "";

    if (data.sources) {

        const uniqueSources = [
            ...new Set(
                data.sources
                    .filter(source => source)
                    .map(source => source.source)
            )
        ];

        uniqueSources.forEach(source => {

            sourceHtml += `
                <div class="source-item">
                    ${source}
                </div>
            `;

        });

    }

    document.getElementById("sources").innerHTML =
        sourceHtml;
}


async function uploadPDF() {

    const fileInput =
        document.getElementById("pdfFile");

    const file =
        fileInput.files[0];

    if (!file) {

        alert("Choose a PDF first");

        return;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await fetch(
            "/upload",
            {
                method: "POST",
                body: formData
            }
        );

    await response.json();

    fileInput.value = "";

    loadDocuments();
}


window.onload = function () {

    loadDocuments();

};