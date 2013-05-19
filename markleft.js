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
    markleft.plugins = [];

    // Our public API
    // --------------

    // Library version
    markleft.VERSION = '0.2.0';

    var runPlugin = function (plug, htmlList) {
        var newList = [];
        for (var j = 0; j < htmlList.length; ++j) {
            var html = htmlList[j];

            // If the item is HTML, do not transform.
            if (html[0] !== '<') {
                if (plug.transform) {
                    html = plug.transform(html);
                }
            }
            else if (plug.transformHTML) {
                html = plug.transformHTML(html);
            }

            // Add the result to the new list.
            if (typeof html === 'string') {
                newList.push(html);
            }
            else {
                newList = newList.concat(html);
            }
        }
        return newList;
    };

    // Get a row text, turn it to richer HTML
    markleft.toHTML = function (txt) {

        // First escape the <> characters
        var htmlList = [ escapeGtPlugin.transform(txt) ];

        // Then run plugins
        var plugins = markleft.plugins;
        for (var i = 0; i < plugins.length; ++i) {
            htmlList = runPlugin(plugins[i], htmlList);
        }

        // Finally remove HTML comments.
        htmlList = runPlugin(noComments, htmlList);

        return htmlList.join('');
    };

    // Register a plugin
    markleft.registerPlugin = function (p) {

        // Check if plugin is valid.
        if (!p.name ||!p.transform) {
            console.log('markleft.registerPlugin: Invalid plugin');
            return;
        }

        // Check if plugin is not already installed.
        for (var i = 0; i < markleft.plugins.length; ++i) {
            if (markleft.plugins[i].name === p.name) {
                console.log('markleft.registerPlugin: Plugin ' + p.name + ' already registered');
                return;
            }
        }

        // Add the plugin to the list.
        markleft.plugins.push(p);
    };

    // Remove a plugin from the collection.
    markleft.unregisterPlugin = function (name) {
        if (typeof name.name !== 'undefined') { // In case we're given the plugin instead of its name.
            name = name.name;
        }
        for (var i = 0; i < markleft.plugins.length; ++i) {
            if (markleft.plugins[i].name === name) {
                markleft.plugins.splice(i, 1);
                return;
            }
        }
        console.log('markleft.unregisterPlugin: Plugin ' + name + ' not found');
    };

    // Markleft default plugins
    // ------------------------

    // Escape HTML < and > characters
    var escapeGtPlugin = {
        name: 'gtlt',
        transform: function (text) {
            return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };
    // escapeGt is run in hard by the toHTML method,
    // because after escapeGt is done, we will ignore all elements
    // starting with <
    // That's why it's not registered (nor unregisterable)
    // markleft.registerPlugin(escapeGtPlugin);

    // Replace text links with HTML <a> links
    var urlPlugin = {
        name: 'a',
        transform: function (text) {
            // Based upon:
            // http://stackoverflow.com/questions/37684
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            var magicToken = '!#@#!';
            var html = text.replace(exp, magicToken + '<a href="$1">$1</a>' + magicToken); 
            return html.split(magicToken);
        }
    };
    markleft.registerPlugin(urlPlugin);

    // Escape & characters
    // Has to be done after replacing links.
    var escapeAmpPlugin = {
        name: 'amp',
        transform: function (text) {
            return text.replace(/&/g, '&amp;');
        }
    };
    markleft.registerPlugin(escapeAmpPlugin);


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
            return text.replace(/<br \/>---<br \/>/g, '<hr />');
        }
    };
    markleft.registerPlugin(hrPlugin);


    // Remove HTML comments
    var noComments = {
        name: 'nocomments',
        transform: function (text) {
            return text;
        },
        transformHTML: function (html) {
            var exp = /<!--[\s\S]*?-->/g;
            return html.replace(exp, '');
        }
    };
    // noComments isn't registered as it's run manually
    // after all other plugins are done.
    // markleft.registerPlugin(noComments);

    // Magic token.
    var tok = '#%@%#';

    var finalReplace = markleft.finalReplace = function (text, exp, rep) {
        var ret = text.replace(exp, tok + '<!-- -->' + rep + tok);
        return ret.split(tok);
    };

    // Replace _Some text_ with <i>Some text</i>
    markleft.italic = {
        name: 'italic',
        transform: function (text) {
            var exp = /_([^_]+)_/g;
            var rep = tok + '<i>' + tok + '$1' + tok + '</i>' + tok;
            var ret = text.replace(exp, rep);
            return ret.split(tok);
        }
    };

    // Replace *Some text* with <b>Some text</b>
    markleft.bold = {
        name: 'bold',
        transform: function (text) {
            var exp = /\*([^*]+)\*/g;
            var rep = tok + '<b>' + tok + '$1' + tok + '</b>' + tok;
            var ret = text.replace(exp, rep);
            return ret.split(tok);
        }
    };

    return markleft;

}).call(this);
