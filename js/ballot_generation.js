/**
 *   This file is part of vVote from the Victorian Electoral Commission.
 *
 *   vVote is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License.
 *
 *   vVote is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with vVote.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Contact Craig Burton   craig.burton@vec.vic.gov.au
 *
 *
 *  Creates a QRCode in a Canvas and then returns the binary version of it and the size in pixels of the finished QRCode.
 *  It is all wrapped inside a VECQRCode object to allow it to be stored within a row object.
 * 
 * @author Peter Scheffer
 */

// pt size. 9 = medium, 18 = large.
var mediumFont = 9;
var largeFont = 9;                                         // large font has been removed. but can be re-inserted by setting = 18.
var defaultFontSize = mediumFont;
var ballotFontSize;

function createQRCode(data) {
  var qr = new JSQR();                                     // Initialize a new JSQR object.
  var code = new qr.Code();                                // Initialize a new Code object.

  code.encodeMode = code.ENCODE_MODE.BYTE;                 // Set the code datatype.
  code.version = code.DEFAULT;                             // Set the code version
                                                           // (DEFAULT = use the smallest possible version).
  code.errorCorrection = code.ERROR_CORRECTION.L;          // Set the error correction level (H = High).

  var input = new qr.Input();                              // Initialize a new Input object.
  input.dataType = input.DATA_TYPE.TEXT;                   // Specify the data type of 'data'.
                                                           // Here, 'data' contains only text.
  input.data = data;                                       // Specify the data which should be encoded.

  var matrix = new qr.Matrix(input, code);                 // Initialize a new Matrix object using the input
                                                           // and code, defined above.
                                                           // At this point, the QR Code get generated.

  matrix.scale = 4;                                        // Specify the scaling for graphic output.
  matrix.margin = 2;                                       // Specify the margin for graphic output.

  var canvas = document.createElement('canvas');           // Create a new Canvas element.
  canvas.setAttribute('width', matrix.pixelWidth);         // Set the canvas width to the size of the QR code.
  canvas.setAttribute('height', matrix.pixelWidth);        // Set the canvas height to the size of the QR code.
  canvas.getContext('2d').fillStyle = 'rgb(255,255,255)';  // Set the foreground color of the canvas to black.
  canvas.getContext('2d').fillRect(0,0, matrix.pixelWidth,matrix.pixelWidth);

  canvas.getContext('2d').fillStyle = 'rgb(0,0,0)';        // Set the foreground color of the canvas to black.
  matrix.draw(canvas, 0, 0);                               // Draw the QR code into the canvas
  bdata = canvas.toDataURL('image/jpeg',1.0).slice('data:image/jpeg;base64,'.length);
  bdata = atob(bdata);
  console.log(canvas.toDataURL('image/jpeg',1.0));

  return new VECQRCode(bdata,matrix.pixelWidth);
}

/**
  Simple object to store both the binary data and pixel size of a QRCode
*/
function VECQRCode(bdata,size) {
  this.bdata = bdata;
  this.size = size;
}


/**
  Blank row for the PDF
  @param {int} the height in mm of the blank space
*/
function BlankRow(rowHeight) {
  this.rowHeight=rowHeight;
  this.addToPDF=addToPDF;
  function addToPDF(vecPDF){
  vecPDF.currentY = vecPDF.currentY + this.rowHeight;
  }
}

/**
  Candidate row for a ballot.
  @param {String} content is the name of the candidate.
*/
function CandidateRow (candidateName, partyName) {
  this.candidateName = candidateName;
  this.partyName = partyName;
  this.cellPaddingX = 1;
  this.cellPaddingY = 0.6;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.rowHeight = (this.fontHeight + this.cellPaddingY) * 2;
  this.boxWidth = 71;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {

    vecPDF.doc.setLineWidth(0.2);
    vecPDF.doc.rect(vecPDF.marginLeft, vecPDF.currentY, this.boxWidth, this.rowHeight);

    vecPDF.doc.setFontSize(this.fontSize);
    vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight, this.candidateName);
    vecPDF.currentY = vecPDF.currentY + (this.rowHeight / 2);

    vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight, this.partyName);
    vecPDF.currentY = vecPDF.currentY + (this.rowHeight / 2);
  }
}

/**
  Candidate row for a ballot that can handle foreign characters.
  @param {String} content is the name of the candidate.
*/
function CandidateRowUnicode (content){
  this.content = content;
  this.fontSize = ballotFontSize;
  this.cellPaddingX = 2;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.ct = generateUnicodeText(content, this.fontSize, "Helvetica", true);
  this.cellPaddingY = 2;
  this.rowHeight = this.fontHeight;
  this.rowWidth = 70;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    vecPDF.doc.addImage(this.ct[0], 'JPEG', vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.cellPaddingY, this.ct[1], this.rowHeight);
    vecPDF.doc.setLineWidth(0.5);
    vecPDF.doc.rect(vecPDF.marginLeft, vecPDF.currentY, this.rowWidth, this.rowHeight);
    vecPDF.currentY = vecPDF.currentY + this.cellPaddingY+ this.rowHeight;
  }
}

/**
  Warning message to display in gaps beside ballot boxes.
 */
function WarningMessageWrappedUnicode (warning, yPosition, height) {

  this.content = warning;
  this.fontSize = ballotFontSize;
  this.fontHeight = (55 / 72) * 25.4;
  this.ct = generateWrappedUnicodeTextInBox(this.content, this.fontSize, "Arial", false);
  this.cellPaddingY = 2;
  this.rowHeight = this.fontHeight + this.cellPaddingY + 5;
  this.rowWidth = 55;
  this.height = height;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    vecPDF.doc.addImage(this.ct[0], 'JPEG', vecPDF.marginLeft + 16, vecPDF.currentY + this.cellPaddingY + 1, this.ct[1], this.rowHeight);
    vecPDF.doc.setLineWidth(0.2);
    vecPDF.doc.rect(20, vecPDF.currentY + 3, this.rowWidth, 30);
  }
}

