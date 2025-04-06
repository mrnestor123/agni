

export {  H1, H2, Text,  SmallText }

/*
*
* TEXTS
*
*/
let theme = {
    heading:'Yanone-bold',
    body: 'Roboto',

    desktop: {
        h1:  '3.5rem',
        h2:  '3rem',
        text: '1.6rem',
        smallText: '1rem',
    },
    mobile: {
        h1:  '20px',
        h2:  '18px',
        text: '16px',
        smallText: '14px',
    }
}

let isMobile = false;
 

window.addEventListener('resize', ()=>{
    if(window.innerWidth < 800){
        isMobile = true;
    } else {
        isMobile = false;
    }
    m.redraw()
})


function H1(){
    return {
        view:(vnode)=>{
            isMobile = window.innerWidth < 1000;

            return [

                m("h1",{
                    style: {
                        marginBottom:'0.1rem',
                        fontFamily:'Yanone-bold',
                        fontSize: isMobile ? theme.mobile.h1 : theme.desktop.h1,
                        ...vnode.attrs
                    }
                }, vnode.children)
            ]
        }
    }
}

function H2(){
    return {
        view:(vnode)=>{
            isMobile = window.innerWidth < 1000;

            return m("h2",{
                style: {
                    fontSize: isMobile ? theme.mobile.h2 : theme.desktop.h2,
                    ...vnode.attrs
                },
                oncreate: vnode.attrs.oncreate
            }, vnode.children)
        }
    }
}


function Text(){
    return{ 
        view:(vnode)=>{
            isMobile = window.innerWidth < 1000;

            return m("p",{
                style: {
                    marginTop:0,
                    fontSize: isMobile ? theme.mobile.text : theme.desktop.text,
                    ...vnode.attrs
                },
                oncreate: vnode.attrs.oncreate
            }, vnode.children)
        }
    }
}

function SmallText(){
    return{ 
        view:(vnode)=>{
            isMobile = window.innerWidth < 1000;

            return m("p",{
                style: {
                    color:'black',
                    fontSize: isMobile ? theme.mobile.smallText : theme.desktop.smallText,
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}