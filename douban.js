(function() {
    'use strict';

    const removeStatus = function() {
        var statusCollection = document.querySelectorAll('div .new-status:not(.saying)')
        const excludeSubstring = ["听过", "想听", "想看", "想读", "想玩", "玩过"]
        statusCollection.forEach((status) => {
            if (excludeSubstring.some(substring => status.textContent.includes(substring))) {
                status.parentElement.removeChild(status)
            }
        })
    }

    const removeAsideAds = function() {
        // remove everything except the friend from aside
        const friend = document.querySelectorAll('div .aside #friend')
        const aside = document.querySelectorAll('div .aside')[0].childNodes
        aside.forEach((a) => {
            if (a.id != "friend") {
                console.log(a)
                a.parentElement.removeChild(a)
            }
        })
    }


    const run = function() {
        removeStatus()
        removeAsideAds()
        setTimeout(removeAsideAds, 2000)
    }
    run()

})();