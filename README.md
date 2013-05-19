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

Advanced plugins
----------------

Some plugins require their output to be final, i.e. not transformed by subsequent plugins. In order to achieve this, the transform method can chose to return an array of strings.

The plugin engine will not run on lines starting with a &gt;

Example, the italic plugin:

    markleft.registerPlugin({
        name: 'italic',
        transform: function (text) {
            var exp = /_([A-Za-z ]+)_/g;
            return text.replace(exp, '<i class="italic">$1</i>');
        }
    });

Will replace `'I am _blue_'` with `'I am <i class="italic">blue</i>'`. Imagine another plugin replace `"xxx"` with `<b>xxx</b>`, then we will loose `class="italic"` and end up with an invalid HTML.

That's such plugin should be writen this way:

    markleft.registerPlugin({
        name: 'italic',
        transform: function (text) {
            var exp = /_([A-Za-z ]+)_/g;
            var tok = '#%@%#';
            var rep = tok + '<i class="italic">$1</i>' + tok;
            var ret = text.replace(exp, rep);
            return ret.split(tok);
        }
    });

Everything from `<i>` to `</i>` will be ignored by the plugin manager, thus will remain identical when output.

Included plugins
----------------

markleft comes with a range of included plugins that you may choose to activate:

###markleft.bold

Replace `Hello *world*` with `Hello <b>world</b>`.

Enable with `markdown.registerPlugin(markdown.bold);`

###markleft.italic
Replace `Hello _world_` with `Hello <i>world</i>`.

Enable with `markdown.registerPlugin(markdown.italic);`

Licence
-------

(c) 2013, Jean-Christophe Hoelt, Fovea.cc

Markleft is available for use under the MIT software license.
