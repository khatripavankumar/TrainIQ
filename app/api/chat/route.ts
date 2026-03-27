import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { tutorGraph } from "@/lib/ai/tutor-graph";

// ── Message conversion ───────────────────────────────────────────────────────

interface IncomingMessage {
	role: "user" | "assistant";
	content: string;
}

function convertToLangChainMessages(
	messages: IncomingMessage[],
) {
	return messages.map((message) => {
		if (message.role === "user") {
			return new HumanMessage(message.content);
		}
		return new AIMessage(message.content);
	});
}

// ── SSE streaming route ──────────────────────────────────────────────────────

export async function POST(request: Request) {
	const { messages } = (await request.json()) as {
		messages: IncomingMessage[];
	};

	const langChainMessages = convertToLangChainMessages(messages);

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();

			try {
				const graphStream = await tutorGraph.stream(
					{ messages: langChainMessages },
					{ streamMode: "messages" },
				);

				for await (const [messageChunk] of graphStream) {
					const tokenContent =
						typeof messageChunk.content === "string"
							? messageChunk.content
							: "";

					if (tokenContent) {
						const ssePayload = `data: ${JSON.stringify({ token: tokenContent })}\n\n`;
						controller.enqueue(encoder.encode(ssePayload));
					}
				}

				controller.enqueue(encoder.encode("data: [DONE]\n\n"));
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";
				controller.enqueue(
					encoder.encode(
						`data: ${JSON.stringify({ error: errorMessage })}\n\n`,
					),
				);
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
