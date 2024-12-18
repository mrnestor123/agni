
export {localize, loadScript}

function localize(localized, lang = 'es') {



    if (!localized) return '';
    if (typeof localized == 'string' || typeof localized == 'number') return localized
    if (typeof localized != 'object') return 'ERR translation:'+typeof localized; //???
    
    return localized[lang] || localized['va']
   /* if (Object.entries(localized).length === 0) return  '';  //???

    if (lang===null && Page && Page.lang) lang=Page.lang
    // else if (lang===null && localStorage.lang) lang =  localStorage.lang;

    if (lang === 'va' && !localized[lang]) lang = 'ca'; // va === ca
    else if (lang === 'ca' && !localized[lang]) lang = 'va'; // va === ca

    var resp = localized[lang] || localized['und'] || Object.values(localized)[0] || '';

    //console.log(resp, lang,localized)

    // hay veces que devuelve un objeto ?????
    if (typeof resp === 'string') return resp;
    return 'ERR translation';*/
}



function loadScript(url) {
    if (typeof loadScript.p === "undefined") loadScript.p = {}
    if (loadScript.p[url]) return loadScript.p[url];
  
    loadScript.p[url] = new Promise(function(resolve, reject) {
        var id = url.substring(url.lastIndexOf('/') + 1)
  
        // Ya estaba cargada
        if (!document.getElementById(id)) {
            var head = document.getElementsByTagName('head')[0]
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.id = id
            script.src = url
            script.addEventListener('load', resolve);
            script.addEventListener('error', e => reject(e.error));
            head.appendChild(script)
        }
    })
    return loadScript.p[url];
  }
