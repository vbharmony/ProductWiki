import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, WikiEntry } from '../data/mockData';
import { EntryReferenceCard } from '../components/EntryReferenceCard';

interface Props {
  entries: WikiEntry[];
}

const SUGGESTION_CHIPS = [
  'What are the known limitations?',
  'How does resource allocation work?',
  'Explain the portfolio health score',
  'What budget constraints exist?',
  'How is capacity planning modelled?',
  'What strategic planning features exist?',
];

let msgIdCounter = 1;

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#E6F1FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '10px', fontWeight: 500, color: '#0C447C' }}>W</span>
      </div>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '0.5px solid #E0E0E0',
        borderRadius: '10px',
        padding: '9px 14px',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#AAAAAA',
              animation: 'typingPulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatBubbleUser({ message }: { message: ChatMessage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '8px', alignItems: 'flex-start' }}>
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#F7F7F7',
        border: '0.5px solid #E0E0E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '10px', fontWeight: 500, color: '#444441' }}>ME</span>
      </div>
      <div style={{
        maxWidth: '85%',
        backgroundColor: '#F7F7F7',
        border: '0.5px solid #E0E0E0',
        borderRadius: '10px',
        padding: '9px 12px',
        fontSize: '12px',
        lineHeight: 1.6,
        color: '#0D0D0D',
      }}>
        {message.text}
      </div>
    </div>
  );
}

function ChatBubbleAgent({ message }: { message: ChatMessage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'flex-start' }}>
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#E6F1FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px',
      }}>
        <span style={{ fontSize: '10px', fontWeight: 500, color: '#0C447C' }}>W</span>
      </div>
      <div style={{ maxWidth: '85%' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '0.5px solid #E0E0E0',
          borderRadius: '10px',
          padding: '9px 12px',
          fontSize: '12px',
          lineHeight: 1.6,
          color: '#333333',
        }}>
          {message.text}
          {message.entries && message.entries.length > 0 && (
            <div>
              {message.entries.map(entry => (
                <EntryReferenceCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SearchScreen({ entries }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isPending) return;

    const userMsg: ChatMessage = {
      id: String(msgIdCounter++),
      role: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsPending(true);
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: text.trim(), entries }),
      });

      const data = await res.json() as { text: string; entryIds: string[]; error?: string };

      const referencedEntries = (data.entryIds ?? [])
        .map((id: string) => entries.find(e => e.id === id))
        .filter((e): e is WikiEntry => !!e);

      const agentMsg: ChatMessage = {
        id: String(msgIdCounter++),
        role: 'agent',
        text: data.error
          ? 'Sorry, I was unable to process your question. Please try again.'
          : data.text,
        entries: referencedEntries,
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch {
      const agentMsg: ChatMessage = {
        id: String(msgIdCounter++),
        role: 'agent',
        text: 'Sorry, something went wrong. Please try again.',
        entries: [],
      };
      setMessages(prev => [...prev, agentMsg]);
    } finally {
      setIsTyping(false);
      setIsPending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      <style>{`
        @keyframes typingPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#F4F5F7',
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {isEmpty ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '0 auto',
              padding: '40px 0',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#E6F1FB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#0C447C' }}>W</span>
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#0D0D0D', margin: '0 0 8px' }}>
                Ask the Wiki Assistant
              </h2>
              <p style={{
                fontSize: '12px',
                fontWeight: 400,
                color: '#888888',
                lineHeight: 1.6,
                margin: '0 0 20px',
              }}>
                Search across all wiki entries using natural language. Ask about features, limitations, architecture decisions, or known issues.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                {SUGGESTION_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    style={{
                      border: '0.5px solid #CCCCCC',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 400,
                      padding: '5px 10px',
                      backgroundColor: '#FFFFFF',
                      color: '#333333',
                      cursor: 'pointer',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      transition: 'background-color 0.1s, color 0.1s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#F7F7F7';
                      e.currentTarget.style.color = '#0D0D0D';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#333333';
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px', width: '100%', margin: '0 auto' }}>
              {messages.map(msg => (
                msg.role === 'user'
                  ? <ChatBubbleUser key={msg.id} message={msg} />
                  : <ChatBubbleAgent key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div style={{
          padding: '12px 16px',
          borderTop: '0.5px solid #E0E0E0',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
        }}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the product wiki…"
            rows={1}
            style={{
              flex: 1,
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '0.5px solid #E0E0E0',
              backgroundColor: '#F7F7F7',
              color: '#0D0D0D',
              fontFamily: 'Inter, system-ui, sans-serif',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              maxHeight: '100px',
              overflowY: 'auto',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#0D0D0D';
              e.target.style.boxShadow = '0 0 0 3px rgba(13,13,13,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E0E0E0';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isPending}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              backgroundColor: '#0D0D0D',
              border: 'none',
              cursor: inputValue.trim() && !isPending ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: !inputValue.trim() || isPending ? 0.4 : 1,
              transition: 'opacity 0.1s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V2M3 6l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
