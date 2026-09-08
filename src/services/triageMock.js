/* ─────────────────────────────────────────────
   Saathi — Mock triage response engine
   ─────────────────────────────────────────────
   SAFE: Never diagnoses conditions or recommends
   medicines / dosages. Only detects red-flag
   emergencies and asks follow-up questions.
   ───────────────────────────────────────────── */

const RED_FLAGS = [
  // English
  'severe breathing', 'breathing difficulty', 'cannot breathe', 'can\'t breathe',
  'unconscious', 'not conscious', 'fainted', 'passed out',
  'seizure', 'convulsion', 'fits',
  'uncontrolled bleeding', 'heavy bleeding', 'won\'t stop bleeding',
  'chest pain', 'heart attack',
  'stroke', 'paralysis', 'one side numb',
  'blue lips', 'turning blue', 'cyanosis',
  // Hindi / transliterated
  'सांस नहीं', 'सांस लेने में', 'saas nahi', 'sans nahi',
  'बेहोश', 'behosh', 'hosh nahi',
  'दौरा', 'daura', 'mirgi',
  'खून बह', 'khoon', 'bleeding ruk nahi',
  'सीने में दर्द', 'seene mein dard', 'chhati mein dard',
  'लकवा', 'lakwa', 'ek taraf sun',
  'नीले होंठ', 'neele honth', 'blue lips',
];

const FOLLOW_UP_QUESTIONS = [
  'यह समस्या कब से है? / How long have you had this problem?',
  'क्या आपको बुखार है? / Do you have a fever?',
  'क्या आप कोई दवाई ले रहे हैं? / Are you currently taking any medicines?',
  'क्या यह पहले भी हुआ है? / Has this happened before?',
  'क्या कोई और लक्षण हैं? / Are there any other symptoms?',
];

/**
 * Process a triage conversation and return the next response.
 *
 * @param {Array<{role: 'user'|'bot', text: string}>} messages - conversation so far
 * @returns {{ reply: string, urgency: 'HIGH'|'PENDING', isComplete: boolean }}
 */
export function getTriageResponse(messages) {
  const lastUserMsg = [...messages]
    .reverse()
    .find((m) => m.role === 'user');

  if (!lastUserMsg) {
    return {
      reply: FOLLOW_UP_QUESTIONS[0],
      urgency: 'PENDING',
      isComplete: false,
    };
  }

  const text = lastUserMsg.text.toLowerCase();

  // Check for red-flag emergency phrases
  for (const flag of RED_FLAGS) {
    if (text.includes(flag.toLowerCase())) {
      return {
        reply:
          '🚨 तुरंत आपातकालीन चिकित्सा सहायता लें! निकटतम अस्पताल जाएं।\n' +
          '🚨 Seek emergency care immediately! Go to the nearest hospital now.\n\n' +
          'यह एक स्वचालित अलर्ट है, निदान नहीं। / This is an automated alert, not a diagnosis.',
        urgency: 'HIGH',
        isComplete: true,
      };
    }
  }

  // Count user messages to pick next follow-up
  const userMsgCount = messages.filter((m) => m.role === 'user').length;

  if (userMsgCount <= FOLLOW_UP_QUESTIONS.length) {
    return {
      reply: FOLLOW_UP_QUESTIONS[userMsgCount - 1],
      urgency: 'PENDING',
      isComplete: false,
    };
  }

  // After all follow-ups, give a safe non-diagnostic closure
  return {
    reply:
      'धन्यवाद। कृपया नज़दीकी स्वास्थ्य केंद्र पर जाएं।\n' +
      'Thank you. Please visit your nearest health centre for proper evaluation.\n\n' +
      'यह कोई निदान नहीं है। / This is not a diagnosis.',
    urgency: 'PENDING',
    isComplete: true,
  };
}

/**
 * Build a short summary from the conversation for triage history.
 */
export function buildTriageSummary(messages) {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'No complaint recorded';
  const text = firstUser.text;
  return text.length > 80 ? text.slice(0, 77) + '…' : text;
}

