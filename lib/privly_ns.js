/**
 * @fileOverview Provides the Privly namespace for the options, storage, glyph
 * and context messenger interface. 
 * For more information about these interfaces, check out the files @
 * chrome/content/privly-applications/shared/javascripts/
 */
var CONTEXT_MESSENGER = "../chrome/content/privly-applications/shared/javascripts/context_messenger.js";
var { glyph, message, options, storage } = require("../chrome/content/privly-applications/shared/javascripts/glyph.js");

// Privly Namespace
var Privly = {};
Privly.CONTEXT_MESSENGER = "../chrome/content/privly-applications/shared/javascripts/context_messenger.js";
// options interface
Privly.options = options;
// glyph interface
Privly.glyph = glyph;
// storage interface
Privly.storage = storage;
// context messenger interface
Privly.message = message;

exports.Privly = Privly;
