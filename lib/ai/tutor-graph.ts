import { ChatOpenRouter } from "@langchain/openrouter";
import { MessagesAnnotation, StateGraph, START } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";

// ── TrainIQ AI Tutor persona ─────────────────────────────────────────────────
// The AI acts as a skill navigator — not a generic assistant.

const TRAINIQ_SYSTEM_PROMPT = `You are the TrainIQ AI Tutor — a precision learning co-pilot embedded inside a skill development platform for software engineering students.

Your role is to help students understand their skill gaps, clarify technical concepts, and build focused learning plans. You have access to the student's current skill map context (provided in messages) and should reference it when relevant.

**Your tone:** Direct, encouraging, technically precise. You sound like a senior engineer who genuinely wants the student to succeed — not a cheerful chatbot.

**What you help with:**
- Explaining why specific skills are gaps and what closes them fastest
- Breaking down algorithms, data structures, and system design concepts clearly
- Building prioritized, time-boxed study plans
- Providing concrete code examples when relevant
- Connecting concepts to real interview and production scenarios

**What you avoid:**
- Generic motivational phrases ("Great question!", "Absolutely!")
- Lengthy preambles before getting to the answer
- Recommending resources you can't verify (just explain the concept directly)

Always be concise. If a question needs depth, structure it clearly with headers and code blocks.`;

// ── Model ────────────────────────────────────────────────────────────────────

const tutorModel = new ChatOpenRouter({
	model: "nvidia/nemotron-3-super-120b-a12b:free",
	temperature: 0,
	maxTokens: 1024,
	apiKey: process.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_API ?? "",
});

// ── Graph ────────────────────────────────────────────────────────────────────

async function callTutorModel(
	state: typeof MessagesAnnotation.State,
): Promise<typeof MessagesAnnotation.Update> {
	const systemMessage = new SystemMessage(TRAINIQ_SYSTEM_PROMPT);
	const response = await tutorModel.invoke([
		systemMessage,
		...state.messages,
	]);
	return { messages: [response] };
}

const tutorGraphBuilder = new StateGraph(MessagesAnnotation)
	.addNode("callModel", callTutorModel)
	.addEdge(START, "callModel");

export const tutorGraph = tutorGraphBuilder.compile();
