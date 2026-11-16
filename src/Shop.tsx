import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { goToOrder, useOrder } from './cart';
import { CATEGORIES, OCCASIONS, PRODUCTS, WORKS, type Product } from './data';
import { Reveal, SplitHeading, ease } from './ui';

function Chips<T extends string>({ items, value, onChange, id }: { items: readonly T[]; value: T; onChange: (v: T) => void; id: string }) {
  return (
    <LayoutGroup id={id}>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
        {items.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={value === c}
            onClick={() => onChange(c)}
            className={`relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${value === c ? 'border-ink text-paper' : 'border-line text-soft hover:border-ink hover:text-ink'}`}
          >
            {value === c && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  const { setPick } = useOrder();
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease, delay: (i % 3) * 0.06 }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-butter">
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {p.tag && <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-berry backdrop-blur">{p.tag}</span>}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => goToOrder(setPick, p.name, p.image)}
          aria-label={`Pedir ${p.name}`}
          className="absolute bottom-4 right-4 flex h-12 items-center gap-2 rounded-full bg-paper px-4 text-sm font-semibold text-ink shadow-lg transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Pedir este <ArrowUpRight size={16} />
        </motion.button>
      </div>
      <div className="mt-5 px-1">
        <p className="eyebrow !text-[0.62rem]">{p.category}</p>
        <h3 className="display mt-1.5 text-[1.75rem]">{p.name}</h3>
      </div>
      <p className="mt-2 px-1 text-sm leading-relaxed text-soft">{p.desc}</p>
      <p className="mt-3 px-1 text-xs font-semibold text-berry-deep">{p.note}</p>
    </motion.article>
  );
}

export function Vitrina() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Todo');
  const list = cat === 'Todo' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
  return (
    <section id="catalogo" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal><p className="eyebrow">01 — Lo que preparo</p></Reveal>
            <SplitHeading text="Recetas de casa, *por encargo.*" className="mt-4 text-[clamp(2.8rem,6vw,5.5rem)]" />
          </div>
          <Reveal delay={0.1} className="max-w-sm text-soft">
            No tengo vitrina: todo lo horneo en mi cocina para el día que lo necesitas. Cada pedido se cotiza a tu medida según las porciones, el relleno y el diseño.
          </Reveal>
        </div>
        <div className="mt-12">
          <Chips<typeof cat> id="cat" items={CATEGORIES} value={cat} onChange={setCat} />
        </div>
        <motion.div layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}


export function Galeria() {
  const { setPick } = useOrder();
  const [occ, setOcc] = useState<(typeof OCCASIONS)[number]>('Todos');
  const [open, setOpen] = useState<number | null>(null);
  const list = occ === 'Todos' ? WORKS : WORKS.filter((w) => w.occasion === occ);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % list.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + list.length) % list.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, list.length]);

  const cur = open !== null ? list[open] : null;

  return (
    <section id="galeria" className="scroll-mt-20 bg-paper px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Reveal><p className="eyebrow">02 — Lo que ya he hecho</p></Reveal>
            <SplitHeading text="Cada torta, *una historia.*" className="mt-4 text-[clamp(2.8rem,6vw,5.5rem)]" />
          </div>
          <div className="lg:justify-self-end">
            <Chips<typeof occ> id="occ" items={OCCASIONS} value={occ} onChange={setOcc} />
          </div>
        </div>

        <motion.div layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((w, i) => (
              <motion.button
                layout
                key={w.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease }}
                onClick={() => setOpen(i)}
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-butter text-left"
                aria-label={`Ver ${w.title}`}
              >
                <img src={w.image} alt={w.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-paper">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">{w.occasion}</p>
                    <p className="display mt-1 text-2xl">{w.title}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {cur && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={cur.title}
          >
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease }}
              onClick={(e) => e.stopPropagation()}
              className="grid max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-paper md:grid-cols-[1.3fr_1fr]"
            >
              <img src={cur.image} alt={cur.title} className="h-72 w-full bg-butter object-contain md:h-[80vh]" />
              <div className="flex flex-col p-7 sm:p-10">
                <p className="eyebrow">{cur.occasion}</p>
                <h3 className="display mt-3 text-4xl sm:text-5xl">{cur.title}</h3>
                <p className="mt-4 text-soft">{cur.note}.</p>
                <p className="mt-2 text-sm text-soft">¿Te gusta? Podemos hacer una parecida, adaptada a tu fecha y número de invitados.</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      goToOrder(setPick, `Una parecida a: ${cur.title}`, cur.image);
                      setOpen(null);
                    }}
                    className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-berry"
                  >
                    Quiero una así
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setOpen((open! - 1 + list.length) % list.length)} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-ink" aria-label="Anterior"><ChevronLeft size={18} /></button>
                    <button onClick={() => setOpen((open! + 1) % list.length)} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-ink" aria-label="Siguiente"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
            <button onClick={() => setOpen(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink" aria-label="Cerrar"><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
