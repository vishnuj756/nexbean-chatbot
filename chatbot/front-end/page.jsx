"use client";

import Messages from "./(subComponent)/messages";
import SideBar from "../../components/sideBar/index";
import Header from "../../components/header/index";
import TypingArea from "./(subComponent)/typingArea";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getChatHistory, getProfileData, getSendMessage } from "../../services/api/apiService";
import { useParams } from "next/navigation";
import ProfileModal from "../../components/modals/profileModal"


export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [formData, setFormData] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileModalOpen, setProfileModal] = useState(false)
  const [profileData,setProfileData]=useState({})
  const param = useParams();
  const chatId = param?.chatId;

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [chatId]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSubmit = async (overridePrompt) => {
    const userPrompt = overridePrompt ?? formData;

    if (!userPrompt.trim()) {
      return toast.error("Invalid Prompt");
    }

    const payload = {
      type: "text",
      message: userPrompt,
      chatId: chatId ? chatId : activeChatId,
    };

    setMessages((prev) => [...prev, { user: userPrompt, bot: null }]);
    setFormData("");

    const response = await getSendMessage(payload, setIsLoading);

    if (response) {
      if (response?.chatId && !activeChatId) {
        setActiveChatId(response.chatId);
      }

      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          bot: response.reply,
        };
        return updatedMessages;
      });
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!chatId) {
        setMessages([]);
        setActiveChatId(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getChatHistory(chatId);
        const formatted = (data || []).map((msg) => ({
          user: msg.user || "",
          bot: msg.bot || "",
        }));
        setMessages(formatted);
      } catch (error) {
        toast.error("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [chatId]);

  const suggestions = [
    "Write a professional email",
    "Explain a complex topic",
    "Summarize a long text",
    "Generate code snippets",
  ];

  // getprofle api


  const fetchProfile = async () => {

    try {
      const data = await getProfileData();
      setProfileData(data)

    } catch (error) {
      toast.error("Failed to load chat history");
    }

  }


  useEffect(() => {

    if (profileModalOpen) {
      fetchProfile();
    }
    else{
      setProfileData({})
    }
  }, [profileModalOpen]);

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-[#f5f5ff] dark:bg-[#0d0b1e] font-sans">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed -top-40 -left-32 z-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]" />
      <div className="pointer-events-none fixed -bottom-32 -right-24 z-0 h-[25rem] w-[25rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.10),transparent_70%)]" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 block bg-black/45 backdrop-blur-sm md:hidden animate-[fadeIn_0.2s_ease_both]"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <div
        className={[
          // shared
          "relative z-[1] h-full flex-shrink-0 overflow-hidden transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          // desktop: collapsible via width
          "hidden md:block",
          sidebarCollapsed ? "md:w-0" : "md:w-64",
          // mobile: fixed drawer
          "max-md:fixed max-md:left-0 max-md:top-0 max-md:z-[45] max-md:block max-md:w-64 max-md:shadow-[4px_0_32px_rgba(0,0,0,0.2)]",
          "max-md:transition-transform max-md:duration-[280ms] max-md:ease-[cubic-bezier(0.4,0,0.2,1)]",
          sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        ].join(" ")}
      >
        <SideBar onClose={() => setSidebarOpen(false)} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      </div>

      {/* Main */}
      <main className="relative z-[1] flex h-full min-w-0 flex-1 flex-col">

        {/* Header row with toggle */}
        <div className="flex flex-shrink-0 items-center gap-2">



          <div className="flex-1">
            <Header setSidebarCollapsed={setSidebarCollapsed} sidebarCollapsed={sidebarCollapsed} sidebarOpen={sidebarOpen} onClose={setSidebarOpen} setProfileModal={setProfileModal} />
          </div>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
          <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">

            {messages?.length > 0 ? (
              <Messages messages={messages} />
            ) : (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center animate-[wFadeIn_0.6s_ease_both]">

                {/* Logo */}
                <div className="relative mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_8px_32px_rgba(99,102,241,0.4),0_2px_8px_rgba(0,0,0,0.1)]">
                  <div className="absolute -top-[40%] -left-[20%] h-[70%] w-[70%] rounded-full bg-white/22" />
                  <span className="relative z-[1] text-[2rem] font-bold text-white">N</span>
                </div>

                {/* Title */}
                <h1 className="mb-2 bg-gradient-to-br from-indigo-700 to-violet-700 bg-clip-text text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-tight text-transparent dark:from-indigo-300 dark:to-purple-300">
                  Welcome to NexBean
                </h1>

                {/* Subtitle */}
                <p className="mb-8 max-w-[22rem] text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Your intelligent assistant is ready. How can I help you move forward today?
                </p>

                {/* Suggestions grid */}
                <div className="grid w-full max-w-[28rem] grid-cols-1 gap-2.5 xs:grid-cols-2 sm:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={s}
                      style={{ animationDelay: `${i * 0.07}s` }}
                      className="rounded-[0.875rem] border border-indigo-500/15 bg-white/75 px-4 py-3 text-left text-[0.8125rem] leading-relaxed text-gray-700 backdrop-blur-[10px] transition-[background,border-color,box-shadow,transform] duration-[180ms] hover:-translate-y-px hover:border-indigo-500/30 hover:bg-indigo-500/[0.08] hover:text-indigo-700 hover:shadow-[0_4px_16px_rgba(99,102,241,0.12)] dark:bg-[rgba(15,12,41,0.7)] dark:text-gray-300 dark:border-indigo-500/20 dark:hover:bg-indigo-500/[0.12] dark:hover:border-indigo-500/35 dark:hover:text-indigo-200"
                      onClick={() => handleSubmit(s)}
                    >
                      {s} →
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Typing dock */}
        <div className="flex-shrink-0 bg-transparent px-4 pb-3 pt-2 sm:px-6 sm:pb-4">
          <div className="mx-auto w-full max-w-3xl">
            <TypingArea
              value={formData}
              onChange={(val) => setFormData(val)}
              onSend={() => handleSubmit()}
            />
          </div>
        </div>
      </main>

      {/* Keyframe animations — minimal inline style block only for keyframes (not supported in Tailwind) */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wFadeIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {
        profileModalOpen && <ProfileModal isOpen={profileModalOpen} onClose={() => {
          setProfileModal(false);
        }}  data={profileData}/>
      }
    </div>
  );
}