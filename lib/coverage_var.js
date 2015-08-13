/**
 * @fileOverview This file is used to determine the coverage variable name
 * for a module. The coverage variable holds all the coverage information of 
 * the module "under test". This variable exists in the instrumented version
 * of the module. In order to generate an instrumented version, use istanbul instrument.
 * 
 * We've followed the exact same steps instanbul follows to generate the names.
 * https://github.com/gotwarlost/istanbul/blob/master/lib/instrumenter.js#L43
 *
 **/

const { Cc, Ci, Cu } = require("chrome");

/**
 * @namespace Helper object to generate a md5 hash for a given input string.
 */
var crypto = {

  /**
   * Returns a base64 md5sum hash of a given input string.
   *
   * @param {string} str Input string
   */
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
  
  /**
   * Returns a base64 version of a given input hash.
   *
   * @param {string} input Input
   * @returns {string} output base64 version of the input.
   */
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

/**
 * @namespace Generates an instrumented coverage variable name for a given
 * filepath.
 */
var coverageVar = {

  /**
   * Finds out the absolute path for a file in this directory.
   *
   * @param {string} filename Filename for a file in the current directory.
   * @returns {string} filepath Absolute file path.
   */
  absolutePath: function(filename) {
    var filepath = require("sdk/preferences/service").
                     get("extensions.privly.extension_path");
    filepath = filepath + "lib/" + filename;
    return filepath;
  },

  /**
   * Generatesa a coverage variable name for the given file.
   * It follows the same steps as --
   * https://github.com/gotwarlost/istanbul/blob/master/lib/instrumenter.js#L43
   *
   * @param {string} filename Filename
   * @returns {string} Coverage variable name for the given filename.
   */
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
