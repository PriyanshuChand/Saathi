# DIDI-AI-
AI voice companion for frontline healthcare workers
# साथी — Saathi: Triage & Records Platform

> ⚠️ **Prototype Only** — This is a demo application. Do not use for real medical decisions or patient data.

A bilingual (Hindi + English) healthcare triage and records platform for patients, ASHA/ANM frontline workers, and administrators.

## Features

- **Patient View**: Save vitals, manage conditions/allergies, imaging history, and run Saathi triage
- **ASHA/ANM View**: Manage assigned patients, add new patients, assign unassigned self-registered patients, view patient records, and run triage sessions
- **Admin View**: Dashboard with summary cards, searchable patient table (read-only)
- **Saathi Triage**: Chat-style mock triage with red-flag emergency detection — never diagnoses or recommends medicines
- **Bilingual**: Hindi and English text throughout the UI
- **Offline-first**: All data stored in browser localStorage

## Tech Stack

- [Vite](https://vite.dev/) + [React 18](https://react.dev/)
- Plain CSS (no UI framework)
- localStorage for demo persistence

## Setup & Run

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The app will open at **http://localhost:5173** by default.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.jsx                          # React entry point
├── App.jsx                           # Root component, session & routing
├── index.css                         # Global styles
├── services/
│   ├── storage.js                    # localStorage service layer
│   ├── triageMock.js                 # Mock triage response engine
│   └── strings.js                    # All UI strings (Hindi + English)
└── components/
    ├── Login.jsx                     # Login screen with role cards
    ├── PrototypeWarning.jsx          # Prototype disclaimer banner
    ├── patient/
    │   ├── PatientView.jsx           # Patient tab container
    │   └── MyRecords.jsx             # Vitals, conditions, imaging, history
    ├── asha/
    │   ├── AshaView.jsx              # ASHA tab container
    │   ├── MyPatients.jsx            # Patient list & management
    │   └── PatientDetail.jsx         # Individual patient detail
    ├── admin/
    │   └── AdminView.jsx             # Admin dashboard & table
    └── shared/
        ├── Tabs.jsx                  # Reusable tab strip
        ├── Badge.jsx                 # Urgency badge component
        ├── TagInput.jsx              # Tag add/remove input
        └── SaathiChat.jsx            # Triage chat UI
```

## Safety Notes

- The triage engine is a **mock** — it only detects red-flag keywords and asks follow-up questions
- It **never** diagnoses conditions or recommends medicines/dosages
- No real AI/LLM API is called; no API keys are used
- All data is stored locally in the browser and is not transmitted anywhere
