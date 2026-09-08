import React from 'react';
import { S } from '../services/strings';

export default function PrototypeWarning() {
  return (
    <div className="prototype-warning" role="alert">
      {S.prototypeWarning}
    </div>
  );
}

