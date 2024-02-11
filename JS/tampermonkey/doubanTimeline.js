// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-02-04
// @description  try to take over the world!
// @author       You
// @match        https://www.douban.com/
// @match        https://www.douban.com/?p*
// @match        https://www.douban.com/people/*/statuses*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // remove certain type of status
    const removeStatus = function() {
        const excludeTypes = ["听过", "想听", "想看", "想读", "在读",
                            "想玩", "玩过", "在玩", "收藏", "转发"]
        const excludeUsers = ["おやすみ"] 
        var excludeSubstring = [].concat(excludeTypes, excludeUsers)
        // var statusCollection = document.querySelectorAll('div .new-status:not(.saying)')
        var statusCollection = document.querySelectorAll('div .new-status')

        statusCollection.forEach((status) => {
            var prefix = status.innerText.slice(0, 20)
            // delete status whose innerText contains any keyword from excludeSubstring
            if (excludeSubstring.some(substring => prefix.includes(substring))) {
                status.parentElement.removeChild(status)
            }
        })
    }

    // remove everything except the friend list from aside
    const removeAsideAds = function() {
        const aside = document.querySelectorAll('div .aside')[0].childNodes
        aside.forEach((a) => {
            if (a.id != "friend") {
                a.parentElement.removeChild(a)
            }
        })
    }   

    const run = function() {
        removeStatus()
        // removeAsideAds()
        setTimeout(removeAsideAds, 1500)
    }
    run()

})();