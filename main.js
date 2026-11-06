// Número de WhatsApp del taller, con código de país y sin espacios (ej.: "50760000000").
// Vacío = abre WhatsApp para que el cliente elija el contacto.
const WHATSAPP = "";

const wa = (texto) =>
  "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);

// Enlaces directos
document.getElementById("enlace-wa").href = wa("Hola, quiero información del taller.");
document.getElementById("boton-ponchada").href = wa("Hola, tengo una llanta ponchada. ¿Me pueden atender ahora?");

// Cotizador con vista previa del mensaje
const form = document.getElementById("form-cotiza");
const vista = document.getElementById("vista");

function armarMensaje() {
  const datos = new FormData(form);
  const servicios = datos.getAll("servicio");
  const nombre = datos.get("nombre").trim();
  const vehiculo = datos.get("vehiculo").trim();
  const detalle = datos.get("detalle").trim();

  let m = "Hola" + (nombre ? ", soy " + nombre : "") + ". Quiero una cotización";
  if (servicios.length) m += " de " + servicios.join(", ").replace(/, ([^,]*)$/, " y $1").toLowerCase();
  m += ".";
  if (vehiculo) m += "\nVehículo/trabajo: " + vehiculo;
  if (detalle) m += "\nDetalle: " + detalle;
  m += "\n(Te mando una foto)";
  return m;
}

function actualizar() { vista.textContent = armarMensaje(); }
form.addEventListener("input", actualizar);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  window.open(wa(armarMensaje()), "_blank", "noopener");
});
actualizar();

// Chispas de soldadura en la portada
(function chispas() {
  const canvas = document.querySelector(".chispas");
  if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  let w, h, dpr, origen, particulas = [], visible = true, ultimo = 0;

  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sello = hero.querySelector(".hero-sello");
    const r = sello.getBoundingClientRect(), rh = hero.getBoundingClientRect();
    origen = { x: r.left - rh.left + r.width * 0.55, y: r.top - rh.top + r.width * 0.5 };
  }

  function soltar(n) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6;
      const v = 2 + Math.random() * 6;
      particulas.push({ x: origen.x, y: origen.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, dec: 0.012 + Math.random() * 0.02 });
    }
  }

  function cuadro(t) {
    if (!visible) return;
    if (t - ultimo > 900 + Math.random() * 1400) { soltar(30 + Math.random() * 40); ultimo = t; }
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    particulas = particulas.filter((p) => p.vida > 0 && p.y < h + 20);
    for (const p of particulas) {
      const x0 = p.x, y0 = p.y;
      p.vy += 0.16; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.vida -= p.dec;
      ctx.strokeStyle = `rgba(255, ${150 + 90 * p.vida | 0}, ${60 * p.vida | 0}, ${p.vida})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    requestAnimationFrame(cuadro);
  }

  new IntersectionObserver(([e]) => {
    const antes = visible; visible = e.isIntersecting;
    if (visible && !antes) requestAnimationFrame(cuadro);
  }).observe(hero);

  addEventListener("resize", medir);
  hero.addEventListener("pointerdown", (e) => {
    const rh = hero.getBoundingClientRect();
    origen = { x: e.clientX - rh.left, y: e.clientY - rh.top };
    soltar(50);
    setTimeout(medir, 1500);
  });
  medir();
  requestAnimationFrame(cuadro);
})();
