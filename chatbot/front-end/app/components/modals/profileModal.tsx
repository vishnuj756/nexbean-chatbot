"use client";

import React, { useEffect } from 'react';
import { UserRound, ShieldCheck, Users, CalendarDays, X } from 'lucide-react';

type ProfileModalProps = {
  data:any
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileModal({ data, isOpen, onClose }: ProfileModalProps) {

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes auroraShift {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .aurora-bar {
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% 100%;
          animation: auroraShift 4s linear infinite;
        }
        .anim-drop-in {
          animation: dropIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
        }
        .anim-fade-in {
          animation: fadeIn 0.2s ease both;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-label="Profile modal"
      >
        {/* Ambient blobs */}
        <div className="pointer-events-none fixed -top-32 -left-24 z-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]" />
        <div className="pointer-events-none fixed -bottom-24 -right-20 z-0 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.10),transparent_70%)]" />

        {/* Modal card — stop click from bubbling to backdrop */}
        <div
          className="anim-drop-in relative z-10 w-full max-w-lg rounded-[1.75rem] overflow-hidden bg-white/[0.82] dark:bg-[rgba(15,12,41,0.88)] border border-indigo-500/[0.13] dark:border-indigo-500/[0.22] backdrop-blur-[20px] shadow-[0_8px_48px_rgba(99,102,241,0.14),0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.5),0_2px_12px_rgba(0,0,0,0.4)]"
          onClick={e => e.stopPropagation()}
        >
          {/* Aurora top bar */}
          <div className="aurora-bar absolute top-0 left-0 right-0 h-[3px]" />

          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-7 pb-5">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                Profile
              </p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight bg-gradient-to-br from-indigo-700 to-violet-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                User details
              </h1>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              {/* ID badge */}
              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-br from-indigo-500/[0.12] to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300">
                ID: {data?.id}
              </span> */}

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-8 h-8 rounded-xl border border-indigo-500/15 dark:border-indigo-500/25 bg-indigo-500/[0.06] dark:bg-indigo-500/10 text-gray-400 dark:text-gray-500 transition-[background,color] duration-150 hover:bg-indigo-500/[0.12] hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Avatar row */}
          <div className="flex items-center gap-4 px-7 pb-5 flex-col">
            <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_4px_20px_rgba(99,102,241,0.4)] overflow-hidden">
              <span className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] rounded-full bg-white/20" />
              <UserRound size={26} className="relative z-[1] text-white" />
            </div>
            <div className='flex items-center flex-col w-full'>
              <p className="text-base font-semibold rounded-2xl bg-white/50 dark:bg-[rgba(99,102,241,0.06)] border border-indigo-500/[0.1] dark:border-indigo-500/[0.15]  rounded-lg w-full  shadow-lg p-3 ">
                {data?.username}
              </p>
              <p className="text-base font-semibold rounded-2xl bg-white/50 dark:bg-[rgba(99,102,241,0.06)] border border-indigo-500/[0.1] dark:border-indigo-500/[0.15]  rounded-lg w-full  shadow-lg p-3 mt-3">
             {data?.email}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-7 h-px bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent dark:via-indigo-500/20" />

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-3 px-7 py-5">
            {[
              { icon: ShieldCheck,  label: 'Status', value: 'Active',   color: 'text-emerald-500' },
              { icon: Users,        label: 'Role',   value: 'Member',   color: 'text-indigo-500 dark:text-indigo-300' },
              { icon: CalendarDays, label: 'Joined', value: data?.createDate, color: 'text-purple-500 dark:text-purple-300' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/50 dark:bg-[rgba(99,102,241,0.06)] border border-indigo-500/[0.1] dark:border-indigo-500/[0.15]">
                <Icon size={15} className={color} />
                <p className="text-[0.7rem] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">
                  {value}
                </p>
              </div>
            ))}
          </div>

         

        </div>
      </div>
    </>
  );
}