/**
  Warning message to display in gaps beside ballot boxes.
 */
function WarningMessage (warning, yPosition, height) {
  this.type = "warning";
  this.warning = warning;
  this.cellPaddingX = 1;
  this.cellPaddingY = 0.6;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.rowHeight = this.fontHeight + this.cellPaddingY;
  this.rowWidth = 55;
  this.height = height - 1;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    var lines = vecPDF.doc.setFontSize(ballotFontSize).splitTextToSize(warning, 53);
    vecPDF.doc.text(vecPDF.marginLeft + 16, vecPDF.currentY + this.fontHeight + 3, lines);
    vecPDF.doc.setLineWidth(0.2);
    vecPDF.doc.rect(20, vecPDF.currentY + 3, this.rowWidth, this.rowHeight * this.height);
  }
}

/**
  Wrapped heading to display in gaps beside ballot boxes.
 */
function WrappedHeading (message, yPosition, height) {
  this.type = "wrappedheading";
  this.message = message;
  this.cellPaddingX = 1;
  this.cellPaddingY = 0.6;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.rowHeight = this.fontHeight + this.cellPaddingY;
  this.rowWidth = 75;
  this.height = height;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    var lines = vecPDF.doc.setFontSize(ballotFontSize).splitTextToSize(this.message, 70);
    vecPDF.doc.text(vecPDF.marginLeft, vecPDF.currentY + this.fontHeight, lines);
    vecPDF.doc.setLineWidth(0.2);
    vecPDF.currentY = vecPDF.currentY + (this.height * (this.rowHeight + this.cellPaddingY));
  }
}

/**
  Preference row for a receipt
  @param {String} content is the preference associated with this, or blank
*/
function PreferenceRow(content) {

  this.content = content;
  this.cellPaddingY = 0.6;
  this.fontSize = ballotFontSize * 2;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.rowHeight = this.fontHeight + (2 * this.cellPaddingY);
  this.rowWidth = this.rowHeight;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF){
    vecPDF.doc.setFontSize(this.fontSize);
    vecPDF.doc.setFontType("bold");
    this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content) * this.fontSize) / (72 / 25.6))) / 2;
    vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX,  vecPDF.currentY + this.fontHeight + ((this.rowHeight-this.fontHeight - (2*this.cellPaddingY))/2), this.content);
    vecPDF.doc.setLineWidth(0.2);
    vecPDF.doc.rect(vecPDF.marginLeft, vecPDF.currentY, this.rowWidth, this.rowHeight);
    vecPDF.currentY = vecPDF.currentY + this.rowHeight;
    vecPDF.resetFont();
  }
}

/**
  QRCodeRow holds a reference to the QRCode and scales it accordingly
  @param {String} this in the string data to be embedded in the QRCode
  @param {int} optional value to specify the size of the outputted QRCode - will scale QRCode to fit
*/
function QRCodeRow(content, size) {

  this.qrcode = createQRCode(content);
  this.cellPaddingY = 1;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;

  if (size) {
    this.rowHeight = size;
    this.rowWidth = size;
  }
  
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF){
    vecPDF.doc.addImage(this.qrcode.bdata, 'JPEG', vecPDF.marginLeft, vecPDF.currentY + this.cellPaddingY, this.rowWidth, this.rowHeight);
    vecPDF.currentY = vecPDF.currentY + this.cellPaddingY+ this.rowHeight;
  }
}

/**
  A bold Heading row. The content can either be a single line or an array.
  @param {String} or String array, if it is an array the lines will be outputted in a paragraph style with less spacing between each line

  All content is centered
*/
function HeadingRow(content) {
  
  this.content = content;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.cellPaddingY = 1;
  if (content instanceof Array) {
    this.rowHeight = (this.fontHeight * content.length) + (2 * this.cellPaddingY);
  } else {
    this.rowHeight = this.fontHeight + (2 * this.cellPaddingY);
  }

  this.rowWidth = 70;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF){
    vecPDF.doc.setFontSize(this.fontSize);
    vecPDF.doc.setFontType("bold");
    if (content instanceof Array) {
      vecPDF.currentY = vecPDF.currentY + this.cellPaddingY;
      for (i = 0; i < content.length; i++) {
        this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content[i]) * this.fontSize) / (72 / 25.6))) / 2;
        vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight, this.content[i]);
        vecPDF.currentY = vecPDF.currentY + this.fontHeight;
      }
      vecPDF.currentY = vecPDF.currentY + this.cellPaddingY;
    } else {
      this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content) * this.fontSize) / (72 / 25.6))) / 2;
      vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight + ((this.rowHeight - this.fontHeight) / 2), this.content);
      vecPDF.currentY = vecPDF.currentY + this.rowHeight;
    }
    vecPDF.resetFont();
  }
}

/**
  A bold Heading row. The content can either be a single line or an array that can handle foreign characters.
  @param {String} or String array, if it is an array the lines will be outputted in a paragraph style with less spacing between each line

  All content is centered
*/
function HeadingRowUnicode(content) {
  this.content = content;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.ct = generateUnicodeText(content, this.fontSize, "Helvetica", true);
  this.cellPaddingY = 2;
  this.rowHeight = this.fontHeight;    // this.ct[2];
  this.rowWidth = 70;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    vecPDF.doc.addImage(this.ct[0], 'JPEG', vecPDF.marginLeft + ((this.rowWidth-this.ct[1])/2), vecPDF.currentY + this.cellPaddingY, this.ct[1], this.rowHeight);
    vecPDF.currentY = vecPDF.currentY + this.cellPaddingY+ this.rowHeight;
  }
}

