/* ─────────────────────────────────────────────
   InsightForge AI — app.js

   Backend/API logic preserved.
   Landing page controls added separately.
   ───────────────────────────────────────────── */


/* ══════════════════════════════════════════════
   SIDEBAR NAVIGATION
   ══════════════════════════════════════════════ */

document.querySelectorAll('.nav-item[data-section]').forEach(item => {

  item.addEventListener('click', () => {

    const section = item.dataset.section;

    switchSection(section, item);

  });

});


function switchSection(section, navEl) {

  document.querySelectorAll('.nav-item')
    .forEach(n => n.classList.remove('active'));

  navEl.classList.add('active');


  document.querySelectorAll('.page-section')
    .forEach(s => s.style.display = 'none');


  const titles = {

    documents: [
      'Documents',
      'Upload and manage your knowledge base.'
    ],

    ask: [
      'Ask AI',
      'Query your knowledge base with natural language.'
    ],

    activity: [
      'Activity',
      'Coming soon.'
    ],

    settings: [
      'Settings',
      'Coming soon.'
    ]

  };


  if (section === 'documents') {

    document.getElementById('section-documents').style.display = 'flex';

  }

  else if (section === 'ask') {

    document.getElementById('section-ask').style.display = 'flex';

    const question = document.getElementById('question');

    if (question) {
      question.focus();
    }

  }

  else {

    showToast(
      `${titles[section]?.[0] || 'Section'} coming soon`,
      'success'
    );

    document.getElementById('section-documents').style.display = 'flex';

    document.querySelectorAll('.nav-item')
      .forEach(n => n.classList.remove('active'));

    const documentsNav =
      document.querySelector('.nav-item[data-section="documents"]');

    if (documentsNav) {
      documentsNav.classList.add('active');
    }

    return;
  }


  if (titles[section]) {

    document.getElementById('page-title').textContent =
      titles[section][0];

    document.getElementById('page-subtitle').textContent =
      titles[section][1];

  }

}


/* ══════════════════════════════════════════════
   LOAD DOCUMENTS
   ══════════════════════════════════════════════ */

async function loadDocuments() {

  try {

    const response = await fetch('/documents');

    const data = await response.json();

    const table =
      document.getElementById('documentsTable');


    if (!data.documents || data.documents.length === 0) {

      table.innerHTML = `

        <tr class="empty-row">

          <td colspan="3">

            <div class="empty-state">

              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >

                <rect
                  width="36"
                  height="36"
                  rx="10"
                  fill="#F4F4F5"
                />

                <path
                  d="M12 8h8l6 6v14a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z"
                  stroke="#A1A1AA"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <path
                  d="M20 8v6h6"
                  stroke="#A1A1AA"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />

              </svg>

              <div class="empty-state-title">
                No documents yet
              </div>

              <div class="empty-state-sub">
                Upload a PDF above to build your knowledge base
              </div>

            </div>

          </td>

        </tr>

      `;

      updateDocBadge(0);

      return;

    }


    table.innerHTML = data.documents.map(file => `

      <tr>

        <td>

          <div class="file-cell">

            <div class="file-icon">

              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
              >

                <path
                  d="M6 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
                  stroke="#F43F5E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <path
                  d="M14 2v4h4"
                  stroke="#F43F5E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />

              </svg>

            </div>

            <span
              class="file-name"
              title="${escapeHtml(file)}"
            >
              ${escapeHtml(file)}
            </span>

          </div>

        </td>


        <td>

          <span class="status-badge processed">

            <span class="status-badge-dot"></span>

            Processed

          </span>

        </td>


        <td>

          <button
            class="btn-ghost"
            style="padding:5px 10px;font-size:12px;"
            onclick="handleAskAboutDoc('${escapeHtml(file)}')"
          >
            Ask about this
          </button>

        </td>

      </tr>

    `).join('');


    updateDocBadge(data.documents.length);


  }

  catch (err) {

    console.error(
      'Failed to load documents:',
      err
    );

  }

}


function updateDocBadge(count) {

  const badge =
    document.getElementById('doc-count-badge');

  if (!badge) return;


  if (count > 0) {

    badge.textContent = count;

    badge.style.display = 'inline-block';

  }

  else {

    badge.style.display = 'none';

  }

}


function handleAskAboutDoc(filename) {

  const askNav =
    document.querySelector(
      '.nav-item[data-section="ask"]'
    );

  if (!askNav) return;


  switchSection(
    'ask',
    askNav
  );


  setTimeout(() => {

    const q =
      document.getElementById('question');

    if (!q) return;


    q.value =
      `Summarize the key insights from "${filename}"`;

    autoResize(q);

    q.focus();

  }, 80);

}


