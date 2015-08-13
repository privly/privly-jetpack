const { Cc, Ci, Cu } = require("chrome");
 
var crypto = {

  hash: function(str) {
    var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].
                      createInstance(Ci.nsIScriptableUnicodeConverter);

    converter.charset = "UTF-8";
    // result is an out parameter,
    // result.value will contain the array length
    var result = {};
    // data is an array of bytes
    var data = converter.convertToByteArray(str, result);
    var ch = Cc["@mozilla.org/security/hash;1"].
               createInstance(Ci.nsICryptoHash);

    ch.init(ch.MD5);
    ch.update(data, data.length);
    var hash = ch.finish(false);
    return crypto.base64(hash);
  },

  base64: function(input) {
    try { b64pad } catch(e) { b64pad=''; }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3)
    {
      var triplet = (input.charCodeAt(i) << 16)
                  | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                  | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > input.length * 8) output += b64pad;
        else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
      }
    }
    return output;
  }

}

var coverageVar = {

  absolutePath: function(filename) {
    var filepath = require("sdk/preferences/service").
                     get("extensions.privly.extension_path");
    filepath = filepath + "lib/" + filename;
    return filepath;
  },

  generate: function(filename) {
    var str = coverageVar.absolutePath(filename);
    var suffix = crypto.hash(str);
    //trim trailing equal signs, turn identifier unsafe chars to safe ones + => _ and / => $
    suffix = suffix.replace(new RegExp('=', 'g'), '').
                    replace(new RegExp('\\+', 'g'), '_').
                    replace(new RegExp('/', 'g'), '$');
    return "__cov_" + suffix;
  }
}
exports.coverageVar = coverageVar;
