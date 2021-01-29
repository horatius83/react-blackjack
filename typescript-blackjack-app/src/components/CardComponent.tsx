import React from 'react';
import { Card, getColor, getUnicodeChar } from '../models/card'

export function CardComponent(props: { card: Card; }) {
  const cardColor = getColor(props.card);
  const cardClass = `card ${cardColor}`;
  const cardDisplay = getUnicodeChar(props.card);
  return (
    <>
      <span className={cardClass}>{cardDisplay}</span>
    </>
  )
}