import { createContext, useContext, useState, type ReactNode } from 'react';

/** Producto elegido del catálogo para precargar el formulario de pedido */
interface OrderCtx { pick: string; setPick: (v: string) => void }
const Ctx = createContext<OrderCtx | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [pick, setPick] = useState('');
  return <Ctx.Provider value={{ pick, setPick }}>{children}</Ctx.Provider>;
}

export const useOrder = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOrder fuera de OrderProvider');
  return c;
};

/** Elige un producto y baja al formulario */
export const goToOrder = (setPick: (v: string) => void, name: string) => {
  setPick(name);
  document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' });
};
