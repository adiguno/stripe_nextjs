"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  // By setting maxSteps to 5, you're allowing the model to use up to 5 "steps" for any given generation
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5, // what is happening when you put int a maxStep?
  });
  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.toolInvocations && (
            <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
          )}
          <p>{m.content}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-zinc-300 p-2 text-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
