import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { OrderProvider } from './cart';
import { Hero, Marquee, Nav } from './Top';
import { Galeria, Vitrina } from './Shop';
import { OrderForm } from './OrderForm';
import { Medida } from './Medida';
import { Como, Contacto, Footer, PaletteDock, Resenas, WhatsFloat } from './Bottom';
import { ease } from './ui';

function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease }}
          className="fixed inset-0 z-[100] grid place-items-center bg-blush"
          aria-hidden
        >
          <div className="overflow-hidden">
            <motion.p initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease }} className="display text-7xl sm:text-9xl">
              El <em>Poli</em>
            </motion.p>
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.3, ease: 'easeInOut' }} className="absolute bottom-[38%] h-px w-40 origin-left bg-ink/40" />
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
