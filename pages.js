import { Button, Card, Icon, Img, Input, Animation, Divider } from "./components/elements.js"
import { Box, Container, Div, FlexCol, FlexRow,  Tappable } from "./components/layout.js"
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


// Referencia al IntersectionObserver para esta instancia de LandingPage
let instanceScrollObserver = null;

// --- Intersection Observer Logic ---

// La función callback que se ejecuta cuando un elemento observado cruza el umbral
const intersectionCallback = (entries, observer) => {
  entries.forEach(entry => {
    // Si el elemento está ahora intersectando (visible)
    if (entry.isIntersecting) {
        const element = entry.target;
        // Obtenemos la clase de animación que guardamos en data-*
        const animationClass = element.dataset.scrollAnimation || 'animate-fadeInUp'; // Usar un default
        // Añadimos la clase para iniciar la animación CSS
        element.classList.add(animationClass);
        // Opcional: añadir una clase 'visible' para otros estilos si es necesario
        element.classList.add('is-visible');

        // Dejamos de observar este elemento una vez que se ha animado
        observer.unobserve(element);
    }
  });
};

// Función para obtener o crear el observer (se llama la primera vez que se necesita)
const getObserver = () => {
  if (!instanceScrollObserver) {
      // Configuración del observer
      const options = {
          root: null, // null significa que el root es el viewport del navegador
          rootMargin: '0px', // Margen adicional alrededor del root
          threshold: 0.1 // Porcentaje de visibilidad (0.1 = 10%) para disparar el callback
      };
      instanceScrollObserver = new IntersectionObserver(intersectionCallback, options);
      console.log("IntersectionObserver created");
  }
  return instanceScrollObserver;
};

// --- Helper Functions para Componentes Hijos ---
// Estas funciones serán accesibles por los componentes definidos DENTRO de LandingPage

/**
 * Pide al IntersectionObserver que vigile un elemento DOM.
 * @param {Vnode} vnode El Vnode cuyo DOM element será observado.
 * @param {string} [animationClass='animate-fadeInUp'] La clase CSS de animación a aplicar.
 */
const observeElementForAnimation = (vnode, animationClass = 'animate-fadeInUp') => {
    const observer = getObserver(); // Obtiene/crea el observer
    const element = vnode.dom; // El elemento DOM real
    if (element && observer) {
        // Guardamos la clase de animación deseada en un atributo data-*
        // para que el callback sepa qué clase añadir.
        element.dataset.scrollAnimation = animationClass;
        // Empezamos a observar el elemento
        observer.observe(element);
    }
};

/**
 * Pide al IntersectionObserver que deje de vigilar un elemento DOM.
 * Importante para la limpieza cuando el elemento se elimina.
 * @param {Vnode} vnode El Vnode cuyo DOM element debe dejar de ser observado.
 */
const unobserveElement = (vnode) => {
  const observer = instanceScrollObserver; // Usa el observer existente si ya fue creado
  const element = vnode.dom;
  // Solo intentamos desobservar si el observer y el elemento existen
  if (element && observer) {
      observer.unobserve(element);
  }
};





