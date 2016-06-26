// identicon.js
//
// Functions for generating identicons from text

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

function generateIdenticon() {
  let source = window.document.getElementById("identicon_source").value;
  let hashCode = Math.abs(source.hashCode());
  console.log("generateIdenticon(" + source + "): " + hashCode);

  var binary = padWithZeroes(31, hashCode.toString(2));

  console.log(binary);
  console.log(binary.length);

  // create matrix
  let gridSize = window.document.getElementById("grid_size").value;
  let matrix = initMatrix(gridSize);
  console.log(matrix);

  fillIdenticonMatrix(matrix, binary);
  console.log(matrix);




  document.getElementById("demo").innerHTML = source;//document.getElementById("identicon_source").value;
}
