# Requirements Document — Persona-Based AI Chatbot
## Scaler Academy | Prompt Engineering Assignment 01

---

## 1. Project Purpose

Build a working web application where users can have real-time conversations with AI-powered versions of three Scaler/InterviewBit personalities: **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. The chatbot must feel like the real person — not a generic assistant with a name slapped on it.

> **Why this framing matters:** The assignment is explicitly testing prompt engineering skill, not coding skill. A visually polished app with a shallow prompt scores lower than a plain UI with a deeply researched persona. Every technical and UX decision should serve the goal of authenticity.

---

## 2. Tech Stack Decision

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Fast setup, component model suits persona tabs + chat bubbles naturally. Tailwind removes the need for CSS files, keeping the codebase lean. |
| Backend | Node.js + Express (single `/api/chat` route) | Keeps the API key server-side — it never reaches the browser. A thin Express layer is the minimum viable separation between the client and the Anthropic API. |
| LLM API | Anthropic Claude (`claude-sonnet-4-6`) | Assignment-native. Claude's instruction-following is strong, which makes persona constraints (the "never do" rules) more reliable. |
| Deployment | Vercel (frontend) + Railway or Render (backend) | Both have free tiers. Vercel handles Vite builds natively. Railway/Render handles a Node process with env var injection. |
| Env management | `dotenv` + `.env.example` | Required by the rubric. `.env` is gitignored. `.env.example` shows the required keys without exposing values. |

---

## 3. Repository Structure

```
persona-chatbot/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx        # Message list + input box
│   │   │   ├── PersonaSwitcher.jsx   # Tab bar for 3 personas
│   │   │   ├── SuggestionChips.jsx   # Quick-start question buttons
│   │   │   ├── TypingIndicator.jsx   # Animated dots during API call
│   │   │   └── MessageBubble.jsx     # Individual chat message
│   │   ├── data/
│   │   │   └── personas.js           # Persona metadata (name, chips, avatar color)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                    # Express backend
│   ├── prompts/
│   │   ├── anshuman.js               # Anshuman Singh system prompt
│   │   ├── abhimanyu.js              # Abhimanyu Saxena system prompt
│   │   └── kshitij.js                # Kshitij Mishra system prompt
│   ├── index.js                      # Express app + /api/chat route
│   └── package.json
├── prompts.md                 # All 3 system prompts + inline annotations (rubric req.)
├── reflection.md              # 300–500 word reflection (rubric req.)
├── README.md                  # Setup instructions + deployed URL + screenshots
├── .env.example               # ANTHROPIC_API_KEY= (no value)
└── .gitignore                 # node_modules, .env, dist
```

> **Why separate `client/` and `server/`?** The API key must never be sent to the browser. A monorepo with two packages is the minimal architecture that guarantees this. Everything in `client/` is public by definition (bundled into static JS). Everything in `server/` runs only on the host.

> **Why a `prompts/` folder per file?** Each persona's system prompt will be ~300–500 lines when fully developed. Keeping them in individual files makes diffs readable and makes it obvious where to look during grading. It also forces a clean separation — no persona bleeds into another.

---

## 4. System Prompt Architecture

Each system prompt must include five mandatory sections. Here is what each section must contain and **why it is required**:

### 4.1 Persona Description

**What:** 200–300 words describing who this person is — their professional background, their communication habits, their known opinions, their energy level, and their verbal tics.

**Why:** This is the foundation. Without a rich persona description, every other section is built on sand. Claude needs enough context to make consistent choices when a question is ambiguous. If you write "You are Anshuman Singh, a software engineer," Claude has almost no signal to distinguish this from any other engineer. If you write that Anshuman's communication style is dense and first-principles, that he references systems design frequently, that he uses direct rhetorical questions to challenge assumptions — now Claude has decision-making material.

**Research required before writing:**
- Anshuman Singh: Scaler's CTO, known for deep-dive system design talks, "crack the coding interview" mindset, very structured thinking, often breaks problems into exhaustive cases.
- Abhimanyu Saxena: Co-founder of InterviewBit/Scaler, known for motivational energy, entrepreneurial conviction, talks about the "why" behind Scaler's mission, uses storytelling with personal anecdotes.
- Kshitij Mishra: Scaler instructor/educator, known for approachable explanations, breaking down hard CS concepts with analogies, patient and encouraging tone, often circles back to check understanding.

