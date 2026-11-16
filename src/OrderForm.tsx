import { AnimatePresence, motion } from 'motion/react';
import { ImagePlus, X, MessageCircle, Instagram, Send, Check, Copy, Share2, Loader2, ExternalLink } from 'lucide-react';
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

interface PhotoItem {
  id: string;
  file: File;
  url: string;
  remoteUrl: string | null;
  uploading: boolean;
  promise: Promise<string | null>;
}

interface CatalogPickImage {
  src: string;
  remoteUrl: string | null;
  uploading: boolean;
  promise: Promise<string | null>;
}

function loadImgElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo leer la imagen'));
    img.src = src;
  });
}

async function compressImageToJpeg(file: Blob, maxDim = 1280, quality = 0.85): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImgElement(objectUrl);
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
    const w = Math.max(1, Math.round((img.naturalWidth || 800) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || 800) * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', quality));
    return blob ?? file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function uploadPhotoForWhatsApp(file: Blob): Promise<string | null> {
  let payload: Blob = file;
  try {
    payload = await compressImageToJpeg(file);
  } catch {
    payload = file;
  }
  const uploadFile = new File([payload], 'referencia.jpg', { type: 'image/jpeg' });

  // 1. Primario: litterbox.catbox.moe (CORS abierto, enlace directo por 72 h)
  try {
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    fd.append('time', '72h');
    fd.append('fileToUpload', uploadFile);
    const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', { method: 'POST', body: fd });
    if (res.ok) {
      const txt = (await res.text()).trim();
      if (txt.startsWith('https://')) return txt;
    }
  } catch {
    /* intenta fallback */
  }

  // 2. Fallback: tmpfiles.org
  try {
    const fd = new FormData();
    fd.append('file', uploadFile);
    const res = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const json = (await res.json()) as { data?: { url?: string } };
      const raw = json?.data?.url;
      if (raw && raw.startsWith('http')) {
        return raw.includes('/dl/') ? raw : raw.replace('://tmpfiles.org/', '://tmpfiles.org/dl/');
      }
    }
  } catch {
    /* sin enlace remoto */
  }

  return null;
}

async function copyImageToClipboard(sourceUrl: string): Promise<boolean> {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false;
  try {
    const img = await loadImgElement(sourceUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0);
    const pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!pngBlob) return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
    return true;
  } catch {
    return false;
  }
}

