**TRAINIQ**

AI-Powered Training Companion

Project Outline & Architecture Plan

**Hackathon Submission**

March 2026

Team Size: 4--5 Members \| Duration: Multi-Day

**1. Project Overview**

**1.1 What is TrainIQ?**

TrainIQ is a unified, AI-powered training companion platform designed
for software training institutes. It combines four intelligent modules
--- Skill Gap Analysis, Mock Interview Simulation, Code Comprehension
Training, and Soft Skills Coaching --- into a single cohesive
application built for students.

The platform's core innovation is that all four modules share a single
student profile and data layer. Performance data from interviews, code
exercises, and role-play scenarios feeds back into the Skill Gap
Analyzer, creating a continuously evolving, 360-degree view of each
student's strengths and weaknesses.

**1.2 The Core Idea**

Traditional training institutes track student progress through
disconnected systems --- attendance sheets, exam scores, and subjective
observations. Students graduate without knowing their real blind spots.

TrainIQ solves this by creating a closed feedback loop:

-   Assess --- The Skill Gap Analyzer maps what each student knows and
    doesn't know

-   Practice --- Mock Interviews and Code Comprehension exercises build
    real-world skills

-   Coach --- The Soft Skills module develops communication,
    negotiation, and teamwork

-   Re-assess --- Every interaction updates the skill map, showing
    measurable growth over time

**1.3 Problem Statement**

Software training institutes face several interconnected challenges that
TrainIQ addresses:

  ------------------------ ----------------------------------------------
  **Problem**              **Detail**

  **Students don't know    Quiz scores show marks, not skill depth. A
  their gaps**             student scoring 60% in SQL doesn't know if
                           they struggle with joins, subqueries, or
                           indexing.

  **Interview readiness is Institutes teach coding but rarely simulate
  untested**               interview conditions. Students face their
                           first mock interview at placement time --- too
                           late to improve.

  **Code reading is        80% of a developer's job is reading and
  neglected**              understanding existing code, yet training
                           focuses almost entirely on writing code from
                           scratch.

  **Soft skills training   Watching videos or reading tips doesn't build
  is passive**             real communication skills. Students need
                           practice and feedback in realistic scenarios.
  ------------------------ ----------------------------------------------

**2. Technology Stack**

The stack is chosen for hackathon speed, full-stack capability, and
seamless LLM integration.

  -------------------- ----------------------------------------------------
  **Layer**            **Technology**

  **Frontend**         Next.js 16 (App Router), React, Tailwind CSS v4,
                       shadcn/ui, Recharts / Chart.js

  **Backend**          Next.js API Routes / Route Handlers (Node.js
                       runtime)

  **Database**         PostgreSQL via Supabase, Prisma ORM v7

  **Authentication**   Supabase Auth (Email + Password, student
                       self-registration)

  **AI / LLM**         NVIDIA LLM APIs (NIM) for interview simulation,
                       code evaluation, soft skills coaching, and learning
                       path generation

  **Speech            Web Speech API for voice-based interview rounds and
  (Optional)**         soft skills practice

  **Real-time**        Server-Sent Events or WebSocket for live interview
                       sessions

  **Deployment**       Vercel (frontend) + Supabase (PostgreSQL + Auth)

  **Styling**          Tailwind CSS v4 + shadcn/ui component library
  -------------------- ----------------------------------------------------

**2.1 Why This Stack?**

-   **Next.js App Router** gives full-stack capability in one framework
    --- no separate backend needed, reducing setup time.

-   **Prisma + PostgreSQL** provides type-safe database access with
    migrations, perfect for rapid iteration during a hackathon.

-   **NVIDIA LLM APIs (NIM)** handle all AI tasks (interview Q&A, code
    explanation evaluation, soft skills analysis) through one consistent
    API with strong reasoning capabilities.

-   **shadcn/ui** gives production-grade UI components out of the box,
    so the team can focus on features rather than building buttons and
    modals.