### 4.2 Few-Shot Examples

**What:** Minimum 3 `User: ... Assistant: ...` pairs embedded directly in the system prompt. Each example must be in that persona's authentic voice.

**Why (GIGO principle):** Few-shot examples are the most direct signal you can give an LLM about output style. The persona description tells the model *who* it is. The few-shot examples show the model *how to sound*. If your examples are generic ("Great question! Here's what I think..."), your outputs will be generic. If your examples mirror how Anshuman actually phrases ideas in his talks — with numbered breakdowns, rhetorical challenges, and system-level framing — the model will extrapolate that pattern to novel questions.

The three examples per persona should cover:
1. A technical question (coding, system design, CS concept)
2. A career/motivation question
3. A meta question about Scaler or their role

### 4.3 Chain-of-Thought (CoT) Instruction

**What:** An explicit instruction telling the model to reason through its answer internally before producing output. Example: *"Before answering, think step-by-step about how [persona name] would approach this question — their likely knowledge base, their values, and the communication pattern they would use. Do not output this reasoning; only output the final answer."*

**Why:** Without CoT, the model snaps to the statistically most common response pattern. For persona work, this means defaulting to generic-assistant tone. CoT creates a forced pause where the model has to simulate the persona's decision-making before speaking. This is especially important for edge cases — controversial topics, emotionally loaded questions, or highly technical questions where the persona has known public opinions.

### 4.4 Output Format Instruction

**What:** Explicit constraints on length and structure. Example: *"Respond in 3–5 sentences. End every response with either a follow-up question to the user or a challenge. Never use bullet points — [persona] speaks in natural paragraphs."*

**Why:** Without format instructions, LLMs default to long, list-heavy, over-explained responses. Real humans don't talk like that. A persona that feels real speaks in natural paragraphs of bounded length. Format instructions also prevent the model from breaking character by over-explaining or hedging — behaviors that destroy the illusion of talking to a specific person.

### 4.5 Constraints (Hard Rules)

**What:** A list of things this persona must never do, no matter what the user asks.

**Why:** Constraints are the safety net. They prevent the model from: attributing false opinions to a real person, roleplaying scenarios that could embarrass them, switching personas mid-conversation, or slipping into generic-assistant mode. Without explicit constraints, even the best persona prompt degrades under adversarial or off-topic inputs.

Required constraints for all three personas:
- Never claim to be an AI or break the fourth wall unless directly and sincerely asked
- Never express opinions on topics the real person has no known public position on
- Never use language or a tone the real person wouldn't use (e.g., don't make Anshuman speak casually if he's characteristically direct and dense)
- Never continue a conversation thread where the user is clearly trying to elicit harmful or false statements about the real person

---

## 5. Frontend Requirements

### 5.1 Persona Switcher

- Three buttons/tabs, one per persona, always visible at the top
- Active persona is highlighted (distinct color or bold border)
- Switching persona **resets the conversation history** and loads that persona's suggestion chips
- The active persona name is displayed in the chat header

> **Why reset on switch?** The conversation history is sent as context to the API on every message. If you carry the history from Persona A into Persona B, the model will get confused — it will try to respond as Persona B but the prior conversation is in Persona A's voice, creating contradictions. A clean reset is both technically correct and the right UX.

### 5.2 Chat Interface

- Messages appear in scrollable bubbles (user right-aligned, persona left-aligned)
- Input box at the bottom with send button
- Enter key sends message
- Input is disabled while an API call is in progress

### 5.3 Suggestion Chips

- 3–4 pre-written questions per persona displayed below the chat header when the conversation is empty
- Clicking a chip populates the input box and sends the message automatically
- Chips disappear after the first message is sent

> **Why chips?** They serve two purposes: UX (reduces friction for new users who don't know where to start) and prompt engineering validation (they are test cases — your chips should be questions where the persona's answer would be noticeably different from a generic assistant, proving your prompt is working).

### 5.4 Typing Indicator

- Animated dots (or equivalent) shown from the time the API call starts to when the response arrives
- Must replace (not append to) the typing indicator with the actual response