export function OrderForm() {
  const { pick } = useOrder();
  const [f, setF] = useState({ name: '', phone: '', type: ORDER_TYPES[0], what: '', people: '', date: '', delivery: 'Recojo en casa', details: '' });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [catalogImage, setCatalogImage] = useState<CatalogPickImage | null>(null);
  const [drag, setDrag] = useState(false);
  const [sent, setSent] = useState<null | 'whatsapp' | 'instagram' | 'web'>(null);
  const [sending, setSending] = useState(false);
  const [preparingWa, setPreparingWa] = useState(false);
  const [copiedPhoto, setCopiedPhoto] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState('');
  const [lastMsg, setLastMsg] = useState('');
  const [lastUrls, setLastUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pick) return;
    const low = pick.name.toLowerCase();
    const type = ORDER_TYPES.find((t) => low.startsWith(t.toLowerCase().slice(0, 4))) ?? (low.startsWith('una parecida') ? 'Torta' : 'Otro / no sé todavía');
    setF((s) => ({ ...s, what: pick.name, type }));

    if (pick.image) {
      let active = true;
      const src = pick.image;
      const promise = fetch(src)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('fetch error'))))
        .then((blob) => uploadPhotoForWhatsApp(blob))
        .catch(() => null);

      setCatalogImage({ src, remoteUrl: null, uploading: true, promise });
      promise.then((remoteUrl) => {
        if (!active) return;
        setCatalogImage((cur) => (cur && cur.src === src ? { ...cur, remoteUrl, uploading: false } : cur));
      });
      return () => {
        active = false;
      };
    } else {
      setCatalogImage(null);
    }
  }, [pick]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((x) => x.type.startsWith('image/')).slice(0, 3 - photos.length);
    if (!imgs.length) return;
    const newItems: PhotoItem[] = imgs.map((file, idx) => {
      const id = `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`;
      const url = URL.createObjectURL(file);
      const promise = uploadPhotoForWhatsApp(file);
      promise.then((remoteUrl) => {
        setPhotos((prev) => prev.map((item) => (item.id === id ? { ...item, remoteUrl, uploading: false } : item)));
      });
      return { id, file, url, remoteUrl: null, uploading: true, promise };
    });
    setPhotos((p) => [...p, ...newItems]);
  };

  const removePhoto = (i: number) =>
    setPhotos((p) => {
      URL.revokeObjectURL(p[i].url);
      return p.filter((_, k) => k !== i);
    });

  const valid = f.name.trim() && f.phone.trim() && f.date;

  const collectReadyUrls = () => {
    const urls: string[] = [];
    if (catalogImage?.remoteUrl) urls.push(catalogImage.remoteUrl);
    else if (catalogImage?.src && typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/.test(window.location.hostname)) {
      urls.push(new URL(catalogImage.src, window.location.origin).href);
    }
    photos.forEach((p) => {
      if (p.remoteUrl) urls.push(p.remoteUrl);
    });
    return urls;
  };

  const message = (urls: string[] = collectReadyUrls()) => {
    const totalLocalImgs = photos.length + (catalogImage ? 1 : 0);
    return [
      '¡Hola! 👋 Quiero hacer un pedido en *Amor Hecho Postre* 🎂',
      '',
      `🍰 *Qué:* ${f.type}${f.what ? ` — ${f.what}` : ''}`,
      f.people ? `👥 *Para:* ${f.people} personas` : null,
      `📅 *Fecha:* ${f.date ? new Date(f.date + 'T12:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }) : 'por definir'}`,
      `${f.delivery === 'Domicilio' ? '🛵' : '🏡'} *Entrega:* ${f.delivery}`,
      f.details ? `📝 *Detalles:* ${f.details}` : null,
      '',
      `🙋 *Nombre:* ${f.name}`,
      `📱 *Celular:* ${f.phone}`,
      urls.length
        ? `\n📸 *Foto(s) de referencia:*\n${urls.join('\n')}`
        : totalLocalImgs
          ? `\n📸 Tengo ${totalLocalImgs} foto(s) de referencia, ¡te las envío por aquí!`
          : null,
      '',
      'Quedo pendiente ✨ ¡Gracias!',
    ]
      .filter((x) => x !== null)
      .join('\n');
  };

  const check = () => {
    if (!valid) {
      setError('Me faltan tu nombre, celular y la fecha 🙏');
      return false;
    }
    setError('');
    return true;
  };

  const awaitPendingUploads = async (): Promise<string[]> => {
    const pending: Promise<string | null>[] = [];
    if (catalogImage?.uploading) pending.push(catalogImage.promise);
    photos.forEach((p) => {
      if (p.uploading) pending.push(p.promise);
    });
    if (pending.length) {
      await Promise.race([Promise.all(pending), new Promise((res) => setTimeout(res, 4000))]);
    }
    const resolvedCatalog = catalogImage ? await Promise.race([catalogImage.promise, Promise.resolve(catalogImage.remoteUrl)]) : null;
    const resolvedPhotos = await Promise.all(photos.map((p) => (p.remoteUrl ? Promise.resolve(p.remoteUrl) : Promise.race([p.promise, Promise.resolve(null)]))));
    const urls: string[] = [];
    if (resolvedCatalog) urls.push(resolvedCatalog);
    else if (catalogImage?.src && typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/.test(window.location.hostname)) {
      urls.push(new URL(catalogImage.src, window.location.origin).href);
    }
    resolvedPhotos.forEach((u) => {
      if (u) urls.push(u);
    });
    return urls;
  };

  const viaWhatsApp = async () => {
    if (!check()) return;
    setCopiedPhoto(false);
    const primarySource = photos[0]?.url ?? catalogImage?.src;
    if (primarySource) {
      copyImageToClipboard(primarySource).then((ok) => {
        if (ok) setCopiedPhoto(true);
      });
    }

    const hasUploading = Boolean(catalogImage?.uploading || photos.some((p) => p.uploading));
    let urls = collectReadyUrls();
    if (hasUploading) {
      setPreparingWa(true);
      urls = await awaitPendingUploads();
      setPreparingWa(false);
    }

    const msg = message(urls);
    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(msg)}`;
    setLastUrls(urls);
    setLastMsg(msg);
    setLastWaUrl(waUrl);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSent('whatsapp');
  };

  const viaInstagram = async () => {
    if (!check()) return;
    const msg = message();
    setLastMsg(msg);
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      /* sin portapapeles */
    }
    window.open(`https://ig.me/m/${INSTAGRAM}`, '_blank', 'noopener,noreferrer');
    setSent('instagram');
  };

  const viaWeb = async () => {
    if (!check()) return;
    setSending(true);
    try {
      const data = new FormData();
      Object.entries(f).forEach(([k, v]) => data.append(k, v));
      data.append('mensaje', message());
      if (catalogImage?.src) data.append('producto_imagen', catalogImage.remoteUrl ?? catalogImage.src);
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

  const handleCopyPhoto = async () => {
    const primarySource = photos[0]?.url ?? catalogImage?.src;
    if (!primarySource) return;
    const ok = await copyImageToClipboard(primarySource);
    setCopiedPhoto(ok);
  };

  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    photos.length > 0 &&
    (() => {
      try {
        return navigator.canShare({ files: photos.map((p) => p.file) });
      } catch {
        return false;
      }
    })();

  const handleShareFiles = async () => {
    if (!photos.length || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        files: photos.map((p) => p.file),
        text: lastMsg || message(),
      });
    } catch {
      /* usuario canceló compartir */
    }
  };

  const reset = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setCatalogImage(null);
    setCopiedPhoto(false);
    setLastWaUrl('');
    setLastMsg('');
    setLastUrls([]);
    setF({ name: '', phone: '', type: ORDER_TYPES[0], what: '', people: '', date: '', delivery: 'Recojo en casa', details: '' });
    setSent(null);
  };

  const hasAnyPhoto = photos.length > 0 || Boolean(catalogImage);

  return (
    <section id="pedido" className="relative scroll-mt-24 overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
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
                { i: <MessageCircle size={18} />, t: 'Por WhatsApp', d: 'Abre el chat con tu pedido y el enlace directo de tu foto.', c: 'bg-[#1f9d55] text-white' },
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
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-soft sm:text-base">
                    {sent === 'whatsapp' &&
                      (lastUrls.length
                        ? 'Tu mensaje de WhatsApp ya lleva el enlace directo a tu(s) foto(s) de referencia. Además, copiamos la imagen a tu portapapeles por si quieres pegarla directo en el chat con Ctrl+V.'
                        : hasAnyPhoto
                          ? 'Se abrió WhatsApp con tu pedido. No olvides adjuntar o pegar ahí tu foto de referencia 📷.'
                          : 'Se abrió WhatsApp con tu pedido. Te respondo apenas lo vea.')}
                    {sent === 'instagram' && 'Copié tu pedido. Pégalo en el chat de Instagram que se abrió y adjunta tus fotos.'}
                    {sent === 'web' && 'Tu pedido y tus fotos me llegaron. Te escribo al celular que dejaste para confirmar.'}
                  </p>

                  {sent === 'whatsapp' && (
                    <div className="mt-6 flex flex-col items-center gap-2.5">
                      {lastWaUrl && (
                        <a
                          href={lastWaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#1f9d55] px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                        >
                          <MessageCircle size={16} /> Abrir WhatsApp <ExternalLink size={14} />
                        </a>
                      )}
                      {hasAnyPhoto && (
                        <button
                          type="button"
                          onClick={handleCopyPhoto}
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
                        >
                          <Copy size={14} /> {copiedPhoto ? '¡Foto copiada! Pégala con Ctrl+V' : 'Copiar foto para pegar en WhatsApp (Ctrl+V)'}
                        </button>
                      )}
                      {canShareFiles && (
                        <button
                          type="button"
                          onClick={handleShareFiles}
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
                        >
                          <Share2 size={14} /> Compartir archivo de foto directo (Celular)
                        </button>
                      )}
                    </div>
                  )}

                  {sent === 'instagram' && (
                    <button type="button" onClick={() => navigator.clipboard?.writeText(lastMsg || message())} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-berry"><Copy size={14} /> Copiar de nuevo</button>
                  )}
                  <button type="button" onClick={reset} className="mt-8 rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-ink">Hacer otro pedido</button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={(e) => { e.preventDefault(); viaWhatsApp(); }} className="grid gap-5" noValidate>
                  {catalogImage && (
                    <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream/70 p-3">
                      <img src={catalogImage.src} alt={f.what || 'Imagen seleccionada'} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="eyebrow !text-[0.6rem]">Imagen seleccionada del catálogo</p>
                        <p className="truncate text-sm font-semibold text-ink">{f.what}</p>
                        <p className="mt-0.5 text-xs text-soft">
                          {catalogImage.uploading ? 'Subiendo enlace para WhatsApp…' : catalogImage.remoteUrl ? '✓ Lista para enviarse en WhatsApp' : 'Se adjuntará al confirmar'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCatalogImage(null)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-paper text-ink hover:border-ink"
                        aria-label="Quitar imagen seleccionada"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

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
                          <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative aspect-square overflow-hidden rounded-xl bg-butter">
                            <img src={p.url} alt={`Referencia ${i + 1}`} className="h-full w-full object-cover" />
                            <button type="button" onClick={() => removePhoto(i)} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-paper/90 text-ink shadow" aria-label="Quitar foto"><X size={14} /></button>
                            <span className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-semibold text-paper backdrop-blur">
                              {p.uploading ? (
                                <>
                                  <Loader2 size={10} className="animate-spin" /> Subiendo…
                                </>
                              ) : p.remoteUrl ? (
                                '✓ Lista para WhatsApp'
                              ) : (
                                'Listo para pegar'
                              )}
                            </span>
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
                    <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={preparingWa} className="flex items-center justify-center gap-2 rounded-full bg-[#1f9d55] py-4 font-semibold text-white disabled:opacity-75">
                      <MessageCircle size={18} /> {preparingWa ? 'Preparando imagen para WhatsApp…' : 'Enviar por WhatsApp'}
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
