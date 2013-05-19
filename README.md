markleft.js
===========

The simplest markup language ever.

Overview
--------

The main goal of markleft is to be just as natural as writing normal text:
 - links are replaces with HTML a tags.
 - line breaks preserved.
 - bullet points detected and replaced with HTML ul/li tags.

Markleft combine this with a secondary objective, which is to be extensible
offering you the chance to add your own extension to the language.

Usage
-----

Add markleft.js or markleft.min.js to your page.

    // Retrieve the text from whatever source...
    var text = $('input').val();
    
    // Parse it with markleft
    var html = markleft.toHTML(text);

    // Do whatever you like with your html.
    document.body.innerHTML = html;

Writing Plugins
---------------

You can register your own plugins to markup. Here's the example of a plugin that puts all your text in lowercase.

    markleft.registerPlugin({
        name: 'lowercase',
        transform: function (text) {
            return text.toLowerCase();
        }
    });

Of course you should come up with better ideas for plugins that this.

Later on you can also unregister the plugin:

    markleft.unregisterPlugin('lowercase');

Licence
-------

(c) 2013, Jean-Christophe Hoelt, Fovea.cc

Markleft is available for use under the MIT software license.
