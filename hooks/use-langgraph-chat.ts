"use client";

import { useCallback, useRef, useState } from "react";
import { nanoid } from "nanoid";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

type ChatStatus = "idle" | "streaming" | "error";

interface UseLangGraphChatOptions {
	apiEndpoint?: string;
}

interface UseLangGraphChatReturn {
	messages: ChatMessage[];
	input: string;
	setInput: (value: string) => void;
	isStreaming: boolean;
	status: ChatStatus;
	append: (content: string) => Promise<void>;
	handleSubmit: (payload: { text: string }) => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useLangGraphChat(
	options: UseLangGraphChatOptions = {},
): UseLangGraphChatReturn {
	const { apiEndpoint = "/api/chat" } = options;

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [status, setStatus] = useState<ChatStatus>("idle");
	const abortControllerRef = useRef<AbortController | null>(null);

	const append = useCallback(
		async (userContent: string) => {
			if (!userContent.trim()) return;

			// Cancel any in-flight request
			abortControllerRef.current?.abort();
			const abortController = new AbortController();
			abortControllerRef.current = abortController;

			const userMessage: ChatMessage = {
				id: nanoid(),
				role: "user",
				content: userContent,
			};

			const assistantMessage: ChatMessage = {
				id: nanoid(),
				role: "assistant",
				content: "",
			};

			// Optimistically add user message + empty assistant placeholder
			setMessages((previousMessages) => [
				...previousMessages,
				userMessage,
				assistantMessage,
			]);
			setStatus("streaming");

			try {
				const allMessages = [
					...messages,
					{ role: "user" as const, content: userContent },
				];

				const response = await fetch(apiEndpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						messages: allMessages.map(({ role, content }) => ({
							role,
							content,
						})),
					}),
					signal: abortController.signal,
				});

				if (!response.ok) {
					throw new Error(`Chat request failed: ${response.status}`);
				}

				const reader = response.body?.getReader();
				if (!reader) throw new Error("No readable stream in response");

				const decoder = new TextDecoder();
				let accumulatedContent = "";
				let buffer = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					// Add new chunk to the buffer
					buffer += decoder.decode(value, { stream: true });

					// Split by double newline (SSE event boundary)
					const messagesArr = buffer.split("\n\n");

					// The last element might be an incomplete message, keep it in the buffer
					buffer = messagesArr.pop() ?? "";

					for (const messageText of messagesArr) {
						// Split into individual lines within the SSE event
						const lines = messageText.split("\n");

						for (const line of lines) {
							const trimmedLine = line.trim();
							if (!trimmedLine.startsWith("data: ")) continue;

							const dataPayload = trimmedLine.slice(6);
							if (dataPayload === "[DONE]") continue;

							try {
								const parsed = JSON.parse(dataPayload) as {
									token?: string;
									error?: string;
								};

								if (parsed.error) {
									throw new Error(parsed.error);
								}

								if (parsed.token) {
									accumulatedContent += parsed.token;
									setMessages((previousMessages) =>
										previousMessages.map((msg) =>
											msg.id === assistantMessage.id
												? { ...msg, content: accumulatedContent }
												: msg,
										),
									);
								}
							} catch (parseError) {
								if (parseError instanceof SyntaxError) {
									console.warn("Skipped malformed SSE JSON:", dataPayload);
									continue;
								}
								throw parseError;
							}
						}
					}
				}

				setStatus("idle");
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}

				setStatus("error");

				// Update the assistant message with error indication
				setMessages((previousMessages) =>
					previousMessages.map((message) =>
						message.id === assistantMessage.id
							? {
									...message,
									content:
										message.content ||
										"Sorry, something went wrong. Please try again.",
								}
							: message,
					),
				);
			}
		},
		[apiEndpoint, messages],
	);

	const handleSubmit = useCallback(
		(payload: { text: string }) => {
			if (!payload.text.trim()) return;
			setInput("");
			void append(payload.text);
		},
		[append],
	);

	return {
		messages,
		input,
		setInput,
		isStreaming: status === "streaming",
		status,
		append,
		handleSubmit,
	};
}
