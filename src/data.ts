// Fotos reales de El Poli (public/fotos, numeradas igual que la carpeta original).
export const foto = (n: string | number) => `/fotos/${n}.jpg`;

export const WHATSAPP = '573105008733'; // número de prueba

export const cop = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const INSTAGRAM = 'elpoli.reposteria'; // TODO: usuario real
// Opcional: endpoint de Formspree / Web3Forms para recibir pedidos desde la página (con foto).
export const FORM_ENDPOINT: string = import.meta.env.VITE_FORM_ENDPOINT ?? '';

export type Category = 'Tortas' | 'Cheesecakes' | 'Mini tortas' | 'Cupcakes' | 'Caseras';

export interface Product {
  id: string;
  name: string;
  desc: string;
  category: Category;
  image: string;
  from: number; // TODO: confirmar precios reales con El Poli
  note: string; // tamaños / unidades
  tag?: string;
}

export const CATEGORIES: ('Todo' | Category)[] = ['Todo', 'Tortas', 'Cheesecakes', 'Mini tortas', 'Cupcakes', 'Caseras'];

export const PRODUCTS: Product[] = [
  { id: 'vainilla-arequipe', name: 'Ponqué de vainilla con arequipe', category: 'Tortas', tag: 'La más pedida', from: 45000, note: 'De 8 a 80 porciones',
    desc: 'La clásica de cumpleaños: ponqué de vainilla relleno de arequipe, decorada con tus colores.', image: foto(40) },
  { id: 'vainilla-chocolate', name: 'Ponqué de vainilla con chocolate', category: 'Tortas', from: 45000, note: 'De 8 a 30 porciones',
    desc: 'Ponqué de vainilla relleno de chocolate, con crema y el diseño que quieras.', image: foto(13) },
  { id: 'chocolatosa', name: 'Torta chocolatosa', category: 'Tortas', from: 50000, note: 'De 8 a 15 porciones',
    desc: 'Chocolate relleno de chocolate, con drip, crema y chocolatinas encima.', image: foto(17) },
  { id: 'fresas', name: 'Torta fría de fresas con crema', category: 'Tortas', from: 60000, note: '15 porciones',
    desc: 'Fresca y suave, rellena de fresas con crema. Ideal para tarde de onces.', image: foto(4) },
  { id: 'arequipe', name: 'Torta de arequipe', category: 'Tortas', from: 50000, note: 'Hasta 100 porciones',
    desc: 'Capas y capas de arequipe con chocolate granulado. Para los más golosos.', image: foto(14) },
  { id: 'chocolate-maracuya', name: 'Chocolate con ganache de maracuyá', category: 'Tortas', from: 65000, note: 'Por encargo',
    desc: 'Chocolate intenso con ganache de maracuyá: dulce y ácido a la vez.', image: foto(37) },
  { id: 'cheese-frutos', name: 'Cheesecake de frutos rojos', category: 'Cheesecakes', tag: 'Favorito', from: 70000, note: 'De 15 a 20 porciones',
    desc: 'Cremoso, con base de galleta, mermelada de frutos rojos, fresas y arándanos.', image: foto(10) },
  { id: 'cheese-maracuya', name: 'Cheesecake de maracuyá', category: 'Cheesecakes', from: 70000, note: '15 porciones',
    desc: 'Con cubierta de maracuyá, crema y chocolate granulado alrededor.', image: foto(11) },
  { id: 'mini-mensaje', name: 'Mini torta con mensaje', category: 'Mini tortas', tag: 'Para regalar', from: 25000, note: 'Personal · en cajita',
    desc: 'Mini personal de arequipe con el dibujo y la frase que tú quieras. El detalle perfecto.', image: foto(29) },
  { id: 'mini-zanahoria', name: 'Mini torta de zanahoria', category: 'Mini tortas', from: 25000, note: 'Personal',
    desc: 'Zanahoria con frutos secos, crema y nuez encima.', image: foto(32) },
  { id: 'cupcakes-vainilla', name: 'Cupcakes decorados', category: 'Cupcakes', from: 4000, note: 'Por unidad · desde 12',
    desc: 'Cupcakes de vainilla con flores de crema. Perfectos para mesas dulces y eventos.', image: foto(18) },
  { id: 'cupcakes-banana', name: 'Cupcakes de banana con chips', category: 'Cupcakes', from: 3500, note: 'Por unidad · desde 12',
    desc: 'Esponjosos, de banana con chips de chocolate. Para el café o la lonchera.', image: foto(39) },
  { id: 'zanahoria', name: 'Torta de zanahoria', category: 'Caseras', from: 45000, note: '15 porciones',
    desc: 'Con frutos secos, húmeda y especiada, como la de la abuela.', image: foto(33) },
  { id: 'auyama', name: 'Torta de auyama con queso y bocadillo', category: 'Caseras', tag: 'De la casa', from: 45000, note: 'Entera',
    desc: 'Receta tradicional: auyama, queso y trocitos de bocadillo.', image: foto(41) },
  { id: 'naranja', name: 'Ponqué de naranja y amapola', category: 'Caseras', from: 35000, note: 'Entero',
    desc: 'Con semillas de amapola, glaseado y rodajas de naranja.', image: foto(35) },
];