**3. User Role**

TrainIQ is focused on a single user role for the hackathon: the **Student**.

**Student capabilities:**

-   Personal skill heatmap and learning path dashboard

-   Access to all four modules: Skill Gap Analyzer, Mock Interviews,
    Code Explain, Soft Skills Coach

-   Progress tracking with historical trend charts

-   Achievement badges and leaderboard position

-   Interview and role-play history with detailed scorecards

-   Self-registration via email + password

**4. Module Breakdown**

**4.1 Module 1: Skill Gap Analyzer & Personalized Learning Path Engine**

**Problem It Solves**

Students often don't know what they don't know. A quiz score of 70%
doesn't reveal whether the gaps are in fundamentals or advanced
concepts.

**How It Works**

-   Ingests data from multiple sources: quiz scores, assignment
    submissions, and performance data from the other three modules
    (interview scores, code explanation accuracy, soft skills ratings)

-   Builds a per-student skill heatmap across a configurable skill
    taxonomy (e.g., DSA → Arrays, Linked Lists, Trees; SQL → Joins,
    Subqueries, Indexing; Communication → Clarity, Empathy,
    Assertiveness)

-   Uses NVIDIA LLM APIs to analyze gap patterns and auto-generate a
    personalized learning roadmap with recommended resources, practice
    exercises, and milestones

-   Continuously updates as students interact with other modules ---
    every interview, code exercise, or role-play refines the skill map

**Key Features**

-   **Skill Heatmap Visualization:** Interactive, color-coded grid
    showing proficiency levels (Beginner / Intermediate / Advanced)
    across all tracked skills.

-   **Adaptive Learning Path Generator:** AI-generated roadmap that
    prioritizes the highest-impact gaps first. Includes specific
    resource recommendations (videos, articles, practice problems) and
    estimated time to close each gap.

-   **Progress Tracking Over Time:** Historical trend charts showing how
    a student's skill map has evolved over weeks/months.

-   **Cross-Module Intelligence:** This is the "brain" of TrainIQ. It
    pulls signals from Modules 2, 3, and 4 to build a truly holistic
    skill profile, not just quiz scores.

**4.2 Module 2: AI-Powered Mock Interview Simulator**

**Problem It Solves**

Most training institutes teach coding but never simulate the pressure
and structure of real interviews. Students face their first mock
interview during placement season --- far too late to identify
weaknesses and improve.

**How It Works**

-   Students select an interview type: Technical (DSA, System Design,
    Language-specific) or HR/Behavioral

-   The AI interviewer (powered by NVIDIA LLM APIs) conducts a multi-round
    interview with adaptive follow-up questions based on the student's
    responses

-   For technical rounds: evaluates code correctness, time/space
    complexity analysis, approach quality, and ability to explain
    reasoning

-   For HR rounds: evaluates communication clarity, confidence,
    structure of answers (STAR method), and relevance

-   Optional voice mode: students can respond via microphone using the
    Web Speech API for a more realistic experience

-   After each session, generates a detailed scorecard with
    category-wise ratings, improvement tips, and comparison against
    previous attempts

**Key Features**

-   **Multi-Round Interview Flow:** Configurable rounds (e.g., 2
    technical + 1 HR). Each round has a time limit and difficulty level.

-   **Real-Time Answer Evaluation:** AI evaluates answers as the
    interview progresses, asking follow-up questions to probe deeper
    understanding.

-   **Detailed Scorecard with Replay:** Post-interview report showing
    scores across categories (technical accuracy, communication,
    problem-solving approach). Students can replay the full
    conversation.

-   **Leaderboard:** Friendly competition with anonymized rankings by
    interview score. Encourages repeated practice.

-   **Data Feed to Skill Gap Analyzer:** Interview performance data
    (which topics the student struggled with) automatically flows into
    Module 1 to refine the skill heatmap.

