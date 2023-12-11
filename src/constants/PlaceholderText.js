import { stringHash } from '@/utils/Hasher';

const TEXTS = [
  'No thoughts head empty',
  'Once upon a time...',
  "You talkin' to me?",
  'What happened next?',
  'Where did I leave my keys?',
  'Have a wonderful day ❤️',
  "I'm the king of the world!",
  "There's no place like home.",
  'Carpe diem. Sieze the day.',
  "I'll be back.",
  "We're gonna need a bigger boat...",
  "Here's looking at you, kid.",
  'Houston, we have a problem.',
  'Rosebud.',
  'Inconceivable!',
  "Well, nobody's perfect.",
  "I've a feeling we're not in Kansas anymore.",
  "You're doing great!",
  'Keep it up, buddy.',
];

/**
 * @param {string} seed
 */
export function choosePlaceholderRandomly(seed) {
  const hash = stringHash(seed);
  const index = Math.abs(hash % TEXTS.length);
  const text = TEXTS[index];
  return text;
}
