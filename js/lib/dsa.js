/*
/Function to get the random values as a hex string
/bitLength should be a multiple of 8 (we can only get random bytes, not bits)
*/
function getRandomValues(bitLength){
  bytelength = bitLength/8;
  var array = new Uint8Array(bytelength);
  window.crypto.getRandomValues(array);
  return toHexString(array);
  //output="";
  //for (var i = 0; i < array.length; i++) {
  //    output=output+array[i].toString(16);
  //}
  //return output
}


var hexChar = ['0' , '1' , '2' , '3' ,'4' , '5' , '6' , '7' ,'8' , '9' , 'a' , 'b' , 'c' , 'd' , 'e' , 'f'];
function toHexString ( b )
   {
   output="";
   for ( var i=0; i<b.length; i++ )
      {
      // look up high nibble char
      output=output+(hexChar[(b[i] & 0xf0) >>> 4]);

      // look up low nibble char
      output=output+(hexChar[b[i] & 0x0f]);
      }
   return output;
   }



/*
/Function to digitally sign a string. jsonKey is the id of the element containing the json representation of the private key
/message is just a string message;
*/
function signMessage(jsonKey, message){
  m = new BigInteger(hex_sha1(message),16);
  var key = JSON.parse(jsonKey);
  k = new BigInteger();

  g = new BigInteger(key.g);
  p = new BigInteger(key.p);
  q = new BigInteger(key.q);
  x = new BigInteger(key.x);


  r = BigInteger.ZERO;
  s = BigInteger.ZERO;
  while(r.equals(BigInteger.ZERO) || s.equals(BigInteger.ZERO)){
    k= new BigInteger(getRandomValues(q.bitLength()),16);
    r = g.modPow(k, p).mod(q);
    xr = x.multiply(r);
    s = k.modInverse(q).multiply(m.add(xr)).mod(q);
  }
//  console.log(s.toString());
//  console.log(r.toString());
  var sarr = s.toByteArray();
  var rarr = r.toByteArray();
//console.log(sarr[0]);
  if(sarr[0]>127){
    sarr.splice(0,0,0);
  }
  if(rarr[0]>127){
    rarr.splice(0,0,0);
  }
  datalength = sarr.length + rarr.length;
  
  var out = new Array();
  out[0]=48;
  out[1]=4+datalength;
  out[2]=2;
  out[3]=rarr.length;
  out = out.concat(rarr);
  out[out.length]=2;
  out[out.length]=sarr.length;
  out = out.concat(sarr);
  //console.log(toHexString(out));
  return base64ArrayBuffer(out);//hex2b64(toHexString(out));
}

function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}