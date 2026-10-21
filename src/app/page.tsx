
'use client';

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';

/* ── Types ───────────────────────────────────────── */
interface ToolInvocation {
  toolName: string;
  toolCallId?: string;
  state: 'call' | 'result';
  args?: {
    rawInput?: string;
    englishTranslation?: string;
    calories?: number;
    proteinGrams?: number;
  };
  result?: {
    success?: boolean;
    message?: string;
    newTotal?: number;
    newMood?: string;
  };
}

interface MessagePart {
  type: string;
  text?: string;
  toolInvocation?: ToolInvocation;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts: MessagePart[];
  timestamp?: Date;
}

/* ── Suggestion Chips ─────────────────────────────── */
const SUGGESTIONS = [
  { emoji: '🍚', text: 'Kanji + kadala curry kazhichu' },
  { emoji: '🫓', text: 'Randu porotta + beef fry' },
  { emoji: '🥥', text: '2 idli sambar coconut chutney' },
  { emoji: '🍳', text: 'Egg roast with 2 chapati' },
  { emoji: '☕', text: 'Black coffee + banana' },
  { emoji: '🍜', text: 'Biriyani oru plate kazhichu' },
];

/* ── Theme Hook ──────────────────────────────────── */
function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    media.removeEventListener('change', callback);
  };
}

function getThemeSnapshot(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('nadan-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeServerSnapshot(): 'light' | 'dark' {
  return 'light';
}

function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('nadan-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    window.dispatchEvent(new Event('storage'));
  }, [theme]);

  return { theme, toggle };
}

/* ── Icons ───────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
    </svg>
  );
}
function LeafIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  );
}

/* ── Dot Loader ──────────────────────────────────── */
function ThinkingDots() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--primary-foreground)', fontSize: 14
      }}>
        <LeafIcon size={15} />
      </div>
      <div className="bubble-ai px-4 py-3">
        <div className="dot-pulse flex gap-1.5">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

/* ── Food Log Card (tool result) ─────────────────── */
interface FoodLogCardProps {
  result?: {
    success?: boolean;
    message?: string;
    newTotal?: number;
    newMood?: string;
  };
  args?: {
    rawInput?: string;
    englishTranslation?: string;
    calories?: number;
    proteinGrams?: number;
  };
}

