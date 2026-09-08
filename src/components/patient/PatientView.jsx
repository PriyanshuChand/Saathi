import React, { useState } from 'react';
import { S } from '../../services/strings';
import Tabs from '../shared/Tabs';
import MyRecords from './MyRecords';
import SaathiChat from '../shared/SaathiChat';

const TABS = [
  { key: 'records', label: S.tabMyRecords },
  { key: 'saathi', label: S.tabSaathi },
];

/**
 * Patient view with Records and Saathi tabs.
 * @param {{ session: {id, name, village} }} props
 */
export default function PatientView({ session }) {
  const [activeTab, setActiveTab] = useState('records');
  // Refresh key to force MyRecords to re-read after triage save
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'records' && (
        <MyRecords key={refreshKey} patientId={session.id} />
      )}

      {activeTab === 'saathi' && (
        <SaathiChat
          patientId={session.id}
          patientName={session.name}
          onTriageSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}