/* ══════════════════════════════════════════════
   FILE INPUT / DRAG & DROP
   ══════════════════════════════════════════════ */

function handleFileSelect(event) {

  const file =
    event.target.files[0];

  if (file) {
    showSelectedFile(file);
  }

}


function handleDragOver(e) {

  e.preventDefault();

  const uploadArea =
    document.getElementById('uploadArea');

  if (uploadArea) {
    uploadArea.classList.add('drag-over');
  }

}


function handleDragLeave(e) {

  const uploadArea =
    document.getElementById('uploadArea');

  if (uploadArea) {
    uploadArea.classList.remove('drag-over');
  }

}


function handleDrop(e) {

  e.preventDefault();

  const uploadArea =
    document.getElementById('uploadArea');

  if (uploadArea) {
    uploadArea.classList.remove('drag-over');
  }


  const file =
    e.dataTransfer.files[0];


  if (
    file &&
    file.type === 'application/pdf'
  ) {

    const dt =
      new DataTransfer();

    dt.items.add(file);

    document.getElementById('pdfFile').files =
      dt.files;

    showSelectedFile(file);

  }

  else {

    showToast(
      'Please drop a PDF file',
      'error'
    );

  }

}


function showSelectedFile(file) {

  const name =
    document.getElementById('selectedFileName');

  const selected =
    document.getElementById('uploadSelected');

  if (name) {
    name.textContent = file.name;
  }

  if (selected) {
    selected.style.display = 'flex';
  }

}


function clearFile() {

  const fileInput =
    document.getElementById('pdfFile');

  const selected =
    document.getElementById('uploadSelected');

  if (fileInput) {
    fileInput.value = '';
  }

  if (selected) {
    selected.style.display = 'none';
  }

}


/* ══════════════════════════════════════════════
   UPLOAD PDF
   Original API endpoint preserved.
   ══════════════════════════════════════════════ */

async function uploadPDF() {

  const fileInput =
    document.getElementById('pdfFile');

  const file =
    fileInput.files[0];


  if (!file) {

    showToast(
      'Please select a PDF first',
      'error'
    );

    return;

  }


  const uploadBtn =
    document.querySelector(
      '.upload-selected .btn-primary'
    );


  if (uploadBtn) {

    uploadBtn.disabled = true;

    uploadBtn.innerHTML = `

      <div
        class="progress-spinner"
        style="width:14px;height:14px;border-width:2px;"
      ></div>

      Processing…

    `;

  }


  setStatus(
    'Processing…',
    true
  );


  const formData =
    new FormData();

  formData.append(
    'file',
    file
  );


  try {

    const response =
      await fetch(
        '/upload',
        {
          method: 'POST',
          body: formData
        }
      );


    await response.json();


    showToast(
      `"${file.name}" uploaded and indexed`,
      'success'
    );


    fileInput.value = '';

    document.getElementById(
      'uploadSelected'
    ).style.display = 'none';


    await loadDocuments();


    setStatus(
      'Ready',
      false
    );


  }

  catch (err) {

    console.error(
      'Upload failed:',
      err
    );

    showToast(
      'Upload failed — please try again',
      'error'
    );

    setStatus(
      'Ready',
      false
    );

  }

  finally {

    if (uploadBtn) {

      uploadBtn.disabled = false;

      uploadBtn.innerHTML = `

        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
        >

          <path
            d="M10 4v12M4 10l6-6 6 6"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

        </svg>

        Upload & Process

      `;

    }

  }

}


/* ══════════════════════════════════════════════
   ASK QUESTION
   Original API endpoint preserved.
   ══════════════════════════════════════════════ */

