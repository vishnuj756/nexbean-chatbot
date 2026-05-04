"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '../themeToggle';
import { UserRound, ChevronDown, LogOut, UserPen, PanelRight } from 'lucide-react';
import { Logout } from '@/app/(helper)/helperFunction';
import { spawn } from 'child_process';
import Link from 'next/link';

type HeaderProps = {
  setSidebarCollapsed: () => void;
  sidebarCollapsed: any;
  sidebarOpen: any;
  onClose: () => void;
  setProfileModal:any
}

export default function Header({ setSidebarCollapsed, sidebarCollapsed, sidebarOpen, onClose,setProfileModal }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userdata = localStorage.getItem("user");
  console.log("header ===>props==?>", sidebarCollapsed);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Keyframes only — not expressible in Tailwind without config */}
      <style>{`
        @keyframes auroraShift {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.93) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .aurora-line {
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% 100%;
          animation: auroraShift 4s linear infinite;
        }
        .anim-drop-in {
          animation: dropIn 0.22s cubic-bezier(0.34,1.2,0.64,1) both;
        }
      `}</style>

      <header className="
        relative flex items-center justify-end h-14 px-6
        bg-white/[0.82] dark:bg-[rgba(15,12,41,0.88)]
        border-b border-indigo-500/[0.13] dark:border-indigo-500/[0.18]
        backdrop-blur-[20px]
        shadow-[0_1px_0_rgba(99,102,241,0.08),0_2px_16px_rgba(99,102,241,0.04)]
        dark:shadow-[0_1px_0_rgba(99,102,241,0.12),0_2px_20px_rgba(0,0,0,0.3)]
      ">

        {/* Aurora underline */}
        <span className="aurora-line pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-70" />

        {/* Inner row */}
        <div className="flex items-center justify-between w-full ">

          {/* Brand */}

          <span className="group relative flex items-center justify-center cursor-pointer font-semibold tracking-tight w-30 " onClick={() => {
            (!sidebarCollapsed == !sidebarOpen) ?
            onClose(true) : setSidebarCollapsed((p) => !p)
          }}>
            {((sidebarCollapsed && !sidebarOpen) || (!sidebarCollapsed == !sidebarOpen)) && (
              <>
                {/* 
          - group-hover:invisible: hides the text when the container is hovered
          - transition-all: makes the disappear/appear effect smooth
      */}
                <span className="absolute inset-0 bg-gradient-to-br text-2xl from-indigo-500 to-purple-500 bg-clip-text text-transparent group-hover:invisible transition-all">
                  NexBean
                </span>

                {/* 
          - opacity-0: hidden by default
          - group-hover:opacity-100: shows when container is hovered
      */}
                <span className="opacity-0 group-hover:opacity-100 transition-all text-indigo-500">
                  <PanelRight size={30} />
                </span>
              </>
            )}
          </span>

          <div className="flex gap-3 items-center">
            <div className="w-15">
              <ThemeToggle />
            </div>

            {/* User dropdown wrapper */}
            <div className="relative" ref={dropdownRef}>

              {/* Trigger button */}
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setIsOpen(!isOpen)}
                className="
                relative flex items-center gap-2 px-3 py-1.5 rounded-full
                border border-indigo-500/20 bg-indigo-500/[0.06]
                text-[0.8125rem] font-medium text-gray-700
                dark:text-gray-300 dark:border-indigo-500/25 dark:bg-indigo-500/10
                cursor-pointer overflow-hidden
                transition-[border-color,box-shadow] duration-[180ms]
                hover:border-indigo-500/35 hover:shadow-[0_2px_12px_rgba(99,102,241,0.15)]
                dark:hover:border-indigo-500/45 dark:hover:shadow-[0_2px_14px_rgba(99,102,241,0.22)]
                group
              "
              >
                {/* Hover gradient overlay */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms]" />

                {/* Avatar */}
                <span className="
                relative z-[1] flex-shrink-0
                w-6 h-6 rounded-full
                bg-gradient-to-br from-indigo-500 to-purple-500
                flex items-center justify-center
                shadow-[0_1px_6px_rgba(99,102,241,0.35)]
                text-white
              ">
                  <UserRound size={12} />
                </span>

                {/* Username */}
                <span className="relative z-[1] max-w-[7rem] truncate">
                  {userdata ?? 'Account'}
                </span>

                {/* Chevron */}
                <ChevronDown
                  size={14}
                  className={`
                  relative z-[1] text-gray-400
                  transition-[transform,color] duration-[220ms] ease-[cubic-bezier(0.34,1.3,0.64,1)]
                  ${isOpen ? 'rotate-180 !text-indigo-500' : ''}
                `}
                />
              </button>

              {/* Dropdown panel */}
              {isOpen && (
                <div
                  role="menu"
                  className="
                  anim-drop-in
                  absolute right-0 top-[calc(100%+0.5rem)] z-50
                  w-52 rounded-2xl overflow-hidden
                  border border-indigo-500/15 dark:border-indigo-500/[0.22]
                  bg-white/[0.92] dark:bg-[rgba(15,12,41,0.94)]
                  backdrop-blur-[20px]
                  shadow-[0_8px_32px_rgba(99,102,241,0.12),0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
                  dark:shadow-[0_8px_36px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]
                "
                >
                  {/* User info header */}
                  <div className="px-3.5 pt-2.5 pb-2 border-b border-indigo-500/10 dark:border-indigo-500/[0.15]">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.09em] text-gray-400">
                      Signed in as
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] font-medium text-indigo-700 dark:text-indigo-300 truncate">
                      {userdata ?? '—'}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">

                    {/* Profile */}
                    <div
                   onClick={()=>{
                    setProfileModal(true)
                   }}
                      role="menuitem"
                      className="
                      flex items-center gap-2 w-full px-2.5 py-2 rounded-[0.625rem]
                      text-[0.8125rem] font-normal text-gray-700 dark:text-gray-300
                      transition-[background,color] duration-150
                      hover:bg-indigo-500/[0.08] hover:text-indigo-700
                      dark:hover:bg-indigo-500/[0.12] dark:hover:text-indigo-200
                      group/item
                    "
                    >
                      <span className="
                      flex-shrink-0 w-6 h-6 rounded-[0.4rem]
                      bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12]
                      flex items-center justify-center
                      text-indigo-500 dark:text-indigo-300
                      transition-[background] duration-150
                      group-hover/item:bg-indigo-500/15 dark:group-hover/item:bg-indigo-500/20
                    ">
                        <UserPen size={13} />
                      </span>
                      Profile
                    </div>

                    {/* Divider */}
                    <div className="h-px my-1 mx-1.5 bg-gradient-to-r from-transparent via-indigo-500/[0.12] to-transparent dark:via-indigo-500/[0.18]" />

                    {/* Sign out */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => Logout()}
                      className="
                      flex items-center gap-2 w-full px-2.5 py-2 rounded-[0.625rem]
                      text-[0.8125rem] font-normal text-red-600 dark:text-red-400
                      transition-[background,color] duration-150
                      hover:bg-red-500/[0.07] dark:hover:bg-red-400/[0.08]
                      group/danger
                      cursor-pointer
                    "
                    >
                      <span className="
                      flex-shrink-0 w-6 h-6 rounded-[0.4rem]
                      bg-red-500/[0.08] dark:bg-red-400/10
                      flex items-center justify-center
                      text-red-600 dark:text-red-400
                      transition-[background] duration-150
                      group-hover/danger:bg-red-500/[0.14] dark:group-hover/danger:bg-red-400/[0.16]
                    ">
                        <LogOut size={13} />
                      </span>
                      Sign out
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}