/**
  A bold Arrow row. Followed by instructions to line up the arrows.
  @param {String} or String array, if it is an array the lines will be outputted in a paragraph style with less spacing between each line

  All content is left aligned.
*/
function ArrowRow(content) {
  
  this.content = content;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.cellPaddingY = 1;
  if (content instanceof Array) {
    this.rowHeight = (this.fontHeight * content.length) + (2 * this.cellPaddingY);
  } else {
    this.rowHeight = this.fontHeight + (2 * this.cellPaddingY);
  }

  this.rowWidth = 70;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF){
    vecPDF.doc.setFontSize(this.fontSize);
    vecPDF.doc.setFontType("bold");
    if (content instanceof Array) {
      vecPDF.currentY = vecPDF.currentY + this.cellPaddingY;
      for (i = 0; i < content.length; i++) {
        this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content[i]) * this.fontSize) / (72 / 25.6))) / 2;
        vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight, this.content[i]);
        vecPDF.currentY = vecPDF.currentY + this.fontHeight;
      }
      vecPDF.currentY = vecPDF.currentY + this.cellPaddingY;
    } else {
      this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content) * this.fontSize) / (72 / 25.6))) / 2;
      vecPDF.doc.text(vecPDF.marginLeft, vecPDF.currentY + this.fontHeight + ((this.rowHeight - this.fontHeight) / 2), this.content);
      vecPDF.currentY = vecPDF.currentY + this.rowHeight;
    }
    vecPDF.resetFont();
  }
}

/**
  SubHeading, slightly smaller and not bold.
  @param {String} single string or array of strings to output
*/
function SubHeadingRow(content) {

  this.content = content;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.cellPaddingY = 1;
  if (content instanceof Array){
    this.rowHeight = (this.fontHeight * content.length) + (2 * this.cellPaddingY);
  } else {
    this.rowHeight = this.fontHeight + (2 * this.cellPaddingY);
  }
  this.rowWidth = 70;

  this.addToPDF=addToPDF;
  function addToPDF(vecPDF) {
    vecPDF.doc.setFontSize(ballotFontSize);
    vecPDF.doc.setFontType("normal");
   
    if (content instanceof Array){
      vecPDF.currentY = vecPDF.currentY + this.cellPaddingY;
      for (i = 0; i < content.length; i++) {
        this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content[i]) * this.fontSize) / (72 / 25.6))) / 2;
        vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight, this.content[i]);
        vecPDF.currentY = vecPDF.currentY  + this.fontHeight;
      }
      vecPDF.currentY = vecPDF.currentY + this.cellPaddingY;
    } else {
      this.cellPaddingX = (this.rowWidth - ((vecPDF.doc.getStringUnitWidth(content) * this.fontSize) / (72 / 25.6))) / 2;
      vecPDF.doc.text(vecPDF.marginLeft + this.cellPaddingX, vecPDF.currentY + this.fontHeight + ((this.rowHeight - this.fontHeight) / 2), this.content);
      vecPDF.currentY = vecPDF.currentY + this.rowHeight;
    }
  
    vecPDF.resetFont();
  }
}

/**
  SubHeading, slightly smaller and not bold that can handle foreign characters.
  @param {String} single string or array of strings to output
*/
function SubHeadingRowUnicode(content) {

  this.content = content;
  this.fontSize = ballotFontSize;
  this.fontHeight = (this.fontSize / 72) * 25.4;
  this.ct = generateUnicodeText(this.content, this.fontSize, "Helvetica", false);
  this.cellPaddingY = 2;
  this.rowHeight = 9;
  this.rowWidth = 70;
  
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    vecPDF.doc.addImage(this.ct[0], 'JPEG', vecPDF.marginLeft + ((this.rowWidth-this.ct[1])/2), vecPDF.currentY + this.cellPaddingY, this.ct[1], this.rowHeight);
    vecPDF.currentY = vecPDF.currentY + this.cellPaddingY+ this.rowHeight;
  }
}

/**
  SubHeading, slightly smaller and not bold that can handle foreign characters.
  @param {String} single string or array of strings to output
*/
function SubHeadingRowWrappedUnicode(content, yPosition, height) {

  this.content = content;
  this.fontSize = ballotFontSize;
  this.fontHeight = (55 / 72) * 25.4;
  this.ct = generateWrappedUnicodeText(this.content, this.fontSize, "Arial", false);
  this.cellPaddingY = 2;
  this.rowHeight = this.fontHeight + this.cellPaddingY + 5;
  this.rowWidth = 70;
  this.height = height;
  this.addToPDF = addToPDF;
  function addToPDF(vecPDF) {
    vecPDF.doc.addImage(this.ct[0], 'JPEG', vecPDF.marginLeft + ((this.rowWidth-this.ct[1])/2), vecPDF.currentY + this.cellPaddingY, this.ct[1], this.rowHeight);
    vecPDF.currentY = vecPDF.currentY + this.cellPaddingY+ this.rowHeight;
  }
}

/**
 Wrapper of the jsPDF object to held create a dynamically sized PDF. Calculates the appropriate size based on the actual data, as such, does two passes through the content, one to calculate total size and one to actually output the data to the PDF
 */