async function askQuestion() {

  const questionEl =
    document.getElementById('question');

  if (!questionEl) return;


  const question =
    questionEl.value.trim();


  if (!question) {

    questionEl.focus();

    return;

  }


  appendQuestion(question);


  questionEl.value = '';

  autoResize(questionEl);

  scrollThread();


  const thinkingId =
    appendThinking();


  const sendBtn =
    document.getElementById('sendBtn');

  if (sendBtn) {
    sendBtn.disabled = true;
  }


  setStatus(
    'Thinking…',
    true
  );


  document.getElementById(
    'answer'
  ).innerText = '';


  document.getElementById(
    'sources'
  ).innerHTML = '';


  try {

    const response =
      await fetch(
        `/ask?question=${encodeURIComponent(question)}`
      );


    const data =
      await response.json();


    removeElement(
      thinkingId
    );


    appendAnswer(
      data.answer,
      data.sources || []
    );


    document.getElementById(
      'answer'
    ).innerText =
      data.answer;


  }

  catch (err) {

    console.error(
      'Question failed:',
      err
    );


    removeElement(
      thinkingId
    );


    appendAnswer(
      'Something went wrong. Please try again.',
      []
    );


    showToast(
      'Request failed',
      'error'
    );

  }

  finally {

    if (sendBtn) {
      sendBtn.disabled = false;
    }


    setStatus(
      'Ready',
      false
    );


    scrollThread();

  }

}


/* ══════════════════════════════════════════════
   CHAT RENDERING
   ══════════════════════════════════════════════ */

function appendQuestion(text) {

  const thread =
    document.getElementById('chatThread');

  if (!thread) return;


  const div =
    document.createElement('div');


  div.className =
    'chat-question';


  div.innerHTML = `

    <div class="chat-question-bubble">
      ${escapeHtml(text)}
    </div>

  `;


  thread.appendChild(div);

}


function appendThinking() {

  const thread =
    document.getElementById('chatThread');

  if (!thread) return null;


  const id =
    'thinking-' + Date.now();


  const div =
    document.createElement('div');


  div.id = id;

  div.className =
    'chat-thinking';


  div.innerHTML = `

    <div class="chat-answer-header">

      <div class="ai-avatar">

        <svg
          width="14"
          height="14"
          viewBox="0 0 18 18"
          fill="none"
        >

          <path
            d="M4 9.5L7.5 13L14 6"
            stroke="white"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

        </svg>

      </div>

      <span class="ai-label">
        InsightForge
      </span>

    </div>


    <div class="thinking-dots">

      <div class="thinking-dot"></div>
      <div class="thinking-dot"></div>
      <div class="thinking-dot"></div>

    </div>

  `;


  thread.appendChild(div);

  scrollThread();


  return id;

}


function appendAnswer(text, sources) {

  const thread =
    document.getElementById('chatThread');

  if (!thread) return;


  const uniqueSources =
    sources.length

      ? [
          ...new Set(
            sources
              .filter(s => s)
              .map(s => s.source)
              .filter(Boolean)
          )
        ]

      : [];


  const sourcesHtml =
    uniqueSources.length

      ? `

        <div class="chat-sources">

          <span class="sources-label">
            Sources
          </span>

          ${uniqueSources.map(s => `

            <span class="source-chip">

              <svg
                class="source-chip-icon"
                viewBox="0 0 20 20"
                fill="none"
              >

                <path
                  d="M6 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

              </svg>

              ${escapeHtml(s)}

            </span>

          `).join('')}

        </div>

      `

      : '';


  document.getElementById(
    'sources'
  ).innerHTML = uniqueSources

    .map(
      s =>
        `<div class="source-item">
          ${escapeHtml(s)}
        </div>`
    )

    .join('');


  const div =
    document.createElement('div');


  div.className =
    'chat-answer';


  div.innerHTML = `

    <div class="chat-answer-header">

      <div class="ai-avatar">

        <svg
          width="14"
          height="14"
          viewBox="0 0 18 18"
          fill="none"
        >

          <path
            d="M4 9.5L7.5 13L14 6"
            stroke="white"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

        </svg>

      </div>

      <span class="ai-label">
        InsightForge
      </span>

    </div>


    <div class="chat-answer-body">
      ${formatAnswer(text)}
    </div>


    ${sourcesHtml}

  `;


  thread.appendChild(div);

}


function removeElement(id) {

  if (!id) return;


  const el =
    document.getElementById(id);


  if (el) {
    el.remove();
  }

}


function scrollThread() {

  const thread =
    document.getElementById('chatThread');

  if (thread) {

    thread.scrollTop =
      thread.scrollHeight;

  }

}


function formatAnswer(text) {

  if (!text) return '';


  return escapeHtml(text)

    .replace(
      /\n\n/g,
      '</p><p>'
    )

    .replace(
      /\n/g,
      '<br>'
    )

    .replace(
      /^/,
      '<p>'
    )

    .replace(
      /$/,
      '</p>'
    );

}


function escapeHtml(str) {

  if (!str) return '';


  return String(str)

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    )

    .replace(
      /"/g,
      '&quot;'
    );

}


