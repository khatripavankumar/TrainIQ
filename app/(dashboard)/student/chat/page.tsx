"use client";

import {
	useLangGraphChat,
	type ChatMessage,
} from "@/hooks/use-langgraph-chat";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import {
	PromptInput,
	PromptInputTextarea,
	PromptInputFooter,
	PromptInputButton,
	PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
	IconBrain,
	IconSend,
	IconSparkles,
} from "@tabler/icons-react";

// ── Suggestion data grounded in TrainIQ's skill-gap domain ────────────────────

interface StarterSuggestion {
	label: string;
	featured?: boolean;
}

interface SuggestionGroup {
	heading: string;
	items: StarterSuggestion[];
}

const SUGGESTION_GROUPS: SuggestionGroup[] = [
	{
		heading: "Understand",
		items: [
			{ label: "Why is Graph Algorithms my biggest gap?", featured: true },
			{ label: "How close am I to closing my skill gaps?" },
			{ label: "What should I focus on after Graph mastery?" },
		],
	},
	{
		heading: "Build",
		items: [
			{ label: "Build me a 2-week plan for Dynamic Programming" },
			{ label: "Explain memoization with a real example" },
		],
	},
];

// ── Empty state ───────────────────────────────────────────────────────────────

function ChatEmptyState({
	onSuggestionClick,
}: { onSuggestionClick: (suggestion: string) => void }) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-10 px-6 pb-24">
			{/* Hero icon with domain-specific radial glow */}
			<div className="relative flex items-center justify-center">
				<div
					className="absolute h-28 w-28 rounded-full blur-2xl"
					style={{
						background:
							"radial-gradient(circle, var(--primary) 0%, var(--heatmap-mastery) 60%, transparent 100%)",
						opacity: 0.08,
					}}
				/>
				<div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border/30 bg-surface-high">
					<IconBrain className="h-7 w-7 text-primary" stroke={1.5} />
				</div>
			</div>

			{/* Heading + contextual subtext */}
			<div className="space-y-2.5 text-center">
				<h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
					Your learning co-pilot
				</h2>
				<p className="mx-auto max-w-sm font-sans text-sm text-muted-foreground leading-relaxed">
					Explore your skill map, understand your gaps, or build a focused study
					plan tailored to your progress.
				</p>
			</div>

			{/* Grouped suggestions — Miller's Law chunking */}
			<div className="flex w-full max-w-xl flex-col gap-5">
				{SUGGESTION_GROUPS.map((group) => (
					<div key={group.heading} className="flex flex-col items-center gap-2">
						<span className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground/50">
							{group.heading}
						</span>
						<div className="flex flex-wrap justify-center gap-2">
							{group.items.map((suggestion) => (
								<button
									key={suggestion.label}
									type="button"
									onClick={() => onSuggestionClick(suggestion.label)}
									className={
										suggestion.featured
											? "rounded-full border border-primary/25 bg-primary/6 px-4 py-1.5 font-sans text-xs font-medium text-foreground transition-all duration-150 hover:border-primary/40 hover:bg-primary/10"
											: "rounded-full border border-border/40 bg-surface-high px-3.5 py-1.5 font-sans text-xs text-muted-foreground transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
									}
								>
									{suggestion.label}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Streaming cursor ──────────────────────────────────────────────────────────

function StreamingCursor() {
	return (
		<span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-primary/60 align-text-bottom" />
	);
}

// ── Assistant message avatar ──────────────────────────────────────────────────

function AssistantAvatar() {
	return (
		<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface-high border border-border/20">
			<IconSparkles className="h-3.5 w-3.5 text-primary/70" stroke={1.5} />
		</div>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentChatPage() {
	const { messages, input, setInput, isStreaming, handleSubmit } =
		useLangGraphChat({ apiEndpoint: "/api/chat" });

	const currentInput = input ?? "";
	const hasMessages = messages.length > 0;

	function handleSuggestionClick(suggestion: string) {
		setInput(suggestion);
	}

	return (
		<div className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden -mx-5 -my-5">
			{/* ── Message thread (fills entire content area) ── */}
			<div className="relative min-h-0 flex-1">
				{!hasMessages ? (
					<ChatEmptyState onSuggestionClick={handleSuggestionClick} />
				) : (
					<Conversation className="h-full">
						<ConversationContent className="mx-auto max-w-3xl px-4 py-6 pb-4 sm:px-6">
							{messages.map((message: ChatMessage, messageIndex: number) => {
								const isAssistant = message.role === "assistant";
								const isLastAssistantMessage =
									isAssistant &&
									isStreaming &&
									messageIndex === messages.length - 1;

								return (
									<div
										key={message.id}
										className="animate-in fade-in duration-150 ease-out"
										style={{
											animationDelay: `${Math.min(messageIndex * 30, 150)}ms`,
											animationFillMode: "backwards",
										}}
									>
										{isAssistant ? (
											<div className="flex gap-3">
												<div className="mt-1">
													<AssistantAvatar />
												</div>
												<Message from={message.role}>
													<MessageContent className="text-foreground">
														<MessageResponse>
															{message.content}
														</MessageResponse>
														{isLastAssistantMessage && <StreamingCursor />}
													</MessageContent>
												</Message>
											</div>
										) : (
											<Message from={message.role}>
												<MessageContent className="bg-primary/6 text-foreground border border-primary/8">
													<MessageResponse>
														{message.content}
													</MessageResponse>
												</MessageContent>
											</Message>
										)}
									</div>
								);
							})}
						</ConversationContent>
						<ConversationScrollButton />
					</Conversation>
				)}
			</div>

			{/* ── Signature gradient edge — the "learning edge" ── */}
			<div
				className="h-[1.5px] w-full shrink-0"
				style={{ background: "var(--chat-gradient-edge)" }}
			/>

			{/* ── Floating input composer ── */}
			<div
				className="shrink-0 bg-surface-high/80 backdrop-blur-sm px-4 py-3 sm:px-6"
				style={{ boxShadow: "var(--chat-composer-shadow)" }}
			>
				<div className="mx-auto max-w-3xl space-y-2.5">
					<PromptInput onSubmit={handleSubmit}>
						<PromptInputTextarea
							value={currentInput}
							onChange={(e) => setInput(e.currentTarget.value)}
							placeholder="Ask about your skill map…"
							className="min-h-[52px] bg-background text-sm placeholder:text-muted-foreground/40 rounded-xl border-border/30"
							disabled={isStreaming}
						/>
						<PromptInputFooter>
							<PromptInputTools />
							<div className="flex items-center gap-3">
								<span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[0.6rem] text-muted-foreground/35 select-none">
									<kbd className="rounded border border-border/20 bg-surface-low px-1 py-0.5 font-mono text-[0.55rem]">↵</kbd>
									Send
									<span className="mx-0.5 text-border">·</span>
									<kbd className="rounded border border-border/20 bg-surface-low px-1 py-0.5 font-mono text-[0.55rem]">⇧↵</kbd>
									New line
								</span>
								<PromptInputButton
									type="submit"
									disabled={!currentInput.trim() || isStreaming}
									className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-opacity duration-150"
									tooltip={{ content: "Send message", shortcut: "↵" }}
								>
									<IconSend className="h-4 w-4" stroke={1.5} />
								</PromptInputButton>
							</div>
						</PromptInputFooter>
					</PromptInput>

					<p className="text-center font-mono text-[0.6rem] text-muted-foreground/30 select-none">
						AI Tutor can make mistakes. Verify important skill assessments.
					</p>
				</div>
			</div>
		</div>
	);
}
