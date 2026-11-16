import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { OrderProvider } from './cart';
import { Hero, Marquee, Nav } from './Top';
import { Galeria, Vitrina } from './Shop';
import { OrderForm } from './OrderForm';
import { Medida } from './Medida';
import { Como, Contacto, Footer, PaletteDock, Resenas, WhatsFloat } from './Bottom';
import { ease } from './ui';

const HEARTS = [
  { left: '8%', bottom: '12%', size: 18, delay: 0.1, dur: 3.1, drift: 14, strong: false },
  { left: '16%', bottom: '28%', size: 14, delay: 0.4, dur: 2.8, drift: -12, strong: true },
  { left: '24%', bottom: '8%', size: 22, delay: 0.2, dur: 3.4, drift: 18, strong: false },
  { left: '34%', bottom: '18%', size: 15, delay: 0.7, dur: 2.9, drift: -15, strong: true },
  { left: '48%', bottom: '10%', size: 16, delay: 0.3, dur: 3.2, drift: 10, strong: false },
  { left: '62%', bottom: '15%', size: 20, delay: 0.5, dur: 3.0, drift: -16, strong: true },
  { left: '74%', bottom: '9%', size: 14, delay: 0.15, dur: 2.7, drift: 12, strong: false },
  { left: '83%', bottom: '24%', size: 21, delay: 0.6, dur: 3.3, drift: -14, strong: true },
  { left: '91%', bottom: '14%', size: 16, delay: 0.35, dur: 2.9, drift: 10, strong: false },
  { left: '12%', bottom: '58%', size: 15, delay: 0.8, dur: 3.0, drift: 12, strong: false },
  { left: '86%', bottom: '56%', size: 17, delay: 0.45, dur: 3.1, drift: -12, strong: true },
];

function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3100);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
          animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
          exit={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0.98 }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-cream px-6"
          aria-hidden
        >
          {/* Fondo cálido con halos suaves */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blush/85 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-butter/90 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

          {/* Corazones flotantes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {HEARTS.map((h, i) => (
              <motion.span
                key={i}
                style={{ left: h.left, bottom: h.bottom }}
                initial={{ opacity: 0, y: 24, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.9, 0.7, 0],
                  y: [-10, -90, -170],
                  x: [0, h.drift, -h.drift * 0.5],
                  scale: [0.6, 1.05, 0.85],
                }}
                transition={{
                  duration: h.dur,
                  delay: h.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`absolute ${h.strong ? 'text-berry/50' : 'text-berry/30'}`}
              >
                <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute right-4 top-4 z-10 rounded-full border border-line bg-paper/80 px-4 py-1.5 text-xs font-semibold text-soft backdrop-blur transition-colors hover:border-ink hover:text-ink sm:right-8 sm:top-8"
          >
            Saltar
          </button>

          {/* Medallón central del logo */}
          <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
            <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full -rotate-90 overflow-visible">
              <motion.circle
                cx="130"
                cy="130"
                r="122"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.25"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '130px 130px' }}
              />
              <motion.circle
                cx="130"
                cy="130"
                r="114"
                fill="none"
                stroke="var(--berry)"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.85 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.3, ease: 'easeInOut' }}
              />
            </svg>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.95, ease }}
              className="relative h-44 w-44 overflow-hidden rounded-full bg-[#FFF4E0] shadow-[0_25px_60px_-15px_rgba(59,23,8,0.35)] ring-4 ring-paper sm:h-56 sm:w-56"
            >
              <img src="/logo-circle.png" alt="Amor Hecho Postre" className="h-full w-full object-cover" />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.55 }}
              className="absolute -left-2 top-2 whitespace-nowrap rounded-full border border-line bg-paper/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-md backdrop-blur sm:-left-10 sm:top-5"
            >
              🧁 Hecho en casa
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.7 }}
              className="absolute -right-2 bottom-2 whitespace-nowrap rounded-full border border-line bg-paper/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-md backdrop-blur sm:-right-10 sm:bottom-5"
            >
              💝 Con mucho amor
            </motion.span>
          </div>

          {/* Título y barra de progreso */}
          <div className="relative z-10 overflow-hidden">
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.3 }}
              className="display mt-6 text-center text-4xl sm:text-6xl"
            >
              Amor Hecho <em>Postre</em>
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.55 }}
            className="eyebrow relative z-10 mt-2.5 text-center"
          >
            Repostería casera · Por encargo
          </motion.p>

          <div className="relative z-10 mt-5 h-1.5 w-44 overflow-hidden rounded-full bg-ink/10 sm:w-56">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-full w-full origin-left rounded-full bg-berry"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <div className="grain">
        <Intro />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Vitrina />
          <Medida />
          <Galeria />
          <Como />
          <OrderForm />
          <Resenas />
          <Contacto />
        </main>
        <Footer />
        <PaletteDock />
        <WhatsFloat />
      </div>
    </OrderProvider>
  );
}
