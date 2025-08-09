// ==UserScript==
// @name         SerienStream / AniWorld - Priority Hoster
// @description  Fügt einen Kommentar zu jedem Hoster hinzu mit Infos über die Kompatibilität zum Downloaden mit JDownloader 2
// @namespace    https://github.com/M4RC-XX
// @version      2.6.3
// @author       M4RC-XX
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABhlBMVEU9mtgpaJI3jcY+nd0oZpA7l9Q4jcY+nd1Ao+VApOZDq/BErvRErfRErfNErPJDrPFDq/FErPFDqu9Dqu5Cqe1CqOxApuo/pelBpulCp+pCqOtCp+lltuxvuuxHpuU+ouVApOdot+vp9Pz3+/6/3/VqteY/oOE+oeNDqe49o+eEw+3+///////v9/yn0u9Yq+I9nuA/ouRBpedBp+o9oeWEwuvh8PmPxupLpOA8n+FBpehCp+tDq+88oOOEwer8/f7P5vZ4uuZDoeA9oONBpOc8oOKEwen2+v252/JkseU/oeI/pOc8n+KDwOns9fuh0PBVredApejS6flWr+pBp+v1+v5rue0/puvx+P2k0/JJqelBqOv5/P7C4PRtt+hCpOb9/v/X6veBwOlGo+I9ouQ9oeTn8/qZy+1Qp+E9n+JAo+Y9ouaEw+zz+f2x1/FeruM+n+A+pOiAwu76/f7I4/ZyuOdBoeFBpupAp+rB4ffT6vmJxe5JpuQ9oeNIqepKqelErPNAo+TKoRPCAAAACHRSTlMAJJ/uJL6f7T8zcWUAAAABYktHRCy63XGrAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH4gcKACUid1a9XgAAAZtJREFUOMuF0+VbwzAQBvCyIV06KmkCXXFdgaDDN3y4juHu7u7yn5NutGsHlPt6v6dy9x7DpLjcrOfXYt2uFIZJTQMc5/21OA6kpTLpINOhQDqTwTkBLoNhDcDHKwmwjMdr9AUAgCjYiddjAF4CUEZIhsBGTED7Ms7KVnwqkq0kAUQZ5+Tm5RcUKiqCQDKICSSAsouKS0rLyv2UaFD8FgbgBahWVFYRUl1TW1ffEMD6e+xA9jU2UUBIc0trG9seRKGYMIGoKR2dMUC6unt6+8K+uDABQEr/QBwQMjg0PDIa1EASGBs3ACETk1MRDCX+T0DIdHQGCk5gdm5epoD7CywsLi07PGFldW1dQcD6DSIyf5NsbG5t7yiYTtM6BzmwGx8U2ds/ODxS6Cx53jbJ4PGJDk7Pzi/q2310YbxtkhLEl1cb5Prm9s4fvsfmyhPrBtpD9PHp+eXV873v5DwIEAXe3kcjsXYiMSb4oELDyypG9sxZMkkzG4IwZI+kDozY08RLtJJyT2NvOZwfVxE7nH9Oz/X/8Tqc/6d+/l/0fV9tB8ubWAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNy0xMFQwMDozNzozNCswMjowMKVVr8QAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDctMTBUMDA6Mzc6MzQrMDI6MDDUCBd4AAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @match        https://*.to/*/stream/*/staffel-*/episode-*
// @grant        none
// @license      CC BY 4.0
// ==/UserScript==

(function() {
    'use strict';

    const hosterAnpassungen = {
        "Vidmoly": {
            buttonText: "🟡",
            hoverText: "Temporäre Probleme\nAnti-Bot-Erkennung!"
        },
        "Vidoza": {
            buttonText: "✅ 1st",
            hoverText: "Absolut perfekt!!"
        },
        "VOE": {
            buttonText: "✅ 2nd",
            hoverText: "Manchmal Probleme den Link zu finden!\nDateigröße erst beim Download bekannt"
        },
        "Doodstream": {
            buttonText: "✅ 3rd",
            hoverText: "Manchmal Probleme den Link zu finden!\nDateigröße erst beim Download bekannt\nGeringe Downloadgeschwindigkeit"
        },
        "Filemoon": {
            buttonText: "🟡",
            hoverText: "Kein Dateiname!"
        },
        "LoadX": {
            buttonText: "❌",
            hoverText: "Captcha!"
        },
    };

    function anpassenDerButtons() {
        const alleListeneintraege = document.querySelectorAll('li[data-link-id]');

        alleListeneintraege.forEach(eintrag => {
            if (eintrag.dataset.processed) {
                return;
            }

            const hosterIcon = eintrag.querySelector('i[title^="Hoster "]');
            if (hosterIcon) {
                const hosterName = hosterIcon.title.substring('Hoster '.length);
                const defektButton = eintrag.querySelector('.reportVideoStream');

                if (defektButton) {
                    if (hosterAnpassungen.hasOwnProperty(hosterName)) {
                        const anpassung = hosterAnpassungen[hosterName];
                        defektButton.textContent = anpassung.buttonText;

                        const geklonterButton = defektButton.cloneNode(true);
                        
                        const currentFontSize = window.getComputedStyle(defektButton).fontSize;
                        const newSize = parseFloat(currentFontSize) + 2;
                        geklonterButton.style.fontSize = `${newSize}px`;

                        defektButton.parentNode.replaceChild(geklonterButton, defektButton);

                        geklonterButton.setAttribute('title', anpassung.hoverText);
                        geklonterButton.style.cursor = 'pointer';

                    } else {
                        defektButton.parentElement.remove();
                    }
                    eintrag.dataset.processed = 'true';
                }
            }
        });
    }

    const observerCallback = (mutationsList, observer) => {
        observer.disconnect();
        anpassenDerButtons();
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const observer = new MutationObserver(observerCallback);
    anpassenDerButtons();
    observer.observe(document.body, { childList: true, subtree: true });

})();
