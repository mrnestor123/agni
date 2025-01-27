import { Button, Card, Icon, Img, Input, Animation, Section, Divider } from "./components/elements.js"
import { Box, Container, Div, FlexCol, FlexRow,  Grid,  Tappable } from "./components/layout.js"
import { H1, H2,  SmallText, Text } from "./components/texts.js"
import { localize } from "./components/util.js";
import { theme } from "./theme.js";

/*
*
*  TO DO: 
* 1. Mobile phone resize
* 2. Navbar color change on scroll
* 3. Calendar with events
* 4. Services
* 5. Room
*/

let pages = [


]


function LandingPage(){

  let mainpage = true;
  let isMobile = false;

  let currentRoute = ''


   
  window.onresize = (e)=>{
    let last = isMobile;
    
    if(window.innerWidth < 800){
      isMobile = true
    } else {
      isMobile = false
    }

    if(last != isMobile)  m.redraw()
  }

  window.onscroll = (e)=>{
    let height = document.getElementById('image').offsetHeight

    let navbar = document.getElementById('navbar')
    if(window.scrollY > height){
      navbar.style.background = '#d7a971'
      navbar.style.color = 'black'
    } else {
      navbar.style.background = '#ffffff5c'
      navbar.style.color = 'white'
    }

  }

  function ImageTransition(){
    let clicked = false

    return {
      view:(vnode)=>{
        return [
          m(Div,{zIndex:1000, id:'image'},
            m(Img,{
              src:'./assets/agni_blanco.png', id:'agni',
              borderRadius:'50%', height:'auto', zIndex:10,
              width: isMobile ? '40%' : '60%', height:'auto', objectFit:'cover',
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)'
            }),

            m(Button,{
              type:'primary',
              position:'absolute',bottom:'20px', left:'50%', zIndex:'10',
              transform:'translateX(-50%)', //borderRadius:'50%',
              padding:'1em', //height:'60px',width:'60px',
              onclick:(e)=>{
                // scroll to home
                document.getElementById('home').scrollIntoView({behavior: "smooth", block: "start", inline: "end"});
              }
            }, 
              m(Text,{color:'white'},localize({es:"Empezar", va:"Començar"}).toUpperCase())
            ), 
              

            m(Div,{width:'100vw',height:'100vh',inset:0, background:'black', objectFit:'cover', id:'background', position:'relative'},
              m(Img, {
                src:"./assets/puertas.png", 
                width:'100%',height:'100%',objectFit:'cover',position:'absolute', inset:0
              }),
              m(Div,{opacity:0.4, background:'black', width:'100%', height:'100%', position:'absolute', inset:0})
            )
          )
        ]
      }
    }
  }

  return {  
    view: (vnode) =>{
      return m(FlexCol,

        m(NavBar),
        m(ImageTransition),

        m(Div,{flex:1, background:'#f7f7f7' },
          m(Container,{ zIndex:1000, id:'home' }, [
            m(Box, {height:'2em'}),
            m(Home),
            m(Divider),
            m(Services),
            m(ContactModal),
            m(Room),
            
          ]),

          /*m(Div, {position:'absolute', inset: 0, background:'black', opacity:0.4, zIndex:10},
            m(Box, {height:'12em'}),
            m(H1, "TEST")

          )*/
        )

      )
    }  
  }

  function NavBar(){

    let isMobile;
    let openMenu = false


    function Menu(){

      return {
        view: (vnode)=>{
          return [
            m(MenuItem,{route:''}, localize({va:'Inicio', es:'Inici'}).toUpperCase()),
            m(MenuItem,{route:'services'}, localize({va:'Servicios', es:'Serveis'}).toUpperCase()),
            m(MenuItem,{route:'gallery'}, localize({va:'Tallers', es:'Tallers'}).toUpperCase()),
            m(MenuItem,{route:'room'}, localize({es:"La sala", va:"La sala"}).toUpperCase()),
            m(MenuItem,{route:'contact'}, localize({va:'Contacto', es:'Contacte'}).toUpperCase()),
          ]
        }
      }


      function MenuItem(){
        return {
          view:(vnode)=>{
            let {route}= vnode.attrs
  
            return m(Div,{ 
              textAlign: isMobile ? 'right': 'center',
              borderRadius:'1em', color:'black'
            },
              m(Tappable,{
                onclick:(e)=>{
                  currentRoute = route
                  let element = document.getElementById(route)
                  element.scrollIntoView({behavior: "smooth", block: "start", inline: "end"});
                  m.redraw()
                },
                hover: {
                  borderRadius:'1em',
                  background: theme.maincolor,
                  color: 'white',
                },
              },
                m(Text,{
                  padding:'0.5em 1em', 
                  //border: currentRoute==route ? `1px solid ${theme.maincolor}`:'',
                  letterSpacing:'2px'
                }, vnode.children)
              )
            )
          }
        }
      }
    }

    return {
      view:(vnode)=>{
        isMobile = window.innerWidth < 1000

        return [
          m(Div,{
            background:'#ffffff5c', zIndex:10040,   width:'100vw',
            backdropFilter:'blur(10px)', position:'fixed', top:0, left:0, 
            color:'white',  padding:'1em', transition: "background 1s", 
            id: 'navbar'
          }, 
            m(FlexRow,{
              justifyContent:'space-between', alignItems:'center', 
              width: isMobile ?'90%':'100%', margin:'0 auto'
            },
              m(Img, { 
                src:'./assets/agni_blanco.png',
                width: isMobile ? '30%' : '80px', 
                height:'auto', 
                objectFit:'contain'
              }),

              m(Box,{ width:'1em' }),

              isMobile ?
              m(Icon,{
                icon: openMenu ? 'close' : 'menu', size:'big', color:'black', 
                onclick:(e)=>{
                  e.preventDefault()
                  openMenu = !openMenu
                  m.redraw()
                }
              }) : 
              [
                m(FlexRow,{gap:'1em', alignItems:'center', justifyContent:'space-around', flex:1},
                  m(Menu)
                ) 
              ]
            ),

            isMobile && 
            m(FlexCol,{
              transition: 'max-height 0.2s ease-in-out',
              maxHeight: openMenu ? '300px':'0px',
              overflow:'hidden'
            }, m(Menu))
          )
        ]
      }
    }
  }


  function Home(){

    let texts = [
      {
        title:'¿Quienes somos?',
        description:'Espacio Agni es un centro de yoga y meditación en el que se imparten clases de yoga y meditación en un entorno tranquilo y relajado. Nuestro objetivo es que puedas encontrar un espacio de paz y tranquilidad en el que puedas desconectar del estrés diario y conectar contigo mismo.',
        src: ''
      },
  
      {
        title:'¿Qué es el yoga?',
        description:'El yoga es una disciplina milenaria que combina posturas físicas, pranayamas y más'
      },
  
      {
        title: '¿Qué es la meditación?',
        description:'La meditación es una práctica milenaria que consiste en concentrar la mente en un objeto o pensamiento con el fin de alcanzar un estado de paz y tranquilidad. La meditación es una práctica milenaria que consiste en concentrar la mente en un objeto o pensamiento con el fin de alcanzar un estado de paz y tranquilidad.',
      }
  
    ]
  

    function Calendar(){
      let month = 0;
      
      let months = [
        {es:'Enero', va:'Gener'},
        {es:'Febrero', va:'Febrer'},
        {es:'Marzo', va:'Març'},
        {es:'Abril', va:'Abril'},
        {es:'Mayo', va:'Maig'},
        {es:'Junio', va:'Juny'},
        {es:'Julio', va:'Juliol'},
        {es:'Agosto', va:'Agost'},
        {es:'Septiembre', va:'Setembre'},
        {es:'Octubre', va:'Octubre'},
        {es:'Noviembre', va:'Novembre'},
        {es:'Diciembre', va:'Desembre'},
      ]

      let days = []

      function getMonthsDays(){

        console.log('DAYS', month, days)

        
        let year = new Date().getFullYear()
        let date = new Date(year, month, 1)
        let lastDay = new Date(year, month+1, 0).getDate()
        let firstDay = date.getDay()
        days = []

        for(let i = 0; i < firstDay; i++){
          days.push('')
        }

        for(let i = 1; i <= lastDay; i++){
          days.push(i)
        }

      }


      return {
        oninit:()=> getMonthsDays(),
        view:(vnode)=>{
          return m(FlexCol,
            m(FlexRow,{alignItems:'center', justifyContent:'space-between'},
              m(H2,{marginBottom:0}, months[month].es),
              m(FlexRow,
                m(Icon,{icon:'chevron_left', color:month == 0 ? 'grey': 'black', size:'big', onclick:(e)=> month>0 && month-- && getMonthsDays()}),
                m(Icon,{icon:'chevron_right',  color:month == 11 ? 'grey': 'black',  size:'big',  onclick:(e)=> month<11 && month++ && getMonthsDays()}),
              )
            ),
            
            m(Grid, {
              columns: 7,
              gap:'0.2em',
            },

              ['L','M','X','J','V','S','D'].map((day)=>{
                return m(Text,{ textAlign:'center' }, day)
              }),

              days.map((day)=>{
                return m(Div,{
                  borderRadius:'0.5em',
                  aspectRatio : 1,
                  border: `3px solid ${theme.maincolor}`,
                  padding:'0.5em',
                },
                  m(Text,day)
                )
              })
            )
          )
        }
      }
    }

    return {
      view:(vnode)=>{
        return [
          m(Section,{
            title: localize({
              es:'Bienvenido a Agni',
              va:'Benvingut a agni'
            }),
            description : localize({
              es:'Un espacio para la práctica de yoga y meditación en un entorno tranquilo',
              va:'Un espai per a la pràctica de ioga i meditació en un entorn tranquil'
            }),
          },

          m(Calendar)

          )
        ]
      }
    }
  }
  
  
  function Room(){
  
    return{
      view:(vnode)=>{
        return m(Section,{
          id:'room',
          title: localize({es:'La sala', va:'La sala'}),
        },
        

        )
      }
    }
  }
  
  function ContactModal(){
  
    return {
      view:(vnode)=>{
        return [
          m(Section,{
            title: localize({es:'Contacto', va:'Contacte'}),
            padding:'1em', margin:'1em', width:'50vw', border:'1px solid lightgrey', id:'contact'
          },
            m(FlexCol,
              //  CONTACT  FORM INPUTS WITH LANGUAGE IN VALENCIAN  AND SPANISH
              m(H1, localize({va:'Contacta con nosotros', es:'Contacta amb nosaltres'})),
              m(Text,{color:'black'}, 
                  localize({es:'Rellena el formulario con tus dudas y nos pondremos en contacto contigo', va:'Omple el formulari amb els teus dubtes i ens posarem en contacte amb tu'})),
              m(Div,{height:'10px'}),
              m(FlexCol,{gap:'0.5em'},
                m(Input,{
                  label: {es:'Nombre y apellidos', va:'Nom i cognoms'},
                  placeholder:localize({es:'Nombre y apellidos', va:'Nom i cognoms'}),
                  type:'text'
                }),
                
                m(Input,{
                  label: {es:'Correo electrónico', va:'Correu electrònic'},
                  placeholder:localize({es:'Correo electrónico', va:'Correu electrònic'}),
                  type:'email'
                }),
                
                m(Input,{
                  label: {es:'Mensaje', va:'Missatge'},
                  placeholder:localize({es:'Mensaje', va:'Missatge'}),
                  
                  type:'textarea',
                  rows:5,
                }),
  
                m(Button,{type:'primary', fluid:true}, localize({es:'Enviar', va:'Enviar'}))
  
              )
            )  
  
          )
        ]
      }
    }
  }
  
  function Services(){
  
    let items = [
      {
        photo:'./assets/meditation.jpg',
        title: 'Yoga',
        description:'Estiraments per a fortaleir el cos',
        time: 'Dimarts i dijous de  18:00 a 19:30 i 19:30 a 21:00, Dilluns de 10:00 a 11:30 '
      },
      {
        photo:'./assets/meditation.jpg',
        title: 'Meditació Mindfulness',
        description: 'Clases de meditació semanals per a entendre ment i cos',
        time: 'Dimecres de 19:30 a 21:00'
      },
      {
        photo:'./assets/meditation.jpg',
        title: 'Meditació i Sanació energètica',
        description: 'Clases de meditació semanals per a entendre ment i cos',
        time: 'Dimecres de 19:30 a 21:00'
      },

      {
        photo:'./assets/group.jpg',
        title: 'Psicología ',
        description:'Sesions individuals i grupals de psicologia'
      },
      
      {
        photo:'./assets/group.jpg',
        title: 'Tallers de fin de semana',
        description:'Tallers de fin de setmana de meditació, profundizació, yoga',
        time: 'Dimecres de 19:30 a 21:00'
      },
    ]
  
    function BeautifulCard(){
  
      return {
        view:(vnode)=>{
          let {item, reverse = false} = vnode.attrs
  
          return m(Div,{
            borderRadius:'1em',
            background:'white',
            color:'white',
            border:'1px solid grey',
            padding:'1em',
            height:'20vh',
            boxShadow:'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;' 
          },
            m(FlexRow,{alignItems:'center', flexDirection: reverse ? 'row-reverse' : 'row' },
              m(Img,{src:item.image, borderRadius:'1em',width:'15%', height:'auto', objectFit:'contain'}),
              m(FlexCol,{width:'80vw'},
                m(H2, item.title),
                m(Text, item.description),
                m(SmallText, item.time)
              )
            )
          )
        }
      }
    }
  
  
    return {
  
      view: (vnode)=> {
        return [
          m(Section,{id:'services'},
            m(FlexCol,
              m(H1, "Els nostres serveis"),
              m(Box,{height:'10px'}),
              m(FlexRow,{ gap:'1em', justifyContent:'space-between', flexGrow:1, flexWrap: 'wrap' },
                items.map((item,i)=>{
                  return m(Card,{
                    ...item
                  })
                })
              )
            )
          )
        ]
      }
    }
  }
  
}




