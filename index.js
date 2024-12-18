import {  LandingPage  } from "./pages.js"


// La página web puede tener otro html y otro enrutador !!

m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, LandingPage)
        },
    }
})


/// HACEMOS LOGIN SOLO EN TENSTAGES-MANAGEMENT !!
function Layout() {
    let route = 'home'
    // DE MOMENTO PASAMOS EL USUARIO ASI !!!

    return {
        view: (vnode) => {
            return [
                vnode.children.map((child) => {
                    return m("main", [
                        m(child, vnode.attrs)
                    ])
                }),
            ]
        }
    }
}

