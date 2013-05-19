//     markleft.js

//     (c) 2013, Jean-Christophe Hoelt, Fovea.cc
//     markleft may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/Fovea/markleft
(function () {
    'use strict';

    // Save a reference to the global object (`window` in the browser, `exports`
    // on the server).
    var root = this;

    // The top-level namespace. All public methods will
    // be attached to this. Exported for both the browser and the server.
    var markleft;
    if (typeof exports !== 'undefined') {
        markleft = exports;
    } else {
        markleft = root.markleft = {};
    }

    // List of Markleft plugins. Each plugin is an object with the
    // following fields:
    // - name: text name of the plugin
    // - transform: function which takes a text as parameter and
    //              returns the patched text in HTLM.
    //
    // User is free to add his own plugins to this array,
    // using the registerPlugin method.
    var plugins = markleft.plugins = [];

    // Our public API
    // --------------

    // Library version
    markleft.VERSION = '0.1.0';

    // Get a row text, turn it to richer HTML
    markleft.toHTML = function (txt) {
        var html = txt;
        for (var i = 0; i < plugins.length; ++i) {
            html = plugins[i].transform(html);
        }
        return html;
    };

    // Register a plugin
    markleft.registerPlugin = function (p) {

        // Check if plugin is valid.
        if (!p.name ||!p.transform) {
            console.log('markleft.registerPlugin: Invalid plugin');
            return;
        }

        // Check if plugin is not already installed.
        for (var i = 0; i < plugins.length; ++i) {
            if (plugins[i].name === p.name) {
                console.log('markleft.registerPlugin: Plugin ' + p.name + ' already registered');
                return;
            }
        }

        // Add the plugin to the list.
        plugins.push(p);
    };

    // Remove a plugin from the collection.
    markleft.unregisterPlugin = function (name) {
        for (var i = 0; i < plugins.length; ++i) {
            if (plugins[i].name === name) {
                plugins.splice(i, 1);
                return;
            }
        }
        console.log('markleft.unregisterPlugin: Plugin ' + name + ' not found');
    };

    // Markleft default plugins
    // ------------------------

    // Escape HTML special characters
    var escapePlugin = {
        name: 'escape',
        transform: function (text) {
            return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };
    markleft.registerPlugin(escapePlugin);

    // Replace text links with HTML <a> links
    var urlPlugin = {
        name: 'a',
        transform: function (text) {
            // Based upon:
            // http://stackoverflow.com/questions/37684
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(exp, '<a href="$1">$1</a>'); 
        }
    };
    markleft.registerPlugin(urlPlugin);

    // Replace line break with <br/>
    var lineBreakPlugin = {
        name: 'br',
        transform: function (text) {
            return text.replace(/\n/g, '<br />');
        }
    };
    markleft.registerPlugin(lineBreakPlugin);

    // Replace --- with <hr/>
    var hrPlugin = {
        name: 'hr',
        transform: function (text) {
            return text.replace(/\n---\n/g, '<hr />');
        }
    };
    markleft.registerPlugin(hrPlugin);

    return markleft;

}).call(this);