**4.3 Module 3: Code Explain --- Reverse Engineering Learning Tool**

**Problem It Solves**

Traditional training focuses on writing code from scratch, but in real
jobs, developers spend roughly 80% of their time reading, understanding,
and modifying existing code. The ability to read unfamiliar code and
explain what it does is a critical skill that is almost never formally
trained.

**How It Works**

-   Students are shown a working code snippet (ranging from simple
    functions to complex algorithms) and asked to explain what the code
    does, step by step

-   The AI (NVIDIA LLM APIs) evaluates the student's explanation for
    accuracy, completeness, and clarity

-   Provides a detailed breakdown of what the student got right, what
    they missed, and what they misunderstood

-   Supports multiple difficulty levels and programming languages
    (Python, Java, JavaScript, SQL, C++)

**Key Features**

-   **Curated Code Snippet Library:** Pre-built library of snippets
    organized by topic (arrays, recursion, OOP patterns, SQL queries)
    and difficulty (Easy / Medium / Hard).

-   **AI-Evaluated Free-Text Explanations:** Students write their
    explanation in plain English. The AI scores it on accuracy (did they
    identify the algorithm?), completeness (did they cover edge cases?),
    and clarity (could a peer understand this?).

-   **Line-by-Line Annotation Mode:** Students can annotate individual
    lines of code with their understanding. The AI provides per-line
    feedback.

-   **"Explain to a 5-Year-Old" Challenge Mode:** A fun variant where
    students must explain complex code in the simplest possible terms.
    Builds the soft skill of simplifying technical concepts.

**4.4 Module 4: AI-Powered Soft Skills Coach via Role-Play Scenarios**

**Problem It Solves**

Soft skills training at most institutes is passive --- students watch
videos or attend lectures on communication, teamwork, and leadership.
This approach doesn't build real skills because it lacks practice and
personalized feedback. Yet every employer consistently rates soft skills
as a top hiring criterion.

**How It Works**

-   Students enter interactive role-play scenarios: a client call gone
    wrong, a salary negotiation, a team conflict, delivering a
    presentation, or giving constructive feedback to a peer

-   The scenario uses a branching narrative engine --- the student's
    choices and responses affect how the scenario unfolds

-   Students respond via text or voice. The AI evaluates tone, empathy,
    clarity, assertiveness, and professionalism

-   After completion, students receive a detailed coaching report with
    scores, before/after comparisons, and specific improvement suggestions

**Key Features**

-   **Branching Scenario Engine:** Choices affect outcomes. A harsh
    response in a client call leads to an escalation path; an empathetic
    one leads to resolution.

-   **Tone & Empathy Analysis:** AI evaluates not just what the student
    said, but how they said it --- identifying passive-aggression,
    over-apologizing, lack of assertiveness, etc.

-   **Before/After Score Comparison:** Students can retake scenarios and
    see measurable improvement in their scores over time.

-   **Role-Play Portfolio:** A portfolio of completed role-plays with
    scores that students can reference during placement interviews as
    evidence of soft skills development.

**5. Data Flow & Architecture**

**5.1 Unified Architecture (Monolith)**

All four modules live within a single Next.js application, sharing one
PostgreSQL database and one authentication layer. This ensures data
flows seamlessly between modules without API stitching overhead.

**5.2 Cross-Module Data Flow**

The key innovation of TrainIQ is how the modules feed each other:

  ------------------- ------------------- -------------------------------
  **From**            **To**              **Data Transferred**

  **Mock Interview    Skill Gap Analyzer  Topic-wise interview scores,
  (Module 2)**        (Module 1)          weak areas identified during
                                          interviews

  **Code Explain      Skill Gap Analyzer  Accuracy scores per programming
  (Module 3)**        (Module 1)          concept, misunderstanding
                                          patterns

  **Soft Skills Coach Skill Gap Analyzer  Communication scores,
  (Module 4)**        (Module 1)          empathy/assertiveness ratings,
                                          scenario outcomes

  **Skill Gap         All Modules         Updated learning path
  Analyzer (Module                        recommendations that prioritize
  1)**                                    weakest areas across all
                                          dimensions
  ------------------- ------------------- -------------------------------

