import React, { useState } from 'react';
import { S } from '../../services/strings';
import Tabs from '../shared/Tabs';
import MyPatients from './MyPatients';
import SaathiChat from '../shared/SaathiChat';

const TABS = [
  { key: 'patients', label: S.tabMyPatients },
  { key: 'saathi', label: S.tabSaathi },
];

/**
 * ASHA/ANM worker view.
 * @param {{ session: {id, name, village} }} props
 */
export default function AshaView({ session }) {
  const [activeTab, setActiveTab] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleStartTriage(patient) {
    setSelectedPatient(patient);
    setActiveTab('saathi');
  }

  function handleBackFromTriage() {
    setSelectedPatient(null);
    setActiveTab('patients');
    setRefreshKey((k) => k + 1);
  }

  return (
    <div>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={(key) => {
        setActiveTab(key);
        if (key === 'patients') setSelectedPatient(null);
      }} />

      {activeTab === 'patients' && (
        <MyPatients
          key={refreshKey}
          workerId={session.id}
          workerVillage={session.village}
          onStartTriage={handleStartTriage}
        />
      )}

      {activeTab === 'saathi' && selectedPatient && (
        <div>
          <button className="btn-secondary btn-sm mb-16" onClick={handleBackFromTriage}>
            {S.backToList}
          </button>
          <SaathiChat
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            onTriageSaved={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      )}

      {activeTab === 'saathi' && !selectedPatient && (
        <p className="text-muted text-center mt-16">
          कृपया पहले एक मरीज़ चुनें / Please select a patient first from the Patients tab.
        </p>
      )}
    </div>
  );
}