function VECPDF(width, marginLeft, marginTop, marginBottom, fontSize) {

  this.width = width;
  this.marginLeft = marginLeft;
  this.marginTop = marginTop;
  this.rows = new Array();
  this.addRow = addRow;
  function addRow(row) {
    this.rows[this.rows.length]=row;
  }
  
  this.createPDF = createPDF;
  function createPDF(elem) {
    
    this.currentY = marginTop;
    var totalHeight = marginTop * 2;
    
    var padding = 500;      // the bottom needs more padding on the Android tablets.
    
    for (rowCount = 0; rowCount < this.rows.length; rowCount++) {
      if (this.rows[rowCount] != null) {
        totalHeight = totalHeight + this.rows[rowCount].rowHeight;
      }
    }
    
    if (totalHeight < this.width) {
      totalHeight = this.width+1;
    }
    totalHeight = totalHeight + marginTop;
    totalHeight = totalHeight + marginBottom;
    totalHeight = totalHeight + padding;
    
    this.doc = new jsPDF("p", "mm", [this.width, totalHeight], false);

    for (rowCount = 0; rowCount < this.rows.length; rowCount++) {
      this.rows[rowCount].addToPDF(this);
    }
    
    
    this.doc.addJS('print(false)');
    elem.src = this.doc.output('dataurlstring');
  }

  //New getPDF method for returning dataurlstring of PDF document
  this.getPDF=getPDF;
  function getPDF(){
    this.currentY=marginTop;
    var totalHeight=marginTop*2;
    for(rowCount=0;rowCount<this.rows.length;rowCount++){
        totalHeight = totalHeight + this.rows[rowCount].rowHeight;
    }
    if(totalHeight<this.width){
        totalHeight = this.width+1;
    }
    this.totalHeight + marginTop;
    lastTotalHeight=totalHeight;
    console.log("totalHeight:"+totalHeight);
    this.doc = new jsPDF("p","mm",[this.width,totalHeight],false);
    for(rowCount=0;rowCount<this.rows.length;rowCount++){
        this.rows[rowCount].addToPDF(this);
    }
    return this.doc.output('dataurlstring');
  }
  
  this.getCalcCurrentY = getCalcCurrentY;
  function getCalcCurrentY () {
    var totalHeight = 15;
    for (rowCount = 0; rowCount < this.rows.length; rowCount++) {
      totalHeight = totalHeight + (this.rows[rowCount].rowHeight - 0.3);
    }
    return totalHeight;
  }
  
  this.resetFont=resetFont;
  function resetFont(){
    this.doc.setFontSize(defaultFontSize);
    this.doc.setFontType("normal");
  }
}

function isUpperCase (char) {
  if ((char == " ") || (char == ",")) {
    return false;
  }
  
  return (char == char.toUpperCase());
}

function getExactWidthText (text) {

  if (text == null) {
    return 0;
  }

  var maxWidth = 44;
  var upperCaseWidth = 4.1;
  var lowerCaseWidth = 3;
  
  var countWidth = 0;
  var maxCharacters = 1;
  for (var index = 0; index < text.length; index++) {
    var letter = text.charAt(index);
    if (isUpperCase(letter)) {
      countWidth += upperCaseWidth;
    } else {
      countWidth += lowerCaseWidth;
    }
    
    if (countWidth >= maxWidth) {
      maxCharacters = index + 1;
      break;
    }
    
    maxCharacters++;
  }
  
  for (var index = countWidth; index < maxWidth; index += 0.8) {
    text = text + " ";
    maxCharacters++;
  }
  
  return text.substring(0, maxCharacters);
}

var pdf;

