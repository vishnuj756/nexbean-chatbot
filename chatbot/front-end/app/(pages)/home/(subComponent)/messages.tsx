"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessagePair = {
  user: string;
  bot: string | null;
};

type MessagesProps = {
  messages: MessagePair[];
};

export default function Messages({ messages }: MessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Keyframes only — not possible in Tailwind without config changes */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(18px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-18px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
        .anim-slide-right { animation: slideInRight 0.35s cubic-bezier(0.34,1.3,0.64,1) both; }
        .anim-slide-left  { animation: slideInLeft  0.35s cubic-bezier(0.34,1.3,0.64,1) both; }
        .anim-typing-dot  { animation: typingBounce 1.2s ease-in-out infinite; }
        .anim-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .anim-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="flex flex-col gap-0 px-4 py-6">
        {messages?.map((pair, index) => (
          <React.Fragment key={index}>

            {/* ── User bubble ── */}
            <div
              className="anim-slide-right flex justify-end mb-2"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="
                relative max-w-[75%] px-[1.1rem] py-3
                rounded-[1.4rem_1.4rem_0.25rem_1.4rem]
                text-sm font-normal leading-relaxed tracking-[0.01em] text-white
                bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500
                shadow-[0_4px_20px_rgba(99,102,241,0.4),0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
                dark:from-indigo-600 dark:via-violet-700 dark:to-purple-700
                dark:shadow-[0_4px_24px_rgba(79,70,229,0.5),0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]
                overflow-hidden
              ">
                {/* Gloss overlay */}
                <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.18] to-transparent" />
                {pair.user}
              </div>
            </div>

            {/* ── Bot bubble ── */}
            {(pair.bot !== null || messages.length - 1 === index) && (
              <div
                className="anim-slide-left flex justify-start items-start gap-2.5 mb-5"
                style={{ animationDelay: `${index * 0.04 + 0.08}s` }}
              >
                {/* Avatar */}
                <div
                  className="
                    relative flex-shrink-0 mt-0.5
                    w-[1.875rem] h-[1.875rem] rounded-full
                    bg-gradient-to-br from-indigo-500 to-purple-500
                    flex items-center justify-center
                    shadow-[0_2px_10px_rgba(99,102,241,0.35)]
                    overflow-hidden
                  "
                  aria-hidden="true"
                >
                  <span className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] rounded-full bg-white/25" />
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-[1] w-3.5 h-3.5 fill-white"
                  >
                    <path d="M12 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m0 5c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4m-4 9h2v6H8v-6m6 0h2v6h-2v-6z" />
                  </svg>
                </div>

                {/* Bubble */}
                <div className="
                  relative max-w-[80%] px-[1.125rem] py-[0.875rem]
                  rounded-[1.4rem_1.4rem_1.4rem_0.25rem]
                  text-sm leading-[1.7]
                  bg-white/[0.78] dark:bg-[rgba(15,12,41,0.72)]
                  border border-indigo-500/[0.12] dark:border-indigo-500/[0.22]
                  backdrop-blur-[16px]
                  text-indigo-950 dark:text-indigo-100
                  shadow-[0_4px_24px_rgba(99,102,241,0.08),0_1px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
                  dark:shadow-[0_4px_28px_rgba(99,102,241,0.12),0_1px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]
                  overflow-hidden
                ">
                  {/* Subtle tint overlay */}
                  <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.03] dark:from-indigo-500/[0.08] dark:to-purple-500/[0.06]" />

                  {pair.bot === null ? (
                    /* Typing indicator */
                    <div className="flex items-center gap-[0.3rem] py-1 px-1" aria-label="Thinking…">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="anim-typing-dot w-[0.45rem] h-[0.45rem] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
                        />
                      ))}
                    </div>
                  ) : (
                    /* Markdown prose */
                    <div className="
                      relative z-[1]
                      [&_p]:mb-[0.6em] [&_p:last-child]:mb-0
                      [&_ul]:my-[0.4em] [&_ul]:ml-5 [&_ul]:p-0
                      [&_ol]:my-[0.4em] [&_ol]:ml-5 [&_ol]:p-0
                      [&_li]:mb-[0.2em]
                      [&_strong]:font-semibold [&_strong]:text-indigo-600 dark:[&_strong]:text-indigo-300
                      [&_a]:text-indigo-500 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-indigo-400
                      [&_code]:text-[0.8em] [&_code]:px-[0.4em] [&_code]:py-[0.1em] [&_code]:rounded-[0.3em]
                      [&_code]:bg-indigo-500/10 [&_code]:text-indigo-600 [&_code]:font-mono
                      dark:[&_code]:bg-indigo-500/[0.18] dark:[&_code]:text-indigo-300
                      [&_pre]:bg-indigo-950 [&_pre]:text-indigo-100 [&_pre]:rounded-xl
                      [&_pre]:px-4 [&_pre]:py-4 [&_pre]:overflow-x-auto [&_pre]:text-[0.8em]
                      [&_pre]:my-3 [&_pre]:shadow-[0_4px_20px_rgba(30,27,75,0.2)]
                      [&_pre]:border [&_pre]:border-indigo-500/20
                      dark:[&_pre]:bg-[#0f0c29] dark:[&_pre]:border-indigo-500/30
                      [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0 [&_pre_code]:text-inherit
                      [&_blockquote]:border-l-[3px] [&_blockquote]:border-indigo-500 [&_blockquote]:my-[0.6em]
                      [&_blockquote]:pl-3 [&_blockquote]:py-[0.4em]
                      [&_blockquote]:bg-indigo-500/5 [&_blockquote]:rounded-r-lg
                      [&_blockquote]:italic [&_blockquote]:text-indigo-700
                      dark:[&_blockquote]:bg-indigo-500/[0.08] dark:[&_blockquote]:text-indigo-300
                      dark:[&_blockquote]:border-indigo-400
                    ">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {pair.bot}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            )}

          </React.Fragment>
        ))}

        <div ref={bottomRef} className="h-4" />
      </div>
    </>
  );
}