function FoodLogCard({ result, args }: FoodLogCardProps) {
  if (!result?.success) {
    return (
      <div style={{
        marginTop: 10, padding: '10px 12px', borderRadius: 12,
        background: 'oklch(0.6 0.22 27 / 0.08)', border: '1px solid oklch(0.6 0.22 27 / 0.3)',
        fontSize: 13, color: 'var(--destructive)'
      }}>
        ⚠️ {result?.message || 'Could not log this meal'}
      </div>
    );
  }
  return (
    <div className="food-log-card animate-scale-in" style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>✅</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', fontFamily: 'var(--font-syne)' }}>
          Logged!
        </span>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginBottom: 8 }}>{result.message}</p>
      {args && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
          {[
            { icon: '🍽️', label: args.englishTranslation },
            { icon: '🔥', label: `${args.calories} kcal` },
            { icon: '💪', label: `${args.proteinGrams}g protein` },
            { icon: '💬', label: `"${args.rawInput}"`, full: true },
          ].map((item, i) => (
            <div key={i} style={{
              gridColumn: item.full ? '1 / -1' : undefined,
              fontSize: 11.5, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 4
            }}>
              <span>{item.icon}</span>
              <span style={{ opacity: item.full ? 0.55 : 1, fontStyle: item.full ? 'italic' : 'normal' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Message Bubble ──────────────────────────────── */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div
      className="animate-fade-slide-up"
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 4,
      }}
    >
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '88%' }}>
          {/* AI Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary-foreground)', marginTop: 2
          }}>
            <LeafIcon size={15} />
          </div>
          <div className="bubble-ai" style={{ padding: '12px 16px', flex: 1 }}>
            {message.parts?.map((part, i) => {
              if (part.type === 'text' && part.text) {
                return (
                  <p key={i} style={{ fontSize: 14.5, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {part.text}
                  </p>
                );
              }
              if (part.type === 'tool-invocation') {
                const inv = part.toolInvocation;
                if (inv?.toolName === 'logFood') {
                  if (inv.state === 'call') {
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--primary)', marginTop: 4 }}>
                        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                        Logging your meal…
                      </div>
                    );
                  }
                  if (inv.state === 'result') {
                    return <FoodLogCard key={i} result={inv.result} args={inv.args} />;
                  }
                }
              }
              return null;
            })}
          </div>
        </div>
      )}

      {isUser && (
        <div style={{ maxWidth: '80%' }}>
          <div className="bubble-user" style={{ padding: '11px 16px' }}>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{message.content}</p>
          </div>
        </div>
      )}

      {/* Timestamp */}
      {message.timestamp && (
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)', paddingLeft: isUser ? 0 : 42, paddingRight: isUser ? 2 : 0, opacity: 0.7 }}>
          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}

/* ── Empty State ─────────────────────────────────── */
function EmptyState({ onChipClick }: { onChipClick: (text: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, gap: 24 }} className="animate-fade-in">
      {/* Logo mark */}
      <div style={{
        width: 72, height: 72, borderRadius: 24,
        background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.65 0.2 120) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 32px oklch(0.55 0.18 148 / 0.25)',
        color: 'white'
      }}>
        <LeafIcon size={34} />
      </div>

      <div style={{ textAlign: 'center', maxWidth: 300 }}>
        <h2 style={{
          fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 22,
          color: 'var(--foreground)', margin: '0 0 8px'
        }}>
          Ente Kazhicha Kariyam 🍃
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, margin: 0 }}>
          Tell me what you ate — in <strong>English</strong>, <strong>Manglish</strong>, or <strong>Malayalam</strong>. I&apos;ll track the calories, protein, and more.
        </p>
      </div>

      {/* Suggestion chips */}
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 12, textAlign: 'center' }}>
          Try these
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {SUGGESTIONS.map((s) => (
            <button key={s.text} className="chip" onClick={() => onChipClick(s.text)}>
              <span>{s.emoji}</span>
              <span>{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────── */
export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  const handleSubmit = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
      parts: [{ type: 'text', text: value }],
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      if (reader) {
        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(chunk, { stream: true });
        }

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantText,
          parts: [{ type: 'text', text: assistantText }],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', maxWidth: 520,
      margin: '0 auto', position: 'relative',
      background: 'var(--background)',
    }}>
      {/* Ambient gradient */}
      <div className="hero-gradient" />

      {/* ── Header ── */}
      <header style={{
        position: 'relative', zIndex: 10,
        padding: '16px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'oklch(from var(--background) l c h / 0.85)',
        backdropFilter: 'blur(12px)',
      }} className="safe-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.65 0.2 120) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 2px 10px oklch(0.55 0.18 148 / 0.3)',
          }}>
            <LeafIcon size={18} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 17,
              color: 'var(--foreground)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em'
            }}>
              Nadan AI
            </h1>
            <p style={{ fontSize: 10.5, color: 'var(--primary)', margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>
              നാടൻ കലോറി ট്র্যাকার
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {/* History button (placeholder) */}
          <button className="theme-toggle" title="History" onClick={() => {}}>
            <HistoryIcon />
          </button>
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 20,
        position: 'relative', zIndex: 1,
      }}>
        {messages.length === 0 && !isLoading && (
          <EmptyState onChipClick={(text) => handleSubmit(text)} />
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <ThinkingDots />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        background: 'oklch(from var(--background) l c h / 0.9)',
        backdropFilter: 'blur(16px)',
      }} className="safe-bottom">
        {/* Quick chips when messages exist */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
            {SUGGESTIONS.slice(0, 4).map(s => (
              <button key={s.text} className="chip" style={{ flexShrink: 0, fontSize: 12, padding: '5px 12px' }}
                onClick={() => handleSubmit(s.text)}>
                <span>{s.emoji}</span>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.text}
                </span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Enthu kazhichu? (Manglish, Malayalam or English)"
              rows={1}
              disabled={isLoading}
              className="input-glow"
              style={{
                width: '100%', resize: 'none', border: '1px solid var(--border)',
                borderRadius: 16, padding: '12px 16px',
                background: 'var(--input)', color: 'var(--foreground)',
                fontSize: 14.5, fontFamily: 'var(--font-dm-sans)',
                lineHeight: 1.5, transition: 'border-color 0.18s, box-shadow 0.18s',
                display: 'block',
              }}
            />
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !input.trim()}
            className="btn-send"
            style={{
              width: 48, height: 48, borderRadius: 14, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              flexShrink: 0, transition: 'opacity 0.18s, transform 0.15s',
              opacity: isLoading || !input.trim() ? 0.45 : 1,
              transform: !isLoading && input.trim() ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <SendIcon />
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--muted-foreground)', textAlign: 'center', marginTop: 8, marginBottom: 0 }}>
          Powered by AI · <span style={{ color: 'var(--primary)' }}>Nadan AI</span>
        </p>
      </div>
    </main>
  );
}