function buildBallot(district, region, serialNumber, signature, languageNumber, fontSize, contrast, interface, podResponse) {

  if (fontSize == 1) {
    ballotFontSize = mediumFont;
  } else if (fontSize == 2) {
    ballotFontSize = largeFont;
  } else {
    ballotFontSize = defaultFontSize;
  }

  var container = getContainer();
  var dataContainer = getDataContainer();
  var nominationsData = dataContainer.Resolve("nominationsData");
  var regionData = null;
  var districtData = null;
  
  for (key in nominationsData) {
    var regionName = nominationsData[key]["region"];
    if (regionName == region) {
      regionData = nominationsData[key];
      break;
    }
  }

  var districts = regionData["districts"];
  for (key in districts) {
    districtData = districts[key];
    if (districtData["district"] == district) {
      break;
    }
  }
  
  var districtIsUncontested = districtData["uncontested"];
  if (districtIsUncontested == null) {
    districtIsUncontested = false;
  }
  
  var regionIsUncontested = regionData["no_race"];
  if (regionIsUncontested == null) {
    regionIsUncontested = false;
  }
  
  var assemblyNominationsData = districtData["candidates"];
  var councilNominationsData = regionData["parties"];
  
  var legislativeAssemblyBallot = new LegislativeAssemblyBallot();
  var aboveTheLineCouncilBallot = new AboveTheLineCouncilBallot();
  var belowTheLineCouncilBallot = new BelowTheLineCouncilBallot();
   
  var language = languageOptions[languageNumber];
  var languageDictionary = dictionaryOptions[language];

  // Interpret POD response JSON.
  var assemblyShuffleOrderArray = podResponse["races"][0]["permutation"];
  var atlCouncilShuffleOrderArray = podResponse["races"][1]["permutation"];
  var btlCouncilShuffleOrderArray = podResponse["races"][2]["permutation"];

  var shuffledAssemblyCandidates = new Array();

  if (!districtIsUncontested) {
    legislativeAssemblyBallot.setCandidateNominations(assemblyNominationsData);
    
    var laCandidates = legislativeAssemblyBallot.getCandidates();
    
    // sanity check
    if (laCandidates.length != assemblyShuffleOrderArray.length) {
      alert('POD permutation length does not match candidate data. Exiting.');
      return;
    }
    
    for (var index = 0; index < laCandidates.length; index++) {
      var shuffledIndex = assemblyShuffleOrderArray[index];
      shuffledAssemblyCandidates[index] = laCandidates[shuffledIndex];
    }
  }

  var shuffledAtlCouncilCandidates = new Array();
  var shuffledBtlCouncilCandidates = new Array();

  if (!regionIsUncontested) {
    aboveTheLineCouncilBallot.setPartyGroupListing(councilNominationsData);
    belowTheLineCouncilBallot.setCandidateNominations(councilNominationsData);
    var lcAtlParties = aboveTheLineCouncilBallot.getTicketedGroups();
    var lcBtlCandidates = belowTheLineCouncilBallot.getCandidates();
    
    // sanity check
    if (lcAtlParties.length != atlCouncilShuffleOrderArray.length) {
      alert('POD permutation length does not match candidate data. Exiting.');
      return;
    }

    // sanity check
    if (lcBtlCandidates.length != btlCouncilShuffleOrderArray.length) {
      alert('POD permutation length does not match candidate data. Exiting.');
      return;
    }
    
    for (var index = 0; index < lcAtlParties.length; index++) {
      var shuffledIndex = atlCouncilShuffleOrderArray[index];
      shuffledAtlCouncilCandidates[index] = lcAtlParties[shuffledIndex];
    }

    var shuffledLcBtlCouncilParties = new Array();
    for (var index = 0; index < lcBtlCandidates.length; index++) {
      var shuffledIndex = btlCouncilShuffleOrderArray[index];
      shuffledBtlCouncilCandidates[index] = lcBtlCandidates[shuffledIndex];
    }
  }

  // Create PDF, 80mm width, with margin of 2mm
  pdf = new VECPDF(75, 2, 2, 20, fontSize);

  if (language != "english") {
    var headingText = $.i18n._(languageDictionary['candidate_list_title']);
    pdf.addRow(new SubHeadingRowUnicode(headingText));
  } else {
    pdf.addRow(new SubHeadingRow(languageDictionary['candidate_list_title']));
  }

  if (language != "english") {
    var headingText = $.i18n._(languageDictionary['not_a_ballot']);
    pdf.addRow(new SubHeadingRowUnicode(headingText));
  } else {
    pdf.addRow(new SubHeadingRow(languageDictionary['not_a_ballot']));
  }

  if (language != "english") {
    var instruction1Text = $.i18n._(languageDictionary['printout_instructions_1']);
    pdf.addRow(new SubHeadingRowUnicode([instruction1Text]));
    var instruction2Text = $.i18n._(languageDictionary['printout_instructions_2']);
    pdf.addRow(new SubHeadingRowWrappedUnicode(instruction1Text + " " + instruction2Text));
  } else {
    pdf.addRow(new SubHeadingRow([languageDictionary['printout_instructions_1'], languageDictionary['printout_instructions_2']]));
  }

  // Add left arrow.
  pdf.addRow(new ArrowRow("<<"));

  // Serialize the shuffle order to insert into the QR code.
  var laShuffle = '';

  if (!districtIsUncontested) {
    var race0 = podResponse["races"][0];
    for (var index = 0; index < race0["permutation"].length; index++) {
      var value = race0["permutation"][index];
      laShuffle += (String(value).length == 1 ? "0" + value : value);
    }
  }

  if (!regionIsUncontested) {
    var lcAtlShuffle = '';
    var race1 = podResponse["races"][1];
    for (var index = 0; index < race1["permutation"].length; index++) {
      var value = race1["permutation"][index];
      lcAtlShuffle += (String(value).length == 1 ? "0" + value : value);
    }

    var lcBtlShuffle = '';
    var race2 = podResponse["races"][2];
    for (var index = 0; index < race2["permutation"].length; index++) {
      var value = race2["permutation"][index];
      lcBtlShuffle += (String(value).length == 1 ? "0" + value : value);
    }
  }
  
  var distUncontested = (districtIsUncontested ? 1 : 0);
  var regUncontested = (regionIsUncontested ? 1 : 0);

  var qrData = district + ";" + region + ";" + serialNumber + ";" + laShuffle + ":" + lcAtlShuffle + ":" + 
               lcBtlShuffle + ";" + signature + ";" + languageNumber + ";" + fontSize + ";" + contrast + ";" + 
               interface + ";" + distUncontested + ";" + regUncontested;

  //Create the QRCode. This is fixed in size to the width, so it is 70 by 70 + a top margin of 2mm
  var qrCodeRow = new QRCodeRow(qrData, 70);

  //Add a QRCode row
  pdf.addRow(qrCodeRow);

  if (language != "english") {
    var headingText = $.i18n._(languageDictionary['serial_number']) + " " + serialNumber;
    pdf.addRow(new SubHeadingRowUnicode(headingText));
  } else {
    pdf.addRow(new SubHeadingRow(languageDictionary['serial_number'] + " " + serialNumber));
  }

  pdf.addRow(new HeadingRow(district, pdf.getCalcCurrentY(), 1));

  // If the district is contested.
  if (!districtIsUncontested) {

    if (language != "english") {
      var displayText = $.i18n._(languageDictionary['assembly_not_in_order']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
    } else {
      pdf.addRow(new SubHeadingRow(languageDictionary['assembly_not_in_order']));
    }
  
    pdf.addRow(new BlankRow(3));
    for (i = 0; i < shuffledAssemblyCandidates.length; i++){
      var candidate = shuffledAssemblyCandidates[i];
      if (candidate == null) {
        console.log('candidate ' + i + ' missing');
      }
      var candidateName = candidate.getName();
      var partyName = candidate.getPartyName();
      var candidateDetails = candidateName + ". " + partyName;
      pdf.addRow(new CandidateRow(candidateName, partyName));
    }
    pdf.addRow(new BlankRow(3));

  // Else if the district is uncontested.
  } else {
  
    var uncontestedMessage = $.i18n._(languageDictionary['district_uncontested']);

    if (language != "english") {
      pdf.addRow(new SubHeadingRowWrappedUnicode(uncontestedMessage));
    } else {
      pdf.addRow(new WrappedHeading(uncontestedMessage, pdf.getCalcCurrentY(), 4));
    }
  }

  // If the region is contested.
  if (!regionIsUncontested) {

    // Region heading.
    pdf.addRow(new HeadingRow(region, pdf.getCalcCurrentY(), 1));

    if (language != "english") {
      var displayText = $.i18n._(languageDictionary['atl_not_in_order']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
      displayText = $.i18n._(languageDictionary['groups']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
    } else {
      pdf.addRow(new SubHeadingRow(languageDictionary['atl_not_in_order']));
      pdf.addRow(new SubHeadingRow(languageDictionary['groups']));
    }

    pdf.addRow(new BlankRow(3));
    for (i = 0; i < shuffledAtlCouncilCandidates.length; i++) {
      var groupName = shuffledAtlCouncilCandidates[i].getName();
      if (groupName == "") {
        groupName = "";
      }
      pdf.addRow(new CandidateRow(groupName, ""));
    }
    pdf.addRow(new BlankRow(3));

    if (language != "english") {
      var displayText = $.i18n._(languageDictionary['btl_not_in_order']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
      displayText = $.i18n._(languageDictionary['candidates']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
    } else {
      pdf.addRow(new SubHeadingRow(languageDictionary['btl_not_in_order']));
      pdf.addRow(new SubHeadingRow(languageDictionary['candidates']));
    }

    pdf.addRow(new BlankRow(3));
    for (i = 0; i < shuffledBtlCouncilCandidates.length; i++) {

      var candidateName = shuffledBtlCouncilCandidates[i].getName();
      var partyName = shuffledBtlCouncilCandidates[i].getPartyName();
      pdf.addRow(new CandidateRow(candidateName, partyName));
    }
  }
  
  pdf.addRow(new BlankRow(3));

  //Add another copy of the QRCode
  pdf.addRow(qrCodeRow);
  
  pdf.addRow(new BlankRow(3));

  var pdfAsDataUri = pdf.getPDF(); // shortened
  var pdfAsArray = convertDataURIToBinary(pdfAsDataUri);
  PDFJS.disableWorker = true;
  PDFJS.getDocument(pdfAsArray).then(getVVotePdf);
}

function getFormattedTimeNow () {
  var date = new Date();
  var formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formattedDate;
}

function buildReceipt(la_data, lc_atl, lc_btl, language) {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  var districtData = null;
  var district = votingSession.getDistrict();
  var region = votingSession.getRegion();
  var nominationsData = dataContainer.Resolve("nominationsData");
  var regionData = null;

  var confirmationSignature = votingSession.getConfirmationSignature();

  var language = votingSession.getLanguage();
  if (language == null) {
    language = "english";
  }
  
  for (key in nominationsData) {
    var regionName = nominationsData[key]["region"];
    if (regionName == region) {
      regionData = nominationsData[key];
      break;
    }
  }

  var serialNumber = votingSession.getSerialCode();
  var fontSizeText = votingSession.getQrFontSize();
  
  if (fontSizeText == LARGE) {
    ballotFontSize = largeFont;
  } else {
    ballotFontSize = mediumFont;
  }
  
  var districts = regionData["districts"];
  for (key in districts) {
    districtData = districts[key];
    if (districtData["district"] == district) {
      break;
    }
  }
  
  var districtIsUncontested = votingSession.getDistrictIsUncontested();
  var regionIsUncontested = votingSession.getRegionIsUncontested();
  var languageDictionary = dictionaryOptions[language];

  // Create PDF, 80mm width, with margin of 5mm
  pdf = new VECPDF(75, 2, 2, 20, ballotFontSize);

  if (language != "english") {
    var headingText = $.i18n._(languageDictionary['preferences_list_title']);
    pdf.addRow(new SubHeadingRowUnicode(headingText));
  } else {
    pdf.addRow(new SubHeadingRow(languageDictionary['preferences_list_title']));
  }

  if (language != "english") {
    var headingText = $.i18n._(languageDictionary['not_a_ballot']);
    pdf.addRow(new SubHeadingRowUnicode(headingText));
  } else {
    pdf.addRow(new SubHeadingRow(languageDictionary['not_a_ballot']));
  }

  if (language != "english") {
    var instruction1Text = $.i18n._(languageDictionary['this_is_a_receipt']);
    pdf.addRow(new SubHeadingRowUnicode([instruction1Text]));
    var instruction2Text = $.i18n._(languageDictionary['vote_remains_private']);
    pdf.addRow(new SubHeadingRowUnicode([instruction2Text]));
  } else {
    pdf.addRow(new SubHeadingRow([languageDictionary['this_is_a_receipt'], languageDictionary['vote_remains_private']]));
  }

  // Add right arrow.
  pdf.addRow(new ArrowRow(">>"));

  var dateTime = getFormattedTimeNow();
  var location = "Gembrook EVC";
  
  var laPreferencesSerialised = "";
  for (i = 0; i < la_data.length; i++) {
    laPreferencesSerialised = laPreferencesSerialised + la_data[i];
    if (i < la_data.length - 1) {
      laPreferencesSerialised = laPreferencesSerialised + ",";
    }
  }
  
  var atlPreferencesSerialised = "";
  for (i = 0; i < lc_atl.length; i++) {
    atlPreferencesSerialised = atlPreferencesSerialised + lc_atl[i];
    if (i < lc_atl.length - 1) {
      atlPreferencesSerialised = atlPreferencesSerialised + ",";
    }
  }
  
  var btlPreferencesSerialised = "";
  for (i = 0; i < lc_btl.length; i++) {
    btlPreferencesSerialised = btlPreferencesSerialised + lc_btl[i];
    if (i < lc_btl.length - 1) {
      btlPreferencesSerialised = btlPreferencesSerialised + ",";
    }
  }

  var distUncontested = (districtIsUncontested ? 1 : 0);
  var regUncontested = (regionIsUncontested ? 1 : 0);
  
  // Construct the QR code data.
  var qrData = "receipt;" + district + ";" + region + ";" + serialNumber + ";" + dateTime + ";" + location + ";" +  
               laPreferencesSerialised + ":" + atlPreferencesSerialised + ":" + btlPreferencesSerialised + 
               ";" + confirmationSignature + ";" + distUncontested + ";" + regUncontested;

  // Create the QRCode. This is fixed in size to the width, so it is 70 by 70 + a top margin of 2mm
  var qrCodeRow = new QRCodeRow(qrData, 70);

  // Add the QRCode
  pdf.addRow(qrCodeRow);

  if (language != "english") {
    var headingText = $.i18n._(languageDictionary['serial_number']) + " " + serialNumber;
    pdf.addRow(new SubHeadingRowUnicode(headingText));
  } else {
    pdf.addRow(new SubHeadingRow(languageDictionary['serial_number'] + " " + serialNumber));
  }

  pdf.addRow(new HeadingRow(district, pdf.getCalcCurrentY(), 1));

  // If the district is contested.
  if (!districtIsUncontested) {

    if (language != "english") {
      var displayText = $.i18n._(languageDictionary['assembly_not_in_order']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
    } else {
      pdf.addRow(new SubHeadingRow(languageDictionary['assembly_not_in_order']));
    }

    if (language != "english") {
      pdf.addRow(new WarningMessageWrappedUnicode(languageDictionary['district_boxes_empty'], pdf.getCalcCurrentY(), 6));
    } else {
      pdf.addRow(new WarningMessage(languageDictionary['district_boxes_empty'], pdf.getCalcCurrentY(), 6));
    }

    pdf.addRow(new BlankRow(3));

    for (i = 0; i < la_data.length; i++) {
      pdf.addRow(new PreferenceRow(la_data[i]));
    }
    pdf.addRow(new BlankRow(3));
    
  // Else if the district is uncontested.
  } else {  

    var uncontestedMessage = $.i18n._(languageDictionary['district_uncontested']);

    if (language != "english") {
      pdf.addRow(new SubHeadingRowWrappedUnicode(uncontestedMessage));
    } else {
      pdf.addRow(new WrappedHeading(uncontestedMessage, pdf.getCalcCurrentY(), 4));
    }
  }

  // If the region is contested.
  if (!regionIsUncontested) {

    // Region heading.
    pdf.addRow(new HeadingRow(region, pdf.getCalcCurrentY(), 1));

    if (language != "english") {
      var displayText = $.i18n._(languageDictionary['atl_not_in_order']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
      displayText = $.i18n._(languageDictionary['groups']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
    } else {
      pdf.addRow(new SubHeadingRow(languageDictionary['atl_not_in_order']));
      pdf.addRow(new SubHeadingRow(languageDictionary['groups']));
    }

    if (language != "english") {
      pdf.addRow(new WarningMessageWrappedUnicode(languageDictionary['atl_boxes_empty'], pdf.getCalcCurrentY(), 6));
    } else {
      pdf.addRow(new WarningMessage(languageDictionary['atl_boxes_empty'], pdf.getCalcCurrentY(), 6));
    }

    pdf.addRow(new BlankRow(3));

    for (i = 0; i < lc_atl.length; i++) {
      pdf.addRow(new PreferenceRow(lc_atl[i]));
    }
    pdf.addRow(new BlankRow(3));

    if (language != "english") {
      var displayText = $.i18n._(languageDictionary['btl_not_in_order']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
      displayText = $.i18n._(languageDictionary['candidates']);
      pdf.addRow(new SubHeadingRowUnicode([displayText]));
    } else {
      pdf.addRow(new SubHeadingRow(languageDictionary['btl_not_in_order']));
      pdf.addRow(new SubHeadingRow(languageDictionary['candidates']));
    }

    if (language != "english") {
      pdf.addRow(new WarningMessageWrappedUnicode(languageDictionary['btl_boxes_empty'], pdf.getCalcCurrentY(), 6));
    } else {
      pdf.addRow(new WarningMessage(languageDictionary['btl_boxes_empty'], pdf.getCalcCurrentY(), 6));
    }

    pdf.addRow(new BlankRow(3));
  
    for (i = 0; i < lc_btl.length; i++) {
      pdf.addRow(new PreferenceRow(lc_btl[i]));
    }
    pdf.addRow(new BlankRow(3));
  }

  // Check your receipt message.
  if (language != "english") {
    pdf.addRow(new SubHeadingRowWrappedUnicode(languageDictionary['check_receipt_message'], pdf.getCalcCurrentY(), 6));
  } else {
    pdf.addRow(new WrappedHeading(languageDictionary['check_receipt_message'], pdf.getCalcCurrentY(), 4));
  }

  //Add another copy of the QRCode
  pdf.addRow(qrCodeRow);
  
  pdf.addRow(new BlankRow(3));

  var pdfAsDataUri = pdf.getPDF(); // shortened
  var pdfAsArray = convertDataURIToBinary(pdfAsDataUri);
  PDFJS.disableWorker = true;
  PDFJS.getDocument(pdfAsArray).then(getVVotePdf);
}

/**
* Generates unicode string by embedding it in a canvas and converting it to an image
*/
function generateUnicodeText(text, size, font, bold) {

  var cvs = document.createElement('canvas');

  //Calculate text size
  var textSize = MeasureText(text, bold, font, 18);

  cvs.setAttribute('width', textSize[0]);
  cvs.setAttribute('height', textSize[1]);
  
  context = cvs.getContext("2d");
  context.textBaseline = "top";
  fstring = (bold ? 'bold ' : '');
  fstring = fstring+ "18pt " + font;
  context.font = fstring;
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0, 0, textSize[0], textSize[1]);          
  context.fillStyle = 'rgb(0,0,0)';              
  context.fillText(text, 0, 0);
  bdata = cvs.toDataURL('image/jpeg', 1.0).slice('data:image/jpeg;base64,'.length);
  bdata = atob(bdata)
  
  return [bdata,(textSize[0] * 0.265), (textSize[1] * 0.6)];
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  if (words.length == 1) {
    words = text.split('');
  }

  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

/**
* Generates unicode string by embedding it in a canvas and converting it to an image
*/
function generateWrappedUnicodeTextInBox(text, size, font, bold) {

  var canvas = document.getElementById('foreign');

  var context = canvas.getContext('2d');
  var maxWidth = 450;
  var lineHeight = 65;
  var x = (canvas.width - maxWidth) / 2;
  var y = 5;

  context.textBaseline = "top";
  fstring = (bold ? 'bold ' : '');
  fstring = fstring + "50pt " + font;
  context.font = fstring;
  
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0, 0, 500, 350);          
  context.fillStyle = 'rgb(0,0,0)';              

  wrapText(context, text, x, y, maxWidth, lineHeight);

  bdata = canvas.toDataURL('image/jpeg', 1.0).slice('data:image/jpeg;base64,'.length);

  bdata = atob(bdata)

  var textSize = [ 200, 200 ];  
  return [bdata,(textSize[0] * 0.264583333), (textSize[1] * 0.264583333)];
}

/**
* Generates unicode string by embedding it in a canvas and converting it to an image
*/
function generateWrappedUnicodeText(text, size, font, bold) {

  var canvas = document.getElementById('foreign2');
  var context = canvas.getContext('2d');
  var maxWidth = 600;
  var lineHeight = 65;
  var x = (canvas.width - maxWidth) / 2;
  var y = 5;
  
  context.textBaseline = "top";
  fstring = (bold ? 'bold ' : '');
  fstring = fstring + "50pt " + font;
  context.font = fstring;
  context.clearRect(x, y, 700, 300);
  
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0, 0, 700, 350);          
  context.fillStyle = 'rgb(0,0,0)';              

  wrapText(context, text, x, y, maxWidth, lineHeight);

  bdata = canvas.toDataURL('image/jpeg', 1.0).slice('data:image/jpeg;base64,'.length);

  bdata = atob(bdata)

  var textSize = [ 280, 200 ];  
  return [bdata,(textSize[0] * 0.264583333), (textSize[1] * 0.264583333)];
}

/**
* Measures text by creating a DIV in the document and adding the relevant text to it.
* Then checking the .offsetWidth and .offsetHeight. Because adding elements to the DOM is not particularly
* efficient in animations (particularly) it caches the measured text width/height.
* 
* @param  string text   The text to measure
* @param  bool   bold   Whether the text is bold or not
* @param  string font   The font to use
* @param  size   number The size of the text (in pts)
* @return array         A two element array of the width and height of the text
*/
function MeasureText(text, bold, font, size) {

  // This global variable is used to cache repeated calls with the same arguments
  var str = text + ':' + bold + ':' + font + ':' + size;
  if (typeof(__measuretext_cache__) == 'object' && __measuretext_cache__[str]) {
    return __measuretext_cache__[str];
  }

  var div = document.createElement('DIV');
  div.innerHTML = text;
  div.style.position = 'absolute';
  div.style.top = '-100px';
  div.style.left = '-100px';
  div.style.fontFamily = font;
  div.style.fontWeight = bold ? 'bold' : 'normal';
  div.style.fontSize = size + 'pt';
  document.body.appendChild(div);
   
  var size = [div.offsetWidth, div.offsetHeight];

  document.body.removeChild(div);
    
  // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
  if (typeof(__measuretext_cache__) != 'object') {
    __measuretext_cache__ = [];
  }
  
  __measuretext_cache__[str] = size;
    
  return size;
}

function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return String(unicodeString);
}


//=====================================
//New PDF Functions from Chris
//=====================================
var BASE64_MARKER = ';base64,';

function getVVotePdf(pdf) {
    //
    // Fetch the first page
    //
    pdf.getPage(1).then(getPageVVote);
}

function getPageVVote(page) {
    var canvas = document.getElementById('the-canvas');
    //The canvas has a pre-determined width of 576 pixels, forces PDF to correct scale
    console.log("scale:" + canvas.width / page.getViewport(1.0).width);
    console.log("heightscale:" + page.getViewport(1.0).height * (canvas.width / page.getViewport(1.0).width));
    var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);

    //
    // Prepare canvas using PDF page dimensions
    //
    var context = canvas.getContext('2d');
    canvas.height = lastTotalHeight*(203/27.6);//viewport.height; The calculated height is wrong, this compensates.
    canvas.width = viewport.width;

    //Fill the background with white - needed for image conversion
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0,0, canvas.width,canvas.height);
    //Reset foreground color
    context.fillStyle = 'rgb(0,0,0)';       // Set the foreground color of the canvas to black.

    //
    // Render PDF page into canvas context
    //
    page.render({canvasContext: context, viewport: viewport}).then(sendDataForPrinting);
}

function sendDataForPrinting(){
    var canvas = document.getElementById('the-canvas');
    var dataURL = canvas.toDataURL();
    //Send via JQuery, strip data: tag first, could wait for response
console.log("submitting " + dataURL.slice('data:image/png;base64,'.length) + " to ./servlet/printMe");
    $.post("./servlet/printMe", { imageContent: dataURL.slice('data:image/png;base64,'.length)},printResponse).fail(printError);
}

function printResponse(data){
    console.log(data);
}

function printError(data){
    window.alert("Error Printing\n\n" + data.responseText);
}

function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    
    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

//===============
//End of New Code
//===============
