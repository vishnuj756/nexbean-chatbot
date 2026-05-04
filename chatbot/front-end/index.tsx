"use client";
import { getHistoryList } from '@/app/services/api/apiService';
import { CircleFadingPlus, History, MessageSquare, PanelLeftOpen, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SideBarProps = {
  onClose?: () => void;
  setSidebarCollapsed:(value:any)=>void;
  sidebarCollapsed:any;
};

export default function SideBar({ onClose,setSidebarCollapsed ,sidebarCollapsed}: SideBarProps) {
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const historyData = await getHistoryList();
        if (historyData) setData(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSubmit = (chatId: any) => {
    navigate.push(`/home/${chatId}`);
    onClose?.();
  };

  const filtered = data.filter((chat: any) =>
    (chat?.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Keyframes only — not expressible in Tailwind without config */}
      <style>{`
        @keyframes auroraShift {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes sbItemIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .aurora-bar {
          animation: auroraShift 4s linear infinite;
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% 100%;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(99,102,241,0.06) 25%, rgba(99,102,241,0.12) 50%, rgba(99,102,241,0.06) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .dark .shimmer-bg {
          background: linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%);
          background-size: 200% 100%;
        }
        .sb-item-in {
          animation: sbItemIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
        }
      `}</style>

      {/* Root */}
      <div className="
        relative flex flex-col w-64 h-full
        bg-white/[0.82] dark:bg-[rgba(15,12,41,0.88)]
        border-r border-indigo-500/[0.13] dark:border-indigo-500/[0.18]
        backdrop-blur-[20px]
        shadow-[4px_0_32px_rgba(99,102,241,0.07),1px_0_0_rgba(99,102,241,0.08)]
        dark:shadow-[4px_0_32px_rgba(0,0,0,0.35)]
        overflow-hidden
      ">

        {/* Aurora top bar */}
        <div className="aurora-bar absolute top-0 left-0 right-0 h-[3px] z-10" />

        {/* Inner column */}
        <div className="flex flex-col h-full px-2 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-3 pt-6 pb-4">
            <span className="
              text-base font-semibold tracking-tight
              bg-gradient-to-br from-indigo-500 to-purple-500
              bg-clip-text text-transparent
            ">
              NexBean
            </span>

            <button
              className="ml-3 hidden md:flex items-center justify-center w-9 h-9 rounded-[0.6rem] border border-indigo-500/20 bg-indigo-500/[0.07] text-indigo-500 cursor-pointer transition-[background,box-shadow] duration-[180ms] hover:bg-indigo-500/[0.14] hover:shadow-[0_2px_10px_rgba(99,102,241,0.18)] dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300 dark:hover:bg-indigo-400/[0.18]"
              onClick={() => setSidebarCollapsed((p:any) => !p)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeftOpen size={16} />
            </button>
            {/* Close — mobile only */}
            <button
              className="
                flex md:hidden items-center justify-center w-8 h-8 rounded-lg border-none
                bg-transparent text-gray-500 cursor-pointer
                transition-[background,color] duration-[180ms]
                hover:bg-indigo-500/10 hover:text-indigo-500
                dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300
              "
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* New Chat */}
          <div
            className="
              flex items-center gap-2.5 px-3 py-[0.55rem] mb-1 rounded-xl cursor-pointer
              bg-gradient-to-br from-indigo-500/[0.12] to-purple-500/10
              border border-indigo-500/20
              transition-[background,box-shadow] duration-[180ms]
              hover:from-indigo-500/20 hover:to-purple-500/[0.16]
              hover:shadow-[0_2px_12px_rgba(99,102,241,0.2)]
              dark:from-indigo-500/[0.18] dark:to-purple-500/[0.14]
              dark:border-indigo-500/[0.28]
            "
            onClick={() => { navigate.push('/home'); onClose?.(); }}
            role="button"
            tabIndex={0}
          >
            <div className="
              flex items-center justify-center w-[1.625rem] h-[1.625rem] rounded-[0.45rem] flex-shrink-0
              bg-gradient-to-br from-indigo-500 to-purple-500
              shadow-[0_2px_8px_rgba(99,102,241,0.35)]
              text-white
            ">
              <CircleFadingPlus size={14} />
            </div>
            <span className="text-[0.8125rem] font-semibold text-indigo-700 dark:text-indigo-200 flex-1">
              New Chat
            </span>
          </div>

          {/* Search toggle */}
          <div
            className="
              flex items-center gap-2.5 px-3 py-[0.55rem] mb-1 rounded-xl cursor-pointer
              border border-transparent
              transition-[background,border-color] duration-[180ms]
              hover:bg-indigo-500/[0.08] hover:border-indigo-500/15
              dark:hover:bg-indigo-500/[0.12]
            "
            onClick={() => setSearchOpen(p => !p)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-center w-[1.625rem] h-[1.625rem] rounded-[0.45rem] flex-shrink-0 text-gray-400">
              <Search size={14} />
            </div>
            <span className="text-[0.8125rem] font-medium text-gray-700 dark:text-gray-300 flex-1">
              Search chats
            </span>
          </div>

          {/* Search input — animated expand */}
          <div
            className={`
              overflow-hidden px-2 transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${searchOpen ? 'max-h-14 opacity-100 pb-2' : 'max-h-0 opacity-0'}
            `}
          >
            <input
              className="
                w-full px-3 py-[0.45rem] rounded-[0.625rem]
                border border-indigo-500/20 bg-indigo-500/5
                text-[0.8125rem] text-indigo-900 dark:text-indigo-100
                placeholder:text-gray-400
                outline-none
                transition-[border-color,box-shadow] duration-[180ms]
                focus:border-indigo-500/45 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]
                dark:bg-indigo-500/[0.08] dark:border-indigo-500/25
              "
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus={searchOpen}
            />
          </div>

          {/* Divider */}
          <div className="h-px mx-3 my-2 bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent" />

          {/* History header */}
          <div className="flex items-center gap-2 px-3 pb-2">
            <History size={12} className="text-gray-400" />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gray-400">
              Recent
            </span>
          </div>

          {/* Chat list */}
          <div className="
            flex-1 overflow-y-auto px-1 pb-4
            scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent
          ">
            {loading ? (
              [85, 65, 75, 55, 70].map((w, i) => (
                <div
                  key={i}
                  className="shimmer-bg h-9 rounded-xl mb-1"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))
            ) : filtered.length > 0 ? (
              filtered.map((chat: any, i: number) => (
                <div
                  key={chat?.chatId}
                  className="
                    sb-item-in
                    flex items-center gap-2 px-3 py-2 mb-0.5 rounded-xl cursor-pointer
                    border border-transparent
                    transition-[background,border-color,box-shadow] duration-[180ms]
                    hover:bg-indigo-500/[0.08] hover:border-indigo-500/[0.14]
                    dark:hover:bg-indigo-500/[0.12]
                    group
                  "
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => handleSubmit(chat?.chatId)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="
                    w-1.5 h-1.5 rounded-full flex-shrink-0
                    bg-gradient-to-br from-indigo-500 to-purple-500
                    opacity-50 transition-[opacity,transform] duration-[180ms]
                    group-hover:opacity-100 group-hover:scale-[1.3]
                  " />
                  <span className="
                    text-[0.8125rem] text-gray-600 dark:text-gray-400
                    whitespace-nowrap overflow-hidden text-ellipsis flex-1
                    transition-colors duration-[180ms]
                    group-hover:text-indigo-700 dark:group-hover:text-indigo-200
                  ">
                    {chat?.title || 'Untitled Chat'}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-center">
                <div className="
                  w-10 h-10 rounded-full bg-indigo-500/[0.08]
                  flex items-center justify-center mx-auto mb-2
                  text-indigo-300
                ">
                  <MessageSquare size={16} />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                  {searchQuery ? 'No matches found.' : 'No conversations yet.\nStart a new chat!'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}