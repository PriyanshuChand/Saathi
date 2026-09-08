import React, { useState, useEffect } from 'react';
import { S } from '../../services/strings';
import {
  getPatientById,
  updateVitals,
  updateConditions,
  updateAllergies,
  addImagingEntry,
  removeImagingEntry,
} from '../../services/storage';
import TagInput from '../shared/TagInput';
import Badge from '../shared/Badge';

/**
 * Patient's own medical records — vitals, conditions, allergies, imaging, triage history.
 * @param {{ patientId: string, readOnly?: boolean }} props
 */
export default function MyRecords({ patientId, readOnly = false }) {
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({ bp: '', temperature: '', pulse: '', spo2: '' });
  const [vitalsSaved, setVitalsSaved] = useState(false);
  const [imgForm, setImgForm] = useState({ type: '', date: '', note: '' });

  useEffect(() => {
    reload();
  }, [patientId]);

  function reload() {
    const p = getPatientById(patientId);
    if (p) {
      setPatient(p);
      setVitals({
        bp: p.vitals.bp || '',
        temperature: p.vitals.temperature || '',
        pulse: p.vitals.pulse || '',
        spo2: p.vitals.spo2 || '',
      });
    }
  }

  function handleSaveVitals(e) {
    e.preventDefault();
    updateVitals(patientId, vitals);
    setVitalsSaved(true);
    setTimeout(() => setVitalsSaved(false), 2000);
    reload();
  }

  function handleConditionsChange(conditions) {
    updateConditions(patientId, conditions);
    reload();
  }

  function handleAllergiesChange(allergies) {
    updateAllergies(patientId, allergies);
    reload();
  }

  function handleAddImaging(e) {
    e.preventDefault();
    if (!imgForm.type.trim()) return;
    addImagingEntry(patientId, imgForm);
    setImgForm({ type: '', date: '', note: '' });
    reload();
  }

  function handleRemoveImaging(entryId) {
    removeImagingEntry(patientId, entryId);
    reload();
  }

  if (!patient) return <p className="text-muted">{S.noResults}</p>;

  return (
    <div>
      {/* ── Vitals ── */}
      <div className="card">
        <h3 className="card-title">{S.vitalsTitle}</h3>
        <form onSubmit={handleSaveVitals}>
          <div className="vitals-grid">
            <div className="form-group">
              <label htmlFor="v-bp">{S.bp}</label>
              <input
                id="v-bp"
                type="text"
                value={vitals.bp}
                onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                readOnly={readOnly}
                placeholder="120/80"
              />
            </div>
            <div className="form-group">
              <label htmlFor="v-temp">{S.temperature}</label>
              <input
                id="v-temp"
                type="text"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                readOnly={readOnly}
                placeholder="98.6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="v-pulse">{S.pulse}</label>
              <input
                id="v-pulse"
                type="text"
                value={vitals.pulse}
                onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                readOnly={readOnly}
                placeholder="72"
              />
            </div>
            <div className="form-group">
              <label htmlFor="v-spo2">{S.spo2}</label>
              <input
                id="v-spo2"
                type="text"
                value={vitals.spo2}
                onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                readOnly={readOnly}
                placeholder="98"
              />
            </div>
          </div>
          {patient.vitals.updatedAt && (
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              {S.lastUpdated}: {patient.vitals.updatedAt}
            </p>
          )}
          {!readOnly && (
            <button type="submit" className="btn-primary btn-sm mt-8">
              {S.saveVitals}
            </button>
          )}
          {vitalsSaved && <div className="toast">{S.vitalsSaved}</div>}
        </form>
      </div>

      {/* ── Conditions ── */}
      <div className="card">
        <h3 className="card-title">{S.conditionsTitle}</h3>
        <TagInput
          tags={patient.conditions}
          onChange={handleConditionsChange}
          readOnly={readOnly}
        />
      </div>

      {/* ── Allergies ── */}
      <div className="card">
        <h3 className="card-title">{S.allergiesTitle}</h3>
        <TagInput
          tags={patient.allergies}
          onChange={handleAllergiesChange}
          readOnly={readOnly}
        />
      </div>

      {/* ── Imaging History ── */}
      <div className="card">
        <h3 className="card-title">{S.imagingTitle}</h3>
        {patient.imaging.length === 0 && (
          <p className="text-muted">{S.noImaging}</p>
        )}
        {patient.imaging.map((entry) => (
          <div key={entry.id} className="imaging-entry">
            <div>
              <strong>{entry.type}</strong>
              {entry.date && <span className="text-muted"> — {entry.date}</span>}
              {entry.note && <span className="text-muted"> — {entry.note}</span>}
            </div>
            {!readOnly && (
              <button
                className="btn-danger btn-sm"
                onClick={() => handleRemoveImaging(entry.id)}
                aria-label={`Remove ${entry.type}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <form className="imaging-form" onSubmit={handleAddImaging}>
            <input
              type="text"
              value={imgForm.type}
              onChange={(e) => setImgForm({ ...imgForm, type: e.target.value })}
              placeholder={S.imagingType}
              aria-label={S.imagingType}
            />
            <input
              type="date"
              value={imgForm.date}
              onChange={(e) => setImgForm({ ...imgForm, date: e.target.value })}
              aria-label={S.imagingDate}
            />
            <input
              type="text"
              value={imgForm.note}
              onChange={(e) => setImgForm({ ...imgForm, note: e.target.value })}
              placeholder={S.imagingNote}
              aria-label={S.imagingNote}
            />
            <button type="submit" className="btn-secondary btn-sm" disabled={!imgForm.type.trim()}>
              {S.addImaging}
            </button>
          </form>
        )}
      </div>

      {/* ── Triage History ── */}
      <div className="card">
        <h3 className="card-title">{S.triageHistoryTitle}</h3>
        {patient.triageHistory.length === 0 && (
          <p className="text-muted">{S.noTriageHistory}</p>
        )}
        {patient.triageHistory.map((t) => (
          <div key={t.id} className="triage-entry">
            <div className="triage-info">
              <span className="triage-date">{t.date}</span>
              <p className="triage-summary">{t.summary}</p>
            </div>
            <Badge urgency={t.urgency} />
          </div>
        ))}
      </div>
    </div>
  );
}

