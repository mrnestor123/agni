import { localize } from "../../../components/util.js";
import { Box, Div, FlexCol, FlexRow } from '../../tenstages/public/src/components/layout.js'
import { H1, H2, Text} from './texts.js'



export { 
    TranslationInput, BackButton, Button, Icon, Input, Modal,  
    ModalFooter, ModalHeader, FormLabel, IntegerInput, Sidebar,
    Label, Message, Dropdown, Card, ModalContent, Checkbox, Spinner,
    ScaleInContainer, Table, TableHead, TableBody, TableCell, TableRow, 
    Img, Animation, Section, Divider
}


function BackButton(){

    return {
        view:(vnode)=>{
            let {route} = vnode.attrs

            return m(Button,{type:'secondary',onclick: () => m.route.set(route)},
                
                    m(Icon,{
                        icon:'arrow_back',
                        color:'black'
                    }),

                    m("div",{style:"width:10px"}),

                    localize({es:"Volver",va:"Tornar"})
                
            )
        }
    }
}


/*
* type: primary, secondary, danger
*/
function Button(){

    let colors = {
        primary:'white',
        secondary:'#4b4b4b',
        positive:'white',
        negative:'#db2828',
        default:'#4b4b4b',
        blue: 'white',
        danger:'red'
    }

    let border = {
        blue:'#2185d0',
        primary:'white',
        secondary:'#4b4b4b',
        default:'#4b4b4b',
        positive: '#00c853',
        negative:'#db2828',
        danger:'red'
    }

    let bg = {
        primary:'#1b1c1d',
        secondary:'white',
        default:'transparent',
        positive:'#00c853',
        blue: '#2185d0',
        negative:'transparent',
        danger:'white'
    }
    
    let brightness = 100;

    return {
        view:(vnode)=>{
            let { type='primary', fluid=false, onclick, disabled} = vnode.attrs
            
            return m("div",{
                style:{
                    paddingLeft:`1.5em`,
                    paddingRight:'1.5em',
                    cursor:'pointer',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor: bg[type],
                    fontFamily:'Poppins',
                    height:'40px',
                    color: colors[type],
                    border:`1px solid ${border[type]}`,  
                    filter:`brightness(${brightness}%)`,
                    borderRadius:'1em',
                    width: fluid ?'100%':'auto', 
                    opacity: disabled ? '0.7':'1',
                    ...vnode.attrs
                },
                onclick:!disabled && onclick,
                onmouseover:(e)=> brightness=80,
                onmouseout:(e)=> brightness=100,
                onmousedown:(e)=> brightness=60,
                onmouseup:(e)=> brightness=100,
            }, vnode.children)
        }
    }
}


/**
 * @attrs 
 * ICONOS DE GOOGLE
 * icon :(string)=> el nombre  del icono, ex: search
 *  
 * color:(string)=> color para el icono. black[default]
 * 
 * size:(string)=> small | medium[default] | large || huge
 * 
 * opacity:(double) => 1 [default]. Va de 0 a 1
 *   
 * El nombre del icono se saca de 
 * https://fonts.google.com/icons
 *
 **/
function Icon(){    
    let sizes = {
        'mini':'font-size:14px',
        'tiny':'font-size:16px',
        'small':'font-size:18px;',
        'medium':'',
        'large':'font-size:26px',
        'huge':'font-size:32px',
        'massive':'font-size:50px'
    }

    return {
        view:(vnode)=>{
            let {onclick} = vnode.attrs

            return m("span",{
                class:'material-icons', 
                onclick:vnode.attrs.onclick,
                style:`${sizes[vnode.attrs.size || 'medium']}; user-select: none;color:${vnode.attrs.color || 'black'};opacity:${vnode.attrs.opacity || 1};${onclick ? 'cursor:pointer':''}`,
                
            }, vnode.attrs.icon)
        }
    }
}


