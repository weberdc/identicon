// identicon.js
//
// Functions for generating identicons from text

function generateIdenticon() {
  // turn the source info into a binary string
  let binaryString = toHashString(elementById("identicon_source").value);

  // create blank boolean matrix
  let gridSize = elementById("grid_size").value;
  let matrix = initMatrix(gridSize);

  // populate the matrix
  fillIdenticonMatrix(matrix, binaryString);

  let cellSize = parseInt(elementById("cell_size").value);
  let svg = buildSvgIdenticonFrom(matrix, cellSize, elementById("identicon_colour").value);

  elementById("identicon_svg").innerHTML = svg;

  var svg2 = document.querySelector("svg");
  var canvas = elementById("identicon_canvas").querySelector("canvas");

  createSvg2pngDownloadLink(svg2, canvas, cellSize * gridSize, cellSize * gridSize);
}

function elementById(id) {
  return window.document.getElementById(id);
}

function toHashString(source) {
  let hashCode = Math.abs(source.hashCode());
  return padWithZeroes(31, hashCode.toString(2));
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function padWithZeroes(targetLength, binaryString) {
  if (binaryString.length < targetLength) {
    var digitsShort = targetLength - binaryString.length;
    for (var i = 0; i < digitsShort; i++) {
      binaryString = "0" + binaryString; // prepend
    }
  }
  return binaryString;
}

function initMatrix(gridSize) {
  let matrix = [];
  for (var i = 0; i < gridSize; i++) {
    matrix.push([]);
    for (var j = 0; j < gridSize; j++) {
      matrix[i].push(false);
    }
  }
  return matrix;
}

function fillIdenticonMatrix(matrix, binaryString) {
  var count = 0;
  for (var row = 0; row < matrix.length; row++) {
    for (var col = 0; col < matrix[row].length / 2; col++) {
      let value = (binaryString[count++ % binaryString.length] === "1");
      matrix[row][col] = value;
      matrix[row][matrix[row].length - col - 1] = value; // duplicate setting, but whatever
    }
  }
}

function buildSvgIdenticonFrom(matrix, cellWidth=20, colour='rgb(0,0,255)') {
  var svg = [];
  let side = cellWidth * matrix.length;
  svg.push(`<svg width="${side}" height=${side}>`);
  for (var row = 0; row < matrix.length; row++) {
    for (var col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        let x = col * cellWidth;
        let y = row * cellWidth;
        let w = cellWidth;
        let h = cellWidth;
        let s = `fill:${colour};stroke-width:0`;
        let cell = `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="${s}" />`;
        svg.push(cell);
      }
    }
  }
  svg.push('</svg>');
  return svg.join('\n');
}

function createSvg2pngDownloadLink(svg, canvas, width, height) {
  // adapted from https://gist.github.com/gustavohenke/9073132
  // we need to look up the existing svg element for some reason
  // var svg = document.querySelector("svg");
  var svgData = new XMLSerializer().serializeToString(svg);

  // find the existing canvas
  // var canvas = elementById("identicon_canvas").querySelector("canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  var ctx = canvas.getContext("2d");

  var img = document.createElement("img");
  img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));

  img.onload = function() {
    ctx.drawImage(img, 0, 0);

    // Now is done
    let pngUrl = canvas.toDataURL("image/png");

    // console.log(pngUrl);

    elementById("identicon_png").innerHTML = `<a href="${pngUrl}">Download</a>`;
  };
}
