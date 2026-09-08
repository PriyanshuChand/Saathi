import React, { useState } from 'react';
import { S } from '../../services/strings';

/**
 * Tag add/remove chip input.
 * @param {{ tags: string[], onChange: (tags: string[]) => void, readOnly?: boolean }} props
 */
export default function TagInput({ tags, onChange, readOnly = false }) {
  const [value, setValue] = useState('');

  function handleAdd() {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setValue('');
  }

  function handleRemove(tag) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div>
      <div className="tag-list">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
            {!readOnly && (
              <button
                onClick={() => handleRemove(tag)}
                aria-label={`Remove ${tag}`}
                title={`Remove ${tag}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
        {tags.length === 0 && <span className="text-muted">—</span>}
      </div>
      {!readOnly && (
        <div className="tag-input-row">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={S.addPlaceholder}
            aria-label={S.addPlaceholder}
          />
          <button className="btn-secondary btn-sm" onClick={handleAdd} disabled={!value.trim()}>
            +
          </button>
        </div>
      )}
    </div>
  );
}

