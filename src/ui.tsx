import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';

export const ease = [0.22, 1, 0.36, 1] as const;

/** Aparece al entrar en pantalla */
export function Reveal({ children, delay = 0, y = 28, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Titular que se revela palabra por palabra. Usa *texto* para cursiva de acento. */
export function SplitHeading({ text, className = '', as = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2'; delay?: number }) {
  const Tag = as;
  const words = text.split(' ');
  return (
    <Tag className={`display ${className}`} aria-label={text.replace(/\*/g, '')}>
      {words.map((w, i) => {
        const italic = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease, delay: delay + i * 0.06 }}
            >
              {italic ? <em>{clean}</em> : clean}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

/** Botón con efecto magnético sutil */
export function Magnetic({ children, className = '', onClick, href, ariaLabel }: { children: ReactNode; className?: string; onClick?: () => void; href?: string; ariaLabel?: string }) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const leave = () => { x.set(0); y.set(0); };
  const props = { ref: ref as never, style: { x: sx, y: sy }, onPointerMove: move, onPointerLeave: leave, className, 'aria-label': ariaLabel, whileTap: { scale: 0.96 } };
  return href ? (
    <motion.a {...props} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</motion.a>
  ) : (
    <motion.button {...props} type="button" onClick={onClick}>{children}</motion.button>
  );
}

export const btnPrimary =
  'inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper shadow-[0_10px_30px_-12px_rgba(43,27,21,.6)] transition-colors hover:bg-berry';
export const btnGhost =
  'inline-flex items-center gap-2 rounded-full border border-line bg-paper/60 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-ink';