function Modal(){
    let modalStyle = {
        display:'block',
        width:'850px',
        margin:0,
        position:'absolute',
        backgroundColor:'white',
        margin:'0 auto',
        borderRadius:'1em',
        left:'50%',
        top:'50%',
        transform:'translate(-50%,-50%)',
        zIndex:1001,
        display:'flex',
        flexDirection:'column',

    }

    let sizes = {
        'small':'500px',
        'big':'850px'
    }
    
    let dimmerStyle = {
        backgroundColor: 'black',
        transition:'animate ease-in',
        position:'fixed',
        fontFamily:'Poppins',
        inset:'0px',
        zIndex:'1000',
    }

    return {
        view:(vnode)=>{
            if(vnode.attrs.size){
                modalStyle.width = sizes[vnode.attrs.size]
            }

            return m("div", {
                style: dimmerStyle
            }, m("div",{
                    style:modalStyle,
                    oncreate:({dom})=> dom.focus(),
                    onkeyup:(e)=>{
                        if (e.key==="Escape" && vnode.attrs.close) vnode.attrs.close()
                    }
                },  
                    vnode.attrs.header ?
                    m(FlexRow,{ justifyContent:'space-between',borderBottom: '2px solid lightgrey', padding:'1em', alignItems:'center'},
                        m(H2,{marginBottom:0}, vnode.attrs.header),

                        m(Icon,{size:'large', style:"cursor:pointer", icon:'cancel', onclick: vnode.attrs.close})
                    ) : null,

                    vnode.children
                )
            )
        }
    }
}


function ModalContent(){

    return {
        view:(vnode)=>{
            return m("div",{
                style:{
                    padding:'1em',
                    overflowY:'auto',
                    maxHeight:'50vh'
                }
            }, vnode.children)
        }
    }
}

function ModalHeader(){

    return {
        view:(vnode)=>{
            return m(FlexRow,{borderBottom:'2px solid lightgrey', justifyContent:'center', alignItems:'center', padding:'1em', fontWeight:'bold'},

                vnode.children
            
            )
        }
    }
}

function ModalFooter(){

    return {
        view:(vnode)=>{
            return m(FlexRow,{borderTop:'2px solid lightgrey', justifyContent:'end', padding:'1em'},

                vnode.children
            
            )
        }
    }
}


function FormLabel(){

    let labelStyle = `font-weight:normal;display: block;
    color: black; font-size: 1em;font-family: Poppins;
    margin-bottom: 0.5em;
    white-space: normal;`

    return {
        view:(vnode)=>{
            let {label, required} = vnode.attrs
            
            return [
                m(FlexRow,
                    m("label",{style:labelStyle}, vnode.children ),
                    required ? m("span", {style:"color:red;margin-left:0.5em;"}, '*'): null,
                )
            ]
        }
    }
}


