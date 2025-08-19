

export {  H1, H2, Text,  SmallText }

// Lista de atributos conocidos que NO son estilos CSS directos
const knownNonStyleAttrs = new Set([
'key',
'class', // 'className' también es común en React, pero 'class' en Mithril/HTML
'id',
'onclick',
'oncreate',
'onupdate',
'onbeforeremove',
'onremove',
'style', // Manejaremos el objeto style explícito por separado
'role',
// Añade aquí otros atributos específicos de ARIA o HTML que uses a menudo
// y no quieras que se traten como estilos si los pasas directamente.
// Por ejemplo: 'href', 'target', 'type', 'disabled', 'placeholder', 'src', 'alt',
// 'aria-label', 'aria-labelledby', 'aria-describedby', 'tabindex'
]);


/**
 * Función helper para separar atributos de estilo de otros atributos.
 * @param {object} attrs - Los atributos pasados al componente (vnode.attrs).
 * @returns {{ styles: object, otherAttrs: object }} - Un objeto con los estilos recolectados y los demás atributos.
 */
function processAttrs(attrs) {
const styles = {};
const otherAttrs = {};

for (const key in attrs) {
    if (key === 'style' && typeof attrs.style === 'object') {
    // Si se pasa un objeto 'style' explícito, lo fusionamos luego
    Object.assign(styles, attrs.style);
    } else if (!knownNonStyleAttrs.has(key)) {
    // Si no es un atributo conocido NO estilo, asumimos que es un estilo
    styles[key] = attrs[key];
    } else if (key !== 'style') {
    // Si es un atributo conocido NO estilo (y no es 'style'), lo pasamos directo
    otherAttrs[key] = attrs[key];
    }
}
return { styles, otherAttrs };
}

// --- Componentes de Texto Refactorizados ---

function H1() {
return {
    view: (vnode) => {
    // Procesamos los atributos para separar estilos de otros attrs
    const { styles, otherAttrs } = processAttrs(vnode.attrs);

    // Renderizamos 'h1'. Los estilos base vienen de CSS.
    // Los estilos calculados (styles) se aplican inline.
    // Los otros atributos (otherAttrs) se aplican directamente.
    return m("h1", {
        ...otherAttrs, // Pasa id, class, oncreate, etc.
        style: styles   // Pasa los estilos recolectados y fusionados
    }, vnode.children); // Usa vnode.children correctamente
    }
};
}

function H2() {
return {
    view: (vnode) => {
    const { styles, otherAttrs } = processAttrs(vnode.attrs);

    return m("h2", {
        ...otherAttrs,
        style: styles
    }, vnode.children); // Usa vnode.children
    }
};
}

function Text() {
return {
    view: (vnode) => {
    const { styles, otherAttrs } = processAttrs(vnode.attrs);

    // Añadimos clase base opcional
    return m("p.text-component", {
        ...otherAttrs,
        style: styles
    }, vnode.children); // Usa vnode.children
    }
};
}

function SmallText() {
return {
    view: (vnode) => {
    const { styles, otherAttrs } = processAttrs(vnode.attrs);

    // Añadimos clase base específica
    return m("p.small-text-component", {
        ...otherAttrs,
        style: styles
    }, vnode.children); // Usa vnode.children
    }
};
}
  
  
  