function DoYouWant(){

  let sliderImage = './assets/k47.png'

  return {
    view:(vnode)=>{

      return m(Div,{id:'doyouwant', height:'100vh', width:'100vw', padding:'1em', position:'relative' },

        m(Img,{ src:  sliderImage, position:'absolute',inset:0, height:'100vh',width:'100vw', objectFit:'cover'}),
        m(FlexCol,{justifyContent:'center',alignItems:'center', height:'100vh', zIndex:10},
        m(FlexCol,{alignItems:'center', justifyContent:'center', width:'60vh', gap:'20px'},

          m(H1,{textAlign:'center',zIndex:10, fontSize:'3em'}, localize({
            va:"¿Quieres aliviar la ansiedad, calmar el estrés, conectar con una parte más profunda de ti?",
            es: "¿Vols aliviar la ansietat, calmar l'estrés o conectar en una part més profunda de tu?"
          })),
          
          m(FlexCol,{paddingLeft:'3em',paddingRight:'2em', gap:'20px',width:'100%'},
            m(Button, {
              fluid:true,
              type:'primary', 
              onclick:(e)=> contactModal = true
            }, m(H2,{color:'white'},"Si, me interesa")),

            m(Button,{
                type:'secondary', 
                fluid:true,
                onclick:(e)=>{
                  let element = document.getElementById('whoweare')
                  element.scrollIntoView({behavior: "smooth", block: "start", inline: "end"});
                }
              }, m(H2,"Saber Més")
            )
          )
        ))
      )
    }
  }

}



export {LandingPage}