function Input(){
    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;
        `
    

    return {
        view: (vnode)=>{
            let { data, name, oninput, type, label, required, rows, readonly } = vnode.attrs

            return [
                m(FlexCol,{width:'100%'},

                    label ? [
                        m(FormLabel,{required: required}, localize(label)),
                        m(Box,{height:'0.2em'})
                    ]:null,

                    

                    m(type =='textarea'? "textarea": "input", {
                        readonly: readonly || false,
                        rows:rows,
                        style: inputStyle+ (vnode.attrs.style ? vnode.attrs.style : ''),
                        value: data && data[name] ? data[name]: '',
                        oninput:(e)=>{
                            oninput ? oninput(e.target.value): ''

                            data && name ? data[name] = e.target.value : ''
                        },
                        ...type && type != 'textarea' ? {type:type}: {},
                        ...vnode.attrs.min && vnode.attrs.max ? {min:vnode.attrs.min, max:vnode.attrs.max}: {},
                        
                    })
                )

            ]
        }
    }
}

function TranslationInput(){

    let languages=['es','va']
    let selectedlang=0

    return {
        view:(vnode)=>{
            let {data, name, label, required, type, rows} = vnode.attrs

            if(!data[name]){
                data[name] = {}
            }else if(typeof data[name] == 'string'){
                data[name] = {'es':data[name]}
            }
            /*
            if(!data[name][languages[selectedlang]]){
                
            }*/

            return m(FlexCol,{width:'100%', },
                label ? m(FormLabel,{ required:required }, label) : null,

                m(FlexRow,{alignItems:'end'},
                m(Input,{
                    style:"flex-grow:2;border-radius:0em;",
                    rows: rows,
                    required:required,
                    data:data[name],
                    name: languages[selectedlang],
                    type: type,
                }),
                m(Button,{
                    type:'default',
                    style:{borderRadius:'0em', height:'100%'},
                    onclick:(e)=>{
                        selectedlang++
                        if(selectedlang>languages.length-1){
                            selectedlang=0
                        }
                    }
                }, languages[selectedlang])
                ),
                
            )
        }
    }
}


function Dropdown(){
    // beautiful dropdown style
    let dropdownStyle = {
        padding:'1em',
        border:'1px solid lightgrey',
        borderRadius:'0.5em',
        cursor:'pointer',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    }

    return {
        view:(vnode)=>{
            let {data, name,  onchange} = vnode.attrs

            return m("select",{
                style: dropdownStyle,
                onchange:(e)=>{
                    data[name] = e.target.value
                    onchange ? onchange(e.target.value): ''
                }
            },
                vnode.children.map((o)=> m("option",{value:o.value, selected: data[name] == o.value  || data[name].includes()}, o.label))
            )
        }
    }
}


function Message(){

    let messageStyle = {
        position: "relative",
        minHeight: "1em",
        margin: "0 0",
        background: "#f8ffff",
        padding: "1em 1.5em",
        lineHeight: "1.4285em",
        color: "#276f86",
        borderRadius: "1em",
        boxShadow: "0 0 0 2px #a9d5de inset,0 0 0 0 transparent"
    }

    return {
        view:(vnode)=>{
            return m("div", {
                style: messageStyle
            }, vnode.children)
        }
    }
}


/*
*
*   INPUT THAT ONLY GETS INTEGER NUMBERS
*
*/
function IntegerInput(){

    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;`

    let on = false;

    return {
        view: (vnode)=>{
            let { data, name, max, min=0, label, onchange, jump=1 } = vnode.attrs
            
            return [

                m("div",{style: inputStyle}, 
                    m(FlexRow,{alignItems:'center',justifyContent:'space-between'},
                        m("div",
                            data && name && data[name] ? data[name]: 0,
                            label ? m("label", label) : null,
                            // se le puede pasar elementos dentro
                            vnode.children 
                        ),

                        m(FlexRow,
                            m(Icon,{
                                icon:'remove',
                                color: data[name] && data[name] > 0 && data[name]>min ? 'black' : 'lightgrey',
                                onclick:(e)=>{
                                    if((!min || data[name]>min) &&  data[name] && data[name] > 0){
                                        data[name] -= jump
                                    }
                                    
                                    if(onchange) onchange(-1)
                                }
                            }),

                            m(Icon,{
                                icon:'add',
                                color: max !=undefined && (data[name] == max || max == 0) ? 'lightgrey': 'black',
                                onclick:(e)=>{
                                    if(!data[name]) data[name] = 0

                                    if(!max || data[name] < max){
                                        data[name] += jump
                                    }

                                    if(onchange) onchange(1)
                                }
                            })
                        )
                    )
                )
            ]
        }
    }
}


//TODO: LABEL
function Label(){
    let labelStyle = {
        display: "inline-block",
        lineHeight: "1",
        verticalAlign: "baseline",
        margin: "0 .14285714em",
        backgroundColor: "#e8e8e8",
        backgroundImage: "none",
        padding: ".5833em .833em",
        color: "rgba(0, 0, 0, .6)",
        textTransform: "none",
        fontWeight: "700",
        border: "0 solid transparent",
        borderRadius: ".28571429rem",
        transition: "background .1s ease"
    }



    return {
        view:(vnode)=>{
            return [
                m("div",{
                    style: labelStyle
                }, vnode.children)
            ]
        }
    }
}


