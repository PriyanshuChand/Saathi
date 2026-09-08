import React from 'react';
import { S } from '../../services/strings';
import MyRecords from '../patient/MyRecords';

/**
 * Patient detail view for ASHA workers — shows records + triage button.
 * @param {{ patient: object, onBack: () => void, onStartTriage: () => void }} props
 */
export default function PatientDetail({ patient, onBack, onStartTriage }) {
  return (
    <div>
      <button className="btn-secondary btn-sm mb-8" onClick={onBack}>
        {S.backToList}
      </button>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="card-title" style={{ margin: 0 }}>
            {S.patientRecord}: {patient.name}
          </h3>
          <p className="text-muted">{patient.village}</p>
        </div>
        <button className="btn-accent" onClick={onStartTriage}>
          {S.startTriage}
        </button>
      </div>

      <MyRecords patientId={patient.id} readOnly={false} />
    </div>
  );
}

