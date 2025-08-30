
export {localize, loadScript, diatoString, hora, minuto, dia, getWeekDays, meses, monthLabel, Page}

let Page = {
    lang: 'va'
}


function localize(localized, lang = Page.lang) {



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


  function diatoString(day, language ='es', showYear=true) {
  
    let date = new Date(day);  
    return date.getDate() + '   ' + meses[language][date.getMonth()] + ' ' + (showYear == undefined || showYear ? date.getFullYear() : '')
}


const hora = (f) => new Date(f).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone:'Europe/Madrid'})
const minuto = (f) => (String)(new Date(f).toLocaleTimeString('es-ES', { minute: '2-digit', timeZone:'Europe/Madrid'}))
const dia = (f) => new Date(f).toLocaleDateString('es-ES')


let dias =[
    {es:'Domingo',va:'Diumenge', eu:"Igande" },
    {es:'Lunes',va:'Dilluns',eu:"Astelehen"},
    {es:'Martes',va:'Dimarts', eu:"Astearte" },
    {es:'Miércoles',va:'Dimecres',eu:"Asteazken" },
    {es:'Jueves',va:'Dijous', eu:"Ostegun" },
    {es:'Viernes',va:'Divendres', eu:"Ostiral"  },
    {es:'Sábado',va:'Dissabte',eu:"Larunbat"}
]


const getWeekDays = ()=>{
    return dias
}

const monthLabel = (date, language = 'es') => {
    return meses[language][date.getMonth()];
}

const meses = {
    "und": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    "es": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    "va": ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    "ca": ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "eu":["Urtarrila","Febrero","Martxo","Apiril","Maiatz","Ekain","Uztail","Abuztu","Irail","Urri","Azaro","Abendu"]
}