function Checkbox(){

    let checkboxStyle = {
        width:'17px', 
        height:'17px',
        cursor:'pointer',
    }

    return {
        view:(vnode)=>{
            let {data, name, onchange,label, checked} = vnode.attrs

            return [
                m(FlexRow,
                    m("input",{
                        type:'checkbox',
                        checked: data && name ? data[name] : checked,
                        style: checkboxStyle,
                        onchange:(e)=>{
                            if(data && name){
                                data[name] = e.target.checked
                            }

                            onchange ? onchange(e): ''
                        }
                    }),
                    m(Box,{width:'0.5em'}),

                    m("label", localize(label))
                )
            ]
        }
    }
}


function Card(){

    let shadow = 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px'
    
    return {
        view: (vnode) => {
            let { photo, title, description} = vnode.attrs

            console.log('SADOW', shadow)
            
            return [
                m("div",{
                    style:"height:100%",
                    onclick: vnode.attrs.onclick,
                    onmouseenter:(e)=>{
                       vnode.attrs.onclick ? shadow = 'rgba(0, 0, 0, 0.35) 0px 5px 15px': null
                    },
                    onmouseleave:(e)=>{
                        shadow = 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px'

                        console.log('LEAVE', shadow)
                    },
                },
                    m(Div,{ 
                        boxShadow: shadow, cursor:'pointer', height:'100%',
                        borderRadius:'1em', position:'relative', padding:'0em'
                    },
                        m(FlexCol,{height:'100%'},
                            photo ?
                            m("img", { 
                                "src": photo + '?w=300', 
                                "style": { 
                                    "width": "100%",  "height": "auto", "max-height":'150px', "object-fit":"cover", "border-style": "none", 'border-top-left-radius':'1em', 'border-top-right-radius':'1em',
                                    ...vnode.attrs.imgStyle
                                    
                                } 
                            
                            })
                            : null,
                            
                            description || title ?
                            m(FlexCol,{flex:2, padding:'1em'},
                                m(H2,{width:'90%',marginTop:'0.5em'}, title),

                                description ? m(Text, m.trust(description)) : null,

                                m(Box,{height:'0.5em'}),
                            ) : null
                        ),

                        vnode.children
                    )
                )
            ]
        }
    }
}


function Spinner(){

    return {
        view:(vnode)=>{



           return [
                m(`style`,
                `.lds-ring {
                    /* change color here */
                    color: #1c4c5b
                }
                .lds-ring,
                .lds-ring div {
                    box-sizing: border-box;
                }
                .lds-ring {
                    display: inline-block;
                    position: relative;
                    width: 40px;
                    height: 40px;
                }
                .lds-ring div {
                    box-sizing: border-box;
                    display: block;
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    margin: 8px;
                    border: 8px solid currentColor;
                    border-radius: 50%;
                    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                    border-color: currentColor transparent transparent transparent;
                }
                .lds-ring div:nth-child(1) {
                    animation-delay: -0.45s;
                }
                .lds-ring div:nth-child(2) {
                    animation-delay: -0.3s;
                }
                .lds-ring div:nth-child(3) {
                    animation-delay: -0.15s;
                }
                @keyframes lds-ring {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }`


                ),

                m("div",{class:"lds-ring"}, m("div"),m("div"))
           ]
        }
    }
}


//FUNCIÓN DE SIDEBAR PARA UTILIZAR EN OTROS SITIOS
function Sidebar() {
    let transitions = { in: '.transition.animating.in.slide.left', out: '.transition.animating.out.slide.left' }

    let transition

    return {
        oninit: () => {
            transition = transitions.in
        },

        view: (vnode) => {
            //también podrías sarle tu la posición. Right,left,top...
            return m(`.ui.right.sidebar${transition}`,
                {

                    tabindex:'0',
                    oncreate: ({ dom }) => {
                        dom.focus()
                    },
                    onkeyup: (e) => {
                        console.log('ONKEYUP')
                        if (e.key === 'Escape' && vnode.attrs.close) {
                            vnode.attrs.close()
                        }
                    },
                    style: vnode.attrs.style,
                    class: vnode.attrs.class
                },
                vnode.children
            )
        },

        onbeforeremove: (vnode) => {
            return new Promise(function(resolve) {
                vnode.dom.classList.add('transition','animating','out','slide','left')
                setTimeout(resolve, 300)

                // modaltransition='.scaleOut';
                // dimmertransition = '.fadeOut';
                // call after animation completes

            })
        }
    }
}




