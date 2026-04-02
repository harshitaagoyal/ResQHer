ResQHer: Engineering a Safer Future for Women

The Vision:

ResQHer is a proactive, high-performance safety ecosystem engineered to bridge the gap between immediate physical danger and systemic legal support. 
Unlike traditional apps that offer only a basic panic button, ResQHer provides a multi-layered shield by integrating real-time asynchronous SOS signaling with specialized Generative AI for legal and emotional advocacy. The platform empowers users to shorten emergency response times through coordinate-aware tracking, demystifies complex legal jargon by translating the Indian Penal Code (IPC) into actionable rights, and provides tactical social de-escalation tools like high-fidelity fake call simulations. By combining empathetic AI companionship with a secure, encrypted incident vault.

ResQHer transforms a smartphone into a comprehensive, 360-degree security asset designed for the real-world complexities of personal safety.


🛠️ Technical Stack & Feature Matrix

1. Nearby Help & Resource Mapping
The Feature: A dynamic, spatial search engine that identifies and filters the closest verified hospitals, police stations, and women’s shelters.
Tech Stack: Google Maps API for spatial rendering, Browser Geolocation API for coordinate tracking, and the Haversine Algorithm for distance calculation.

2. LawBot: AI Legal Advocate
The Feature: An LLM-powered consultant providing instant information on women’s rights and legal procedures, functioning as a 24/7 legal aid assistant.
Tech Stack: Google Gemini 3 Flash for low-latency NLP, Next.js API Routes for serverless backend execution, and React-Markdown for rendering citations.

3. Tactical Exit: Discrete Fake Call
The Feature: A 100% realistic phone call simulation designed to provide users with a believable and safe excuse to exit uncomfortable public situations.
Tech Stack: Native Fullscreen API to bypass browser UI, HTML5 Audio API for ringtone simulation, and Custom React Hooks for call-state management.

4. Trust Circle: Multi-Channel SOS
The Feature: A high-priority emergency system that broadcasts live GPS coordinates and an "Unsafe" status to a pre-configured network of trusted contacts.
Tech Stack: Clerk Metadata API for contact persistence, Node.js/Next.js API Routes for secure signal processing, and Tailwind CSS for emergency UI.

5. TherapyBot: Psychological First Aid
The Feature: A sentiment-aware AI companion engineered to provide immediate emotional de-escalation for users managing trauma or panic.
Tech Stack: Gemini Pro API with empathetic system prompting, Vercel AI SDK for real-time streaming, and React Hooks for state.

6. Secure Incident Vault
The Feature: A structured, encrypted documentation tool for recording incidents of harassment, ensuring a secure digital "paper trail" for legal evidence.
Tech Stack: MongoDB Atlas for NoSQL persistence, Zod Schema Validation for data integrity, and JWT-based Authentication via Clerk.


💻 Core Technical Architecture

Framework -> Next.js 16 (App Router) -> Optimized for Server-Side Rendering (SSR) and Client-Side Hydration.
Runtime -> Node.js -> Powering server-side logic, API proxying, and environment security.
Authentication -> Clerk -> End-to-end user identity management and persistent metadata storage.
Database -> MongoDB -> Storing encrypted incident reports and multi-turn AI chat histories.
Styling -> Tailwind CSS -> Implementing a robust Dark Mode architecture and mobile-first design.

Developer
Harshita Goyal