/* ══════════════════════════════════════════════
   TEXTAREA
   ══════════════════════════════════════════════ */

function autoResize(el) {

  if (!el) return;


  el.style.height =
    'auto';


  el.style.height =
    Math.min(
      el.scrollHeight,
      160
    ) + 'px';

}


function handleQuestionKey(e) {

  if (
    e.key === 'Enter' &&
    !e.shiftKey
  ) {

    e.preventDefault();

    askQuestion();

  }

}


/* ══════════════════════════════════════════════
   STATUS
   ══════════════════════════════════════════════ */

function setStatus(text, loading) {

  const statusText =
    document.getElementById('status-text');

  if (statusText) {
    statusText.textContent = text;
  }


  const dot =
    document.querySelector('.status-dot');


  if (dot) {

    dot.className =
      'status-dot' +
      (loading ? ' loading' : '');

  }

}


/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */

function showToast(
  message,
  type = 'success'
) {

  const toast =
    document.getElementById('toast');

  if (!toast) return;


  toast.textContent =
    message;


  toast.className =
    `toast ${type}`;


  toast.style.display =
    'block';


  clearTimeout(
    toast._timer
  );


  toast._timer =
    setTimeout(
      () => {
        toast.style.display =
          'none';
      },
      3500
    );

}


/* ══════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════ */

/*
   These functions are called directly from
   index.html onclick handlers.
*/


function openWorkspace() {

  const landing =
    document.getElementById('landingPage');

  const workspace =
    document.getElementById('workspaceApp');


  if (!landing || !workspace) {

    console.error(
      'Landing/workspace elements not found.'
    );

    return;

  }


  landing.style.display =
    'none';


  workspace.style.display =
    'flex';


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  /*
     Keep the existing application logic.
     This refreshes the document list when
     entering the workspace.
  */

  loadDocuments();

}


function showLanding() {

  const landing =
    document.getElementById('landingPage');

  const workspace =
    document.getElementById('workspaceApp');


  if (!landing || !workspace) {
    return false;
  }


  workspace.style.display =
    'none';


  landing.style.display =
    'block';


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  return false;

}


function scrollToProduct() {

  const section =
    document.getElementById(
      'productShowcase'
    );


  if (!section) {

    console.warn(
      'Product section not found.'
    );

    return;

  }


  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}


function scrollToHow() {

  const section =
    document.getElementById(
      'howSection'
    );


  if (!section) {

    console.warn(
      'How-it-works section not found.'
    );

    return;

  }


  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}


/* ══════════════════════════════════════════════
   LANDING PAGE SCROLL REVEAL
   ══════════════════════════════════════════════ */

function initLandingReveal() {

  const elements =
    document.querySelectorAll(
      '.reveal'
    );


  if (!elements.length) {
    return;
  }


  /*
     If the browser/user prefers reduced
     motion, immediately show everything.
  */

  if (
    window.matchMedia &&
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    elements.forEach(
      el => el.classList.add('visible')
    );

    return;

  }


  /*
     Fallback for browsers without
     IntersectionObserver.
  */

  if (!('IntersectionObserver' in window)) {

    elements.forEach(
      el => el.classList.add('visible')
    );

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'visible'
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  elements.forEach(
    el => observer.observe(el)
  );

}


/* ══════════════════════════════════════════════
   EASTER EGG
   ══════════════════════════════════════════════ */

(function initEasterEgg() {

  const sequence = [

    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight'

  ];


  let position = 0;


  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
        sequence[position]
      ) {

        position++;


        if (
          position ===
          sequence.length
        ) {

          document.body.classList.add(
            'insight-secret'
          );


          setTimeout(() => {

            document.body.classList.remove(
              'insight-secret'
            );

          }, 1400);


          position = 0;

        }

      }

      else {

        position = 0;

      }

    }
  );

})();


/* ══════════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════════ */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    /*
       Landing page is the default screen.
    */

    const landing =
      document.getElementById(
        'landingPage'
      );

    const workspace =
      document.getElementById(
        'workspaceApp'
      );


    if (landing && workspace) {

      landing.style.display =
        'block';

      workspace.style.display =
        'none';

    }


    /*
       Start landing animations.
    */

    initLandingReveal();

  }
);


/*
   Keep the original document loading
   behavior after the page is ready.
*/

window.addEventListener(
  'load',
  () => {

    loadDocuments();

  }
);

window.openWorkspace = openWorkspace;
window.scrollToProduct = scrollToProduct;