export const ORDER_TYPES = ['Torta', 'Cheesecake', 'Mini torta con mensaje', 'Cupcakes', 'Casera (zanahoria, auyama, naranja)', 'Otro / no sé todavía'];

export type Occasion = 'Cumpleaños' | 'Infantiles' | 'Celebraciones' | 'Mini tortas';
export const OCCASIONS: ('Todos' | Occasion)[] = ['Todos', 'Cumpleaños', 'Infantiles', 'Celebraciones', 'Mini tortas'];
export interface Work { id: string; title: string; occasion: Occasion; image: string; note: string }

export const WORKS: Work[] = [
  { id: 'w19', title: 'Rosas y fresas', occasion: 'Cumpleaños', image: foto(19), note: 'Vainilla con arequipe, drip rosado, rosas naturales y fresas · 15 porciones' },
  { id: 'w6', title: 'Dos pisos de osito', occasion: 'Infantiles', image: foto(6), note: 'Dos pisos con el personaje favorito y su nombre · 50 a 60 porciones' },
  { id: 'w1', title: 'Aniversario en tres pisos', occasion: 'Celebraciones', image: foto(1), note: 'Tres pisos en verde y crema con flores · hasta 100 porciones' },
  { id: 'w9', title: 'Happy Birthday con rosas', occasion: 'Cumpleaños', image: foto(9), note: 'Ponqué de chocolate relleno de chocolate, rosas, perlas y corona' },
  { id: 'w29', title: 'Un abrazo a la distancia', occasion: 'Mini tortas', image: foto(29), note: 'Mini personal de arequipe con dibujo y mensaje, en cajita' },
  { id: 'w12', title: 'Minnie · 3 años', occasion: 'Infantiles', image: foto(12), note: 'Vainilla con arequipe, rosetones rosados · 30 porciones' },
  { id: 'w22', title: 'Feliz grado', occasion: 'Celebraciones', image: foto(22), note: 'Vainilla con chocolate y topper de la profesión · 8 porciones' },
  { id: 'w15', title: 'Azul con drip dorado', occasion: 'Cumpleaños', image: foto(15), note: 'Vainilla con arequipe en degradado azul · 30 porciones' },
  { id: 'w20', title: 'K-Pop Demon Hunters', occasion: 'Infantiles', image: foto(20), note: 'Vainilla con chocolate, toppers de los personajes · 30 porciones' },
  { id: 'w27', title: 'Te amo', occasion: 'Mini tortas', image: foto(27), note: 'Mini personal de arequipe para sorprender a alguien' },
  { id: 'w24', title: 'Mariposas doradas', occasion: 'Cumpleaños', image: foto(24), note: 'Vainilla con chocolate, mariposas, corona y esferas · 15 porciones' },
  { id: 'w23', title: 'Dos pisos de granja', occasion: 'Infantiles', image: foto(23), note: 'Vainilla con arequipe, personajes y nombre · 80 porciones' },
  { id: 'w21', title: 'Corazón "I\'m feeling 22"', occasion: 'Cumpleaños', image: foto(21), note: 'Torta corazón estilo vintage · 10 porciones' },
  { id: 'w25', title: 'No hay plata, pero…', occasion: 'Mini tortas', image: foto(25), note: '"…alcanzó para la torta". Zanahoria con frutos secos · 15 porciones' },
  { id: 'w8', title: 'Paw Patrol', occasion: 'Infantiles', image: foto(8), note: 'Torta alta con todos los cachorros' },
  { id: 'w7', title: 'Grado de psicóloga', occasion: 'Celebraciones', image: foto(7), note: 'Torta con dibujo y mensaje divertido para la graduada' },
  { id: 'w16', title: 'Rosa con moño', occasion: 'Cumpleaños', image: foto(16), note: 'Vainilla con arequipe, moño y perlas · 30 porciones' },
  { id: 'w31', title: 'Jurassic', occasion: 'Infantiles', image: foto(31), note: 'Vainilla con arequipe y dinosaurios · 8 porciones' },
  { id: 'w26', title: 'Amigo más que hermano', occasion: 'Mini tortas', image: foto(26), note: 'Con mensaje y dibujos · 20 porciones' },
  { id: 'w3', title: 'Rosas y mariposas', occasion: 'Cumpleaños', image: foto(3), note: 'Vainilla rellena de chocolate · 25 a 30 porciones' },
  { id: 'w28', title: 'Feliz cumple en cajita', occasion: 'Mini tortas', image: foto(28), note: 'Mini personal de arequipe con nombre' },
  { id: 'w30', title: 'Aquí tienes tu regalo', occasion: 'Mini tortas', image: foto(30), note: 'Mini personal de arequipe con corazones' },
];

