import { Button, Icon, Img, Input } from "./components/elements.js"
import { Box, Container, Div, FlexCol, FlexRow, H1, H2, H3, SmallText, Tappable, Text } from "./components/layout.js"
import { localize } from "./components/util.js";
import { theme } from "./theme.js";


function LandingPage(){

  let mainpage = true;

  let currentRoute = ''


  function ImageTransition(){
    let clicked = false

    return {
      view:(vnode)=>{
        return [

          m(Img,{
            src:'./assets/agni_blanco.png', id:'agni',
            borderRadius:'50%',height:'auto',zIndex:10,
            width:'auto',height:'100%',objectFit:'cover',
            position:'absolute', top:'50%',left:'50%',transform:'translate(-50%,-50%)'
          }),

          clicked 
          ? null 
          : m(Button,{
            type:'primary',
            position:'absolute',bottom:'20px', left:'50%', zIndex:'10',
            transform:'translateX(-50%)', borderRadius:'50%',
            padding:'1em', height:'60px',width:'60px',
            onclick:(e)=>{
              clicked = true;
              let image = document.getElementById('agni')
              image.style.transition = 'all 2s'
              image.style = 'position:fixed; top:0; left:0; width:100vw; height:10vh; object-fit:contain; z-index:1000'

              let background = document.getElementById('background')
              background.style.transition = 'all 2s'
              background.style = 'position:fixed; top:0; left:0; width:100vw; height:10vh; object-fit:cover;'

            }
          }, 
            m(Icon,{
              color:'white',
              icon:'keyboard_arrow_down'
            })
          ), 
            

          m(Div,{width:'100vw',height:'100vh',inset:0, background:'black', objectFit:'cover', id:'background', position:'relative'},
            m("img", {src:"./assets/puertas.png", style:"object-fit:cover;position:absolute; inset:0;width:100%;height:100%;" }),
            m(Div,{opacity:0.4, background:'black', width:'100%', height:'100%', position:'absolute', inset:0})
          ),

        ]
      }
    }
  }

  return {  
    view: (vnode) =>{
      return m(Div,{background:'white'},
        m(FlexCol, [
            
          m(ImageTransition),

          
          m(MainPage),
          
        ])
      )
    }  
  }

  

  function MainPage(){
    return {
      view:(vnode)=>{
        return m(Div,{id:'mainpage', padding:'1em', height:'100vh', width:'100vw'},
          m(SideBar),


          m(Container,
            m(FlexCol,{ justifyContent:'center', alignItems:'center' },
              currentRoute == 'services' ? m(Services) :
              currentRoute == 'contact'? m(ContactModal):
              currentRoute == 'room'? m(Room):
              m(Starting)
            )
          )
        )
      }
    }

    //  TODO: Mobile  phone resize
    function SideBar(){

      function MenuItem(){
        return {
          view:(vnode)=>{
            let {route}= vnode.attrs
            return m(Tappable,{
              onclick:(e)=>{
                currentRoute = route
                m.redraw()
              }
            },
              m(Div,{
                padding:'0.5em 1em', 
                borderRadius:'0.5em',
                background:'white',
                color: currentRoute==route ? theme.maincolor:'black',
                cursor:'pointer',
                hoverBackground:theme.maincolor,
                hoverColor:'white',
                letterSpacing:'2px'
              }, vnode.children)
            )
          }
        }
      }
  
      return {
        view:(vnode)=>{
                    
          return [
            m(FlexCol,{
              color:'white', margin:'0em auto', padding:'1em',  zIndex:10040, position:'fixed', left:20
            }, 
              m(FlexCol,{alignItems:'center'},
                m(Img, {src:'./assets/agni_rojo.png', height:'90px', width:'auto'}),
                m(FlexCol,{gap:'1em'},
                  m(MenuItem,{route:''}, localize({va:'Inicio', es:'Inici'}).toUpperCase()),
                  m(MenuItem,{route:'services'}, localize({va:'Servicios', es:'Serveis'}).toUpperCase()),
                  m(MenuItem,{route:'gallery'}, localize({va:'Servicios', es:'Serveis'}).toUpperCase()),
                  m(MenuItem,{route:'room'}, localize({es:"La sala", va:"La sala"}).toUpperCase()),
                  m(MenuItem,{route:'contact'}, localize({va:'Contacto', es:'Contacte'}).toUpperCase()),
                )
              ),

              m(Div,{background:theme.maincolor, height:'0.5px', width:'100%'})
            
            )
          ]
        }
      }
    }


    function Starting(){
      return {
        view:(vnode)=>{
          return [
            m(H3, "HEHEHE UNETE A YOGA")
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
            m(Div,{padding:'1em', background:'white', borderRadius:'1em', margin:'1em', width:'50vw', border:'1px solid lightgrey'},
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
          image:'./assets/meditation.jpg',
          title: 'Yoga',
          description:'Estiraments per a fortaleir el cos',
          time: 'Dimarts i dijous de  18:00 a 19:30 i 19:30 a 21:00, Dilluns de 10:00 a 11:30 '
        },
        {
          image:'./assets/meditation.jpg',
          title: 'Meditació',
          time: 'Dimecres de 19:30 a 21:00'
        },
        {
          image:'./assets/group.jpg',
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
            m(Div,{id:'whoweare', padding:'2em', height:'100vh', background:'#F1EFF0'},
              m(Container,{height:'100vh'},
                m(FlexCol,
                m(H1, "Els nostres serveis".toUpperCase()),
                m(Box,{height:'10px'}),
                m(FlexCol,{gap:'1em', justifyContent:'space-between', flexGrow:1},
                  items.map((item,i)=>{
                    return m(BeautifulCard,{item:item, reverse:i%2 != 0})
                  })
                )
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
              }, m(H3,{color:'white'},"Si, me interesa")),

              m(Button,{
                  type:'secondary', 
                  fluid:true,
                  onclick:(e)=>{
                    let element = document.getElementById('whoweare')
                    element.scrollIntoView({behavior: "smooth", block: "start", inline: "end"});
                  }
                }, m(H3,"Saber Més")
              )
            )
          ))
        )
      }
    }

  }
  

  
}

export {LandingPage}