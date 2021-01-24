import React from 'react';
import { SuitBackUnicodeChar } from '../models/card'

export function CardBackComponent() {
  const cardClass = `card black`;
  return (
    <>
      <span className={cardClass}>{SuitBackUnicodeChar}</span>
    </>
  )
}