// TODO: reemplazar por reseñas reales de clientes.
export const REVIEWS = [
  { name: 'Valentina R.', text: 'La torta de rosas y fresas estaba deliciosa y llegó perfecta. Todos preguntaron dónde la había comprado.', occ: 'Cumpleaños' },
  { name: 'Camilo P.', text: 'Le pedí la mini torta con mensaje a mi novia y le encantó. Súper fácil por WhatsApp.', occ: 'Detalle' },
  { name: 'Daniela M.', text: 'Le mostré una foto de los personajes favoritos de mi hija y la torta quedó igualita, o mejor.', occ: 'Cumpleaños infantil' },
  { name: 'Juliana G.', text: 'El cheesecake de maracuyá es otra cosa. Ya voy por el tercero este mes.', occ: 'Cliente frecuente' },
  { name: 'Sebastián L.', text: 'La torta de auyama con queso y bocadillo me recordó a la de mi abuela. Se nota el cariño.', occ: 'Aniversario' },
];

export const FAQ = [
  { q: '¿Con cuánta anticipación debo pedir?', a: 'Idealmente con 3 días. Como todo lo hago yo en casa, recibo pocos pedidos por día: entre más pronto me escribas, más seguro tu fecha.' },
  { q: '¿Para cuántas personas hacen tortas?', a: 'Desde mini tortas personales hasta tortas de varios pisos para 100 porciones. Cuéntame cuántos son y te recomiendo el tamaño.' },
  { q: '¿Dónde recojo mi pedido?', a: 'Lo recoges en casa (te mando la ubicación por WhatsApp) o te lo llevo a domicilio según la zona.' },
  { q: '¿Cómo se paga?', a: 'Separas tu fecha con el 50% por Nequi, Daviplata o transferencia, y el resto al recibir.' },
  { q: '¿Puedes hacer una torta con personajes o una foto que vi?', a: '¡Claro! Súbela en el formulario o mándala por WhatsApp y te digo cómo la hago, el tamaño y el precio.' },
];
