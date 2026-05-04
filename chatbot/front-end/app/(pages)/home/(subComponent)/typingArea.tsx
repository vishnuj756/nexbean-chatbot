"use client";

import React, { useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";

type TypingAreaProps = {
  onSend: () => void;
  onChange: (val: string) => void;
  value: string;
};

const TypingArea: React.FC<TypingAreaProps> = ({ onSend, onChange, value }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 5 * 24;
    if (el.scrollHeight <= maxHeight) {
      el.style.height = `${el.scrollHeight}px`;
      el.style.overflowY = "hidden";
    } else {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasContent = value.trim().length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .ta-wrap {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 0.625rem;
          padding: 0.625rem 0.625rem 0.625rem 1rem;
          border-radius: 1.25rem;
          border: 1px solid rgba(99, 102, 241, 0.2);
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 4px 24px rgba(99, 102, 241, 0.08),
            0 1px 4px rgba(0,0,0,0.05),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transition: border-color 0.22s, box-shadow 0.22s;
        }

        .ta-wrap:focus-within {
          border-color: rgba(99, 102, 241, 0.45);
          box-shadow:
            0 0 0 3px rgba(99, 102, 241, 0.1),
            0 4px 28px rgba(99, 102, 241, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* animated aurora border on focus */
        .ta-wrap::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% 100%;
          animation: auroraShift 3s linear infinite;
          opacity: 0;
          transition: opacity 0.25s;
          z-index: -1;
          pointer-events: none;
        }
        .ta-wrap:focus-within::before { opacity: 0.5; }

        @keyframes auroraShift {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        /* mask to cut the gradient behind the bg */
        .ta-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(255,255,255,0.82);
          z-index: -1;
          transition: background 0.22s;
        }

        .ta-textarea {
          flex: 1;
          resize: none;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.5rem;
          color: #1e1b4b;
          max-height: 120px;
          padding: 0.25rem 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(99,102,241,0.2) transparent;
        }
        .ta-textarea::-webkit-scrollbar { width: 3px; }
        .ta-textarea::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 2px; }
        .ta-textarea::placeholder { color: #9ca3af; }

        /* ── Send button ── */
        .ta-send-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition:
            background 0.2s,
            box-shadow 0.2s,
            transform 0.18s cubic-bezier(0.34,1.4,0.64,1),
            opacity 0.2s;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          box-shadow: 0 2px 10px rgba(99,102,241,0.4);
          position: relative;
          overflow: hidden;
        }

        .ta-send-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          border-radius: inherit;
        }

        .ta-send-btn:not(:disabled):hover {
          transform: scale(1.08) translateY(-1px);
          box-shadow: 0 4px 18px rgba(99,102,241,0.5);
        }

        .ta-send-btn:not(:disabled):active {
          transform: scale(0.94);
          box-shadow: 0 1px 6px rgba(99,102,241,0.3);
        }

        .ta-send-btn:disabled {
          background: rgba(99,102,241,0.15);
          box-shadow: none;
          cursor: not-allowed;
          color: rgba(99,102,241,0.4);
        }

        /* send icon nudge on hover */
        .ta-send-btn:not(:disabled):hover .ta-send-icon {
          transform: translateX(1px) translateY(-1px);
        }
        .ta-send-icon {
          transition: transform 0.18s cubic-bezier(0.34,1.4,0.64,1);
          position: relative;
          z-index: 1;
        }

        /* hint text */
        .ta-hint {
          position: absolute;
          bottom: -1.4rem;
          right: 0.25rem;
          font-size: 0.65rem;
          color: #c4b5fd;
          opacity: 0;
          transition: opacity 0.25s;
          pointer-events: none;
          white-space: nowrap;
        }
        .ta-wrap:focus-within .ta-hint { opacity: 1; }

        /* ══════════════════════
           DARK MODE
        ══════════════════════ */
        @media (prefers-color-scheme: dark) {
          .ta-wrap {
            background: rgba(15, 12, 41, 0.82);
            border-color: rgba(99, 102, 241, 0.22);
            box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
          }
          .ta-wrap::after { background: rgba(15,12,41,0.82); }
          .ta-wrap:focus-within {
            border-color: rgba(99,102,241,0.5);
            box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 4px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
          }
          .ta-textarea { color: #e0e7ff; }
          .ta-textarea::placeholder { color: #4b5563; }
          .ta-send-btn:disabled { background: rgba(99,102,241,0.12); color: rgba(165,180,252,0.35); }
        }

        .dark .ta-wrap {
          background: rgba(15, 12, 41, 0.82);
          border-color: rgba(99, 102, 241, 0.22);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .dark .ta-wrap::after { background: rgba(15,12,41,0.82); }
        .dark .ta-wrap:focus-within { border-color: rgba(99,102,241,0.5); box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 4px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04); }
        .dark .ta-textarea { color: #e0e7ff; }
        .dark .ta-textarea::placeholder { color: #4b5563; }
        .dark .ta-send-btn:disabled { background: rgba(99,102,241,0.12); color: rgba(165,180,252,0.35); }
      `}</style>

      <div className="ta-wrap" style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          className="ta-textarea"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Message NexBean…"
          aria-label="Message input"
        />

        <button
          className="ta-send-btn"
          onClick={handleSend}
          disabled={!hasContent}
          aria-label="Send message"
          type="button"
        >
          <Send size={15} className="ta-send-icon" />
        </button>

        <span className="ta-hint">↵ Enter to send · Shift+↵ for new line</span>
      </div>
    </>
  );
};

export default TypingArea;