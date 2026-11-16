import { createContext, useContext, useState, type ReactNode } from 'react';

/** Producto elegido del catálogo o galería para precargar el formulario de pedido */
export interface OrderPick {
  name: string;
  image?: string;
}

interface OrderCtx {
  pick: OrderPick | null;
  setPick: (v: OrderPick | null) => void;
}
const Ctx = createContext<OrderCtx | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [pick, setPick] = useState<OrderPick | null>(null);
  return <Ctx.Provider value={{ pick, setPick }}>{children}</Ctx.Provider>;
}

export const useOrder = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOrder fuera de OrderProvider');
  return c;
};

/** Desplaza suavemente a una sección y reajusta por si quedan imágenes o animaciones por acomodarse */
export const scrollToSection = (hash: string) => {
  const id = hash.replace(/^#/, '');
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 380);
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 750);
};

/** Elige un producto (y su foto) y baja al formulario */
export const goToOrder = (setPick: (v: OrderPick | null) => void, name: string, image?: string) => {
  setPick({ name, image });
  scrollToSection('#pedido');
};
