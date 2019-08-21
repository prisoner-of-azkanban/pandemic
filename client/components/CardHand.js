import React from 'react'

const CardHand = props => {
  return props.hand.map(card => (
    <li key={card.title} className={card.color}>
      {card.title}
    </li>
  ))
}

export default CardHand
