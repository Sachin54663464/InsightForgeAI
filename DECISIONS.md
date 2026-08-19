# InsightForge — Decisions

## 1. Why this approach?

I chose the **Premium Home Page** track and built InsightForge as a focused AI document-intelligence product rather than creating a generic marketing page. The page uses a static HTML/CSS implementation because it was the fastest way to ship a responsive result without adding unnecessary framework or build complexity.

I deliberately kept the experience centered around one product flow: **upload → understand → ask**. The hero communicates the value proposition immediately, while the workspace mockup shows the product instead of relying only on marketing copy. I chose this over a heavier component framework because the challenge evaluates UI craft, judgment, responsiveness, and shipping speed more than framework choice.

## 2. Time-limit trade-off

Under the time limit, I prioritized the core landing-page experience, responsive layout, product showcase, navigation, and restrained interactions over building a fully functional backend deployment. The live submission therefore focuses on the working home page and its product presentation.

With a real week, I would connect the landing-page CTA to the full InsightForge application, add more deliberate accessibility testing, expand mobile-specific polish, and add automated checks for responsive layouts and broken assets.

## 3. AI usage and personal verification

I used AI tools during implementation for coding assistance, UI iteration, debugging, and troubleshooting deployment issues. I did not treat generated output as final without testing it. I personally reviewed the implementation, ran the application locally, inspected browser console/network behavior, verified the responsive layout, and fixed the GitHub Pages asset-path issue that initially caused the CSS and JavaScript not to load.

The final page was manually checked at mobile and desktop sizes, and I verified that the deployed GitHub Pages URL loads the intended styled interface. The design also avoids fabricated testimonials, fake user counts, and invented logos.