function ScaleInContainer(){

    return {
        view:(vnode)=>{
            return m("div",{
                class:"transition scale in",
                style:vnode.attrs.style,
                onbeforeremove:(e)=>{
                    console.log('ONBEFOREREMOVE',e)
                    return new Promise(function (resolve) {
                        vnode.dom.classList.remove('in','transition','animating','scale')
                        vnode.dom.classList.add('visible','transition','animating','scale','out')
                        //vnode.dom.classList.add('transition fade out')
                        vnode.dom.addEventListener("animationend", resolve)
                    })
                }
            },vnode.children)
        }
    }
}



function Table(){
    let tableStyle = {
        width: "100%",
        background: "#fff",
        margin: "1em 0",
        border: "1px solid rgba(34,36,38,.15)",
        boxShadow: "none",
        borderRadius: "0.28571429rem",
        textAlign: "left",
        color: "rgba(0,0,0,.87)",
        borderCollapse: "separate",
        borderSpacing: "0",
        borderRadius:'1em'
    }


    return {
        view:(vnode)=>{
            return m("table",{
                style:tableStyle,
            }, vnode.children)
        }
    }
}

function TableHead(){
    let style = {
        boxShadow: "none",
        padding:'1em',
        cursor: "auto",
        background: "#24303f",
        textAlign: "inherit",
        color: "white",
        borderTopRadius:'1em',
        verticalAlign: "inherit",
        fontWeight: 700,
        textTransform: "none",
        borderBottom: "1px solid rgba(34,36,38,.1)",
        borderLeft: "none"
    }
    

    return {
        view:(vnode)=>{
            return m("thead",{
                style: style
            }, vnode.children
            )
        }
    }
}

function TableBody(){

    return {
        view:(vnode)=>{
            return m("tbody",
                vnode.children
            )
        }
    }
}

function TableRow(){
    return {
        view:(vnode)=>{
            return m("tr",{
                style:{
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    
    }
}

function TableCell(){
    return {
        view: (vnode) => {
            let {header= false}=vnode.attrs

            return m(header ? "th" : "td",{
                style: {
                    textAlign:'center',
                    padding:'1em',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function Img(){
    return {
        view: (vnode) => {
            return  m("img",{
                src: vnode.attrs.src,
                id: vnode.attrs.id,
                style: {
                    ...vnode.attrs
                }
            })
        }
    }
}

function Animation() {
    return {
      oncreate: ({ attrs, dom }) => {
        setTimeout(()=>{
          Object.keys(attrs.after).forEach(attr => {
            dom.style[attr] = attrs.after[attr]
          })
        },100)
      },
      view: ({ attrs, children }) => {
        return m("div", {
          style: attrs.before,
        }, children)
      }
    }
} 


function Section(){
    
    return {
        view: (vnode) => {
            let {title, description} = vnode.attrs

            return [
                m(Div,{id:vnode.attrs.id},
                    m(FlexCol,{width:'100%', padding:'1em', minHeight:'100vh', },
                        
                        title ? m(H1,{marginBottom:'0.5em'}, title) : null,

                        description ? m(Text, description) : null,

                        vnode.children
                    )
                )
            ]
        }
    }
}


function Divider(){

    return {
        view : (vnode) => {
            return m("div",{
                style:{
                    borderBottom:'1px solid lightgrey',
                    width:'100%',
                    margin:'2em 0',
                    ...vnode.attrs
                }
            })
        }
    }
}