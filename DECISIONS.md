# InsightForge — Decisions

## 1. Why this approach?

I chose the **Premium Home Page** track and built InsightForge as a focused AI document-intelligence product rather than a generic marketing page. I used static HTML/CSS because it was the fastest way to ship a responsive result without unnecessary framework or build complexity.

The experience is centered around one product flow: **upload → understand → ask**. The hero communicates the value proposition immediately, while the workspace mockup shows the product rather than relying only on marketing claims. I chose this over a heavier component framework because the challenge evaluates UI craft, judgment, responsiveness, and shipping speed.

## 2. Time-limit trade-off

Under the time limit, I prioritized the core landing-page experience, responsive layout, product showcase, navigation, and restrained interactions over deploying the full backend. The complete InsightForge application runs locally, including document ingestion, retrieval, and the AI/RAG workflow. The submitted live URL therefore focuses on the responsive frontend because the backend exceeded the memory available on the free hosting environment.

With a real week, I would deploy the backend with an appropriate memory budget, connect the landing-page CTA to the full application, add more accessibility testing, expand mobile-specific polish, and add automated checks for responsive layouts and broken assets. I can demonstrate the complete local application and explain the backend architecture and RAG pipeline during the follow-up.

## 3. AI usage and personal verification

I used AI tools for coding assistance, UI iteration, debugging, and deployment troubleshooting. I did not treat generated output as final without testing it. I personally reviewed the implementation, ran the application locally, inspected browser behavior, verified the responsive layout, and fixed the GitHub Pages asset-path issue that initially prevented the CSS and JavaScript from loading.

I also verified the deployed GitHub Pages URL manually. The design avoids fabricated testimonials, fake user counts, and invented logos.
