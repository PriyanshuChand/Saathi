import React, { useState, useRef, useEffect } from 'react';
import { S } from '../../services/strings';
import { getTriageResponse, buildTriageSummary } from '../../services/triageMock';
import { addTriageResult } from '../../services/storage';

/**
 * Chat-style Saathi triage UI.
 * @param {{ patientId: string, patientName: string, onTriageSaved?: () => void }} props
 */
export default function SaathiChat({ patientId, patientName, onTriageSaved }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: S.saathiGreeting },
  ]);
  const [input, setInput] = useState('');
  const [urgency, setUrgency] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text || isComplete) return;

    const userMsg = { role: 'user', text };
    const updated = [...messages, userMsg];

    // Get mock triage response
    const result = getTriageResponse(updated);
    const botMsg = { role: 'bot', text: result.reply };
    const allMessages = [...updated, botMsg];

    setMessages(allMessages);
    setInput('');
    setUrgency(result.urgency);
    setIsComplete(result.isComplete);

    // Auto-save when complete
    if (result.isComplete) {
      const summary = buildTriageSummary(allMessages);
      addTriageResult(patientId, {
        urgency: result.urgency,
        summary,
        messages: allMessages,
      });
      setSaved(true);
      onTriageSaved?.();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setMessages([{ role: 'bot', text: S.saathiGreeting }]);
    setInput('');
    setUrgency(null);
    setIsComplete(false);
    setSaved(false);
  }

  return (
    <div className="chat-container">
      <h3 className="card-title">{S.saathiTitle}</h3>
      {patientName && (
        <p className="text-muted mb-8">
          {S.rolePatient}: <strong>{patientName}</strong>
        </p>
      )}

      {/* Urgency banner */}
      {urgency && (
        <div className={`urgency-banner ${urgency.toLowerCase()}`} role="status">
          {urgency === 'HIGH'
            ? `🚨 ${S.urgencyHigh} — Seek emergency care now`
            : `⏳ ${S.urgencyPending}`}
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Saved toast */}
      {saved && <div className="toast">{S.triageSaved}</div>}

      {/* Input row */}
      <div className="chat-input-row">
        <button
          className="btn-icon mic"
          title={S.micTooltip}
          aria-label={S.micTooltip}
          disabled
        >
          🎤
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={S.chatPlaceholder}
          aria-label={S.chatPlaceholder}
          disabled={isComplete}
        />
        <button
          className="btn-primary btn-sm"
          onClick={handleSend}
          disabled={!input.trim() || isComplete}
        >
          {S.send}
        </button>
      </div>

      {/* Actions */}
      <div className="chat-actions">
        <button className="btn-secondary btn-sm" onClick={handleReset}>
          {S.reset}
        </button>
      </div>
    </div>
  );
}

