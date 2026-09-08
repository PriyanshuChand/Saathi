/* ─────────────────────────────────────────────
   Saathi — localStorage service layer
   All demo persistence goes through this module.
   ───────────────────────────────────────────── */

const KEYS = {
  patients: 'saathi_patients',
  workers: 'saathi_workers',
  session: 'saathi_session',
};

// ── Helpers ──

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Session ──

export function getSession() {
  return read(KEYS.session);
}

export function saveSession(session) {
  write(KEYS.session, session);
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
}

// ── Patients ──

export function getPatients() {
  return read(KEYS.patients) || [];
}

export function getPatientById(id) {
  return getPatients().find((p) => p.id === id) || null;
}

export function savePatient(patient) {
  const patients = getPatients();
  const idx = patients.findIndex((p) => p.id === patient.id);
  if (idx >= 0) {
    patients[idx] = patient;
  } else {
    patients.push(patient);
  }
  write(KEYS.patients, patients);
  return patient;
}

export function createPatient({ name, village, assignedWorker = null, selfRegistered = true }) {
  const patient = {
    id: generateId(),
    name,
    village: village || '',
    assignedWorker,
    selfRegistered,
    vitals: { bp: '', temperature: '', pulse: '', spo2: '', updatedAt: '' },
    conditions: [],
    allergies: [],
    imaging: [],
    triageHistory: [],
  };
  return savePatient(patient);
}

export function assignPatientToWorker(patientId, workerId) {
  const patient = getPatientById(patientId);
  if (patient) {
    patient.assignedWorker = workerId;
    patient.selfRegistered = false;
    savePatient(patient);
  }
  return patient;
}

// ── Patient fields ──

export function updateVitals(patientId, vitals) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  patient.vitals = { ...vitals, updatedAt: new Date().toLocaleString('hi-IN') };
  return savePatient(patient);
}

export function updateConditions(patientId, conditions) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  patient.conditions = conditions;
  return savePatient(patient);
}

export function updateAllergies(patientId, allergies) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  patient.allergies = allergies;
  return savePatient(patient);
}

export function addImagingEntry(patientId, entry) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  patient.imaging.push({ ...entry, id: generateId() });
  return savePatient(patient);
}

export function removeImagingEntry(patientId, entryId) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  patient.imaging = patient.imaging.filter((e) => e.id !== entryId);
  return savePatient(patient);
}

// ── Triage history ──

export function addTriageResult(patientId, result) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  patient.triageHistory.unshift({
    id: generateId(),
    date: new Date().toLocaleString('hi-IN'),
    urgency: result.urgency,
    summary: result.summary,
    messages: result.messages,
  });
  return savePatient(patient);
}

// ── Workers ──

export function getWorkers() {
  return read(KEYS.workers) || [];
}

export function getWorkerById(id) {
  return getWorkers().find((w) => w.id === id) || null;
}

export function saveWorker(worker) {
  const workers = getWorkers();
  const idx = workers.findIndex((w) => w.id === worker.id);
  if (idx >= 0) {
    workers[idx] = worker;
  } else {
    workers.push(worker);
  }
  write(KEYS.workers, workers);
  return worker;
}

export function createWorker({ name, village }) {
  const worker = {
    id: generateId(),
    name,
    village: village || '',
    role: 'asha',
  };
  return saveWorker(worker);
}

// ── Ensure logged-in user exists in data ──

export function ensureUserRecord(session) {
  if (session.role === 'patient') {
    let patient = getPatientById(session.id);
    if (!patient) {
      patient = createPatient({
        name: session.name,
        village: session.village,
        selfRegistered: true,
      });
      // Update session with generated id
      session.id = patient.id;
      saveSession(session);
    }
    return patient;
  }
  if (session.role === 'asha') {
    let worker = getWorkerById(session.id);
    if (!worker) {
      worker = createWorker({ name: session.name, village: session.village });
      session.id = worker.id;
      saveSession(session);
    }
    return worker;
  }
  return null; // admin has no stored record
}