**5.3 Core Database Entities**

The PostgreSQL schema is designed around these primary entities:

-   **Users/Profiles:** id, name, email, role (student), created_at

-   **Skills:** id, name, category, parent_skill_id (hierarchical
    taxonomy)

-   **StudentSkillScores:** user_id, skill_id, proficiency_level,
    confidence_score, last_updated, source_module

-   **InterviewSessions:** id, user_id, type, rounds, overall_score,
    scorecard_json, transcript, created_at

-   **CodeExplanations:** id, user_id, snippet_id, explanation_text,
    accuracy_score, completeness_score, feedback_json

-   **RolePlaySessions:** id, user_id, scenario_id, choices_json,
    scores_json, coaching_feedback, created_at

-   **LearningPaths:** id, user_id, path_json (AI-generated roadmap),
    status, generated_at

**6. Suggested Team Work Division**

With a team of 4--5, dividing by layer (not by module) keeps the product
cohesive and avoids integration chaos on the final day.

  ------------ ----------------- ---------------------------------------------
  **Member**   **Role**          **Responsibilities**

  **Member 1** **Frontend Lead** Student dashboard, skill heatmap component,
                                 learning path UI, progress charts
                                 (Recharts/Chart.js)

  **Member 2** **Frontend + UX** Interview simulator UI, Code Explain
                                 interface, Soft Skills role-play chat UI,
                                 responsive design

  **Member 3** **Backend + API** API routes for all modules, Supabase Auth,
                                 route protection, data validation

  **Member 4** **Database + AI** Prisma schema & migrations, NVIDIA LLM API
                                 integration for all four modules, prompt
                                 engineering, scoring logic

  **Member 5** **Integration**   Cross-module data flow, skill analyzer
                                 aggregation, leaderboard, achievement system
  ------------ ----------------- ---------------------------------------------

**7. Innovation Highlights (For Judges)**

These are the differentiators that make TrainIQ stand out in a hackathon
setting:

-   **Cross-Module Feedback Loop:** Unlike standalone tools, every
    module feeds data back into the Skill Gap Analyzer. This creates a
    360-degree, continuously evolving student profile that no existing
    platform offers.

-   **Reverse Code Training (Code Explain):** Flipping the traditional
    "write code" model to "read and explain code" addresses a real
    industry gap. No mainstream training platform does this.

-   **Interactive Soft Skills Coaching:** Moving from passive
    video-watching to active role-play with AI evaluation. Soft skills
    coaching tools are virtually nonexistent in the edtech space.

-   **AI as Coach, Not Just Evaluator:** NVIDIA LLM APIs are used not just
    to score answers but to provide actionable coaching --- specific,
    personalized suggestions for improvement after every interaction.

**8. MVP Scope for Hackathon Demo**

To deliver a fully working demo, prioritize these features for each
module:

  --------------------- -------------------------------------------------
  **Module**            **MVP Scope**

  **Skill Gap           Skill heatmap for 8--10 skills, basic learning
  Analyzer**            path generation

  **Mock Interview**    One technical round (DSA) + one HR round,
                        scorecard, question bank with 20+ pre-loaded
                        questions

  **Code Explain**      10--15 pre-loaded snippets across 3 difficulty
                        levels, AI evaluation of free-text explanations

  **Soft Skills Coach** 3--4 pre-built scenarios, text-based responses,
                        coaching scorecard

  **Authentication**    Student login/signup, one demo account
  --------------------- -------------------------------------------------

*This document serves as the blueprint for building TrainIQ. Each
section can be expanded into detailed technical specifications as the
team moves into implementation.*
