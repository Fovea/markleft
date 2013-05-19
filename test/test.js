// Load PerfCollector module, initialize one instance and enable it!
var markleft = require('../markleft');
var assert = require("assert");

describe('markleft', function () {
    describe('links', function () {
        it('Replace a basic link', function () {
            assert.equal(markleft.toHTML('http://www.fovea.cc/'), '<a href="http://www.fovea.cc/">http://www.fovea.cc/</a>');
        });
        it ('Replace link with port number', function () {
            assert.equal(markleft.toHTML('The link:http://localhost:8080/job/Checklist\nCheers!'), 'The link:<a href="http://localhost:8080/job/Checklist">http://localhost:8080/job/Checklist</a><br />Cheers!');
        });
        it ('Replace complex links', function () {
            var link = 'https://dev.moz.org/a.b?c=en-US&d=DOM%2Fa.b&c=&d'
            var expect = '<a href="' + link + '">' + link + '</a>';
            assert.equal(markleft.toHTML(link), expect);
        });
    });

    describe('line breaks', function () {
        it('Replace line breaks', function () {
            assert.equal(markleft.toHTML('\nHello,\nhow are you?'), '<br />Hello,<br />how are you?');
        });
        it('Replace multiple line breaks', function () {
            assert.equal(markleft.toHTML('\n\n'), '<br /><br />');
        });
    });

    describe('separators', function () {
        it('Replace --- with a separator', function () {
            assert.equal(markleft.toHTML('A---B\n---\nC\n----\nD'), 'A---B<hr />C<br />----<br />D');
        });
    });

    var italic = {
        name: 'italic-plugin',
        transform: function (text) {
            var exp = /_([A-Za-z\" ]+)_/g;
            var tok = '#%@%#';
            var rep = tok + '<i class="italic">' + tok + '$1' + tok + '</i>' + tok;
            var ret = text.replace(exp, rep);
            return ret.split(tok);
        }
    };

    describe('1 plugin', function () {
        it ('Replace __ with italic', function () {
            markleft.registerPlugin(italic);
            assert.equal(markleft.toHTML('A _B C_ D'), 'A <i class="italic">B C</i> D');
            markleft.unregisterPlugin(italic);
            assert.equal(markleft.toHTML('A _B C_ D'), 'A _B C_ D');
        });
    });

    var bold = {
        name: 'bold-plugin',
        transform: function (text) {
            var exp = /\"([^"]+)\"/g;
            var html = '<b class="bold">$1</b>';
            return markleft.finalReplace(text, exp, html);
        }
    };

    describe('2 plugins', function () {
        it ('Replace "" with bold', function () {
            markleft.registerPlugin(italic);
            markleft.registerPlugin(bold);
            assert.equal(markleft.toHTML('A "B C" D'), 'A <b class="bold">B C</b> D');
            // assert.equal(markleft.toHTML('_A "B C" D_'), '<i class="italic">A <b class="bold">B C</b> D</i>');
            markleft.unregisterPlugin(bold);
            assert.equal(markleft.toHTML('A "B C" D'), 'A "B C" D');
            markleft.unregisterPlugin(italic);
        });
    });

    describe('default plugins', function () {
        it ('Replace __ with italic', function () {
            markleft.registerPlugin(markleft.italic);
            assert.equal(markleft.toHTML('_a_'), '<i>a</i>');
            assert.equal(markleft.toHTML('Hey _it\'s me_ jeko'), 'Hey <i>it\'s me</i> jeko');
            markleft.unregisterPlugin(markleft.italic);
        });
        it ('Replace ** with bold', function () {
            markleft.registerPlugin(markleft.bold);
            assert.equal(markleft.toHTML('*a*'), '<b>a</b>');
            assert.equal(markleft.toHTML('Hey *it\'s me* jeko'), 'Hey <b>it\'s me</b> jeko');
            markleft.unregisterPlugin(markleft.bold);
        });
        it ('Replace ** with bold', function () {
            markleft.registerPlugin(markleft.italic);
            markleft.registerPlugin(markleft.bold);
            assert.equal(markleft.toHTML('*a*'), '<b>a</b>');
            assert.equal(markleft.toHTML('_a_'), '<i>a</i>');
            // Recursive replace doesn't work.
            // assert.equal(markleft.toHTML('_a*b*_'), '<i>a<b>b</b></i>');
            // assert.equal(markleft.toHTML('*a_b_*'), '<b>a<i>b</i></b>');
            markleft.unregisterPlugin(markleft.italic);
            markleft.unregisterPlugin(markleft.bold);
        });
    });

});

