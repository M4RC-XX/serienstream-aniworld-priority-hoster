// ==UserScript==
// @name         SerienStream / AniWorld - Priority Hoster
// @description  Adds a number behind the best hosts, with the best JDownloader compatibility (descending)
// @namespace    https://github.com/M4RC-XX
// @version      1.0
// @author       M4RC-XX
// @icon            https://s.to/favicon-32x32.png
// @match        https://*.to/*/stream/*/staffel-*/episode-*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Liste der zu ersetzenden Wörter und ihrer Ergänzungen
    const replacements = [
        { word: "Vidmoly", addition: " (1)" },
        { word: "VOE", addition: " (2)" },
        { word: "Vidoza", addition: " (3)" },
        { word: "SpeedFiles", addition: " (4)" },
    ];

    // Finde alle Textknoten im Dokument
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    let node;
    while ((node = walk.nextNode())) {
        // Iteriere durch die Liste und ersetze Wörter
        replacements.forEach(({ word, addition }) => {
            const regex = new RegExp(`\\b${word}\\b`, 'g'); // Genaues Wort finden
            node.nodeValue = node.nodeValue.replace(regex, `${word}${addition}`);
        });
    }
})();
