
import Promise from 'Promise';
import jQuery from 'jquery';

//IMPORTANT : laisser l'expose de jQuery global, car lightspeed se sert de jQuery et on lui expose celui-ci avec cette ligne
window.$ = window.jQuery = window.jQuery || jQuery;

window.GreenSockGlobals = {};

require('console-polyfill');
