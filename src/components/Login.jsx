import React, { useState } from 'react';
import { S } from '../services/strings';

const ROLES = [
  { key: 'patient', icon: '🧑', name: S.rolePatient, desc: S.rolePatientDesc },
  { key: 'asha', icon: '👩‍⚕️', name: S.roleAsha, desc: S.roleAshaDesc },
  { key: 'admin', icon: '🛡️', name: S.roleAdmin, desc: S.roleAdminDesc },
];

/**
 * Login screen with role selection, name, and village.
 * @param {{ onLogin: (session: {role, name, village}) => void }} props
 */
export default function Login({ onLogin }) {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');

  const canContinue = role && name.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canContinue) return;
    onLogin({ role, name: name.trim(), village: village.trim() });
  }

  return (
    <div className="login-screen">
      <h1 className="login-title">{S.appName}</h1>
      <p className="login-subtitle">{S.loginSubtitle}</p>

      <p className="text-muted mb-8">{S.chooseRole}</p>

      <div className="role-cards">
        {ROLES.map((r) => (
          <div
            key={r.key}
            className={`role-card${role === r.key ? ' selected' : ''}`}
            onClick={() => setRole(r.key)}
            role="radio"
            aria-checked={role === r.key}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setRole(r.key)}
          >
            <div className="role-icon">{r.icon}</div>
            <div className="role-name">{r.name}</div>
            <div className="role-desc">{r.desc}</div>
          </div>
        ))}
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-name">{S.nameLabel}</label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={S.namePlaceholder}
            autoComplete="name"
          />
        </div>

        {role !== 'admin' && (
          <div className="form-group">
            <label htmlFor="login-village">{S.villageLabel}</label>
            <input
              id="login-village"
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder={S.villagePlaceholder}
            />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={!canContinue}>
          {S.continueBtn}
        </button>
      </form>
    </div>
  );
}