> **Why required?** Without it, users experience a blank UI for 3–10 seconds and assume the app is broken. This is a basic conversational UX expectation.

### 5.5 Responsiveness

- Layout must function on mobile (375px width) and desktop (1280px width)
- Persona switcher stacks or scrolls on small screens
- Chat bubbles do not overflow the viewport

---

## 6. Backend / API Requirements

### 6.1 API Key Security

- `ANTHROPIC_API_KEY` stored in a `.env` file, never in source code
- `.env` is listed in `.gitignore`
- `.env.example` contains `ANTHROPIC_API_KEY=` with no value

> **Why non-negotiable?** A committed API key is an automatic zero on the GitHub repo criterion regardless of other quality. Keys committed to public repos are scraped by bots within minutes.

### 6.2 Chat Endpoint

- `POST /api/chat`
- Request body: `{ personaId: "anshuman" | "abhimanyu" | "kshitij", messages: [{ role, content }] }`
- Server selects the system prompt by `personaId`, prepends it to the messages array, and sends to the Anthropic API
- Response: `{ reply: "<assistant message>" }`

> **Why pass `messages` (full history) rather than just the latest message?** Claude needs the conversation history to maintain context — if you only send the latest message, every response is stateless and the persona can't reference what was said earlier in the conversation.

### 6.3 Error Handling

- If the Anthropic API returns an error, the server returns `{ error: "<user-friendly message>" }` with a 500 status
- The frontend catches this and displays a non-crashing error message in the chat window (e.g., "Something went wrong. Please try again.")
- The input box is re-enabled so the user can retry

### 6.4 CORS

- Server must allow requests from the frontend origin in production (Vercel URL)
- Use `cors` middleware with explicit origin configuration — do not use `*` in production

---

## 7. Documentation Requirements

### 7.1 README.md

Must contain:
1. Project description (1–2 sentences)
2. Live deployed URL
3. Local setup steps (clone → install → add `.env` → run)
4. Screenshots of the UI (at least one per persona)

### 7.2 prompts.md

Must contain all three system prompts in full, with **inline annotations** explaining each decision:
- Why this persona description uses certain words
- Why these specific few-shot examples were chosen
- What the CoT instruction is trying to prevent
- Why each constraint was added

> **Why annotations?** This is the "product decision document" the assignment rubric asks for. It forces you to be intentional rather than copy-pasting something that sort-of works. Annotations are also what differentiate a 10/10 prompt from a 6/10 prompt — they prove you understand the engineering behind the choices.

### 7.3 reflection.md

300–500 words covering:
1. What worked — which prompt techniques had the most impact on persona authenticity
2. GIGO in practice — a specific example of a lazy prompt producing bad output and how you fixed it
3. What you would improve — honest assessment of where your personas still feel generic

---

## 8. Deployment Requirements

| Component | Target Platform | Rationale |
|---|---|---|
| Frontend | Vercel | Native Vite/React support, automatic HTTPS, free tier is sufficient |
| Backend | Railway or Render | Both support Node.js, env var injection through their dashboard (key never in code), free tier |

The deployed app must:
- Work without any local setup from the evaluator's machine
- Have a stable URL (not a preview URL that expires)
- Support all three personas in production

---

## 9. Grading Alignment

| Rubric Criterion | This Document's Coverage |
|---|---|
| GitHub Repository (2 pts) | §3 repo structure, §6.1 API key security, §7.1 README |
| Live Project Deployed (2 pts) | §8 deployment requirements |
| Frontend Quality (2 pts) | §5 frontend requirements |
| Backend & Prompt Quality (2 pts) | §4 system prompt architecture, §6 backend requirements |
| Documentation & Reflection (2 pts) | §7 documentation requirements |

---

## 10. Definition of Done

A feature is complete when:
- [ ] It works in the deployed environment (not just locally)
- [ ] No API keys appear anywhere in the git history (`git log -S "sk-ant"` returns nothing)
- [ ] Persona responses are noticeably distinct — a question answered by all three produces three clearly different answers in voice, not just content
- [ ] The app handles a failed API call without a blank screen or console error visible to the user
- [ ] prompts.md annotations explain *why*, not just *what*
