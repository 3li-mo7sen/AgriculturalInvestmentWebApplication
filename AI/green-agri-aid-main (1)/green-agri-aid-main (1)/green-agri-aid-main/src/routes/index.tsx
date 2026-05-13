import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Leaf, Plus, Send, Menu, X, MessageSquare, Trash2, Sun, Moon, Settings, Sparkles, Paperclip, FileText, Loader2 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { parseFile, validate, formatSize, type ParsedAttachment } from "@/lib/file-parser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agri-Pro — Smart Agricultural & Investment Advisor" },
      { name: "description", content: "AI chat assistant for Egyptian farming, crops, irrigation and agricultural investment decisions." },
    ],
  }),
  component: ChatPage,
});

type DisplayAttachment = {
  name: string;
  size: number;
  mime: string;
  kind: "image" | "document";
  dataUrl?: string;
};
type Msg = { role: "user" | "assistant"; content: string; attachments?: DisplayAttachment[] };
type Conv = { id: string; title: string; updated_at: number; messages: Msg[] };

const STORAGE_KEY = "agripro.conversations.v1";
const ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,.docx,.txt,image/png,image/jpeg,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";
const MAX_FILES = 5;

function loadStore(): Conv[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conv[]) : [];
  } catch { return []; }
}
function saveStore(c: Conv[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* quota */ }
}

