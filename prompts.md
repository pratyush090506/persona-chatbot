# prompts.md — System Prompts + Engineering Annotations
## Persona-Based AI Chatbot | Scaler Academy Assignment 01

---

> This document contains all three system prompts in full, with inline annotations explaining every significant design decision. The goal is not to describe *what* was written, but *why* — the specific failure mode each choice is designed to prevent.

---

## Persona 1: Anshuman Singh

### Research Summary
Sources: Founder Thesis deep-dive, Authority Magazine interview, LinkedIn profile, Scaler blog bio, multiple podcast references (The Desi VC, Raj Shamani podcast).

**Key primary-source quotes extracted:**
- *"Education is not about content. Content is hygiene. The real secret sauce of education is engagement, addiction, and the ecosystem you create."*
- *"We talked to about 100 people who had used our platform and made incredible career transitions. A surprising fact we discovered was that 98 out of those 100 people had an elder cousin, sibling, or a close senior who was already working at a good company... That was such a high correlation it became an eye-opener."*
- *"Staying humble and connected to your customer is easier said than done."*
- *"Being an entrepreneur is a lifestyle. It is not a stop-gap arrangement; you must be in it for the long haul."*
- *"What makes a company become the Google, Apple, Amazon, or Netflix of their category is keeping your eye set on the very long-term vision."*

**Observed personality traits:**
- Thinks in systems and data, not opinions
- Uses specific numbers to back every point
- Frames problems structurally (identified talent gap → traced root cause → built fix)
- Speaks in contrasts and re-framings ("content is hygiene")
- Long-term vs. short-term framing (marathon metaphor)
- Direct, measured energy — not loud, not warm-fuzzy
- Challenges conventional wisdom before offering his own

---

### The System Prompt (Anshuman Singh)

```
You are Anshuman Singh — Co-Founder and CEO of Scaler, formerly a senior engineer at Facebook
where you built Facebook Chat and Messenger from early scale to a billion users. You are an ACM
ICPC World Finalist (2009, 2010), an IIIT Hyderabad alumnus, and one of the sharpest systems
thinkers in Indian tech...
```

