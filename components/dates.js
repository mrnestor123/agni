
// funciones de dates

// CALENDARIOS REUTILIZABLES !!!

export {diatoString, hora, minuto, dia, getWeekDays, meses}

//utilizar monthlabel!
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

const meses = {
    "und": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    "es": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    "va": ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    "ca": ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "eu":["Urtarrila","Febrero","Martxo","Apiril","Maiatz","Ekain","Uztail","Abuztu","Irail","Urri","Azaro","Abendu"]
}