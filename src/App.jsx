import React, { useState, useEffect } from 'react';
import { S } from './services/strings';
import {
  getSession,
  saveSession,
  clearSession,
  ensureUserRecord,
  createPatient,
  createWorker,
} from './services/storage';
import PrototypeWarning from './components/PrototypeWarning';
import Login from './components/Login';
import PatientView from './components/patient/PatientView';
import AshaView from './components/asha/AshaView';
import AdminView from './components/admin/AdminView';

export default function App() {
  const [session, setSession] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = getSession();
    if (saved) {
      ensureUserRecord(saved);
      setSession(saved);
    }
  }, []);

  function handleLogin({ role, name, village }) {
    let id = '';

    if (role === 'patient') {
      const patient = createPatient({ name, village, selfRegistered: true });
      id = patient.id;
    } else if (role === 'asha') {
      const worker = createWorker({ name, village });
      id = worker.id;
    } else {
      id = 'admin';
    }

    const newSession = { role, name, village, id };
    saveSession(newSession);
    setSession(newSession);
  }

  function handleLogout() {
    clearSession();
    setSession(null);
  }

  return (
    <>
      <PrototypeWarning />

      {!session ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-shell">
          {/* Header */}
          <header className="header-bar">
            <h1>{S.appName}</h1>
            <div>
              <div className="user-info">
                {session.name}
                {session.village ? ` · ${session.village}` : ''}
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                {S.logout}
              </button>
            </div>
          </header>

          {/* Role-based view */}
          {session.role === 'patient' && <PatientView session={session} />}
          {session.role === 'asha' && <AshaView session={session} />}
          {session.role === 'admin' && <AdminView />}
        </div>
      )}
    </>
  );
}

