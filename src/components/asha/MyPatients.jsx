import React, { useState, useEffect } from 'react';
import { S } from '../../services/strings';
import {
  getPatients,
  createPatient,
  assignPatientToWorker,
} from '../../services/storage';
import PatientDetail from './PatientDetail';

/**
 * ASHA patient list — assigned & unassigned patients.
 * @param {{ workerId: string, workerVillage: string, onStartTriage: (patient) => void }} props
 */
export default function MyPatients({ workerId, workerVillage, onStartTriage }) {
  const [patients, setPatients] = useState([]);
  const [newName, setNewName] = useState('');
  const [viewingPatient, setViewingPatient] = useState(null);

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    setPatients(getPatients());
  }

  const assigned = patients.filter((p) => p.assignedWorker === workerId);
  const unassigned = patients.filter(
    (p) => p.selfRegistered && !p.assignedWorker
  );

  function handleAddPatient(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    createPatient({
      name,
      village: workerVillage,
      assignedWorker: workerId,
      selfRegistered: false,
    });
    setNewName('');
    reload();
  }

  function handleAssign(patientId) {
    assignPatientToWorker(patientId, workerId);
    reload();
  }

  // Show patient detail sub-view
  if (viewingPatient) {
    return (
      <PatientDetail
        patient={viewingPatient}
        onBack={() => {
          setViewingPatient(null);
          reload();
        }}
        onStartTriage={() => onStartTriage(viewingPatient)}
      />
    );
  }

  return (
    <div>
      {/* Add patient */}
      <form className="add-patient-row" onSubmit={handleAddPatient}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={S.patientNamePlaceholder}
          aria-label={S.addPatient}
        />
        <button type="submit" className="btn-primary btn-sm" disabled={!newName.trim()}>
          {S.addPatient}
        </button>
      </form>

      {/* Assigned patients */}
      <div className="card">
        <h3 className="card-title">{S.assignedPatients}</h3>
        {assigned.length === 0 && <p className="text-muted">{S.noPatients}</p>}
        {assigned.map((p) => (
          <div key={p.id} className="patient-item">
            <div>
              <div className="patient-name">{p.name}</div>
              <div className="patient-village">{p.village}</div>
            </div>
            <div className="patient-actions">
              <button className="btn-secondary btn-sm" onClick={() => setViewingPatient(p)}>
                {S.viewRecord}
              </button>
              <button className="btn-accent btn-sm" onClick={() => onStartTriage(p)}>
                {S.startTriage}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned self-registered patients */}
      <div className="card">
        <h3 className="card-title">{S.unassignedPatients}</h3>
        {unassigned.length === 0 && <p className="text-muted">{S.noPatients}</p>}
        {unassigned.map((p) => (
          <div key={p.id} className="patient-item">
            <div>
              <div className="patient-name">{p.name}</div>
              <div className="patient-village">{p.village}</div>
            </div>
            <div className="patient-actions">
              <button className="btn-secondary btn-sm" onClick={() => handleAssign(p.id)}>
                {S.assignToMe}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

