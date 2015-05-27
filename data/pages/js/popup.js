/**
 * @fileOverview This file provides for the menu that pops up when
 * you click on the Privly icon in the browser Chrome.
 *
 * The text message on the button determines the operating mode.
 * "off" indicates that the content script can be injected, but it
 * doesn't execute any code.
 *
 * "on" indicates that the content script is injected, and should
 * actively replace links on the user's whitelist.
 *
 * This file depends on the background script modal_button.js.
 *
 */

 /*global chrome:false */
