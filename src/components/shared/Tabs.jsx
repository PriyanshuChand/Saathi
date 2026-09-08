import React from 'react';

/**
 * Reusable tab strip.
 * @param {{ tabs: {key: string, label: string}[], activeTab: string, onChange: (key: string) => void }} props
 */
export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

