import React from 'react';
import { Card } from '../models/card'

export function CardComponent(props: { card: Card; }) {
  const cardClass = `card ${props.card.color}`;
  return (
    <>
      <span className={cardClass}>{props.card.unicodeChar}</span>
    </>
  )
}