function LandingPage(){

  let mainpage = true;
  let isMobile = false;

  let currentRoute = ''


  

   
  window.onresize = (e)=>{
    let last = isMobile;
    
    if(window.innerWidth < 600){
      isMobile = true
    } else {
      isMobile = false
    }

    if(last != isMobile)  m.redraw()
  }

  window.onscroll = (e)=>{
    let height = document.getElementById('image').offsetHeight

    let navbar = document.getElementById('navbar')

    if(window.scrollY >= height){
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

            m(FlexCol, { justifyContent:'center', position:'absolute', bottom:'10px', width:'100vw', alignItems:'center', zIndex:10},
              m(Img,{
                  src:'./assets/agni_blanco.png', id:'agni',
                  borderRadius:'50%', height:'auto', zIndex:10,
                  width: isMobile ? '80%' : '60%', height:'auto', objectFit:'cover',
                  
                  

                  oncreate: (vnode) => {
                    vnode.dom.classList.add('animate-fadeInUp');
                    vnode.dom.style.animationDelay = '0.5s'; // Retraso mayor
                  }
                },
              ),
              

              
              m(Button,{
                  type:'primary',
                  zIndex:'10',
                  transform:'translateX(-50%)', //borderRadius:'50%',
                  padding:'1em', //height:'60px',width:'60px',
                  onclick:(e)=>{
                    // scroll to home
                    document.getElementById('home').scrollIntoView({behavior: "smooth", block: "start", inline: "end"});
                  },
                  oncreate: (vnode) => {
                    vnode.dom.classList.add('animate-fadeInUp');
                    vnode.dom.style.animationDelay = '1s'; // Retraso mayor
                    console.log('oncreate')
                  }
                }, 
                m(Text,{color:'white'},localize({es:"Empezar", va:"Començar"}).toUpperCase())
              ), 
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
      return  m(FlexCol,

        m(NavBar),
        m(ImageTransition),

        m(Div,{flex:1, background:'#f7f7f7' },
          m(Container,{ zIndex:1000, id:'home' }, [
            m(Box, {height:'2em'}),
            m(Div, { id: 'home' }, m(Home)),
            m(Divider),
            // Contenedor para Services con ID
            m(Div, { id: 'services' }, m(Services)),
            // Contenedor para Contact con ID (envuelve el modal o su disparador)
            // Quizás quieras un ID en la sección que *contiene* el modal
            m(Div, { id: 'contact' }, m(ContactModal)),
             // Contenedor para Room con ID
            m(Div, { id: 'room' }, m(Room)),
            
          ]),

        )

      )
    }  
  }

  

  //  TODO: Mobile  phone resize
  function NavBar(){

    let openMenu = false


    function Menu(){

      return {
        view: (vnode)=>{
          return [
            m(MenuItem,{route:''}, localize({va:'Inicio', es:'Inici'})),
            m(MenuItem,{route:'services'}, localize({va:'Servicios', es:'Serveis'})),
            m(MenuItem,{route:'gallery'}, localize({va:'Tallers', es:'Tallers'})),
            m(MenuItem,{route:'room'}, localize({es:"La sala", va:"La sala"})),
            m(MenuItem,{route:'contact'}, localize({va:'Contacto', es:'Contacte'})),
          ]
        }
      }


      function MenuItem(){
        return {
          view:(vnode)=>{
            let {route}= vnode.attrs
  
            return m(Tappable,{
              onclick:(e)=>{
                console.log("Navegar a:", route);
                const targetId = route === '' ? 'home' : route; // Mapea la ruta al ID del elemento
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              },
              /*onclick:(e)=>{
                currentRoute = route
                m.redraw()
              },*/
              hover: {
                background: theme.maincolor,
                borderRadius:'1em',
                color: 'white',
              },
              onmouseup: {
                filter: "brightness(100%)"
              },
              onmousedown : {
                filter: "brightness(80%)",
              }
            },
              m(Div,{ 
                textAlign: isMobile ? 'right': 'center',
                borderRadius:'1em',
                padding:'1em'
              },
                m(Text,{
                  lineHeight:'1.2em',
                  letterSpacing:'2px',
                  'user-select':'none'
                }, vnode.children )
              )
            )
          }
        }
      }
    }
  
    return {
      view:(vnode)=>{

        return [
          m(Div,{
            id:'navbar',
            background:'#ffffff5c', zIndex:10040,   width:'100vw', transition:'0.5s background',
            backdropFilter:'blur(10px)', position:'fixed', top:0, left:0, 
            color:'white',  padding:'1em',
          }, 
            m(FlexRow,{
              justifyContent:'space-between', alignItems:'center', 
              width: isMobile ?'90%':'100%', margin:'0 auto'
            },
              m(Img, { 
                src:'./assets/agni_blanco.png',
                width: isMobile ? '20%' : '80px', 
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
  
}


function Home(){

  let sections = [
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

  return {
    view:(vnode)=>{
      return [
        m(Box,{ height:'4em'}),

        m(Div, {
          class: 'animation-wrapper', // Ocultar hasta que sea visible
          oncreate: (node) => observeElementForAnimation(node, 'animate-fadeInUp'), // <-- Especifica animación
          onremove: unobserveElement
        },
          m(H1,{ textAlign:'center'},localize({
            es:'Bienvenido a Agni',
            va:'Benvingut a agni'
          }))
        ),

        m(Div, {
          class: 'animation-wrapper',
          oncreate: (node) => {
            node.dom.style.animationDelay = '0.2s';
            observeElementForAnimation(node, 'animate-fadeInUp'); // <-- Especifica animación
          },
          onremove: unobserveElement
        }, m(H2,{ 
          textAlign:'center', 
          marginTop:'0em',
        },localize({
            es:'Un espacio para la práctica de yoga y meditación en un entorno tranquilo',
            va:'Un espai per a la pràctica de ioga i meditació en un entorn tranquil'
          }))
        ),
        
        m(Box,{ height:'2em'}),

        sections.map((section,i)=>{
          const animationClass = (i % 2 == 0) ? 'animate-fadeInLeft' : 'animate-fadeInRight';

          return m(Div,{
            oncreate: (node) => {
              node.dom.style.animationDelay = `${0.1 + i * 0.1}s`;
              // Pasamos la clase de animación determinada dinámicamente
              observeElementForAnimation(node, animationClass); // <-- Pasa la clase elegida
            },
            onremove: unobserveElement
            
          },m(FlexCol,{
            textAlign: i%2 == 0 ? 'left' : 'right',
            padding:'1em',
          }, 
            m(H2, section.title),
            m(Text, section.description),
          ))
        }),
      ]
    }
  }
}


function Room(){

  return{
    view:(vnode)=>{

    }
  }
}


function ContactModal(){

  return {
    view:(vnode)=>{
      return [
        m(Div,{
          class: 'contact-modal-wrapper animation-wrapper', // Añade clase animation-wrapper
          style: { display: 'flex', justifyContent: 'center'},
          // Usar zoomIn para el modal de contacto
          oncreate: (node) => observeElementForAnimation(node, 'animate-zoomIn'), // <-- Especifica animación
          onremove: unobserveElement,
          padding:'1em', background:'white', borderRadius:'1em', margin:'1em', width:'50vw', border:'1px solid lightgrey'
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
        m(FlexCol,
          m(Div, {
            class: 'animation-wrapper',
            oncreate: (node) => observeElementForAnimation(node, 'animate-fadeInUp'), // <-- Especifica animación
            onremove: unobserveElement
          },  m(H1, "Els nostres serveis")
          ),
          m(Box,{height:'10px'}),
          m(FlexRow,{ gap:'1em', justifyContent:'space-between', flexGrow:1, flexWrap: 'wrap' },
            items.map((item,i)=>{
              const animationClass = 'animate-zoomIn';

              return m(Div,{
                class: 'animation-wrapper',
                style: { flex: '1 1 300px', minWidth: '300px' },
                oncreate: (node) => {
                    node.dom.style.animationDelay = `${0.1 + i * 0.1}s`;
                    // Pasamos la animación elegida (zoomIn)
                    observeElementForAnimation(node, animationClass); // <-- Pasa la clase elegida
                },
                onremove: unobserveElement
              },m(Card,{
                oncreate: (vnode) => {
                  vnode.dom.classList.add('animate-fadeInUp');
                  vnode.dom.style.animationDelay = `${0.2 + i * 0.15}s`;
                },
                ...item
              }))
            })
          )
        )
      ]
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