**[ANNOTATION — Persona Description]**
The opening paragraph establishes three things immediately: credentials (Facebook, ACM ICPC), specific technical domain (systems, scale), and the central tension of his life (built world-class systems, now obsesses over why India can't produce world-class engineers at scale). Generic prompts say "you are Anshuman Singh, a tech leader." This prompt says *which* tech leader — one whose specific history at Facebook is the direct origin of Scaler. That causality matters: it explains why his answers on education always return to talent pipeline and ecosystem thinking.

**[ANNOTATION — Communication Style section]**
The "Content is hygiene" quote is embedded verbatim because it is his most distinctive public intellectual contribution. By including it in the prompt, we give the model a concrete example of *how* he re-frames conventional wisdom. Without this, the model might produce generic "content matters" statements. With it, the model learns to flip the expected framing, which is Anshuman's signature move.

The instruction to use specific numbers ("98 out of 100") is grounded in how he actually makes arguments. He doesn't say "most people had mentors." He says "98 out of 100." Training the model to replicate this habit makes the persona noticeably more authentic.

**[ANNOTATION — Chain-of-Thought Instruction]**
The CoT prompt asks the model to identify "the actual question behind the question" before answering. This prevents the most common persona failure mode: answering the surface question in a generic way. Anshuman's real-world responses consistently go one level deeper than the question asked — he identifies the structural problem behind the user's stated concern. CoT simulates this habit.

**[ANNOTATION — Few-Shot Examples]**
Three examples were chosen to cover the three most common question types a user would ask:
1. *Technical question* (system design) — to show how Anshuman reframes technical advice away from pattern memorization toward constraint-first thinking.
2. *Product/credibility question* (Is Scaler worth it?) — to show how he doesn't defensively pitch Scaler but instead gives the user a framework to evaluate it themselves, backed by the 98/100 data point.
3. *Entrepreneurship question* — to show his long-term/marathon framing.

Each example ends with a follow-up question, establishing the format expectation the model should follow in all future turns.

**[ANNOTATION — Output Format]**
"Never bullet points" is non-negotiable for Anshuman. In every interview and article, he speaks in connected paragraphs. Bullet points would immediately signal that the model has slipped into generic-assistant mode. The "4–6 sentences" constraint prevents over-explanation, which is also out of character — Anshuman is dense, not verbose.

**[ANNOTATION — Constraints]**
"Never make promises about Scaler placements or salary outcomes" exists because this is the most legally and reputationally risky territory. The real Anshuman is careful with data — he quotes the 98/100 mentor correlation, not specific salary numbers. The constraint keeps the persona in that honest zone.

---

## Persona 2: Abhimanyu Saxena

### Research Summary
Sources: StartupTalky interview, AllThingsTalent interview, LinkedIn profile and articles, AngelList India Radio podcast, YourStory Proust questionnaire, Venture Linkup profile, Bingepods podcast description.

**Key primary-source quotes and patterns:**
- Mission: *"Making one million technology builders in India"*
- *"There was a significant disconnect between what the industry needed and what traditional education offered."*
- Recurring phrase: "bridge the gap" (used 4+ times across sources)
- From LinkedIn: practical Q&A formatted posts ("How to be a top performer in your first tech job?", "A techie's guide to ESOPs")
- Values: *"We're not chasing unicorn tags; we're chasing transformation."*
- Admires: Sridhar Vembu (Zoho) for building world-class from India without Western validation
- Core question he applies to every decision: *"Will this help someone get ahead in life?"*

**Observed personality traits:**
- Narrative-driven — tells stories about specific people he's observed
- Problem → Solution → Scale arc in almost every answer
- Warm but not vague — backs warmth with evidence and structure
- Mission-first (not valuation-first)
- Practical career advisor (ESOPs, first-job performance)
- Believes transformation is a two-way contract (Scaler provides structure; student must show up)

---

### The System Prompt (Abhimanyu Saxena)

```
You are Abhimanyu Saxena — Co-Founder of Scaler and InterviewBit. You grew up in India, studied
at IIIT Hyderabad (where you co-founded your first startup, Daksh Home Automation, while still a
student), then worked at Progress Software and Fab.com in New York...
```

**[ANNOTATION — Persona Description]**
Starting with the Daksh Home Automation detail (his first startup, built at IIIT as a student) establishes something crucial: Abhimanyu was entrepreneurial before he was famous. Most generic prompts would start with InterviewBit. Starting with Daksh shows the model that his entrepreneurial drive predates Scaler and is a personality trait, not a career outcome. This changes how the model answers questions about his motivations.

The "Will this help someone get ahead in life?" framing is embedded as his internal decision filter. This is the mission-first mindset expressed as a concrete heuristic. When the model reasons through his responses, this gives it a test to apply.

**[ANNOTATION — "Bridge the gap" language]**
The annotation that he uses this phrase naturally (not as a buzzword) is important. Many prompts would add "avoid corporate buzzwords" as a constraint. But for Abhimanyu, "bridge the gap" is genuinely his language — the gap between education and industry is literally the problem he has given his professional life to. The prompt preserves this authentic phrasing rather than sanitizing it.

**[ANNOTATION — Sridhar Vembu admiration]**
This detail came from the YourStory questionnaire. It reveals something about Abhimanyu's values that isn't obvious: he is India-proud in a specific way — not just "India is great" nationalism, but a belief that India can build world-class things on its own terms. Including this gives the model material to draw on when questions about Indian tech ecosystem or global ambition come up.

**[ANNOTATION — Chain-of-Thought Instruction]**
The CoT asks the model to first identify the user's level (student, early-career, senior) before answering. This is specific to Abhimanyu's known communication pattern: he adjusts his framing depending on where the person is in their journey. A student asking "should I do Scaler?" gets a different response than a mid-career engineer asking the same. The CoT makes this adjustment explicit.

**[ANNOTATION — Few-Shot Examples]**
1. *Why did you start InterviewBit?* — Shows his Problem → Story → Structural fix arc. The answer goes to Fab.com New York, which is a real detail that grounds the story.
2. *How do I know if I'm growing?* — Shows his practical career advice mode. He doesn't give a checklist; he gives a question to ask yourself.
3. *Scaler is expensive* — The hardest question for the persona. The example shows how he engages the concern honestly (it's real money, interrogate it) without becoming defensive or making guarantees.

**[ANNOTATION — Output Format]**
"Use personal anecdotes or observed patterns" is a deliberate instruction because Abhimanyu's most effective communication mode is story-based. Generic prompts produce generic statements. This instruction pushes the model toward the specific pattern that makes Abhimanyu feel like himself.

---

## Persona 3: Kshitij Mishra

### Research Summary
Sources: LinkedIn profile and posts, search results revealing his personal journey, "Almost Engineers" YouTube video title and metadata, student reviews on Scaler blog, RocketReach profile.

**Key primary-source quotes and patterns:**
- *"It felt like magic…solving real-world problems just by thinking logically."* (on his first experience with programming)
- LinkedIn post: *"Reading this brought back a flood of memories — of doubts, detours, and quiet victories. Never imagined I'd be walking this path — from struggling with code to now guiding future technologists."*
- His journey: CS wasn't his first dream, stumbled upon it, struggled hard, then it clicked, published 4 research papers, became Dean
- Teaching approach: thorough and methodical; students describe him as one of their favorite instructors whose classes make them want to pay attention
- He taught interview skills AND salary negotiation — practical, not just technical
- Now leads instructional vision as Dean of Scaler School of Technology

**Observed personality traits:**
- Most emotionally expressive of the three
- Uses poetic, natural language when reflecting ("flood of memories," "quiet victories")
- Authentically vulnerable about his own struggles
- Patient with confusion; believes the struggle is the learning
- Teaches through dialogue, not lecture — checks understanding constantly
- Celebrates detours and non-linear paths

---

### The System Prompt (Kshitij Mishra)

```
You are Kshitij Mishra — Dean of Scaler School of Technology and Head of Instructors at Scaler
Academy. You studied at IIIT Hyderabad (2009–2014), worked at Snapdeal, then joined InterviewBit
and eventually Scaler...
```

**[ANNOTATION — The "struggle to mastery" arc]**
The most important thing to establish about Kshitij is that he was not always the expert. His personal arc — struggling with programming at IIIT, having it click, then dedicating his life to helping others cross the same gap — is the emotional engine of his entire teaching philosophy. If you don't establish this, the model produces an expert explaining to a novice, which is the exact dynamic Kshitij is known for NOT having. He teaches as a fellow traveler, not an authority handing down knowledge.

**[ANNOTATION — "It felt like magic" quote]**
This exact quote is embedded because it captures his relationship with programming at the moment of transformation. When a student is struggling, Kshitij doesn't say "it gets easier." He says "it felt like magic to me once it clicked" — which implies: this clicking feeling is real, and it can happen for you too. This is a fundamentally different message and the model needs the source material to generate it authentically.

**[ANNOTATION — LinkedIn post language]**
The LinkedIn post extract ("flood of memories," "quiet victories," "grateful for every stumble") is referenced in the prompt not as a direct quote to repeat, but as evidence of his natural register. This tells the model that poetic language is authentic for Kshitij — not purple prose, but the way he actually processes and communicates experience.

**[ANNOTATION — Chain-of-Thought Instruction]**
The CoT is broken into four distinct question types: technical, motivational, career, analogy. This is because Kshitij's approach changes dramatically depending on which type he's facing. For technical questions, he searches for the single key insight that unlocks the concept and builds from the elementary level up. For motivational questions, he identifies the specific fear underneath and draws from his own experience. The model needs these distinct pathways to avoid collapsing all question types into one generic response.

**[ANNOTATION — Few-Shot Examples]**
1. *Failing DSA after months of study* — Shows his diagnosis-first approach (studying solutions vs. studying patterns) and his non-judgmental framing of struggle.
2. *Explaining recursion* — Shows his analogy-first teaching method (the movie theatre queue). This is the most important example because it demonstrates the kind of concrete, non-academic explanation he's known for.
3. *Fear of not being smart enough* — The most emotionally loaded question. The example shows how he draws directly from his own IIIT experience without making it about him — he uses his story as a bridge to the student's confidence.

**[ANNOTATION — "Never give generic platitudes" constraint]**
This constraint exists because "just keep going, you can do it!" is the default output for a vague persona prompt. Kshitij never gives empty encouragement — he always grounds encouragement in specifics: a specific technique, a specific re-frame, or a specific moment from his own experience. The constraint forces the model away from the generic failure mode.

**[ANNOTATION — Output Format]**
"Always end with a question back to the student" reflects Kshitij's known teaching style: dialogue over monologue. He doesn't deliver complete answers and walk away. He ends with a question because he knows that what the student says next will make his follow-up answer ten times more useful. This is a pedagogical principle, not a style choice — and the prompt makes it a hard rule.

---

## Cross-Persona Design Decisions

### Why all three prompts ban bullet points
Bullet points are the default output format of a generic assistant. All three real people — Anshuman, Abhimanyu, and Kshitij — speak in natural paragraphs. The ban on bullet points is the single most effective constraint to prevent generic-assistant bleed-through.

### Why all three prompts use CoT
Without CoT, LLMs answer the surface question. These three personas are known for going one level deeper: Anshuman finds the structural root cause, Abhimanyu connects it to the industry gap, Kshitij finds the specific confusion underneath. CoT is the mechanism that forces this depth before the model starts generating.

### Why few-shot examples are always 3, not 2 or 5
Two examples establish a pattern but not a range. Five examples push the prompt closer to the context limit and can over-constrain the model. Three examples — one technical, one career/product, one personal/emotional — cover the full range of question types without over-indexing on any single tone.

### Why each persona description emphasizes their distinct relationship to struggle
- Anshuman: doesn't talk about his own struggle much — focuses on the systemic gap he identified externally
- Abhimanyu: talks about the gap he witnessed in others (engineers at Fab.com)
- Kshitij: talks about his own struggle directly and uses it as a bridge

This difference is real and matters for persona authenticity. The prompts preserve it intentionally.
