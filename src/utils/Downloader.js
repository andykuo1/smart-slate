export const FILE_TYPE_PNG = 'png';
export const FILE_TYPE_JPG = 'jpg';
export const FILE_TYPE_SVG = 'svg';

/**
 * @param {string} filename
 * @param {string} textData
 */
export function downloadText(filename, textData) {
  downloadURL(filename, getTextDataURI(textData));
}

/**
 *
 * @param {string} filename
 * @param {string} filetype
 * @param {SVGElement} svg
 * @param {number} width
 * @param {number} height
 */
export function downloadImageFromSVG(filename, filetype, svg, width, height) {
  const blob = createBlobFromSVG(svg);
  switch (filetype) {
    case FILE_TYPE_PNG:
    case FILE_TYPE_JPG:
      {
        const url = URL.createObjectURL(blob);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Missing canvas 2d context.');
        }
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          URL.revokeObjectURL(url);

          const imageURI = canvas
            .toDataURL('image/' + filetype)
            .replace('image/' + filetype, 'image/octet-stream');
          downloadURL(filename, imageURI);
        };
        image.src = url;
      }
      break;
    case FILE_TYPE_SVG:
      {
        const reader = new FileReader();
        reader.onload = () => {
          downloadURL(filename, String(reader.result));
        };
        reader.readAsDataURL(blob);
      }
      break;
    default:
      throw new Error("Unknown file type '" + filetype + "'");
  }
}

/**
 * @param {string} filename
 * @param {string} url
 */
export function downloadURL(filename, url) {
  const element = document.createElement('a');
  const headerIndex = url.indexOf(';');
  url =
    url.substring(0, headerIndex + 1) +
    'headers=Content-Disposition%3A%20attachment%3B%20filename=' +
    filename +
    ';' +
    url.substring(headerIndex + 1);
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

export function downloadURLImpl(filename, url) {
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

/**
 * @param {SVGElement} svg
 */
function createBlobFromSVG(svg) {
  const styledSVG = computeSVGStyles(svg);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(styledSVG);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return blob;
}

// SOURCE: https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser/44769098#44769098
const SVG_CONTAINERS = ['svg', 'g'];
/**
 * @param {SVGElement} svg
 * @param {SVGElement} dst
 */
function computeSVGStyles(
  svg,
  dst = /** @type {SVGElement} */ (svg.cloneNode(true)),
) {
  let sourceChildren = svg.childNodes;
  let children = dst.childNodes;

  for (var index = 0; index < children.length; index++) {
    let child = /** @type {SVGElement} */ (children[index]);
    let tagName = child.tagName;
    if (SVG_CONTAINERS.indexOf(tagName) != -1) {
      const sourceChild = /** @type {SVGElement} */ (sourceChildren[index]);
      computeSVGStyles(sourceChild, child);
    } else if (sourceChildren[index] instanceof Element) {
      const sourceChild = /** @type {SVGElement} */ (sourceChildren[index]);
      const computedStyle = window.getComputedStyle(sourceChild);

      let styleAttributes = [];
      for (let styleName of Object.keys(computedStyle)) {
        styleAttributes.push(
          `${styleName}:${computedStyle.getPropertyValue(styleName)};`,
        );
      }

      child.setAttribute('style', styleAttributes.join(''));
    }
  }

  return dst;
}

/**
 * @param {string} data
 */
function getTextDataURI(data) {
  return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
}
