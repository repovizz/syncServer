/**
 * Decodes a base64-encoded binary array to an ArrayBuffer
 * Notice that a DataView must be created from the returned buffer
 * Uses the native atob method if available
 * Falls back to manual parsing if not
 */

 /**
  * The manual method is adapted from Daniel Guerrero code
  * (https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js)
  * The native method is adapted from http://jsperf.com/blob-base64-conversion
  */

 define([], function() {

    var Base64Binary = {

        decode: function(base64) {
            if (!window.atob)
                return manual_decode(input);
            var binary = window.atob(base64);
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            while (--len) {
                view[len] = binary.charCodeAt(len);
            }
            return buffer;
        },

        encode: function(buffer) {
            if (!window.btoa)
                return manual_encode(buffer);
            var view = new Uint8Array(buffer);
            var len = view.length;
            var binary = "";
            for (var i = 0; i < len; i++) {
                binary = binary + String.fromCharCode(view[i]);
            }
            var base64 = window.btoa(binary);
            return base64;
        }

    };

    // Fallbacks for old browsers


    var keyStr =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


    var manual_decode = function(input) {

        //get last chars to see if are valid
        var lkey1 = _keyStr.indexOf(input.charAt(input.length-1));
        var lkey2 = _keyStr.indexOf(input.charAt(input.length-2));

        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray, buffer;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        buffer = new ArrayBUffer(bytes);
        uarray = new Uint8Array(buffer);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i=0; i<bytes; i+=3) {
            //get the 3 octects in 4 ascii chars
            enc1 = _keyStr.indexOf(input.charAt(j++));
            enc2 = _keyStr.indexOf(input.charAt(j++));
            enc3 = _keyStr.indexOf(input.charAt(j++));
            enc4 = _keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }

        return buffer;
    };


    var manual_encode = function(buffer) {

        return "";

    };


    return Base64Binary;

 });