function ChatPage() {
  const { theme, toggle } = useTheme();
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachments, setAttachments] = useState<ParsedAttachment[]>([]);
  const [parsing, setParsing] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const active = convs.find(c => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  useEffect(() => { setConvs(loadStore()); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  function persist(next: Conv[]) {
    setConvs(next);
    saveStore(next);
  }

  function newConv() {
    setActiveId(null);
    setSidebarOpen(false);
    setAttachments([]);
  }

  function deleteConv(id: string) {
    const next = convs.filter(c => c.id !== id);
    if (activeId === id) setActiveId(null);
    persist(next);
  }

  async function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    const remaining = MAX_FILES - attachments.length;
    if (remaining <= 0) { toast.error(`Maximum ${MAX_FILES} files at a time`); return; }
    const accepted: File[] = [];
    for (const f of files.slice(0, remaining)) {
      const err = validate(f);
      if (err) { toast.error(err); continue; }
      accepted.push(f);
    }
    if (!accepted.length) return;
    setParsing(p => p + accepted.length);
    for (const f of accepted) {
      try {
        const parsed = await parseFile(f);
        setAttachments(prev => [...prev, parsed]);
      } catch (e: any) {
        toast.error(`Couldn't read ${f.name}: ${e?.message ?? "error"}`);
      } finally {
        setParsing(p => Math.max(0, p - 1));
      }
    }
  }

  function removeAttachment(id: string) {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  async function send(text?: string) {
  console.log("SEND CALLED");
  const content = (text ?? input).trim();
  if ((!content && attachments.length === 0) || streaming || parsing > 0) return;
  setInput("");

  const sending = attachments;
  setAttachments([]);

  let cid = activeId;
  let working = convs;
  
  if (!cid) {
    cid = crypto.randomUUID();
    const titleSrc = content || sending[0]?.name || "New Chat";
    const conv: Conv = { 
      id: cid, 
      title: titleSrc.slice(0, 40), 
      updated_at: Date.now(), 
      messages: [] 
    };
    working = [conv, ...convs];
    setConvs(working);
    setActiveId(cid);
  }

  // Build display attachments
  const displayAtts: DisplayAttachment[] = sending.map(a => ({
    name: a.name, 
    size: a.size, 
    mime: a.mime, 
    kind: a.kind,
    dataUrl: a.kind === "image" ? a.dataUrl : undefined,
  }));
  
  const userMsg: Msg = { 
    role: "user", 
    content, 
    attachments: displayAtts.length ? displayAtts : undefined 
  };
  
  // Add user message and temporary assistant message
  working = working.map(c => c.id === cid
    ? { 
        ...c, 
        updated_at: Date.now(), 
        messages: [...c.messages, userMsg, { role: "assistant", content: "" }] 
      }
    : c);
  persist(working);

  setStreaming(true);
  
  try {
    // Prepare payload with attachments
    const docs = sending.filter(a => a.kind === "document");
    const imgs = sending.filter(a => a.kind === "image");
    let textContent = content;
    
    if (docs.length) {
      const docText = docs.map(d =>
        `\n\n--- Attached file: ${d.name} (${d.mime || "document"}) ---\n${d.text ?? ""}\n--- end of file ---`
      ).join("");
      textContent = (textContent + docText).trim() || "حلّل الملفات المرفقة من فضلك.";
    }
    
    let payloadMessages;
    if (imgs.length === 0) {
      payloadMessages = [
        ...(working.find(c => c.id === cid)?.messages ?? []).slice(0, -1),
        { role: "user", content: textContent }
      ];
    } else {
      payloadMessages = [
        ...(working.find(c => c.id === cid)?.messages ?? []).slice(0, -1),
        {
          role: "user",
          content: [
            { type: "text", text: textContent || "حلّل الصور المرفقة من فضلك." },
            ...imgs.map(i => ({ type: "image_url", image_url: { url: i.dataUrl! } })),
          ],
        }
      ];
    }

    // ✅ التعديل هنا: استدعاء واحد فقط للـ API
    const resp = await fetch("/api/public/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: payloadMessages }),
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.error || "Connection failed");
    }
    
    const assistantMessage = data.message;
    
    // Update the temporary assistant message with the real response
    setConvs(prev => prev.map(cv => cv.id === cid
      ? { 
          ...cv, 
          messages: cv.messages.map((m, i, arr) => 
            i === arr.length - 1 ? { role: "assistant", content: assistantMessage } : m
          ) 
        }
      : cv));
      
  } catch (err: any) {
    console.error("Error:", err);
    toast.error(err.message || "Something went wrong");
    // Remove the temporary assistant message on error
    setConvs(prev => {
      const next = prev.map(cv => cv.id === cid 
        ? { ...cv, messages: cv.messages.slice(0, -1) } 
        : cv);
      saveStore(next);
      return next;
    });
  } finally {
    setStreaming(false);
  }
}

  return (
    <div
      dir="ltr"
      className="relative flex h-screen overflow-hidden bg-background"
      onDragOver={e => { e.preventDefault(); if (!dragActive) setDragActive(true); }}
      onDragLeave={e => { if (e.target === e.currentTarget) setDragActive(false); }}
      onDrop={onDrop}
    >
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-extrabold tracking-tight">Agri-Pro</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden" aria-label="Close sidebar"><X className="h-5 w-5" /></button>
          </div>

          <button onClick={newConv} className="m-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 font-semibold text-primary-foreground shadow-elegant transition hover:opacity-95">
            <Plus className="h-4 w-4" /> New Chat
          </button>

          <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chat History</div>
            {convs.length === 0 && <div className="px-3 py-6 text-center text-xs text-muted-foreground">No conversations yet</div>}
            {convs.map(c => (
              <div key={c.id} className={`group mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition cursor-pointer ${activeId === c.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"}`}
                   onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}>
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate" dir="auto">{c.title}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteConv(c.id); }} className="opacity-0 group-hover:opacity-100 transition" aria-label="Delete chat">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-sidebar-border p-3 space-y-2">
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent/60 transition">
              <Settings className="h-4 w-4 text-muted-foreground" /> Settings
            </button>
            <button onClick={toggle} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs hover:bg-accent transition">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}

      {/* Main */}
      <main className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden" aria-label="Open sidebar"><Menu className="h-6 w-6" /></button>
          <span className="font-bold">Agri-Pro Assistant</span>
          <div className="w-6 md:hidden" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.length === 0 ? <Empty onPick={send} onStart={newConv} /> : (
              <div className="space-y-6">
                {messages.map((m, i) => <Bubble key={i} msg={m} streaming={streaming && i === messages.length - 1 && m.role === "assistant" && !m.content} />)}
                {streaming && <div className="text-xs text-muted-foreground pl-11">Agri-Pro is thinking...</div>}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            {/* Attachment previews */}
            {(attachments.length > 0 || parsing > 0) && (
              <div className="mb-2 flex flex-wrap gap-2 animate-fade-in-up">
                {attachments.map(a => (
                  <AttachmentChip key={a.id} att={a} onRemove={() => removeAttachment(a.id)} />
                ))}
                {parsing > 0 && (
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Reading {parsing} file{parsing > 1 ? "s" : ""}...
                  </div>
                )}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); send(); }}
                  className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-card focus-within:border-primary/50 focus-within:shadow-elegant transition">
              <input ref={fileInputRef} type="file" multiple accept={ACCEPT} className="hidden"
                     onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach files"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition">
                <Paperclip className="h-5 w-5" />
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
                dir="auto"
                placeholder="Ask about crops, investment, or attach a plant photo or PDF..."
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground max-h-40"
                style={{ minHeight: "36px" }}
              />
              <button disabled={(!input.trim() && attachments.length === 0) || streaming || parsing > 0} type="submit" aria-label="Send Message"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant transition disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">Drag & drop images or PDFs. Agri-Pro may make mistakes — verify important info.</p>
          </div>
        </div>
      </main>

      {/* Drag overlay */}
      {dragActive && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm animate-fade-in-up">
          <div className="rounded-2xl border-2 border-dashed border-primary bg-card px-10 py-8 text-center shadow-elegant">
            <Paperclip className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="font-semibold">Drop files to attach</div>
            <div className="text-xs text-muted-foreground">Images, PDF, DOCX, TXT (max 10MB)</div>
          </div>
        </div>
      )}
    </div>
  );
}

function AttachmentChip({ att, onRemove }: { att: ParsedAttachment; onRemove: () => void }) {
  return (
    <div className="group relative flex items-center gap-2 rounded-xl border border-border bg-card p-2 pr-7 shadow-card animate-fade-in-up">
      {att.kind === "image" && att.dataUrl ? (
        <img src={att.dataUrl} alt={att.name} className="h-12 w-12 rounded-md object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 max-w-[160px]">
        <div className="truncate text-xs font-semibold">{att.name}</div>
        <div className="text-[10px] text-muted-foreground">{formatSize(att.size)}</div>
      </div>
      <button type="button" onClick={onRemove} aria-label="Remove attachment"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-destructive">
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

const SUGGESTIONS = [
  "What's the best crop to plant this season on 5 feddans in the Delta?",
  "Estimate ROI for investing 100,000 EGP in olive farming.",
  "Upload a photo of a sick plant and I'll diagnose it.",
  "Best smart irrigation techniques for sandy soil in Egypt?",
];

function Empty({ onPick, onStart }: { onPick: (s: string) => void; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center pt-10 text-center animate-fade-in-up">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-elegant">
        <Sparkles className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">Agri-Pro</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">Smart Agricultural & Investment Advisor for Egypt</p>
      <button onClick={onStart} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-95">
        <Plus className="h-4 w-4" /> Start New Chat
      </button>
      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => onPick(s)}
                  className="rounded-xl border border-border bg-card p-4 text-left text-sm shadow-card transition hover:border-primary/50 hover:shadow-elegant hover:-translate-y-0.5">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const isUser = msg.role === "user";
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isUser ? "bg-secondary text-secondary-foreground" : "bg-gradient-primary text-primary-foreground shadow-elegant"}`}>
        {isUser ? "U" : <Leaf className="h-4 w-4" />}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-card ${isUser ? "bg-gradient-primary text-primary-foreground" : "bg-card text-card-foreground border border-border"}`}>
        {streaming ? (
          <div className="flex gap-1 py-1">
            <span className="typing-dot inline-block h-2 w-2 rounded-full bg-current" />
            <span className="typing-dot inline-block h-2 w-2 rounded-full bg-current" />
            <span className="typing-dot inline-block h-2 w-2 rounded-full bg-current" />
          </div>
        ) : (
          <>
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {msg.attachments.map((a, i) => a.kind === "image" && a.dataUrl ? (
                  <img key={i} src={a.dataUrl} alt={a.name} className="max-h-48 max-w-[220px] rounded-lg object-cover" />
                ) : (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-background/15 px-2 py-1.5 text-xs">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[160px]">{a.name}</span>
                    <span className="opacity-70">{formatSize(a.size)}</span>
                  </div>
                ))}
              </div>
            )}
            {msg.content && <div className="whitespace-pre-wrap" dir="auto">{msg.content}</div>}
            <div className={`mt-1 text-[10px] opacity-60 ${isUser ? "text-right" : "text-left"}`}>{time}</div>
          </>
        )}
      </div>
    </div>
  );
}
