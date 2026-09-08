import React, { useState, useEffect } from 'react';
import { S } from '../../services/strings';
import { getPatients, getWorkers, getWorkerById } from '../../services/storage';
import Badge from '../shared/Badge';

/**
 * Admin dashboard — summary cards + searchable patient table (read-only).
 */
export default function AdminView() {
  const [patients, setPatients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPatients(getPatients());
    setWorkers(getWorkers());
  }, []);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q)
    );
  });

  const highUrgencyCount = patients.filter((p) =>
    p.triageHistory.some((t) => t.urgency === 'HIGH')
  ).length;

  function getWorkerName(workerId) {
    if (!workerId) return '—';
    const w = getWorkerById(workerId);
    return w ? w.name : '—';
  }

  function getLastTriage(patient) {
    if (patient.triageHistory.length === 0) return null;
    return patient.triageHistory[0]; // already sorted newest first
  }

  return (
    <div>
      <h2 className="card-title mb-16">{S.adminTitle}</h2>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-value">{patients.length}</div>
          <div className="summary-label">{S.totalPatients}</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{workers.length}</div>
          <div className="summary-label">{S.totalWorkers}</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-value">{highUrgencyCount}</div>
          <div className="summary-label">{S.highUrgency}</div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={S.searchPatients}
        aria-label={S.searchPatients}
      />

      {/* Patient table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{S.patientName}</th>
              <th>{S.village}</th>
              <th>{S.worker}</th>
              <th>{S.lastTriage}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  {S.noResults}
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const last = getLastTriage(p);
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.village || '—'}</td>
                  <td>{getWorkerName(p.assignedWorker)}</td>
                  <td>
                    {last ? (
                      <span>
                        <Badge urgency={last.urgency} />{' '}
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {last.date}
                        </span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

