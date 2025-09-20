import { Button, Icon, Img, Segment } from "./dview/elements.js"
import { Animate, Box, Container, Div, FlexCol, FlexRow,   Grid,   Tappable } from "./dview/layout.js"
import { H1, H2,  H3,  SmallText, Text } from "./dview/texts.js"
import { localize, monthLabel, Page } from "./util.js";
import { theme } from "./theme.js";
import { Input } from "./dview/forms.js";

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



let isMobile = false;
let navbarHeight = 0;


function LandingPage(){
  let activeSection = ''; 

  const sectionIds = ['home', 'timetable', 'room', 'contact']; 

  let inprocess = true;

  let imageLoaded = false;


  window.onresize = (e)=>{
    let last = isMobile;
    
    if(window.innerWidth < 800)isMobile = true
    else isMobile = false

    if(last != isMobile)  m.redraw()
  }

  window.onscroll = (e)=>{
    let height = document.getElementById('image').offsetHeight

    let navbar = document.getElementById('navbar')

    if(window.scrollY >= height){
      navbar.style.background = '#382f2f'
      //navbar.style.color = 'black'
    } else {
      navbar.style.background = '#ffffff5c'
      navbar.style.color = 'white'
    }

    
    // Actualizar la sección activa en función del desplazamiento
    
    
    const scrollPosition = window.scrollY + navbarHeight;

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          console.log('Sección activa:', id);
          if(activeSection != id){
            activeSection = id;
            m.redraw()
          }
        }
      }
    });
  }
  
  return {  
    
    /*
    onupdate: (vnode) => {
      // Reinitialize observer if needed after updates
      if (!sectionVisibilityObserver) {
        initializeSectionObserver();
      }
    },*/
    onremove: (vnode) => {
      // Limpiar listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);

      // Limpiar observers
      if (instanceScrollObserver) { instanceScrollObserver.disconnect(); instanceScrollObserver = null; }
    },
    view: (vnode) => {
      isMobile = window.innerWidth < 800

      if(inprocess && false){
        return m(FlexCol, { id: 'inprocess', style: { minHeight: '100vh' } },
          m(Div, { style: { padding: '2em', textAlign: 'center' } },
            m(H1, "Cargando...")
          )
        )
      }

      return m(FlexCol,
        
        imageLoaded && m(NavBar),
        //m(SectionDotsNav),
        m(RoomImage),

        m(Div,{ flex:1, background:'#f7f7f7' },
          
          m(Box, { height: '2em' }),

          // make the div the remaining height without the navbar height
          m(Home),

          // Contenedor para Services con ID
          m(TimeTable),
          
          // Contenedor para Room con ID
          m(Div, { id: 'room', style:{ minHeight:'100vh'} }, m(Room)),

          // Contenedor para Contact con ID (envuelve el modal o su disparador)
          // Quizás quieras un ID en la sección que *contiene* el modal
          m(Div, { id: 'contact', style: { minHeight: '100vh'}},  m(Contact)),
            
        ),
      )
    }  
  }

  // --- Definición de Componentes Internos ---
  function RoomImage() {
    let seeImage= false;
    
    return {
      view: (vnode) => {
        return [
          m(Div, {
            id: 'image',
            style: {
              width: '100vw', height: '100vh', position: 'relative',
              overflow: 'hidden', backgroundColor: '#2a2a2a', // Placeholder color oscuro
              zIndex: 1000
            }
          },

            // Imagen de fondo
            m(Img, {
              src: "./assets/puertas.png",
              alt: localize({es: "Puertas de entrada a la escuela de yoga Agni", va: "Portes d'entrada a l'escola de ioga Agni"}),
              style: {
                width: '100%', height: '100%', objectFit: 'cover',
                position: 'absolute', inset: 0,
                opacity: seeImage ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
              },
              onload: (e) => { 
                seeImage = true
                setTimeout(()=>{
                  imageLoaded = true; 
                  m.redraw(); 
                }, 800);
              }
            }),

            // Overlay oscuro (opcional)
            m(Div, {
              style: {
                opacity: seeImage ? 0.4 : 0, // Aparece con la imagen
                //transition: 'opacity 0.8s ease-in-out 0.2s',
                background: 'black', width: '100%', height: '100%',
                position: 'absolute', inset: 0
              }
            }),
            
            // Logo Agni
            !imageLoaded 
            ? null
            : m(FlexCol, {position:'absolute', bottom:'20px', alignItems:'center', justifyContent:'center', width:'100vw', gap:'2em'},
              
              m(Animate,{
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              }, 
                m(Img, {
                src: './assets/agni_blanco.png', id: 'agni', alt: "Logo Agni Yoga",
                style: {
                  //width: isMobile ? '70%' : '50%', 
                  maxWidth: '400px',
                  height: 'auto', objectFit: 'contain', zIndex: 10,
                }
                })
              ),

              m(Animate,{
                from: { transform: 'scale(0.7)', opacity: 0 },
                to: { transform: 'scale(1)', opacity: 1 },
                delay: 1500
              },
                // Botón "Empezar"
                m(Button, {
                  type: 'primary',
                  style: {
                    zIndex: 10,
                  },
                  onclick: () => document.getElementById('home')?.scrollIntoView({ behavior: "smooth", block: "start" })
                },
                  m(Text, { style: { color: 'white' } }, localize({ es: "Empezar", va: "Començar" }).toUpperCase())
                )
              )
            )
          )
        ]
      }
    }
  } 

  // --- NUEVO Componente: Navegación por Puntos ---
  function SectionDotsNav() {
    return {
      view: () => {
        // No mostrar en móvil si se prefiere
        if (isMobile) return null;

        return m('nav', {
          class: 'section-dots-nav',
          style: {
            position: 'fixed',
            top: '50%',
            right: '20px', // Ajusta la distancia a la derecha
            transform: 'translateY(-50%)',
            zIndex: 1010, // Encima de otros elementos pero debajo de modales quizás
            display: 'flex',
            flexDirection: 'column',
            gap: '12px', // Espacio entre puntos
          }
        },
          sectionIds.map(id => {
            const isActive = activeSection === id;
            const sectionName = id.charAt(0).toUpperCase() + id.slice(1); // Nombre simple para tooltip

            return m('a', { // Usamos 'a' para poder enlazar a la sección
              href: `#${id}`,
              class: `dot ${isActive ? 'active' : ''}`,
              'aria-label': `Ir a sección ${localize({es:sectionName, va:sectionName})}`, // Accesibilidad
              title: localize({es:sectionName, va:sectionName}), // Tooltip al pasar el ratón
              style: {
                display: 'block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: isActive ? (theme.maincolor || '#d7a971') : 'rgba(0, 0, 0, 0.3)', // Color activo/inactivo
                border: isActive? '2px solid white' : 'none', // Borde blanco si está activo
                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s ease, transform 0.3s ease', // Transición suave
                transform: isActive ? 'scale(1.2)' : 'scale(1)' // Crece un poco si está activo
              },
              onclick: (e) => {
                e.preventDefault(); // Evita el salto brusco del href
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          })
        );
      }
    };
  } // Fin SectionDotsNav


  function NavBar() {
    let openMenu = false;
    const mobileMenuId = "mobile-menu-content";

    function Menu() {

      function MenuItem() {
        return {
          view: (vnode) => {
            const { route } = vnode.attrs;
            const targetId = route === '' ? 'home' : route;
            
            // Check if this menu item should be active based on current section
            const isActive = activeSection === targetId;

            return m(Tappable, {
              class: 'menu-item-tappable', 
              role: 'menuitem',
              //id: route,
              onclick: () => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
                if (isMobile) { openMenu = false; } // Cierra menú móvil
              },
            },
              m(Div, { 
                style: { 
                  textAlign: 'center', 
                  padding: '0.8em 1em',
                  borderBottom: isActive ? `2px solid ${theme.maincolor || '#d7a971'}` : '2px solid transparent',
                  transition: 'border-bottom 0.5s ease'
                } 
              },
                m(Text, { 
                  
                  lineHeight: '1.2em', 
                  letterSpacing: '1.5px', 
                  userSelect: 'none', 
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? (theme.maincolor || '#d7a971') : 'inherit',
                  transition: 'color 0.3s ease, font-weight 0.3s ease'
                   
                },
                  vnode.children // Accede a los hijos pasados a MenuItem
                )
              )
            );
          }
        };
      } // Fin MenuItem

      return {
        view: () => {
          return m(Div, {
            role: isMobile ? 'menu' : 'menubar',
            style: {
              gap: isMobile ? '0.5em' : '1em',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: isMobile ? 'flex-end' : 'space-around',
              display:'flex',
              flexDirection: isMobile ? 'column': 'row',
              flex: 1
            }
          },
            [ // Contenido real de los items
              m(MenuItem, { route: '' }, localize({ va: 'Inici', es: 'Inicio' })),
             // m(MenuItem, { route: 'services' }, localize({ va: 'Serveis', es: 'Servicios' })),
              m(MenuItem, { route: 'timetable' }, localize({ va: 'Horaris', es: 'Horario' })),
              m(MenuItem, { route: 'room' }, localize({ es: "Nuestra historia ", va: "Nostra historia" })),
              m(MenuItem, { route: 'contact' }, localize({ va: 'Contacte', es: 'Contacto' })),
            ]
          );
        }
      };
    } // Fin Menu

    function LanguageSelection() {

      let languages = [
        {
          name: 'es',
          label: "Español",
          asset: 'assets/spain.png'
        },

        {
          name: 'va',
          label: "Valenciano",
          asset: 'assets/valencia.png'
        },
      ]
      
      let selectedLang;

      return {
        oninit:()=> {
          let name = localStorage.getItem('agni-lang') || 'va';
          selectedLang = languages.find((lang) => lang.name === name);
        },
        view: (vnode)=> {
          return [
            m(Tappable, {
              style: {"float":"right", position:'absolute', right:'5px  '},
              onclick:(e)=>{
                selectedLang = languages.find((lang) => lang.name !== selectedLang.name);
                localStorage.setItem('agni-lang', selectedLang.name);
                Page.lang = selectedLang.name
              }
            },
              m(Img, {
                src: selectedLang.asset,
                alt: selectedLang.label,
                style: { width: '30px', height: '30px', objectFit: 'contain' }
              })
            )
          ]
        }
      }
    }

    return {
      view: (vnode) => {
        return [
          m(Div, { 
            id: 'navbar',
            oncreate:(vnode)=>{
              navbarHeight = vnode.dom.offsetHeight;
            },
            style: {
              background: '#ffffff5c', color: 'white', zIndex: 10040, width: '100vw',
              transition: '0.5s background, 0.5s color', backdropFilter: 'blur(10px)',
              position: 'fixed', top: 0, left: 0,
              padding: isMobile ? '0.5em' : 0
            }
           },
            m(FlexRow, { 
              justifyContent: 'space-between', alignItems: 'center',
              maxWidth: '1200px', width: isMobile ? '90%' : '95%', margin: '0 auto'
            },
              // Logo
              m(Img, {
                src: './assets/agni_blanco.png', alt: "Logo Agni Yoga - Inicio",
                style: { width: isMobile ? '50px' : '70px', height: 'auto', objectFit: 'contain', cursor: 'pointer' },
                onclick: () => {
                  document.getElementById('home')?.scrollIntoView({ behavior: "smooth", block: "start" });
                  if (isMobile) { openMenu = false; }
                }
              }),

              isMobile ?
              m("button", {
                class: 'hamburger-button',
                'aria-label': openMenu ? localize({es:"Cerrar menú", va:"Tancar menú"}) : localize({es:"Abrir menú", va:"Obrir menú"}),
                'aria-expanded': openMenu, 'aria-controls': mobileMenuId,
                style: { background: 'none', border: 'none', padding: '0.5em', cursor: 'pointer', color: 'inherit' },
                onclick: (e) => { e.preventDefault(); openMenu = !openMenu; }
              },
                m(Icon, { 
                  icon: openMenu ? 'close' : 'menu', 
                  size: 'large', 
                  color:'white'
                })
              ) : m(Menu),


              m(LanguageSelection)
            ),
            
            // Mobile Dropdown Menu
            isMobile && m(Div, { 
              id: mobileMenuId, 
              style: {
                transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                maxHeight: openMenu ? '400px' : '0px', 
                opacity: openMenu ? 1 : 0,
                overflow: 'hidden', 
                //position:openMenu ?'relative':'absolute',
                //display: openMenu ?'block':'none',
                borderRadius: '0 0 0.5em 0.5em',
                //marginTop: '0.5em', 
                padding: openMenu ? '0.5em 0' : '0',
              }
            },
              m(Menu)
            )
          )
        ];
      }
    };
  } 


  
  
}


function Home() {
 // Array de secciones actualizado
  let sections = [
  {
    index: 0, // Añadimos índice para facilitar lógica específica
    title: '¿Quienes somos?',
    // Nueva descripción
    description: 'Todo empieza en un taller familiar donde se arreglaban herramientas de campo mediante la herrería. Tras varias generaciones, llegó a Aitana, amante y apasionada del yoga. Lo demás es historia',
    // Añadimos un icono (asegúrate que 'groups' exista en tu componente Icon o elige otro)
    icon: 'groups' // Ejemplo: icono de grupo/familia/comunidad
  },
  {
    index: 1,
    title: '¿Qué es el yoga?',
    description: 'El yoga es una disciplina milenaria que combina posturas físicas (asanas), técnicas de respiración (pranayama), meditación y filosofía para unir cuerpo, mente y espíritu.' // Texto ligeramente ampliado
  },
  {
    index: 2,
    title: '¿Qué es la meditación?',
    description: 'La meditación es una práctica que entrena la mente para enfocar la atención y alcanzar un estado de calma y claridad mental. Ayuda a reducir el estrés y a conectar con el presente.' // Texto ligeramente modificado
  }
  ];

  let photos = [
    'assets/hands.jpg',
    'assets/hands.jpg',
    'assets/hands.jpg',
    'assets/hands.jpg'
  ]

  return {
    view: () => {
      return [
        m(Div, {
          id:'home', 
          style: { 
            minHeight:'100vh ', paddingTop: navbarHeight +'px', alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column',
            backgroundImage:'url(assets/lineas2.jpg)', backgroundPosition:'center', backgroundSize:'cover', backgroundRepeat:'no-repeat'
          }
        },
          m(Container,
            m(FlexCol,   
              m(FlexRow, {justifyContent:'space-between', alignItems:'center', gap:'2em'}, // order items reverse

                m(FlexCol,
                  m(Grid, {columns: 2, style: {gridSpacing:'1em'}},
                    photos.map((photo)=> 
                      m(Img, {src: photo, style: {width:'100%', height:'auto', objectFit:'cover', aspectRatio: '1/1'}})
                    )
                  )
                ),

                m(FlexCol, {alignItems:'end', minWidth:'50%'},
                  m(H1, {textAlign:'center'}, localize({es:"Bienvenido a Agni",va:"Benvingut a Agni"}) ),
                  m(Text, {textAlign: 'center', marginTop: '0em', width:'300px' }, 
                    localize({ 
                      es: 'Un espacio para la práctica de yoga, meditación y desarrollo interior', 
                      va: 'Un espai per a la pràctica de ioga, meditació i desenvolupament interior' 
                    })
                  )
                )

              )
            )
          ),

          // is it possible to add some lines at the bottom, to make the section more beautiful

        )
      ];
    }
  };


  function RowIcon(){
    let showDescription = false;

    return {
      view:(vnode)=>{
        let {icon, text} = vnode.attrs
        
        // make it a horizontal card 
        return m(Tappable,{
          onhover:(bool)=>{
            showDescription = bool;
          },
          style:{
            height:'6em', position:'relative',
            boxShadow:'0 2px 4px rgba(0,0,0,0.1)', padding:'2em', background:'white'
          }
        },
          showDescription ?
          m(Div,  vnode.attrs.description)
          :
          m(FlexRow, {gap:'0.5em', alignItems:'center', justifyContent:'center'},
            m(Icon, {icon}),
            m(H3, text.toUpperCase()),
            m(Icon,{
              style:{
                fontSize:'16px',
                position:'absolute', right:'2em', top:'50%', transform: 'translateY(-50%)'
              },
              size:'tiny',
              icon: 'info'
            })
          )
        )
      }
    }
  }


  function Leaves(){

    return {
      view:(vnode) => {
        return [
          // import svg from assets/leaves.svg
          m("img", { 
            src: "assets/leaves.png", 
            alt: "Leaves",
            style: { 
              position: "fixed", 
              bottom: "0em", 
              right: "0em",
              width: "300px", 
              height: "300px" 
            } 
          })
        ]
      }
    }
  }
}


function Room() {
  return {
    view: () => {
      return m(Div, { style: { padding: '2em', textAlign: 'center' }, oncreate: (n) => observeElementForAnimation(n, 'animate-fadeInUp'), onremove: unobserveElement },
        m(H2, localize({es: "Nuestra Sala", va: "La Nostra Sala"})),
        m(Text, localize({es: "Un espacio tranquilo y acogedor para tu práctica.", va: "Un espai tranquil i acollidor per a la teua pràctica."})) // Texto ejemplo
        // Aquí podrías añadir m(Img, ...) con fotos de la sala cuando las tengas
      );
    }
  };
} // Fin Room


function Contact() {

  const interestOptions = [
    { value: "", label: localize({ es: "Selecciona una opción", va: "Selecciona una opció" }) },
    { value: "hatha", label: "Hatha Yoga" },
    { value: "vinyasa", label: "Vinyasa Flow" },
    { value: "yin", label: "Yin Yoga" },
    { value: "membership", label: localize({ es: "Membresía Mensual", va: "Subscripció Mensual" }) },
    { value: "private", label: localize({ es: "Sesiones Privadas", va: "Sessions Privades" }) },
  ];

  const socialLinks = [
    { href: "#", icon: 'facebook-f', label: "Facebook" },
    { href: "#", icon: 'instagram', label: "Instagram" },
    { href: "#", icon: 'twitter', label: "Twitter" },
    { href: "#", icon: 'youtube', label: "YouTube" },
  ];

  const contactInfo = [
    { icon: 'map-marker-alt', title: localize({es:"Nuestro Estudio", va:"El Nostre Estudi"}), lines: ["Carrer de la Pau, 123", "Torrent, València 46900"] },
    { icon: 'phone-alt', title: localize({es:"Llámanos", va:"Telefona'ns"}), lines: ["(123) 456-7890", localize({es:"Lun-Vie, 9h-18h", va:"Dl-Dv, 9h-18h"})] },
    { icon: 'envelope', title: localize({es:"Escríbenos", va:"Escriu-nos"}), lines: ["hola@agniyoga.com", localize({es:"Respondemos en 24h", va:"Responem en 24h"})] },
    { icon: 'clock', title: localize({es:"Horario del Estudio", va:"Horari de l'Estudi"}), lines: [localize({es:"Lunes-Viernes: 6h-21h", va:"Dilluns-Divendres: 6h-21h"}), localize({es:"Sábado-Domingo: 7h-19h", va:"Dissabte-Diumenge: 7h-19h"})] },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    alert(localize({es:'Formulario enviado (simulación).', va:'Formulari enviat (simulació).'}));
  }

  return {
    view: () => {
      return m(FlexCol, // Clase principal de la sección
        m(Container, // Contenedor centrado
          
          m(Div,{oncreate :(n) => observeElementForAnimation(n, 'animate-fadeInUp')},
            
            
            m(Segment,{type:'secondary'},
              m(H1, "Contacta"),
              m(FlexCol, {gap:'1em'},
                m(Input,{
                  label: "Nom"
                }),

                m(Input,{
                  label: "Correu Electrònic"
                }),

                m(Input,{
                  label: "Telèfon"
                }),

                m(Input,{
                  label: "Missatge",
                  type: 'textarea',
                  rows: 4
                })
              ),

              m(Button,{
                type:'secondary',
                style: {
                  width: 'auto',
                  margin: '1em 0',
                }
              }, "Enviar")
            )

          ),
        ) 
      ); 
    } 
  }; 
} 



function TimeTable() {

  function Calendar() {

    let currentDate = new Date(); // Abril es mes 3 (0-indexed)
    let calendarDays = [];

    // --- Datos de Prueba (Eventos Abril y Mayo 2025) ---
    const allEvents = [
      // Abril 2025
      { 
        date: '2025-09-06', 
        time: '10:00', 
        title: {es: 'Sesión de celebración', va: 'Taller Vinyasa Flow'}, 
        description: {es: 'Intensivo de fin de semana.', va: 'Intensiu de cap de setmana.'} 
      },

      {
        days: [2, 4],
        time: '20:00',
        title: {es: 'Clase de Hatha Yoga', va: 'Classe de Hatha Yoga'},
        description: {es: 'Clase semanal de Hatha Yoga impartida por aitana.', va: 'Classe setmanal de Hatha Yoga., impartida per aitana'} 
      },

      {
        days: [2, 4],
        months: [9,10,11,12,1,2],
        time: '19:00',
        title: {es: 'Yoga Restaurativo', va: 'Classe de Yoga Restauratiu'},
        description: {es: 'Clase semanal de Yoga Restaurativo impartida por aitana.', va: 'Classe setmanal de Yoga Restauratiu., impartida per aitana'} 
      },
     
    ];


    function getCalendarDays() {

      let days = [];

      let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      // dias anterior al mes
      if(firstDayOfMonth.getDay() != 1){ 
        let startOfCalendar = new Date(new Date(firstDayOfMonth).setDate( 1 - ((firstDayOfMonth.getDay() || 7) - 1)));

        while (startOfCalendar <firstDayOfMonth) {
          days.push(new Date(startOfCalendar));
          startOfCalendar.setDate(startOfCalendar.getDate() + 1);
        }
      }


      while (firstDayOfMonth.getMonth() === currentDate.getMonth()) {
        days.push(new Date(firstDayOfMonth));
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
      }

      
      // dias posteriores
      if(days.length % 7 != 0){
        let fillDays = 7 - (days.length % 7);
        for(let i = 0; i < fillDays; i++){
          days.push(new Date(firstDayOfMonth));
          firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }
      }

      return days;
    }

    function changeMonth(direction){
      currentDate.setMonth(currentDate.getMonth() + direction);
      calendarDays = getCalendarDays();
    }

    return {
      oninit:( vnode)=> {
        calendarDays = getCalendarDays();
      },
      view : (vnode) => {
        return [
          m(Segment,

            m(FlexCol,
              m(H1, { textAlign: 'center' }, 
                localize({ es: "Horario y Eventos", va: "Horari i Esdeveniments" })
              ),

              m(FlexRow, { justifyContent: 'space-between', alignItems: 'center', padding: '1em'},
                m(Icon, { icon: 'chevron_left', onclick:(e)=> changeMonth(-1) }),

                m(H2, monthLabel(currentDate, 'va') + ' ' + currentDate.getFullYear()),

                m(Icon, { icon: 'chevron_right', onclick:(e)=> changeMonth(1) })
              ),

              m(Grid, {columns: 7,  style: { gridGap:'0.5em' }},
                calendarDays.map(day => {
                  let eventDate = new Date(day);
                  let thisMonth = eventDate.getMonth() === currentDate.getMonth();

                  let hasEvent = allEvents.some(event => {
                    return event.days?.includes(eventDate.getDay()) &&
                      event.months?.includes(eventDate.getMonth() + 1) ||
                      event.date === eventDate.toISOString().split('T')[0];
                  });

                  return m(Tappable, {
                    style : {
                      boxSizing: 'border-box',  
                      textAlign: 'center',
                      padding: '1.5em',
                      padding: "0.8em 0.5em",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight:'4em',
                      position:'relative',
                      backgroundColor: 'lightgrey'
                    },
                    hover: {

                    }
                  }, 
                    m(SmallText, {
                      fontWeight: thisMonth ? 'bold' : 'normal'
                    }, new Date(day).getDate()),

                    hasEvent ? m(Div, { 
                      style: {
                        position:'absolute',
                        borderRadius: '50%',
                        backgroundColor: theme.maincolor,
                        fontSize: '0.8em',
                        height:'5px',
                        width:'5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '1em'
                      }
                    }) : null
                  )
                })
              )
            )
          )
        ]
      }
    }
  }

  return {
    // oncreate: (vnode) => { observeElementForAnimation(vnode, 'animate-fadeInUp'); }, // Añadir si quieres animación
    // onremove: unobserveElement,
    view: () => {
      
      return m(Div, { id: 'timetable', style:{ minHeight:'100vh' } },
        m(FlexCol,{background: theme.green, minHeight:'100vh', paddingTop: navbarHeight+'px', justifyContent:'center'},
          m(Container,
            m(FlexCol, { style: { padding: '2em 1em'} }, // Añade padding o usa Container
              // Título de la Sección (opcional)
              
              m(FlexRow, {position:'relative', alignItems:'center'},
                m(Div, {width:'80%', zIndex:10},
                  m(Calendar),
                ),

                m(Img, {
                  src: './assets/adomuca.jpg', 
                  style: {
                    position:'absolute',
                    right:'-40px',
                    width:'30%', 
                    height:'600px', objectFit:'cover', borderRadius:'0.5em'}
                })
              ),
              // Fin Services Grid
            )
          ) 
        ) 
      )
    } 
  }; 
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


function Wrapper() {

  return {
    vnode:(vnode) => {
      console.log('wrapper')
      return m("div", {
        style: { minHeight:'100vh '}
      }, vnode.children)
    }
  }
}




export {LandingPage}