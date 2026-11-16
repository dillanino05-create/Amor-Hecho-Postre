import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Menu, X, Star, ArrowDown, ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { scrollToSection } from './cart';
import { foto } from './data';
import { Magnetic, btnGhost, btnPrimary, ease } from './ui';

const LINKS = [
  ['Catálogo', '#catalogo'],
  ['A tu medida', '#medida'],
  ['Galería', '#galeria'],
  ['Cómo pedir', '#como'],
  ['Preguntas', '#preguntas'],
  ['Contacto', '#contacto'],
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection('#top');
      }}
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="Amor Hecho Postre, inicio"
    >
      <img src="/logo-circle.png" alt="Logo Amor Hecho Postre" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-ink/15 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11" />
      <div className="flex flex-col">
        <span className="display text-[1.35rem] leading-none sm:text-[1.55rem]">
          Amor Hecho <em>Postre</em>
        </span>
        <span className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-soft">repostería casera</span>
      </div>
    </a>
  );
}

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(v > 30);
    setHidden(v > 500 && v > prev && !menu);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.45, ease }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
            solid ? 'border border-line bg-paper/80 shadow-[0_10px_40px_-20px_rgba(43,27,21,.35)] backdrop-blur-xl' : 'border border-transparent'
          }`}
        >
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map(([l, h]) => (
              <li key={h}>
                <a
                  href={h}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(h);
                  }}
                  className="relative rounded-full px-3 py-2 text-sm font-medium text-soft transition-colors hover:text-ink"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#pedido"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#pedido');
              }}
              className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-berry"
            >
              Hacer un pedido
            </a>
            <button onClick={() => setMenu(true)} className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden" aria-label="Abrir menú">
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[70] flex flex-col bg-blush px-6 pb-10 pt-6"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenu(false)} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper" aria-label="Cerrar menú">
                <X size={18} />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-1.5">
              {LINKS.map(([l, h], i) => (
                <motion.li key={h} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06, ease, duration: 0.7 }}>
                  <a
                    href={h}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenu(false);
                      scrollToSection(h);
                    }}
                    className="display block py-1 text-4xl sm:text-5xl"
                  >
                    {l}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto text-sm text-soft">Por encargo · idealmente con 3 días</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const HEADLINE = ['Amor', 'hecho', '*postre,*', 'horneado', '*para*', '*tu*', '*día.*'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yBig = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:pb-28 lg:pt-36">
      {/* Manchas de color suaves */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-blush opacity-80 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-butter opacity-90 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-berry opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-berry" />
            </span>
            Repostería casera · Solo por encargo
          </motion.p>

          <h1 className="display mt-6 text-[clamp(3rem,6.6vw,6.2rem)]" aria-label="Amor hecho postre, horneado para tu día.">
            {HEADLINE.map((w, i) => {
              const it = w.startsWith('*');
              const c = w.replace(/\*/g, '');
              return (
                <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%', rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 1.1, ease, delay: 0.15 + i * 0.07 }}
                  >
                    {it ? <em>{c}</em> : c}
                    {' '}
                  </motion.span>
                </span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.8 }}
            className="mt-7 max-w-md text-lg leading-relaxed text-soft"
          >
            Tortas de cumpleaños, infantiles y de celebración, cheesecakes, mini tortas con mensaje y cupcakes, hechos a mano en mi cocina. Me cuentas para qué día lo necesitas y lo horneo fresquito para ti.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.95 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic href="#pedido" className={btnPrimary}>
              <ImagePlus size={16} /> Hacer un pedido
            </Magnetic>
            <Magnetic href="#catalogo" className={btnGhost}>
              Ver lo que preparo <ArrowDown size={16} />
            </Magnetic>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[12, 10, 27].map((n) => (
                <img key={n} src={foto(n)} alt="" className="h-11 w-11 rounded-full border-2 border-cream object-cover" />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-0.5 text-berry">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <span className="ml-1.5 font-bold text-ink">4.9</span>
              </div>
              <p className="text-soft">+120 encargos entregados con cariño</p>
            </div>
          </motion.div>
        </div>

        {/* Composición de fotos */}
        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          <motion.div
            style={{ y: yBig }}
            initial={{ clipPath: 'inset(100% 0 0 0 round 999px 999px 32px 32px)' }}
            animate={{ clipPath: 'inset(0% 0 0 0 round 999px 999px 32px 32px)' }}
            transition={{ duration: 1.4, ease, delay: 0.2 }}
            className="relative ml-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-full rounded-b-[2rem] bg-blush shadow-[0_40px_80px_-30px_rgba(43,27,21,.45)]"
          >
            <motion.img style={{ scale: scaleImg }} src={foto(19)} alt="Torta con rosas y fresas de Amor Hecho Postre" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            style={{ y: ySmall }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.9 }}
            className="absolute -left-2 bottom-10 w-[42%] overflow-hidden rounded-[1.6rem] border-[6px] border-paper shadow-[0_30px_60px_-25px_rgba(43,27,21,.5)] sm:left-0"
          >
            <img src={foto(18)} alt="Cupcakes decorados con flores de crema" className="aspect-square w-full object-cover" />
          </motion.div>

          {/* Sello giratorio con logo siempre derecho */}
          <div className="absolute -top-4 left-[6%] h-28 w-28 sm:h-32 sm:w-32">
            <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
              <defs>
                <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="var(--paper)" />
              <text fontSize="7.6" fontWeight="700" letterSpacing="1.35" fill="var(--ink)" fontFamily="Manrope">
                <textPath href="#circ">AMOR HECHO POSTRE · HECHO EN CASA · POR ENCARGO ·</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center">
              <img src="/logo-circle.png" alt="Amor Hecho Postre" className="h-16 w-16 rounded-full object-cover shadow-sm sm:h-20 sm:w-20" />
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.3 }}
            className="absolute -right-1 top-[46%] rounded-2xl border border-line bg-paper/90 px-4 py-3 shadow-xl backdrop-blur sm:right-[-1.5rem]"
          >
            <p className="eyebrow !text-[0.6rem]">Próxima fecha libre</p>
            <p className="display mt-1 text-xl">Este sábado</p>
            <p className="text-xs text-soft">Pocos cupos por día</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const FLAVORS = ['Cumpleaños', 'Infantiles', 'Grados', 'Aniversarios', 'Cheesecakes', 'Mini tortas', 'Cupcakes', 'Zanahoria', 'Auyama', 'Por encargo'];

export function Marquee() {
  return (
    <div className="overflow-hidden py-6"><div className="relative -mx-4 -rotate-[1.5deg] bg-berry py-4 text-paper">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {FLAVORS.map((f) => (
              <span key={f} className="display flex items-center whitespace-nowrap px-6 text-3xl sm:text-4xl">
                <em className="!text-paper">{f}</em>
                <span className="ml-12 text-xl opacity-70">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div></div>
  );
}
