import { AnimatePresence, motion } from 'motion/react';
import { ImagePlus, X, MessageCircle, Instagram, Send, Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOrder } from './cart';
import { FORM_ENDPOINT, INSTAGRAM, ORDER_TYPES, WHATSAPP } from './data';
import { Reveal, SplitHeading, ease } from './ui';

const inDays = (d: number) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
};

const field = 'w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-soft/50 focus:border-ink';

export function OrderForm() {
  const { pick } = useOrder();
  const [f, setF] = useState({ name: '', phone: '', type: ORDER_TYPES[0], what: '', people: '', date: '', delivery: 'Recojo en casa', details: '' });
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [drag, setDrag] = useState(false);
  const [sent, setSent] = useState<null | 'whatsapp' | 'instagram' | 'web'>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pick) return;
    const low = pick.toLowerCase();
    const type = ORDER_TYPES.find((t) => low.startsWith(t.toLowerCase().slice(0, 4))) ?? (low.startsWith('una parecida') ? 'Torta' : 'Otro / no sé todavía');
    setF((s) => ({ ...s, what: pick, type }));
  }, [pick]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((x) => x.type.startsWith('image/')).slice(0, 3 - photos.length);
    setPhotos((p) => [...p, ...imgs.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  };
  const removePhoto = (i: number) => setPhotos((p) => { URL.revokeObjectURL(p[i].url); return p.filter((_, k) => k !== i); });

  const valid = f.name.trim() && f.phone.trim() && f.date;

  const message = () =>
    [
      '¡Hola! 👋 Quiero hacer un pedido 🎂',
      '',
      `🍰 *Qué:* ${f.type}${f.what ? ` — ${f.what}` : ''}`,
      f.people ? `👥 *Para:* ${f.people} personas` : null,
      `📅 *Fecha:* ${f.date ? new Date(f.date + 'T12:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }) : 'por definir'}`,
      `${f.delivery === 'Domicilio' ? '🛵' : '🏡'} *Entrega:* ${f.delivery}`,
      f.details ? `📝 *Detalles:* ${f.details}` : null,
      '',
      `🙋 *Nombre:* ${f.name}`,
      `📱 *Celular:* ${f.phone}`,
      photos.length ? `\n📸 Tengo ${photos.length} foto(s) de referencia, ¡te las envío por aquí!` : null,
      '',
      'Quedo pendiente ✨ ¡Gracias!',
    ]
      .filter((x) => x !== null)
      .join('\n');

  const check = () => {
    if (!valid) { setError('Me faltan tu nombre, celular y la fecha 🙏'); return false; }
    setError('');
    return true;
  };

  const viaWhatsApp = () => {
    if (!check()) return;
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(message())}`, '_blank');
    setSent('whatsapp');
  };

  const viaInstagram = async () => {
    if (!check()) return;
    try { await navigator.clipboard.writeText(message()); } catch { /* sin portapapeles */ }
    window.open(`https://ig.me/m/${INSTAGRAM}`, '_blank');
    setSent('instagram');
  };

  const viaWeb = async () => {
    if (!check()) return;
    setSending(true);
    try {
      const data = new FormData();
      Object.entries(f).forEach(([k, v]) => data.append(k, v));
      data.append('mensaje', message());
      photos.forEach((p, i) => data.append(`foto_${i + 1}`, p.file));
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error();
      setSent('web');
    } catch {
      setError('No se pudo enviar desde la página. Inténtalo por WhatsApp, por favor.');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setF({ name: '', phone: '', type: ORDER_TYPES[0], what: '', people: '', date: '', delivery: 'Recojo en casa', details: '' });
    setSent(null);
  };

  return (
    <section id="pedido" className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute right-[-10rem] top-20 h-[36rem] w-[36rem] rounded-full bg-blush opacity-70 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Texto + canales */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal><p className="eyebrow">04 — Haz tu pedido</p></Reveal>
          <SplitHeading text="Cuéntame qué *quieres* y para cuándo." className="mt-4 text-[clamp(2.6rem,5.4vw,4.8rem)]" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-soft">
              Sube una foto de lo que te gustó (de Pinterest, de Instagram o de algo que ya te hice) y te respondo con precio y disponibilidad. Sin compromiso.
            </p>
            <ul className="mt-9 grid gap-3">
              {[
                { i: <MessageCircle size={18} />, t: 'Por WhatsApp', d: 'Te abre el chat con todo escrito.', c: 'bg-[#1f9d55] text-white' },
                { i: <Instagram size={18} />, t: 'Por Instagram', d: 'Copiamos el mensaje para que lo pegues.', c: 'bg-gradient-to-br from-[#f9a03f] via-[#d62976] to-[#7638fa] text-white' },
                { i: <Send size={18} />, t: 'Desde aquí mismo', d: 'Llega directo a mi correo, con las fotos.', c: 'bg-ink text-paper' },
              ].filter((x) => FORM_ENDPOINT || x.t !== 'Desde aquí mismo').map((x) => (
                <li key={x.t} className="flex items-center gap-4 rounded-2xl border border-line bg-paper/70 p-4 backdrop-blur">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${x.c}`}>{x.i}</span>
                  <span><b className="block text-sm">{x.t}</b><span className="text-sm text-soft">{x.d}</span></span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Formulario */}
        <Reveal delay={0.05}>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-paper p-6 shadow-[0_40px_80px_-50px_rgba(43,27,21,.5)] sm:p-9">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }} className="flex min-h-[32rem] flex-col items-center justify-center text-center">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }} className="grid h-20 w-20 place-items-center rounded-full bg-blush text-berry">
                    <Check size={36} strokeWidth={2.5} />
                  </motion.span>
                  <h3 className="display mt-6 text-4xl sm:text-5xl">¡Gracias, <em>{f.name.split(' ')[0] || 'de verdad'}!</em></h3>
                  <p className="mt-4 max-w-sm text-soft">
                    {sent === 'whatsapp' && (photos.length ? 'Se abrió WhatsApp con tu pedido. No olvides adjuntar ahí tus fotos de referencia 📷.' : 'Se abrió WhatsApp con tu pedido. Te respondo apenas lo vea.')}
                    {sent === 'instagram' && 'Copié tu pedido. Pégalo en el chat de Instagram que se abrió y adjunta tus fotos.'}
                    {sent === 'web' && 'Tu pedido y tus fotos me llegaron. Te escribo al celular que dejaste para confirmar.'}
                  </p>
                  {sent === 'instagram' && (
                    <button onClick={() => navigator.clipboard?.writeText(message())} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-berry"><Copy size={14} /> Copiar de nuevo</button>
                  )}
                  <button onClick={reset} className="mt-8 rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-ink">Hacer otro pedido</button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={(e) => { e.preventDefault(); viaWhatsApp(); }} className="grid gap-5" noValidate>
                  {/* Foto */}
                  <div>
                    <span className="eyebrow">Foto de referencia <span className="normal-case tracking-normal text-soft/70">(opcional, hasta 3)</span></span>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                      className={`mt-3 grid gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors ${drag ? 'border-berry bg-blush/50' : 'border-line'} ${photos.length ? 'grid-cols-3' : ''}`}
                    >
                      <AnimatePresence>
                        {photos.map((p, i) => (
                          <motion.div key={p.url} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative aspect-square overflow-hidden rounded-xl">
                            <img src={p.url} alt={`Referencia ${i + 1}`} className="h-full w-full object-cover" />
                            <button type="button" onClick={() => removePhoto(i)} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-paper/90 text-ink" aria-label="Quitar foto"><X size={14} /></button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {photos.length < 3 && (
                        <button type="button" onClick={() => fileRef.current?.click()} className={`flex flex-col items-center justify-center gap-2 rounded-xl text-center text-sm text-soft transition-colors hover:bg-cream ${photos.length ? 'aspect-square' : 'py-9'}`}>
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-blush text-berry"><ImagePlus size={20} /></span>
                          {photos.length ? 'Otra' : <span><b className="text-ink">Sube una foto</b> o arrástrala aquí</span>}
                        </button>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2"><span className="eyebrow">¿Qué quieres?</span>
                      <select value={f.type} onChange={set('type')} className={field}>{ORDER_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                    </label>
                    <label className="grid gap-2"><span className="eyebrow">¿Para cuántas personas?</span>
                      <input type="number" min={1} inputMode="numeric" value={f.people} onChange={set('people')} placeholder="Ej: 20" className={field} />
                    </label>
                  </div>

                  <label className="grid gap-2"><span className="eyebrow">Sabor, idea o producto</span>
                    <input value={f.what} onChange={set('what')} placeholder="Ej: torta de chocolate con fresas, tema unicornio" className={field} />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2"><span className="eyebrow">¿Para qué fecha? *</span>
                      <input type="date" min={inDays(2)} value={f.date} onChange={set('date')} className={field} required />
                    </label>
                    <fieldset className="grid gap-2"><legend className="eyebrow mb-2">Entrega</legend>
                      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-butter/70 p-1">
                        {['Recojo en casa', 'Domicilio'].map((m) => (
                          <button type="button" key={m} onClick={() => setF((s) => ({ ...s, delivery: m }))} aria-pressed={f.delivery === m} className={`relative rounded-xl py-2.5 text-sm font-semibold ${f.delivery === m ? 'text-paper' : 'text-soft'}`}>
                            {f.delivery === m && <motion.span layoutId="delivery" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                            <span className="relative">{m}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  <label className="grid gap-2"><span className="eyebrow">Detalles</span>
                    <textarea rows={3} value={f.details} onChange={set('details')} placeholder="Colores, mensaje, alergias, a qué hora lo necesitas…" className={`${field} resize-none`} />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2"><span className="eyebrow">Tu nombre *</span>
                      <input value={f.name} onChange={set('name')} autoComplete="name" className={field} required />
                    </label>
                    <label className="grid gap-2"><span className="eyebrow">Celular *</span>
                      <input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" placeholder="300 000 0000" className={field} required />
                    </label>
                  </div>

                  <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-semibold text-berry" role="alert">{error}</motion.p>}
                  </AnimatePresence>

                  <div className="mt-1 grid gap-2.5">
                    <motion.button whileTap={{ scale: 0.98 }} type="submit" className="flex items-center justify-center gap-2 rounded-full bg-[#1f9d55] py-4 font-semibold text-white">
                      <MessageCircle size={18} /> Enviar por WhatsApp
                    </motion.button>
                    <div className={`grid gap-2.5 ${FORM_ENDPOINT ? 'sm:grid-cols-2' : ''}`}>
                      <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={viaInstagram} className="flex items-center justify-center gap-2 rounded-full border border-line py-3.5 text-sm font-semibold hover:border-ink">
                        <Instagram size={16} /> Por Instagram
                      </motion.button>
                      {FORM_ENDPOINT && (
                        <motion.button whileTap={{ scale: 0.98 }} type="button" disabled={sending} onClick={viaWeb} className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-paper hover:bg-berry disabled:opacity-60">
                          <Send size={16} /> {sending ? 'Enviando…' : 'Enviar desde aquí'}
                        </motion.button>
                      )}
                    </div>
                    <p className="text-center text-xs text-soft">Te respondo el mismo día con precio y disponibilidad. Separas tu fecha con el 50%.</p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
