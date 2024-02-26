import { createToken } from '../fountain/FountainTokenHelper';

/**
 * @param {string} text
 */
export function tokenize(text) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(text, 'application/xml');
  let content = doc.getElementsByTagName('Content').item(0);
  if (!content) {
    return [];
  }
  let paragraphs = content.querySelectorAll('Paragraph');
  let tokens = [];
  for (let p of paragraphs) {
    let type = p.getAttribute('Type');
    switch (type) {
      case 'Scene Heading':
        tokens.push(
          createToken(
            'heading',
            [...p.querySelectorAll('Text')]
              .map((text) => text?.textContent?.toUpperCase?.())
              .join(''),
            false,
          ),
        );
        break;
      case 'Action':
        if (p.getAttribute('Alignment') === 'Center') {
          // Centered text.
          tokens.push(
            ...[...p.querySelectorAll('Text')].map((text) =>
              createToken('action', text.textContent || '', true, 'centered'),
            ),
          );
        } else {
          // Normal action.
          tokens.push(
            createToken(
              'action',
              [...p.querySelectorAll('Text')]
                .map((text) => text.textContent)
                .join(''),
              false,
            ),
          );
        }
        break;
      case 'Character':
        tokens.push(
          createToken(
            'character',
            [...p.querySelectorAll('Text')]
              // NOTE: Character names (i.e. McCORMICK) can have lowercases.
              .map((text) => text.textContent)
              .join(''),
            false,
          ),
        );
        break;
      case 'Dialogue':
        tokens.push(
          createToken(
            'dialogue',
            [...p.querySelectorAll('Text')]
              .map((text) => text.textContent)
              .join(''),
            false,
          ),
        );
        break;
      case 'Parenthetical':
        tokens.push(
          createToken(
            'parenthetical',
            [...p.querySelectorAll('Text')]
              .map((text) => text.textContent)
              .join(''),
            false,
          ),
        );
        break;
      case 'Transition':
        tokens.push(
          createToken(
            'transition',
            [...p.querySelectorAll('Text')]
              .map((text) => text?.textContent?.toUpperCase?.())
              .join(''),
            false,
          ),
        );
        break;
      case 'Singing':
        tokens.push(
          ...[...p.querySelectorAll('Text')].map((text) =>
            createToken('lyric', text.textContent || '', false),
          ),
        );
        break;
      default:
        // Ignored...
        break;
    }
  }
  return tokens;
}
