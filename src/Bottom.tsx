import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Plus, MessageCircle, MapPin, Clock, Instagram, ArrowUpRight, Palette, ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { scrollToSection } from './cart';
import { FAQ, INSTAGRAM, REVIEWS, WHATSAPP, foto } from './data';
import { Logo } from './Top';
import { Magnetic, Reveal, SplitHeading, btnPrimary, ease } from './ui';

const STEPS = [
  { t: 'Me cuentas', d: 'Qué quieres, para cuántas personas y la fecha. Si tienes una foto de referencia, mejor.' },
  { t: 'Te confirmo', d: 'Reviso si tengo cupo ese día y te paso el precio por WhatsApp.' },
  { t: 'Separas', d: 'Con el 50% por Nequi, Daviplata o transferencia aparto tu fecha.' },
  { t: 'Horneo y entrego', d: 'Lo preparo fresquito para tu día. Lo recoges en casa o te lo llevo.' },
];

export function Como() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const line = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <section id="como" className="scroll-mt-20 bg-ink px-4 py-24 text-paper sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Reveal><p className="eyebrow !text-paper/60">03 — Cómo funciona</p></Reveal>
            <SplitHeading text="Así de *fácil* es pedir." className="mt-4 text-[clamp(2.6rem,5.6vw,5rem)] [&_em]:!text-blush" />
          </div>
          <Reveal delay={0.1} className="max-w-md text-paper/70 lg:justify-self-end">
            Sin intermediarios: hablas directamente con quien hornea tu pedido.
          </Reveal>
        </div>
        <div ref={ref} className="relative mt-16">
          <div className="absolute left-0 right-0 top-[1.9rem] hidden h-px bg-paper/15 lg:block">
            <motion.div style={{ width: line }} className="h-full bg-blush" />
          </div>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.1}>
                <li className="relative list-none">
                  <span className="display relative z-10 grid h-[3.8rem] w-[3.8rem] place-items-center rounded-full border border-paper/20 bg-ink text-2xl">
                    <em className="!text-blush">{i + 1}</em>
                  </span>
                  <h3 className="display mt-6 text-3xl">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/65">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Resenas() {
  return (
    <section className="overflow-hidden py-24 lg:py-32" aria-label="Opiniones de clientes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><p className="eyebrow">05 — Lo que dicen</p></Reveal>
        <SplitHeading text="Hechas con cariño, *comidas* con gusto." className="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)]" />
      </div>
      <div className="relative mt-14 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee marquee-slow hover:[animation-play-state:paused]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-5 pr-5" aria-hidden={k === 1}>
              {REVIEWS.map((r, i) => (
                <figure key={r.name} className={`w-[20rem] shrink-0 rounded-[1.75rem] p-7 sm:w-[24rem] ${i % 2 ? 'bg-blush' : 'bg-paper ring-1 ring-line'}`}>
                  <div className="display text-6xl leading-none text-berry">“</div>
                  <blockquote className="display -mt-3 text-[1.45rem] !leading-snug !tracking-tight">{r.text}</blockquote>
                  <figcaption className="mt-6 flex items-center justify-between text-sm">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-soft">{r.occ}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contacto() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-4 pb-24 sm:px-6 lg:pb-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">
        <div id="contacto" className="scroll-mt-28">
          <Reveal delay={0.05}>
            <div className="relative overflow-hidden rounded-[2rem] bg-blush p-8 sm:p-12">
              <img src={foto(4)} alt="" aria-hidden className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full object-cover opacity-85 ring-8 ring-paper/60 sm:h-72 sm:w-72" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <img src="/logo-circle.png" alt="Logo Amor Hecho Postre" className="h-20 w-20 shrink-0 rounded-full bg-[#FFF4E0] object-cover shadow-md ring-4 ring-paper" />
                  <div>
                    <p className="eyebrow">Contacto directo</p>
                    <p className="display mt-1 text-2xl">Amor Hecho <em>Postre</em></p>
                  </div>
                </div>
                <h3 className="display mt-6 max-w-sm text-4xl sm:text-5xl">¿Tienes una fecha <em>especial?</em></h3>
                <p className="mt-4 max-w-xs text-soft">Escríbeme y cuéntame qué celebras. Te respondo el mismo día.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Magnetic href={`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent('¡Hola! Quiero cotizar un pedido 🎂')}`} className={btnPrimary}>
                    <MessageCircle size={17} /> WhatsApp · 310 500 8733
                  </Magnetic>
                  <a
                    href={`https://instagram.com/${INSTAGRAM}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-5 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-ink"
                  >
                    <Instagram size={16} /> @{INSTAGRAM}
                  </a>
                  <button
                    type="button"
                    onClick={() => scrollToSection('#pedido')}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-5 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-ink"
                  >
                    <ImagePlus size={16} /> Ir al formulario
                  </button>
                </div>
                <ul className="mt-9 grid max-w-[17rem] gap-4 text-sm sm:max-w-xs">
                  <li className="flex gap-3"><Clock size={18} className="mt-0.5 shrink-0 text-berry" /><span><b>Pedidos todos los días</b><br /><span className="text-soft">Entregas con cita, según disponibilidad</span></span></li>
                  <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-berry" /><span>Hecho en casa · recoges aquí<br /><span className="text-soft">Domicilio según la zona</span></span></li>
                  <li className="flex gap-3"><Instagram size={18} className="mt-0.5 shrink-0 text-berry" /><span>@{INSTAGRAM}</span></li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        <div id="preguntas" className="scroll-mt-28">
          <Reveal><p className="eyebrow">06 — Preguntas frecuentes</p></Reveal>
          <SplitHeading text="Lo que *siempre* nos preguntan." className="mt-4 text-[clamp(2.2rem,4.4vw,3.8rem)]" />
          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="text-lg font-semibold">{f.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.35, ease }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-line">
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <p className="max-w-lg pb-6 text-soft">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line bg-paper px-4 pt-16 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-soft">Repostería casera por encargo. Hecho a mano en mi cocina, con ingredientes frescos y mucho cariño.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <ul className="space-y-2.5">
            {[['Catálogo', '#catalogo'], ['Galería', '#galeria'], ['Hacer un pedido', '#pedido']].map(([l, h]) => (
              <li key={h}>
                <a
                  href={h}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(h);
                  }}
                  className="text-soft hover:text-ink"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <ul className="space-y-2.5">
            <li><a href={`https://api.whatsapp.com/send?phone=${WHATSAPP}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-soft hover:text-ink">WhatsApp <ArrowUpRight size={13} /></a></li>
            <li><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-soft hover:text-ink">Instagram <ArrowUpRight size={13} /></a></li>
            <li>
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contacto');
                }}
                className="text-soft hover:text-ink"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>
      <motion.p
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
        className="display mx-auto mt-14 max-w-7xl select-none whitespace-nowrap text-center text-[clamp(2.5rem,10.5vw,11rem)] !leading-[0.82]"
        aria-hidden
      >
        Amor Hecho <em>Postre</em>
      </motion.p>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 border-t border-line py-6 text-xs text-soft">
        <span>© {new Date().getFullYear()} Amor Hecho Postre · Repostería casera</span>
        <span>Horneado en casa con mucho amor ♥</span>
      </div>
    </footer>
  );
}

const PALETTES = [
  { id: 'fresa', name: 'Fresa', c: ['#fff4e0', '#fad9d2', '#d94b48'] },
  { id: 'pistacho', name: 'Pistacho', c: ['#f7f5ea', '#e9ebd2', '#5f7d45'] },
  { id: 'lavanda', name: 'Lavanda', c: ['#f8f4f6', '#ece3ee', '#7b4f9a'] },
];

/** Selector de paleta (versiones de color) */
export function PaletteDock() {
  const [p, setP] = useState(() => {
    try { return localStorage.getItem('amorhechopostre-palette') || 'fresa'; } catch { return 'fresa'; }
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.palette = p;
    try { localStorage.setItem('amorhechopostre-palette', p); } catch { /* sin almacenamiento */ }
  }, [p]);
  return (
    <div className="fixed bottom-5 left-4 z-[55] flex items-center gap-2 sm:left-6">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Cambiar paleta de colores" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper/90 shadow-lg backdrop-blur hover:border-ink">
        <Palette size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, x: -10, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3, ease }} className="flex gap-1 rounded-full border border-line bg-paper/95 p-1.5 shadow-lg backdrop-blur">
            {PALETTES.map((x) => (
              <button key={x.id} onClick={() => setP(x.id)} aria-pressed={p === x.id} className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-xs font-semibold transition-colors ${p === x.id ? 'bg-ink text-paper' : 'text-soft hover:text-ink'}`}>
                <span className="flex -space-x-1.5">{x.c.map((c) => <span key={c} className="h-5 w-5 rounded-full ring-2 ring-paper" style={{ background: c }} />)}</span>
                {x.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WhatsFloat() {
  return (
    <a href={`https://api.whatsapp.com/send?phone=${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp" className="fixed bottom-5 right-4 z-[55] grid h-14 w-14 place-items-center rounded-full bg-[#1f9d55] text-white shadow-[0_15px_35px_-10px_rgba(31,157,85,.7)] transition-transform hover:scale-105 sm:right-6">
      <MessageCircle size={24} />
    </a>
  );
}
