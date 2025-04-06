import {  localize } from './util.js'
import { Modal, ModalFooter, ModalHeader, Button, Icon } from './elements.js'
import { Box, Div, H2 } from './layout.js'


export { confirmDialog, alertDialog }


// DIÁLOGOS
function confirmDialog(options={'title':'','message':'','buttonLabels':[],'then':()=>{}, 'multiple':false, 'onSaveAnswer':()=>{}}){
    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:1000000;position:fixed'
    elem.id = Math.random()*10000 + ''
    document.getElementsByTagName('main')[0].appendChild(elem);

    console.log(document.body.clientHeight)
    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
      onbeforeremove:()=>{
          console.log('removing')
          return new Promise(function(resolve) {
              //console.log(vnode.attrs.transition)
              //console.log(vnode.dom.classList);
              vnode.dom.classList.add('fade', 'out')
              vnode.dom.children[0].classList.add('scale', 'out')
              setTimeout(resolve, 300)
          })
      },
      view:()=>  m(Modal, {size:'tiny'},
              m(ModalHeader, m(H2, options.title || 'Confirma la acción')),
              
              m(Div,{padding:'1em'},    m.trust(options.message)),
              
              m(ModalFooter,
                  
                  m(Button, {
                    type:'negative',
                    onclick:()=>{options.then ? options.then(false):null; elem.remove()}}, options.buttonLabels ? options.buttonLabels[1] : localize({es:'Cancelar',va:'Cancel·lar'})
                  ),

                  m(Box,{width:'10px'}),
              
                  m(Button, {
                    type:'positive',
                    onclick:()=>{options.then ? options.then(true):null; elem.remove()}
                  }, options.buttonLabels ? options.buttonLabels[0] : localize({es:'Aceptar',va:'Acceptar'}))
              )
          )
    })
}



// DIÁLOGO DE CONFIRMACIÓN CON SEMANTIC !
// PARA LAS ALERTAS DE ERROR ??
function alertDialog(options={'title':'','message':'','buttonLabels':[],type:"success",'then':()=>{}, 'multiple':false}){
    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed')
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);

    if(typeof options == 'string'){
        options = {message:options}
    }
    console.log('options',options)

    let types = {
        'info':{
            icon:'info',
        },
        'warning':{
            icon:'warning', 
        },
        'error':{
            icon:'error',
            text:'Error',
            color:'#db2828'
        },
        'success':{
            text:'Éxito',
            icon:'check_circle',
            color:'#00c853'
        }
    }

    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        onbeforeremove:()=>{
            console.log('removing')
            return new Promise(function(resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out')
                vnode.dom.children[0].classList.add('scale', 'out')
                setTimeout(resolve, 300)
            })
        },
        view:()=> m(Modal, { size:'tiny' },
                types[options.type] || options.title ? 
                m(ModalHeader,
                    m(Icon,{icon: types[options.type]?.icon, color: types[options.type]?.color }),
                    m(Box,{width:'10px'}),
                    m(H2,{marginTop:0}, types[options.type]?.text || options.title)
                ):  null,

                m(Div,{padding:'1em'}, m.trust(options.message)),

                m(ModalFooter,
                    m(Button, {
                        onclick:(e)=>{
                            options.then ? options.then():null; 
                            elem.remove()
                        },
                        type:'negative'
                    },
                    options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cerrar',va:"Tancar"}))
                )
            )
    })
}
