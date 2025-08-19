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

  // NUEVO: Estado para saber qué sección está activa
  let activeSection = 'home'; // Empezamos en 'home' por defecto

  // IDs de las secciones a incluir en la navegación por puntos
  // El orden aquí determinará el orden de los puntos
  const sectionIds = ['home', 'services', 'room', 'contact']; // Añade 'gallery' si la implementas

  // --- Lógica del Intersection Observer (Modificada) ---

  // Opciones para observar las secciones principales
  const sectionObserverOptions = {
    root: null, // Viewport
    rootMargin: '-40% 0px -60% 0px', // Ajusta estos márgenes: dispara cuando la sección está más centrada verticalmente
    threshold: 0 // Dispara apenas entre o salga de los márgenes
  };

  const sectionIntersectionCallback = (entries, observer) => {
    entries.forEach(entry => {
      // Si una sección entra en el área definida por rootMargin
      if (entry.isIntersecting) {
        // Actualizamos la sección activa con el ID del elemento que intersecta
        const newActiveSection = entry.target.id;
        if (activeSection !== newActiveSection) {
          activeSection = newActiveSection;
          // console.log("Active section:", activeSection); // Para depurar
          m.redraw(); // Necesitamos redibujar para actualizar los puntos
        }
      }
    });
  };

  // Observer específico para detectar la sección activa
  let sectionVisibilityObserver = null;

  const initializeSectionObserver = () => {
    if (!sectionVisibilityObserver) {
      sectionVisibilityObserver = new IntersectionObserver(sectionIntersectionCallback, sectionObserverOptions);
      // Empezar a observar cada sección principal una vez creadas
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          sectionVisibilityObserver.observe(element);
        } else {
          // Es posible que el elemento no esté en el DOM en la primera inicialización
          // Podríamos reintentar en onupdate o asegurarnos que se llama después del primer render
          // console.warn(`Element with id "${id}" not found for section observer.`);
        }
      });
      // console.log("Section Visibility Observer created and observing");
    }
  };

  const disconnectSectionObserver = () => {
    if (sectionVisibilityObserver) {
      sectionVisibilityObserver.disconnect();
      sectionVisibilityObserver = null;
      // console.log("Section Visibility Observer disconnected");
    }
  };
   
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

    if(window.scrollY >= height){
      navbar.style.background = '#d7a971'
      navbar.style.color = 'black'
    } else {
      navbar.style.background = '#ffffff5c'
      navbar.style.color = 'white'
    }
  
  }

  
  return {  
    oncreate: (vnode) => {
      // oncreate es un lugar más seguro para inicializar observers que dependen del DOM
      initializeSectionObserver();
    },
    onremove: (vnode) => {
      // Limpiar listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      // Limpiar observers
      if (instanceScrollObserver) { instanceScrollObserver.disconnect(); instanceScrollObserver = null; }
      disconnectSectionObserver(); // Limpia el nuevo observer
    },
    view: (vnode) => {
      isMobile = window.innerWidth < 800

      return m(FlexCol,
        
        m(NavBar),
        m(SectionDotsNav),
        m(ImageTransition),

        m(Div,{ flex:1, background:'#f7f7f7' },
          m(Container, [
            m(Box, { height: '2em' }),
            m(Div, { id: 'home', style:{ minHeight:'100vh'}}, m(Home)),
            m(Divider),
            
            // Contenedor para Services con ID
            m(Div, { id: 'services', style:{ minHeight:'100vh'} }, m(Services)),
            
            // Contenedor para Contact con ID (envuelve el modal o su disparador)
            // Quizás quieras un ID en la sección que *contiene* el modal
            m(Div, { id: 'contact', style: { minHeight: '100vh'}},  m(Contact)),
            
            // Contenedor para Room con ID
            m(Div, { id: 'room', style:{ minHeight:'100vh'} }, m(Room)),
            
          ]),
        )
      )
    }  
  }

  // --- Definición de Componentes Internos ---
  function ImageTransition() {
    let imageLoaded = false;
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
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
              },
              onload: (e) => { imageLoaded = true; m.redraw(); }
            }),

            // Overlay oscuro (opcional)
            m(Div, {
              style: {
                opacity: imageLoaded ? 0.4 : 0, // Aparece con la imagen
                //transition: 'opacity 0.8s ease-in-out 0.2s',
                background: 'black', width: '100%', height: '100%',
                position: 'absolute', inset: 0
              }
            }),
            
            // Logo Agni
            m(FlexCol, {position:'absolute', bottom:'20px', alignItems:'center', justifyContent:'center', width:'100vw', gap:'2em'},
              m(Div,{
                oncreate: observeElementForAnimation,
                style: { animationDelay:'1.5s'},
              }, m(Img, {
                src: './assets/agni_blanco.png', id: 'agni', alt: "Logo Agni Yoga",
                style: {
                  //width: isMobile ? '70%' : '50%', 
                  maxWidth: '400px',
                  height: 'auto', objectFit: 'contain', zIndex: 10,
                }
              })),

              m(Div,{
                oncreate: observeElementForAnimation,
                style: { animationDelay:'2.5s'},
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

            return m(Tappable, {
              class: 'menu-item-tappable', role: 'menuitem',
              onclick: () => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
                if (isMobile) { openMenu = false; } // Cierra menú móvil
              },
            },
              m(Div, { style: { textAlign: 'center', padding: '0.8em 1em' } },
                m(Text, { style: { lineHeight: '1.2em', letterSpacing: '1.5px', userSelect: 'none', fontWeight: '500' } },
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
              m(MenuItem, { route: 'services' }, localize({ va: 'Serveis', es: 'Servicios' })),
              m(MenuItem, { route: 'gallery' }, localize({ va: 'Horaris', es: 'Horario' })),
              m(MenuItem, { route: 'room' }, localize({ es: "Nuestra historia ", va: "Nostra historia" })),
              m(MenuItem, { route: 'contact' }, localize({ va: 'Contacte', es: 'Contacto' })),
            ]
          );
        }
      };
    } // Fin Menu

    return {
      view: () => {
        return [
          m(Div, { 
            id: 'navbar',
            style: {
              background: '#ffffff5c', color: 'white', zIndex: 10040, width: '100vw',
              transition: '0.5s background, 0.5s color', backdropFilter: 'blur(10px)',
              position: 'fixed', top: 0, left: 0, padding: '1em',
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
                m(Icon, { icon: openMenu ? 'close' : 'menu', size: '28px', color:'white'})
              ) : m(Menu)
            ),
            
            // Mobile Dropdown Menu
            isMobile && m(Div, { 
              id: mobileMenuId, 
              style: {
                transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                maxHeight: openMenu ? '400px' : '0px', opacity: openMenu ? 1 : 0,
                overflow: 'hidden', 
                borderRadius: '0 0 0.5em 0.5em',
                marginTop: '0.5em', padding: openMenu ? '0.5em 0' : '0',
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

  return {
    view: () => {
      return [
        m(Box, { height: '4em' }),
        m(Div, { class: 'animation-wrapper', oncreate: (n) => observeElementForAnimation(n, 'animate-fadeInUp'), onremove: unobserveElement },
          m(FlexRow, {gap:'0.5em'},

            m(FlexCol,
            //m(H1, { textAlign: 'center'  }, localize({ es: 'Bienvenido a ', va: 'Benvingut a ' })),
            m(Text,{textTransform:'uppercase'},
              `ESTE ES UN TEXTO LARGO LARGO QJEJEJEJ 
                va cambiando poco a poco 
                te como un pmoco
              `
            ),
            m(Button, {

            }, localize({es:"Nuestros servicios", va:"Els nostres serveis"}))
          ),
            // Imagen Agni Rojo (Centrada arriba del título)
            /*
            m(Img, {
              src: '/assets/agni_rojo.png', // Ruta a tu imagen
              alt: 'Logo Agni Yoga en Rojo',
              style: {
                width: '80px', // Ajusta el tamaño según necesites
                height: 'auto',
                marginBottom: '1em' // Espacio debajo de la imagen
              }
            })*/
          )
        ),
        m(Div, { class: 'animation-wrapper', oncreate: (n) => { n.dom.style.animationDelay = '0.2s'; observeElementForAnimation(n, 'animate-fadeInUp'); }, onremove: unobserveElement },
          m(H2, {textAlign: 'center', marginTop: '0em' }, localize({ es: 'Un espacio para la práctica de yoga y meditación', va: 'Un espai per a la pràctica...' }))
        ),
        m(Box, { height: '2em'  }),

        sections.map((section, i) => {
          const animationClass = (i % 2 == 0) ? 'animate-fadeInLeft' : 'animate-fadeInRight';
          return m(Div, { class: 'animation-wrapper', oncreate: (n) => { n.dom.style.animationDelay = `${0.1 + i * 0.1}s`; observeElementForAnimation(n, animationClass); }, onremove: unobserveElement },
            m(FlexRow, 
              // Renderizar Icono si existe en la sección
              section.icon && m(Div, { style: { marginTop: '0.3em'} }, // Ajuste vertical del icono
                m(Icon, {
                  icon: section.icon,
                  size: '48px', // Tamaño del icono
                  color: theme.maincolor || '#d7a971' // Color del icono
                })
              ),  
              
              m(FlexCol, { textAlign: i % 2 == 0 ? 'left' : 'right', padding: '1em' },
                m(H2, section.title),
                m(Text, section.description),
              )
            )
          )
        }),
      ];
    }
  };
} 


function Room() {
  return {
    view: () => {
      return m(Div, { class: 'room-section-wrapper animation-wrapper', style: { padding: '2em', textAlign: 'center' }, oncreate: (n) => observeElementForAnimation(n, 'animate-fadeInUp'), onremove: unobserveElement },
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
      return m("section#contact.contact-section", // Clase principal de la sección
        m(Div, { class: "contact-container" }, // Contenedor centrado
          // Encabezado
          m(Div, { class: "contact-header animation-wrapper", oncreate: (n) => observeElementForAnimation(n, 'animate-fadeInUp'), onremove: unobserveElement },
            // Usamos m("h2") si H2 no existe o para asegurar estilos CSS
            m("h2", localize({ es: "Únete a Nuestra Comunidad", va: "Uneix-te a la Nostra Comunitat" })),
            // Usamos m("p") si Text no existe o para asegurar estilos CSS
            m("p", localize({ es: "¿Tienes preguntas o estás listo/a para empezar tu viaje en el yoga? ¡Contáctanos!", va: "Tens preguntes o estàs llest/a per començar el teu viatge en el ioga? Contacta'ns!" }))
          ),

          // Grid Principal (Formulario + Info)
          m(Div, { class: "contact-grid" },

            // Columna Formulario
            m(Div, { class: "animation-wrapper", oncreate: (n) => observeElementForAnimation(n, 'animate-fadeInLeft'), onremove: unobserveElement },
              m(Div, { class: "contact-form-container" },
                m("form", { onsubmit: handleSubmit },
                  // Campo Nombre
                  m(Div, { class: "form-field" },
                    m("label", { for: "name" }, localize({ es: "Nombre Completo", va: "Nom Complet" })),
                    // Usando input normal si Input no existe o para asegurar estilos
                    m("input", { type: "text", id: "name", class: "form-input", placeholder: localize({ es: "Tu nombre", va: "El teu nom" }) })
                  ),
                  // Campo Email
                  m(Div, { class: "form-field" },
                    m("label", { for: "email" }, localize({ es: "Correo Electrónico", va: "Correu Electrònic" })),
                    m("input", { type: "email", id: "email", class: "form-input", placeholder: localize({ es: "tu@email.com", va: "el_teu@email.com" }) })
                  ),
                  // Campo Teléfono
                  m(Div, { class: "form-field" },
                    m("label", { for: "phone" }, localize({ es: "Número de Teléfono", va: "Número de Telèfon" })),
                    m("input", { type: "tel", id: "phone", class: "form-input", placeholder: "(opcional)" })
                  ),
                  // Campo Interés (Select)
                  m(Div, { class: "form-field" },
                    m("label", { for: "interest" }, localize({ es: "Interesado/a en", va: "Interessat/ada en" })),
                    m("select", { id: "interest", class: "form-select" },
                      interestOptions.map(opt => m("option", { value: opt.value }, opt.label))
                    )
                  ),
                  // Campo Mensaje
                  m(Div, { class: "form-field" },
                    m("label", { for: "message" }, localize({ es: "Tu Mensaje", va: "El Teu Missatge" })),
                    m("textarea", { id: "message", rows: 4, class: "form-textarea", placeholder: localize({ es: "Cuéntanos sobre tu experiencia y objetivos...", va: "Conta'ns sobre la teua experiència i objectius..." }) })
                  ),
                  // Botón Enviar
                  m("button", { type: 'submit', class: "submit-button" }, // Usando botón normal con clase CSS
                    localize({ es: "Enviar Mensaje", va: "Enviar Missatge" })
                  )
                ) // Fin form
              ) // Fin Div form container
            ), // Fin Columna Formulario wrapper

            // Columna Información
            m(Div, { class: "animation-wrapper", oncreate: (n) => observeElementForAnimation(n, 'animate-fadeInRight'), onremove: unobserveElement },
              m(Div, { class: "contact-info-container" },
                m("h3", localize({ es: "Información de Contacto", va: "Informació de Contacte" })),
                // Bloques de info
                m(Div, { class: "info-blocks-container" },
                  contactInfo.map(info =>
                    // Usando FlexRow si existe y aplica display:flex, o usar div con clase .info-item
                    m(Div, { class: "info-item" },
                      m(Div, { class: "info-icon-container" },
                        m(Icon, { icon: info.icon, class: "icon" }) // Pasamos clase para estilo interno si es necesario
                      ),
                      m(Div, { class: "info-text-container" },
                        m("h4", info.title),
                         // Usando p normal si Text no existe o para asegurar estilos
                        info.lines.map(line => m("p", line))
                      )
                    )
                  )
                ),
                // Redes Sociales
                m(Div, { class: "social-links-container" },
                  m("h4", localize({ es: "Síguenos", va: "Segueix-nos" })),
                  m(Div, { class: "social-links" }, // Usando Div con clase en lugar de FlexRow
                    socialLinks.map(link =>
                      m("a", { href: link.href, target: "_blank", rel: "noopener noreferrer", "aria-label": link.label, class: "social-link" },
                        m(Icon, { icon: link.icon, class: "icon" }) // Pasamos clase para estilo interno
                      )
                    )
                  )
                )
              ) // Fin Div info container
            ) // Fin Columna Info wrapper
          ) // Fin Grid Principal
        ) // Fin Container
      ); // Fin Section
    } // Fin view
  }; // Fin return componente
} // Fin functi/ 

function Services() {

  // --- Estado del Componente ---
  // Usamos la fecha actual simulada (o la real si prefieres Date.now())
  let currentDate = new Date(2025, 3, 28); // Abril es mes 3 (0-indexed)
  let selectedDate = null; // Para el día seleccionado (opcional)

  // --- Datos de Prueba (Eventos Abril y Mayo 2025) ---
  const allEvents = [
    // Abril 2025
    { date: '2025-04-05', time: '10:00', title: {es: 'Taller Vinyasa Flow', va: 'Taller Vinyasa Flow'}, description: {es: 'Intensivo de fin de semana.', va: 'Intensiu de cap de setmana.'} },
    { date: '2025-04-14', time: '19:00', title: {es: 'Yoga Restaurativo', va: 'Ioga Restauratiu'}, description: {es: 'Relajación profunda.', va: 'Relaxació profunda.'} },
    { date: '2025-04-22', time: '18:30', title: {es: 'Hatha Yoga', va: 'Hatha Ioga'}, description: {es: 'Clase multinivel.', va: 'Classe multinivell.'} },
    { date: '2025-04-29', time: '19:00', title: {es: 'Hatha Yoga', va: 'Hatha Ioga'}, description: {es: 'Clase multinivel.', va: 'Classe multinivell.'} },
    { date: '2025-04-30', time: '09:00', title: {es: 'Meditación Guiada', va: 'Meditació Guiada'}, description: {es: 'Enfoque en mindfulness.', va: 'Enfocament en mindfulness.'} },

    // Mayo 2025
    { date: '2025-05-01', time: '10:00', title: {es: 'Taller Especial: Yoga y Primavera', va: 'Taller Especial: Ioga i Primavera'}, description: {es: 'Actividad festivo Día del Trabajador.', va: 'Activitat festiu Dia del Treballador.'} },
    { date: '2025-05-03', time: '17:00', title: {es: 'Taller Yin Yoga', va: 'Taller Yin Ioga'}, description: {es: 'Profundiza en la quietud.', va: 'Aprofundeix en la quietud.'} },
    { date: '2025-05-07', time: '09:00', title: {es: 'Meditación Guiada', va: 'Meditació Guiada'}, description: {es: 'Calma matutina.', va: 'Calma matutina.'} },
    { date: '2025-05-12', time: '19:30', title: {es: 'Yoga para Principiantes', va: 'Ioga per a Principiants'}, description: {es: 'Iniciación al Hatha.', va: 'Iniciació al Hatha.'} },
    { date: '2025-05-15', time: '18:30', title: {es: 'Hatha Yoga', va: 'Hatha Ioga'}, description: {es: 'Clase multinivel.', va: 'Classe multinivell.'} },
    { date: '2025-05-21', time: '09:00', title: {es: 'Meditación Guiada', va: 'Meditació Guiada'}, description: {es: 'Conexión interior.', va: 'Connexió interior.'} },
    { date: '2025-05-28', time: '10:00', title: {es: 'Vinyasa Flow', va: 'Vinyasa Flow'}, description: {es: 'Clase dinámica.', va: 'Classe dinàmica.'} },
    { date: '2025-05-31', time: '10:30', title: {es: 'Taller Pranayama', va: 'Taller Pranayama'}, description: {es: 'Control de la respiración.', va: 'Control de la respiració.'} },
  ];

  // --- Funciones Auxiliares ---

  /** Formatea YYYY-MM-DD a partir de un objeto Date */
  function formatDateISO(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Obtiene eventos para un año y mes específicos */
  function getEventsForMonth(year, month) { // month es 0-indexed
    const monthString = (month + 1).toString().padStart(2, '0');
    const prefix = `${year}-${monthString}-`;
    return allEvents
      .filter(event => event.date.startsWith(prefix))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)); // Ordena por fecha y hora
  }

  /** Genera los días para la vista del calendario */
  function generateCalendarDays(year, month) { // month es 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Domingo, 1=Lunes...
    const startingDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Ajustar para que Lunes sea 0

    const days = [];
    const todayISO = formatDateISO(new Date()); // Fecha real de hoy
    const currentMonthEvents = getEventsForMonth(year, month);
    const eventDays = new Set(currentMonthEvents.map(e => e.date));

    // Días del mes anterior (placeholders)
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
      days.push({
        day: daysInPrevMonth - startingDay + 1 + i,
        isCurrentMonth: false
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const dateISO = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: dateISO === todayISO,
        isoDate: dateISO,
        hasEvents: eventDays.has(dateISO),
        isSelected: selectedDate === dateISO
      });
    }

    // Días del mes siguiente (placeholders)
    const totalDays = days.length;
    const nextMonthDays = (7 - (totalDays % 7)) % 7;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false
      });
    }

    return days;
  }

  /** Cambia al mes anterior */
  function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = null; // Resetear selección al cambiar de mes
    // m.redraw(); // Mithril maneja esto automáticamente desde el onclick
  }

  /** Cambia al mes siguiente */
  function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = null;
    // m.redraw();
  }

  /** Selecciona un día (opcional) */
  function selectDay(dayData) {
      if (dayData.isCurrentMonth && dayData.isoDate) {
          selectedDate = dayData.isoDate;
          // Aquí podrías filtrar la lista de eventos de la derecha si quisieras
          // Por ahora, solo lo marcamos visualmente en el calendario
      }
  }

  // --- Nombres de Meses y Días (Localizables) ---
  const monthNames = {
    es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    va: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"]
  };
  const dayNamesShort = {
    es: ["L", "M", "X", "J", "V", "S", "D"],
    va: ["Dl", "Dm", "Dc", "Dj", "Dv", "Ds", "Dg"]
  };

  return {
    // oncreate: (vnode) => { observeElementForAnimation(vnode, 'animate-fadeInUp'); }, // Añadir si quieres animación
    // onremove: unobserveElement,
    view: () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-indexed
      const currentMonthName = localize(monthNames)[month]; // Obtiene el array correcto y luego el mes
      const calendarDays = generateCalendarDays(year, month);
      const eventsThisMonth = getEventsForMonth(year, month);
      const currentDayNames = localize(dayNamesShort);

      return m(FlexCol, { class: 'services-section animation-wrapper', style: { padding: '2em 1em' } }, // Añade padding o usa Container
        // Título de la Sección (opcional)
        m(H1, { class: 'section-title', style: { textAlign: 'center', marginBottom: '1.5em' } }, localize({ es: "Horario y Eventos", va: "Horari i Esdeveniments" })),

        // Grid Principal (Calendario | Eventos)
        m(Div, { class: 'services-grid', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2em' } },

          // --- Columna Izquierda: Calendario ---
          m(Div, { class: 'calendar-container' },
            // Cabecera del Calendario (Mes y Navegación)
            m(FlexRow, { class: 'calendar-header', style: { justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' } },
              m('button', { onclick: prevMonth, class: 'calendar-nav-button' }, '<'), // TODO: Usar Icon component
              m(H2, { style: { margin: 0, textAlign: 'center' } }, `${currentMonthName} ${year}`),
              m('button', { onclick: nextMonth, class: 'calendar-nav-button' }, '>') // TODO: Usar Icon component
            ),

            // Días de la Semana
            m(Div, { class: 'calendar-weekdays', style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5em', fontWeight: 'bold' } },
              currentDayNames.map(dayName => m(Div, dayName))
            ),

            // Grid de Días del Calendario
            m(Div, { class: 'calendar-grid', style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' } },
              calendarDays.map(dayData =>
                m(Div, {
                  class: `calendar-day ${dayData.isCurrentMonth ? 'current-month' : 'other-month'} ${dayData.isToday ? 'today' : ''} ${dayData.hasEvents ? 'has-events' : ''} ${dayData.isSelected ? 'selected' : ''}`,
                  onclick: () => selectDay(dayData),
                  style: {
                    padding: '0.8em 0.5em',
                    textAlign: 'center',
                    border: '1px solid #eee', // Estilo base
                    background: !dayData.isCurrentMonth ? '#f9f9f9' : (dayData.isSelected ? (theme.maincolor || '#d7a971') : 'white'), // Fondo diferente si no es del mes o está seleccionado
                    color: !dayData.isCurrentMonth ? '#ccc' : (dayData.isSelected ? 'white' : 'inherit'),
                    fontWeight: dayData.isToday ? 'bold' : 'normal',
                    cursor: dayData.isCurrentMonth ? 'pointer' : 'default',
                    position: 'relative', // Para el punto de evento
                    minHeight: '4em' // Asegura algo de altura
                  }
                },
                  dayData.day, // El número del día
                  // Indicador visual si tiene eventos (un punto)
                  dayData.hasEvents && m(Div, {class: 'event-dot', style:{ position:'absolute', bottom:'5px', left:'50%', transform:'translateX(-50%)', width:'6px', height:'6px', background: dayData.isSelected ? 'white' : (theme.maincolor || '#d7a971'), borderRadius:'50%' } })
                )
              )
            )
          ), // Fin Columna Calendario

          // --- Columna Derecha: Lista de Eventos ---
          m(Div, { class: 'event-list-container' },
            m(H2, { style: { marginBottom: '1em' } }, `${localize({ es: "Eventos en", va: "Esdeveniments a" })} ${currentMonthName}`),
            eventsThisMonth.length > 0
              ? m(FlexCol, { class: 'event-list', gap: '1em' },
                eventsThisMonth.map(event =>
                  // Podrías usar tu componente Card aquí: m(Card, { title: localize(event.title), description: localize(event.description), /* ...otras props */ })
                  // O un div simple como este:
                  m(Div, { class: 'event-item', style: { border: `1px solid ${theme.maincolor || '#d7a971'}`, padding: '1em', borderRadius: '4px' } },
                    m(H2, { style: { marginBottom: '0.25em', fontSize: '1.1em' } }, localize(event.title)),
                    m(SmallText, { style: { color: '#555', marginBottom: '0.5em' } }, `${event.date} - ${event.time}`),
                    m(Text, localize(event.description))
                  )
                )
              )
              : m(Text, localize({ es: "No hay eventos programados para este mes.", va: "No hi ha esdeveniments programats per a este mes." }))
          ) // Fin Columna Eventos

        ) // Fin Services Grid
      ); // Fin Services Section FlexCol
    } // Fin view
  }; // Fin return componente
} // Fin function Services



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