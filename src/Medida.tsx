import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { foto } from './data';
import { Magnetic, Reveal, SplitHeading, btnPrimary, ease } from './ui';

const CHOICES = [
  { n: '01', t: 'Tú eliges la ocasión', d: 'Cumpleaños, aniversarios, grados, baby shower, amor y amistad, día de la madre… o simplemente un antojo de martes.', img: foto(1) },
  { n: '02', t: 'Tú eliges la presentación', d: 'Personal para ti solo, en cajita para regalar, para compartir en familia o de varios pisos para 100 personas.', img: foto(28) },
  { n: '03', t: 'Tú eliges el mensaje', d: 'Un nombre, una frase, un dibujo o ese chiste que solo ustedes entienden. Para dedicar y sorprender.', img: foto(25) },
  { n: '04', t: 'Tú eliges los colores', d: 'Tus colores, tus personajes favoritos, flores naturales, toppers, dorados… para toda ocasión y todo gusto.', img: foto(20) },
];

const MAKES = ['Tortas', 'Tortas frías', 'Cheesecakes', 'Mini tortas', 'Cupcakes', 'Brownies', 'Galletas', 'Ponqués', 'Postres para mesa dulce'];
const SIZES = [
  { t: 'Personal', d: 'Para darte un gusto' },
  { t: 'Para regalar', d: 'En cajita, con dedicatoria' },
  { t: 'Para compartir', d: 'De 8 a 30 porciones' },
  { t: 'Para eventos', d: 'Hasta 100 porciones' },
];

export function Medida() {
  return (
    <section id="medida" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal><p className="eyebrow">Hecho a tu medida</p></Reveal>
            <SplitHeading text="Tú lo imaginas, *yo lo horneo.*" className="mt-4 text-[clamp(2.8rem,6vw,5.5rem)]" />
          </div>
          <Reveal delay={0.1} className="max-w-md text-soft lg:justify-self-end">
            Nada sale de un molde repetido: cada pedido se arma contigo. Sabor, tamaño, colores y mensaje, para comértelo solo, regalarlo o celebrar en grande.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHOICES.map((c, i) => (
            <motion.article
              key={c.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-paper ring-1 ring-line"
            >
              <div className="aspect-[4/3] overflow-hidden bg-butter">
                <img src={c.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-bold tracking-[0.2em] text-berry">{c.n}</span>
                <h3 className="display mt-2 text-[1.6rem] leading-tight">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-soft">{c.d}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 rounded-[2rem] bg-blush/60 p-7 sm:p-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Lo que horneo</p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {MAKES.map((m) => (
                <li key={m} className="rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink ring-1 ring-line">{m}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-soft">¿Tienes algo distinto en mente? Pregúntame: si se puede hornear, lo intentamos.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Del tamaño que necesites</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {SIZES.map((s) => (
                <li key={s.t} className="rounded-2xl bg-paper p-4 ring-1 ring-line">
                  <b className="display block text-xl">{s.t}</b>
                  <span className="text-sm text-soft">{s.d}</span>
                </li>
              ))}
            </ul>
            <Magnetic href="#pedido" className={`${btnPrimary} mt-6`}>
              Cuéntame tu idea <ArrowUpRight size={16} />
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
