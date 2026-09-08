import React from 'react';
import { S } from '../../services/strings';

const BADGE_MAP = {
  HIGH: { cls: 'badge-high', label: S.urgencyHigh },
  PENDING: { cls: 'badge-pending', label: S.urgencyPending },
  LOW: { cls: 'badge-low', label: S.urgencyLow },
};

/**
 * Urgency badge chip.
 * @param {{ urgency: 'HIGH'|'PENDING'|'LOW' }} props
 */
export default function Badge({ urgency }) {
  const cfg = BADGE_MAP[urgency] || BADGE_MAP.PENDING;
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

