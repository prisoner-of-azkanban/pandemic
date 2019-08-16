export const roleCards = [
  {
    title: 'Medic',
    actionOne: 'Remove all cubes of one color when doing Treat Disease.',
    actionTwo:
      'Automatically remove cubes of cured diseases from the city you are in (and prevent them from being placed there).'
  },
  {
    title: 'Dispatcher',
    actionOne:
      "Move another player's pawn as if it were yours (Get permission before moving another player's pawn).",
    actionTwo:
      "As an action, move any pawn to a city with another pawn (Get permission before moving another player's pawn)."
  },
  {
    title: 'Operations Expert',
    actionOne:
      'As an action, build a research station in the city you are in (no City card needed).',
    actionTwo:
      'Once per turn as an action, move from a research station to any city by discarding any City card.'
  },
  {
    title: 'Scientist',
    actionOne:
      'You need only 4 cards of the same color to do the Discover a Cure action.',
    actionTwo: null
  },
  {
    title: 'Researcher',
    actionOne:
      'You may give any 1 of your City cards when you Share Knowledge. It need not match your city.',
    actionTwo:
      'A player who Shares Knowledge with you on their turn can take any of your City cards.'
  },
  {
    title: 'Contingency Planner',
    actionOne:
      'As an action, take any discarded Event card and store it on this card. Limit one Event card on this card at a time, which is not part of your hand.',
    actionTwo: 'When you play the stored Event card, remove it from the game.'
  },
  {
    title: 'Quarantine Specialist',
    actionOne:
      'Prevent disease cube placements (and outbreaks) in the city you are in and all cities connected to it.',
    actionTwo: null
  }
]
