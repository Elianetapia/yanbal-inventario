"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

const SEDES = ["Mariscal Cáceres", "San Agustín"];
const ROLES = { admin: "Admin", directora: "Directora", asistente: "Asistente" };
const DEFAULT_OPERATORS = [
  { name: "Eliane", pin: "0000", role: "admin" },
  { name: "Elena", pin: "0000", role: "directora" },
  { name: "Janeth", pin: "0000", role: "asistente" },
];
const MOVE_TYPES = [
  { id: "compra", label: "Compra de stock", icon: "📦", dir: 1, color: "#2d7a4f", group: "ingreso" },
  { id: "devolucion", label: "Devolución de préstamo", icon: "↩️", dir: 1, color: "#2d7a4f", group: "ingreso" },
  { id: "traslado_in", label: "Traslado entre sedes", icon: "🚚", dir: 0, color: "#4a6fa5", group: "ingreso" },
  { id: "venta", label: "Venta", icon: "💰", dir: -1, color: "#b5485f", group: "egreso" },
  { id: "prestamo", label: "Préstamo de producto", icon: "🤝", dir: -1, color: "#9a6c3b", group: "egreso" },
  { id: "traslado_out", label: "Traslado entre sedes", icon: "🚚", dir: 0, color: "#4a6fa5", group: "egreso" },
  { id: "traslado", label: "Traslado", icon: "🚚", dir: 0, color: "#4a6fa5", group: "_legacy" },
  { id: "ajuste_pos", label: "Ajuste positivo", icon: "➕", dir: 1, color: "#2d7a4f", group: "_legacy" },
  { id: "ajuste_neg", label: "Ajuste negativo", icon: "➖", dir: -1, color: "#b5485f", group: "_legacy" },
];

const INITIAL_RAW = [[1,"Adrenaline","245","145",0,0],[2,"Adrenaline Alegria","","",2,0],[3,"Adrenalina All","","",0,0],[4,"A La Vida","","",1,0],[5,"Aires Del Amazonas","","",0,0],[6,"Aires Del Los Andes","","",1,0],[7,"Aires Del Caribe","","",0,0],[8,"Ccori","2035","",3,0],[9,"Ccori Rose","","",2,0],[10,"Ccori Cristal","","",0,0],[11,"Ccori Cristal Rose","","",1,0],[12,"Cielo","2211","179",2,0],[13,"Cielo En Rosa","2211","179",2,0],[14,"Dulce Amistad","2182","145",1,0],[15,"Dulce Vanidad","","",2,0],[16,"Di Que Si","","",1,0],[17,"Di Que Si Caramel","","",1,0],[18,"Gaia Elixir","","",2,0],[19,"Gaia","","",1,0],[20,"Icono","","",1,0],[21,"Icono Intense","","",1,0],[22,"Liberatta","236","239",1,0],[23,"Liberatta Noire","","",0,0],[24,"Liberatta Viva","","",0,0],[25,"Pasion","","",1,0],[26,"Temptation","79946","",3,0],[27,"Temptatacion Mystic","","",1,0],[28,"Osadia","","",0,0],[29,"Osadia Infinita","","",1,0],[30,"Xiss","2214","99",3,0],[31,"Xiss Active","2214","99",1,0],[32,"Mix & Chic Peach Tonic","","",1,0],[33,"Mix & Chic Apple Tonic","","",2,0],[34,"Mix & Chic Berry Tonic","","",2,0],[35,"Mix & Chic Mango Tonico","","",2,0],[36,"L'Essence Violeta Salvaje","","",2,0],[37,"L'Essence Cerezo Silvestre","","",1,0],[38,"L'Essence Orquidea Exotico","","",1,0],[39,"L'Essence Mimosa Radiante","","",1,0],[40,"Soy Sexi","","",1,0],[41,"Soy Glow","","",2,0],[42,"Soy Latina","","",1,0],[43,"Soy Poderosa","","",2,0],[44,"Soy Unica","","",2,0],[45,"Arom","2194","169",2,0],[46,"Arom Absolut","210","192",1,0],[47,"Arom Element","2177","192",2,0],[48,"Adrenaline V","245","145",1,0],[49,"Adrenaline All V","","",0,0],[50,"Dendur","206","192",2,0],[51,"Dendur Destiny","2201","192",3,0],[52,"Evolution","","",1,0],[53,"Indomito","","",1,0],[54,"Jaque","203","220",2,0],[55,"Musk","2218","",2,0],[56,"Ohm","201","230",3,0],[57,"Ohm Plateado","","",1,0],[58,"Ohm Black","201","230",1,0],[59,"Ohm Soul","","",2,0],[60,"Osadia V","","",2,0],[61,"Paralel 43°","","",3,0],[62,"Savour","","",0,0],[63,"Solo","","",2,0],[64,"Solo Elixir","","",1,0],[65,"Selecto","2161","",1,0],[66,"Temptation V","","",1,0],[67,"Temptation Black","2192","202",1,0],[68,"Xool","221","",3,0],[69,"Zentro","212","220",2,0],[70,"Ccori Deo","","",2,0],[71,"Ccori Rose Deo","","",3,0],[72,"Ccori Cristal Deo","","",0,0],[73,"Cielo Deo","","",4,0],[74,"Gaia Deo","","",4,0],[75,"Osadia Deo","","",1,0],[76,"Temptation Deo","","",3,0],[77,"Efective Original","","",4,0],[78,"Efective Brisa Floral","","",3,0],[79,"Efective Aclarante","","",3,0],[80,"Efective Clinical","","",3,0],[81,"Efective Sensitive","","",3,0],[82,"Efective Aerosol Clinical","","",2,0],[83,"Efective Aerosol Aclarante","","",2,0],[84,"Efective Aerosol Original","","",2,0],[85,"Arom Deo","","",3,0],[86,"Arom Absolut Deo","","",0,0],[87,"Arom Element Deo","","",0,0],[88,"Dendur Destiny Deo","","",2,0],[89,"Evolucion Deo","","",2,0],[90,"Foco Discover Deo","","",2,0],[91,"Temptation Deo V","","",1,0],[92,"Solo Deo","","",2,0],[93,"Solo Elixir Deo","","",1,0],[94,"Ohm Deo","","",2,0],[95,"Ohm Black Deo","","",3,0],[96,"Ohm Soul Deo","","",2,0],[97,"Zentro Deo","","",1,0]];

function loadInitialProducts() {
  return INITIAL_RAW.map(r => ({
    id: r[0], name: r[1], code: r[2], price: r[3],
    stock: { mc: r[4], sa: r[5] }, active: true
  }));
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwALuyQiBRe0oZlbQpycJa1oyCOSw9hYMM1fGXESYmNG2T7-6Niax8La7JUjmfViPbi/exec";

async function gsRead(action) {
  try {
    const r = await fetch(`${APPS_SCRIPT_URL}?action=${action}`, { redirect: "follow" });
    const text = await r.text();
    try { const d = JSON.parse(text); return d.rows || []; }
    catch { console.error("gsRead parse error:", text.slice(0, 200)); return []; }
  } catch (e) { console.error("gsRead error:", e); return []; }
}

async function gsWrite(action, data, extra = "") {
  try {
    const url = extra
      ? `${APPS_SCRIPT_URL}?action=${action}&${extra}`
      : `${APPS_SCRIPT_URL}?action=${action}`;
    
    const body = { action, data: JSON.stringify(data) };
    if (extra) extra.split("&").forEach(p => { const [k,v] = p.split("="); body[k] = v; });

    const r = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    try { return JSON.parse(text); }
    catch { console.error("gsWrite parse error:", text.slice(0, 200)); return { error: "Parse error" }; }
  } catch (e) { console.error("gsWrite error:", e); return { error: e.toString() }; }
}

function parseProducts(rows) {
  return rows.map(r => ({
    id: Number(r.ID) || 0, name: r.Nombre || "",
    code: String(r["Código"] || ""), price: String(r.Precio || ""),
    stock: { mc: Number(r["Stock MC"]) || 0, sa: Number(r["Stock SA"]) || 0 },
    active: r.Activo !== "No"
  }));
}

function parseMovements(rows) {
  return rows.map(r => ({
    id: r.ID || "", productId: Number(r["Producto ID"]) || 0, type: r.Tipo || "",
    qty: Math.abs(Number(r.Cantidad)) || 0, sede: r.Sede || "",
    sedeFrom: r["Sede Origen"] || "", sedeTo: r["Sede Destino"] || "",
    person: r.Consultora || "", notes: r.Notas || "",
    operator: r.Operadora || "", date: r.Fecha || "",
    loanId: r["Loan ID"] || "", _row: r._row
  }));
}

function parseOperadoras(rows) {
  return rows.map(r => ({ name: r.Nombre || "", pin: String(r.PIN || "0000"), role: r.Rol || "asistente", _row: r._row }));
}

function parseConsultoras(rows) {
  return rows.filter(r => r.Nombre).map(r => ({
    name: r.Nombre || "", phone: r["Teléfono"] || "", address: r["Dirección"] || "",
    dni: r.DNI || "", birthday: r["Cumpleaños"] || "", _row: r._row
  }));
}

const C = {
  bg: "#faf9f7", card: "#ffffff", border: "#e8e4df", borderLight: "#f0ece7",
  gold: "#8b6914", goldLight: "#b8960f", goldBg: "#f7f0e0", goldMuted: "#c4a44e",
  text: "#2c2825", textSecondary: "#6b6560", textMuted: "#9e9790", white: "#ffffff",
  green: "#2d7a4f", greenBg: "#edf7f0", red: "#b5485f", redBg: "#fdf0f2",
  yellow: "#9a6c3b", yellowBg: "#fdf5ec", blue: "#4a6fa5", blueBg: "#eef3fa",
  shadow: "0 1px 3px rgba(44,40,37,0.06), 0 1px 2px rgba(44,40,37,0.04)",
  shadowHover: "0 4px 12px rgba(44,40,37,0.08), 0 2px 4px rgba(44,40,37,0.04)",
};

const FONT = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'DM Sans', -apple-system, sans-serif";
const FONT_NUM = "'Outfit', 'DM Sans', sans-serif";
const FS = { xs: 13, sm: 15, base: 16, md: 17, lg: 19, xl: 22, xxl: 28, title: 32 };

const Icon = ({ name, size = 20 }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const icons = {
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    plus: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>,
    box: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>,
    move: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
    users: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    history: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    settings: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  };
  return icons[name] || null;
};

const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const base = { padding: "13px 24px", borderRadius: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, fontSize: FS.base, display: "inline-flex", alignItems: "center", gap: 8,
    transition: "all 0.2s", opacity: disabled ? 0.4 : 1, fontFamily: FONT_BODY, letterSpacing: 0.2 };
  const v = {
    primary: { background: C.gold, color: "#fff" },
    secondary: { background: C.bg, color: C.text, border: `1px solid ${C.border}` },
    danger: { background: C.redBg, color: C.red },
    ghost: { background: "transparent", color: C.textMuted, padding: "8px 12px" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant], ...style }}>{children}</button>;
};

const Input = ({ value, onChange, placeholder, style = {}, type = "text" }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
      background: C.white, color: C.text, fontSize: FS.base, outline: "none", fontFamily: FONT_BODY,
      boxSizing: "border-box", transition: "border-color 0.2s", ...style }}
    onFocus={e => e.target.style.borderColor = C.goldMuted}
    onBlur={e => e.target.style.borderColor = C.border} />
);

const Select = ({ value, onChange, options, placeholder, style = {} }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
      background: C.white, color: value ? C.text : C.textMuted, fontSize: FS.base,
      outline: "none", fontFamily: FONT_BODY, boxSizing: "border-box", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e9790' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 40, ...style }}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
      {typeof o === "string" ? o : o.label}</option>)}
  </select>
);

const Badge = ({ children, color = C.gold, bg }) => (
  <span style={{ padding: "5px 14px", borderRadius: 20, fontSize: FS.sm, fontWeight: 600,
    color, background: bg || C.goldBg, whiteSpace: "nowrap", letterSpacing: 0.2 }}>{children}</span>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`,
    padding: 22, cursor: onClick ? "pointer" : "default", transition: "all 0.2s",
    boxShadow: C.shadow, ...style }}>{children}</div>
);

const StockBadge = ({ qty }) => {
  const s = { display: "inline-block", width: 78, textAlign: "center", padding: "5px 0", borderRadius: 20,
    fontSize: FS.sm, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.2 };
  if (qty > 3) return <span style={{ ...s, color: C.green, background: C.greenBg }}>{qty} disp.</span>;
  if (qty > 0) return <span style={{ ...s, color: C.yellow, background: C.yellowBg }}>{qty} bajo</span>;
  return <span style={{ ...s, color: C.red, background: C.redBg }}>Sin stock</span>;
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(44,40,37,0.4)", backdropFilter: "blur(4px)" }} />
      <div onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 30,
          maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto",
          position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(44,40,37,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: FS.xl, fontFamily: FONT, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 4 }}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: FS.title, fontWeight: 600, color: C.text, margin: "0 0 24px", fontFamily: FONT, letterSpacing: -0.3 }}>{children}</h2>
);

const LBL = { fontSize: FS.xs, color: "#9e9790", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 };

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("stock");
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [people, setPeople] = useState([]);
  const [operators, setOperators] = useState(DEFAULT_OPERATORS);

  const reload = useCallback(async () => {
    const [prods, movs, cons, ops] = await Promise.all([
      gsRead("getProducts"), gsRead("getMovements"),
      gsRead("getConsultoras"), gsRead("getOperadoras"),
    ]);
    if (prods.length === 0 && ops.length === 0) throw new Error("No data returned");
    setProducts(parseProducts(prods));
    setMovements(parseMovements(movs));
    setPeople(parseConsultoras(cons));
    setOperators(ops.length > 0 ? parseOperadoras(ops) : DEFAULT_OPERATORS);
  }, []);

  useEffect(() => {
    reload()
      .then(() => setLoading(false))
      .catch(e => { console.error("Load failed:", e); setLoadError(true); setLoading(false); });
  }, [reload]);

  const withSave = useCallback(async (fn) => {
    setSaving(true);
    try { await fn(); await reload(); }
    catch (e) { console.error(e); }
    finally { setSaving(false); }
  }, [reload]);

  const updateProduct = useCallback(async (product) => {
    await withSave(async () => {
      await gsWrite("updateProduct", {
        ID: product.id, Nombre: product.name,
        "Código": product.code, Precio: product.price,
        "Stock MC": product.stock.mc, "Stock SA": product.stock.sa,
        Activo: product.active ? "Sí" : "No"
      });
    });
  }, [withSave]);

  const addProduct = useCallback(async (product) => {
    await withSave(async () => {
      const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      await gsWrite("addProduct", {
        ID: maxId, Nombre: product.name,
        "Código": product.code, Precio: product.price,
        "Stock MC": 0, "Stock SA": 0, Activo: "Sí"
      });
    });
  }, [withSave, products]);

  const addMovement = useCallback(async (movement) => {
    await withSave(async () => {
      const prod = products.find(p => p.id === movement.productId);
      await gsWrite("addMovement", {
        ID: movement.id, Fecha: movement.date, "Producto ID": movement.productId,
        Producto: prod?.name || "", Tipo: movement.type, Cantidad: movement.qty,
        Sede: movement.sede || "", "Sede Origen": movement.sedeFrom || "",
        "Sede Destino": movement.sedeTo || "", Consultora: movement.person || "",
        Notas: movement.notes || "", Operadora: movement.operator,
        "Loan ID": movement.loanId || "",
      });
    });
  }, [withSave, products]);

  const addMovements = useCallback(async (movementList) => {
    await withSave(async () => {
      const rows = movementList.map(movement => {
        const prod = products.find(p => p.id === movement.productId);
        return {
          ID: movement.id, Fecha: movement.date, "Producto ID": movement.productId,
          Producto: prod?.name || "", Tipo: movement.type, Cantidad: movement.qty,
          Sede: movement.sede || "", "Sede Origen": movement.sedeFrom || "",
          "Sede Destino": movement.sedeTo || "", Consultora: movement.person || "",
          Notas: movement.notes || "", Operadora: movement.operator,
          "Loan ID": movement.loanId || "",
        };
      });
      await gsWrite("addMovements", rows);
    });
  }, [withSave, products]);

  const removeMovement = useCallback(async (movement) => {
    const dataRowIndex = movement._row - 1;
    await withSave(() => gsWrite("removeMovement", {}, `row=${dataRowIndex}`));
  }, [withSave]);

  const addConsultora = useCallback(async (c) => {
    await withSave(() => gsWrite("addConsultora", {
      Nombre: c.name, "Teléfono": c.phone || "", "Dirección": c.address || "",
      DNI: c.dni || "", "Cumpleaños": c.birthday || ""
    }));
  }, [withSave]);

  const removeConsultora = useCallback(async (index) => {
    await withSave(() => gsWrite("removeConsultora", {}, `row=${index + 1}`));
  }, [withSave]);

  const updateConsultoraFn = useCallback(async (index, c) => {
    await withSave(() => gsWrite("updateConsultora", {
      Nombre: c.name, "Teléfono": c.phone || "", "Dirección": c.address || "",
      DNI: c.dni || "", "Cumpleaños": c.birthday || ""
    }, `row=${index + 1}`));
  }, [withSave]);

  const addOperadora = useCallback(async (op) => {
    await withSave(() => gsWrite("addOperadora", { Nombre: op.name, PIN: op.pin, Rol: op.role }));
  }, [withSave]);

  const updateOperadora = useCallback(async (originalName, op) => {
    const idx = operators.findIndex(o => o.name === originalName);
    if (idx < 0) return;
    await withSave(() => gsWrite("updateOperadora", { Nombre: op.name, PIN: op.pin, Rol: op.role }, `row=${idx + 1}`));
  }, [withSave, operators]);

  const removeOperadora = useCallback(async (index) => {
    await withSave(() => gsWrite("removeOperadora", {}, `row=${index + 1}`));
  }, [withSave]);

  const bulkUpdateProducts = useCallback(async (newProducts) => {
    await withSave(async () => {
      const data = newProducts.map(p => ({
        ID: p.id, Nombre: p.name, "Código": p.code, Precio: p.price,
        "Stock MC": p.stock.mc, "Stock SA": p.stock.sa, Activo: p.active ? "Sí" : "No"
      }));
      await gsWrite("updateProducts", data);
    });
  }, [withSave]);

  const can = useCallback((action) => {
    if (!currentUser) return false;
    const r = currentUser.role;
    if (r === "admin" || r === "directora") return true;
    if (["view_stock","register_move","view_loans","view_history","manage_products","manage_people"].includes(action)) return true;
    return false;
  }, [currentUser]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: FS.sm, letterSpacing: 5, color: C.gold, fontWeight: 600 }}>YANBAL</div>
        <div style={{ color: C.textMuted, fontSize: FS.base, marginTop: 8 }}>Cargando inventario...</div>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: FS.sm, letterSpacing: 5, color: C.gold, fontWeight: 600 }}>YANBAL</div>
        <div style={{ color: C.red, fontSize: FS.lg, marginTop: 16, fontWeight: 600 }}>Error de conexión</div>
        <div style={{ color: C.textMuted, fontSize: FS.base, marginTop: 8, lineHeight: 1.5 }}>No se pudo conectar con Google Sheets.</div>
        <button onClick={() => { setLoadError(false); setLoading(true); reload().then(() => setLoading(false)).catch(() => { setLoadError(true); setLoading(false); }); }}
          style={{ marginTop: 20, padding: "13px 26px", borderRadius: 8, border: "none", background: C.gold, color: "#fff", fontWeight: 600, fontSize: FS.base, cursor: "pointer", fontFamily: FONT_BODY }}>
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!currentUser) return <LoginScreen operators={operators} onSelect={setCurrentUser} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT_BODY, color: C.text }}>
      {saving && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: C.gold, zIndex: 9999, animation: "pulse 1s ease-in-out infinite" }}>
          <style>{`@keyframes pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }`}</style>
        </div>
      )}
      <Header user={currentUser} onLogout={() => setCurrentUser(null)} />
      <Nav page={page} setPage={setPage} />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 100px" }}>
        {page === "stock" && <StockView products={products} movements={movements} />}
        {page === "move" && <MoveView products={products} people={people} user={currentUser.name} addMovement={addMovement} addMovements={addMovements} />}
        {page === "loans" && <LoansView products={products} movements={movements} addMovements={addMovements} currentUser={currentUser} />}
        {page === "history" && <HistoryView products={products} movements={movements} removeMovement={removeMovement} currentUser={currentUser} />}
        {page === "admin" && <AdminView products={products} people={people} operators={operators} currentUser={currentUser}
          updateProduct={updateProduct} addProduct={addProduct} bulkUpdateProducts={bulkUpdateProducts}
          addConsultora={addConsultora} removeConsultora={removeConsultora} updateConsultoraFn={updateConsultoraFn}
          addOperadora={addOperadora} updateOperadora={updateOperadora} removeOperadora={removeOperadora} />}
      </main>
    </div>
  );
}

function LoginScreen({ operators, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const op = operators.find(o => o.name === selected);
    if (!op) return;
    if (op.pin === "0000" || op.pin === pin) { onSelect({ name: op.name, role: op.role }); }
    else { setError("PIN incorrecto"); setPin(""); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: FS.base, fontWeight: 600, color: C.gold, letterSpacing: 6, marginBottom: 12 }}>YANBAL</div>
        <div style={{ fontSize: 40, fontWeight: 500, color: C.text, marginBottom: 6, fontFamily: FONT, lineHeight: 1.2 }}>Sistema de Inventario</div>
        <div style={{ width: 40, height: 1, background: C.goldMuted, margin: "16px auto 32px" }} />
        {!selected ? (
          <>
            <div style={{ color: C.textSecondary, fontSize: FS.md, marginBottom: 24 }}>Selecciona tu nombre</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {operators.map(op => (
                <button key={op.name} onClick={() => { setSelected(op.name); setPin(""); setError(""); }}
                  style={{ padding: "18px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white,
                    color: C.text, fontSize: FS.md, fontWeight: 500, cursor: "pointer", fontFamily: FONT_BODY,
                    textAlign: "left", display: "flex", alignItems: "center", gap: 14, boxShadow: C.shadow }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.goldBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: C.gold, fontWeight: 700, fontSize: FS.md }}>{op.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: FS.md }}>{op.name}</div>
                    <div style={{ fontSize: FS.sm, color: C.textMuted }}>{ROLES[op.role]}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ color: C.textSecondary, fontSize: FS.md, marginBottom: 8 }}>Hola, {selected}</div>
            {operators.find(o => o.name === selected)?.pin === "0000" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <div style={{ padding: "14px 16px", borderRadius: 8, background: C.yellowBg, color: C.yellow, fontSize: FS.sm }}>
                  Tu PIN es el predeterminado (0000). Cámbialo en Admin después de entrar.
                </div>
                <Btn onClick={() => onSelect({ name: selected, role: operators.find(o => o.name === selected).role })} style={{ width: "100%" }}>Entrar</Btn>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: FS.sm, fontFamily: FONT_BODY }}>← Cambiar usuario</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <div style={{ color: C.textMuted, fontSize: FS.sm, marginBottom: 4 }}>Ingresa tu PIN</div>
                <Input type="password" value={pin} onChange={v => { setPin(v.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                  placeholder="• • • •" style={{ textAlign: "center", fontSize: 28, letterSpacing: 12 }} />
                {error && <div style={{ color: C.red, fontSize: FS.sm }}>{error}</div>}
                <Btn onClick={handleLogin} disabled={pin.length < 4} style={{ width: "100%" }}>Entrar</Btn>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: FS.sm, fontFamily: FONT_BODY }}>← Cambiar usuario</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Header({ user, onLogout }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 20px", maxWidth: 900, margin: "0 auto", background: C.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: C.gold, letterSpacing: 5 }}>YANBAL</span>
            <span style={{ color: C.border, fontSize: 22 }}>|</span>
            <span style={{ fontSize: FS.md, color: C.text, fontWeight: 500, fontFamily: FONT }}>Inventario</span>
          </div>
          <div style={{ fontSize: FS.xs, color: C.textMuted, marginTop: 3 }}>Directora Elena Sta. Gadea — Uso exclusivo</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.goldBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.gold, fontWeight: 700, fontSize: FS.base }}>{user.name.charAt(0)}</span>
            </div>
            <div>
              <div style={{ fontSize: FS.base, color: C.text, fontWeight: 500 }}>{user.name}</div>
              <div style={{ fontSize: FS.xs, color: C.textMuted }}>{ROLES[user.role]}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: FONT_BODY, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span style={{ fontSize: 10 }}>Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Nav({ page, setPage }) {
  const items = [
    { id: "stock", icon: "box", label: "Stock" },
    { id: "move", icon: "move", label: "Movimiento" },
    { id: "loans", icon: "users", label: "Préstamos" },
    { id: "history", icon: "history", label: "Historial" },
    { id: "admin", icon: "settings", label: "Admin" },
  ];
  return (
    <div style={{ display: "flex", padding: "0 20px", maxWidth: 900, margin: "0 auto", overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      {items.map(item => (
        <button key={item.id} onClick={() => setPage(item.id)}
          style={{ padding: "16px 20px", border: "none", background: "transparent",
            color: page === item.id ? C.gold : C.textMuted, cursor: "pointer",
            fontSize: FS.base, fontWeight: page === item.id ? 600 : 500,
            display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
            fontFamily: FONT_BODY, borderBottom: page === item.id ? `2px solid ${C.gold}` : "2px solid transparent",
            marginBottom: -1, borderRadius: 0 }}>
          <Icon name={item.icon} size={17} />{item.label}
        </button>
      ))}
    </div>
  );
}

function StockView({ products, movements }) {
  const [search, setSearch] = useState("");
  const [sedeFilter, setSedeFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const computedStock = useMemo(() => {
    const stock = {};
    products.forEach(p => { stock[p.id] = { mc: p.stock.mc, sa: p.stock.sa }; });
    movements.forEach(m => {
      if (!stock[m.productId]) return;
      const type = MOVE_TYPES.find(t => t.id === m.type);
      if (!type) return;
      if (m.type === "traslado" || m.type === "traslado_in" || m.type === "traslado_out") {
        if (m.sedeFrom === "Mariscal Cáceres") { stock[m.productId].mc -= m.qty; stock[m.productId].sa += m.qty; }
        else { stock[m.productId].sa -= m.qty; stock[m.productId].mc += m.qty; }
      } else {
        const sede = m.sede === "Mariscal Cáceres" ? "mc" : "sa";
        stock[m.productId][sede] += type.dir * m.qty;
      }
    });
    return stock;
  }, [products, movements]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (!p.active) return false;
      const s = search.toLowerCase();
      if (s && !p.name.toLowerCase().includes(s) && !p.code.includes(s)) return false;
      const st = computedStock[p.id] || { mc: 0, sa: 0 };
      const total = st.mc + st.sa;
      const sedeQty = sedeFilter === "Mariscal Cáceres" ? st.mc : sedeFilter === "San Agustín" ? st.sa : total;
      if (stockFilter === "disponible" && sedeQty <= 0) return false;
      if (stockFilter === "agotado" && sedeQty > 0) return false;
      if (stockFilter === "bajo" && (sedeQty <= 0 || sedeQty > 3)) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [products, search, sedeFilter, stockFilter, computedStock]);

  const stats = useMemo(() => {
    let total = 0, available = 0, outOfStock = 0;
    products.filter(p => p.active).forEach(p => {
      const st = computedStock[p.id] || { mc: 0, sa: 0 };
      total++; if (st.mc + st.sa > 0) available++; else outOfStock++;
    });
    return { total, available, outOfStock };
  }, [products, computedStock]);

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Stock de Productos</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 26 }}>
        {[
          { label: "Total productos", value: stats.total, color: C.gold, bg: C.goldBg },
          { label: "Con stock", value: stats.available, color: C.green, bg: C.greenBg },
          { label: "Sin stock", value: stats.outOfStock, color: C.red, bg: C.redBg },
        ].map(s => (
          <Card key={s.label} style={{ padding: "20px 18px", textAlign: "center", borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 36, fontWeight: 600, color: s.color, fontFamily: FONT_NUM }}>{s.value}</div>
            <div style={{ fontSize: FS.xs, color: C.textMuted, marginTop: 4, fontWeight: 500, letterSpacing: 0.3, textTransform: "uppercase" }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textMuted }}><Icon name="search" size={18} /></div>
        <Input value={search} onChange={setSearch} placeholder="Buscar producto o código..." style={{ paddingLeft: 44 }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        <Select value={sedeFilter} onChange={setSedeFilter} options={SEDES} placeholder="Todas las sedes" style={{ flex: 1, minWidth: 140 }} />
        <Select value={stockFilter} onChange={setStockFilter}
          options={[{value:"disponible",label:"Con stock"},{value:"agotado",label:"Sin stock"},{value:"bajo",label:"Stock bajo"}]}
          placeholder="Estado" style={{ flex: 1, minWidth: 120 }} />
      </div>
      <div style={{ fontSize: FS.sm, color: C.textMuted, marginBottom: 10, fontWeight: 500 }}>{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.map(p => {
          const st = computedStock[p.id] || { mc: 0, sa: 0 };
          const total = st.mc + st.sa;
          return (
            <Card key={p.id} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: FS.md, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 4, display: "flex", gap: 8 }}>
                  {p.code && <span>CÓD. {p.code}</span>}
                  {p.price && <span>S/ {p.price}</span>}
                </div>
              </div>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "center", width: 52 }}>
                  <div style={{ fontSize: FS.lg, fontWeight: 700, color: st.mc > 0 ? C.green : C.red }}>{st.mc}</div>
                  <div style={{ fontSize: FS.xs, color: C.textMuted, letterSpacing: 0.5, fontWeight: 600 }}>MC</div>
                </div>
                <div style={{ width: 1, height: 28, background: C.borderLight }} />
                <div style={{ textAlign: "center", width: 52 }}>
                  <div style={{ fontSize: FS.lg, fontWeight: 700, color: st.sa > 0 ? C.green : C.red }}>{st.sa}</div>
                  <div style={{ fontSize: FS.xs, color: C.textMuted, letterSpacing: 0.5, fontWeight: 600 }}>SA</div>
                </div>
                <div style={{ width: 1, height: 28, background: C.borderLight }} />
                <StockBadge qty={total} />
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 50, color: C.textMuted, fontSize: FS.base }}>No se encontraron productos</div>}
      </div>
    </div>
  );
}

function MoveView({ products, people, user, addMovement, addMovements }) {
  const [direction, setDirection] = useState("");
  const [type, setType] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [sede, setSede] = useState("");
  const [sedeFrom, setSedeFrom] = useState("");
  const [sedeTo, setSedeTo] = useState("");
  const [person, setPerson] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartProductId, setCartProductId] = useState("");
  const [cartProductSearch, setCartProductSearch] = useState("");
  const [cartQty, setCartQty] = useState("1");

  const isLoan = type === "prestamo";
  const isTraslado = type === "traslado_in" || type === "traslado_out";
  const needsPerson = type === "prestamo" || type === "devolucion";
  const availableTypes = MOVE_TYPES.filter(t => t.group === direction);

  const filteredProducts = useMemo(() => {
    const s = (isLoan ? cartProductSearch : productSearch).toLowerCase();
    if (!s) return products.filter(p => p.active);
    return products.filter(p => p.active && (p.name.toLowerCase().includes(s) || p.code.includes(s)));
  }, [products, productSearch, cartProductSearch, isLoan]);

  const resetForm = () => {
    setDirection(""); setType(""); setProductId(""); setQty(""); setSede("");
    setSedeFrom(""); setSedeTo(""); setPerson(""); setNotes(""); setProductSearch("");
    setCart([]); setCartProductId(""); setCartProductSearch(""); setCartQty("1");
  };

  const addToCart = () => {
    if (!cartProductId) return;
    const parsedQty = Math.abs(parseInt(cartQty)) || 1;
    const existing = cart.find(c => c.productId === parseInt(cartProductId));
    if (existing) {
      setCart(cart.map(c => c.productId === parseInt(cartProductId) ? { ...c, qty: c.qty + parsedQty } : c));
    } else {
      const prod = products.find(p => p.id === parseInt(cartProductId));
      setCart([...cart, { productId: parseInt(cartProductId), name: prod?.name || "", qty: parsedQty }]);
    }
    setCartProductId(""); setCartProductSearch(""); setCartQty("1");
  };

  const handleSubmit = async () => {
    if (isLoan) {
      if (!person || !sede || cart.length === 0) return;
      const now = new Date().toISOString();
      const loanId = genId(); // ← generado aquí en el momento del submit
      await addMovements(cart.map(item => ({
        id: genId(),
        productId: item.productId, type: "prestamo", qty: item.qty,
        sede, person, notes, operator: user, date: now, loanId,
      })));
    } else {
      const parsedQty = Math.abs(parseInt(qty));
      if (!type || !productId || !parsedQty) return;
      if (!isTraslado && !sede) return;
      if (isTraslado && (!sedeFrom || !sedeTo)) return;
      if (needsPerson && !person) return;
      await addMovement({
        id: genId(),
        productId: parseInt(productId), type, qty: parsedQty,
        sede: isTraslado ? "" : sede,
        sedeFrom: isTraslado ? sedeFrom : "",
        sedeTo: isTraslado ? sedeTo : "",
        person: needsPerson ? person : "",
        notes, operator: user,
        date: new Date().toISOString(),
        loanId: "",
      });
    }
    setSuccess(true);
    setTimeout(() => { setSuccess(false); resetForm(); }, 1500);
  };

  const isDisabled = isLoan
    ? !person || !sede || cart.length === 0
    : !type || !productId || !qty || (!isTraslado && !sede) || (isTraslado && (!sedeFrom || !sedeTo)) || (needsPerson && !person);

  if (success) return (
    <div style={{ textAlign: "center", padding: "80px 20px", marginTop: 26 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.green }}><Icon name="check" size={28} /></div>
      <div style={{ fontSize: FS.xxl, fontWeight: 500, color: C.green, fontFamily: FONT }}>Registrado</div>
      <div style={{ color: C.textMuted, fontSize: FS.md, marginTop: 8 }}>Movimiento guardado correctamente</div>
    </div>
  );

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Registrar Movimiento</SectionTitle>

      <Card style={{ marginBottom: 14 }}>
        <label style={LBL}>Dirección</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "ingreso", label: "Ingreso", icon: "📥", desc: "Entra producto al stock", color: C.green },
            { id: "egreso", label: "Egreso", icon: "📤", desc: "Sale producto del stock", color: C.red },
          ].map(d => (
            <button key={d.id} onClick={() => { setDirection(d.id); setType(""); setCart([]); }}
              style={{ padding: "18px 14px", borderRadius: 10, border: `2px solid ${direction === d.id ? d.color : C.border}`,
                background: direction === d.id ? d.color + "0a" : C.white, cursor: "pointer", textAlign: "center", fontFamily: FONT_BODY }}>
              <div style={{ fontSize: 26 }}>{d.icon}</div>
              <div style={{ fontSize: FS.md, fontWeight: 700, color: direction === d.id ? d.color : C.text, marginTop: 6 }}>{d.label}</div>
              <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 2 }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      {direction && (
        <Card style={{ marginBottom: 14 }}>
          <label style={LBL}>Motivo</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {availableTypes.map(t => (
              <button key={t.id} onClick={() => { setType(t.id); setCart([]); }}
                style={{ padding: "14px 16px", borderRadius: 8, border: `1.5px solid ${type === t.id ? C.gold : C.border}`,
                  background: type === t.id ? C.goldBg : C.white, cursor: "pointer", textAlign: "left",
                  fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ fontSize: FS.md, fontWeight: 600, color: type === t.id ? C.gold : C.text }}>{t.label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {type && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {isLoan ? (
              <>
                <div>
                  <label style={LBL}>Consultora</label>
                  <Select value={person} onChange={setPerson}
                    options={people.length > 0 ? people.map(p => typeof p === "string" ? p : p.name) : ["(Agrega consultoras en Admin)"]}
                    placeholder="Seleccionar consultora" />
                </div>
                <div>
                  <label style={LBL}>Sede</label>
                  <Select value={sede} onChange={setSede} options={SEDES} placeholder="Seleccionar sede" />
                </div>
                <div>
                  <label style={LBL}>Productos del préstamo</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <Input value={cartProductSearch} onChange={s => { setCartProductSearch(s); setCartProductId(""); }} placeholder="Buscar producto..." />
                      {cartProductSearch && !cartProductId && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, maxHeight: 200, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 4, background: C.white, boxShadow: C.shadowHover }}>
                          {filteredProducts.slice(0, 20).map(p => (
                            <div key={p.id} onClick={() => { setCartProductId(p.id.toString()); setCartProductSearch(p.name); }}
                              style={{ padding: "11px 14px", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`, fontSize: FS.sm, display: "flex", justifyContent: "space-between" }}
                              onMouseEnter={e => e.currentTarget.style.background = C.bg}
                              onMouseLeave={e => e.currentTarget.style.background = C.white}>
                              <span>{p.name}</span>
                              {p.code && <span style={{ color: C.textMuted, fontSize: FS.xs }}>{p.code}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input type="number" value={cartQty} min="1" onChange={e => setCartQty(e.target.value.replace(/[^0-9]/g, ""))}
                      style={{ width: 72, padding: "13px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: FS.base, fontFamily: FONT_BODY, textAlign: "center", outline: "none" }} />
                    <Btn onClick={addToCart} disabled={!cartProductId} variant="secondary" style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <Icon name="plus" size={16} /> Agregar
                    </Btn>
                  </div>
                  {cart.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {cart.map(item => (
                        <div key={item.productId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg }}>
                          <div style={{ flex: 1 }}><div style={{ fontSize: FS.md, fontWeight: 500 }}>{item.name}</div></div>
                          <Badge color={C.yellow} bg={C.yellowBg}>{item.qty} ud.</Badge>
                          <button onClick={() => setCart(cart.filter(c => c.productId !== item.productId))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "2px 4px" }}>
                            <Icon name="x" size={16} />
                          </button>
                        </div>
                      ))}
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.yellowBg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: FS.sm, color: C.yellow, fontWeight: 600 }}>Total</span>
                        <Badge color={C.yellow} bg={C.yellowBg}>{cart.reduce((a, c) => a + c.qty, 0)} unidades</Badge>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "18px 14px", textAlign: "center", color: C.textMuted, fontSize: FS.sm, border: `1px dashed ${C.border}`, borderRadius: 8 }}>
                      Ningún producto agregado aún
                    </div>
                  )}
                </div>
                <div>
                  <label style={LBL}>Notas (opcional)</label>
                  <Input value={notes} onChange={setNotes} placeholder="Agregar nota..." />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={LBL}>Producto</label>
                  <Input value={productSearch} onChange={s => { setProductSearch(s); setProductId(""); }} placeholder="Buscar producto..." />
                  {productSearch && !productId && (
                    <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 4, background: C.white, boxShadow: C.shadowHover }}>
                      {filteredProducts.slice(0, 20).map(p => (
                        <div key={p.id} onClick={() => { setProductId(p.id.toString()); setProductSearch(p.name); }}
                          style={{ padding: "11px 14px", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`, fontSize: FS.sm, display: "flex", justifyContent: "space-between" }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = C.white}>
                          <span>{p.name}</span>
                          {p.code && <span style={{ color: C.textMuted, fontSize: FS.xs }}>{p.code}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {productId && <div style={{ marginTop: 6, fontSize: FS.sm, color: C.green, display: "flex", alignItems: "center", gap: 4 }}><Icon name="check" size={15} /> Seleccionado</div>}
                </div>
                <div>
                  <label style={LBL}>Cantidad</label>
                  <Input value={qty} onChange={v => setQty(v.replace(/[^0-9]/g, ""))} placeholder="Cantidad" />
                </div>
                {isTraslado ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "end" }}>
                    <div><label style={LBL}>Sede origen</label><Select value={sedeFrom} onChange={setSedeFrom} options={SEDES} placeholder="Desde..." /></div>
                    <div style={{ color: C.goldMuted, paddingBottom: 16, fontSize: 20 }}>→</div>
                    <div><label style={LBL}>Sede destino</label><Select value={sedeTo} onChange={setSedeTo} options={SEDES.filter(s => s !== sedeFrom)} placeholder="Hacia..." /></div>
                  </div>
                ) : (
                  <div><label style={LBL}>Sede</label><Select value={sede} onChange={setSede} options={SEDES} placeholder="Seleccionar sede" /></div>
                )}
                {needsPerson && (
                  <div><label style={LBL}>{type === "prestamo" ? "Prestado a" : "Devuelto por"}</label>
                    <Select value={person} onChange={setPerson}
                      options={people.length > 0 ? people.map(p => typeof p === "string" ? p : p.name) : ["(Agrega consultoras en Admin)"]}
                      placeholder="Seleccionar consultora" /></div>
                )}
                <div><label style={LBL}>Notas (opcional)</label><Input value={notes} onChange={setNotes} placeholder="Agregar nota..." /></div>
              </>
            )}
          </div>
        </Card>
      )}

      {type && (
        <Btn onClick={handleSubmit} disabled={isDisabled} style={{ width: "100%", padding: "16px 20px", fontSize: FS.md, borderRadius: 10 }}>
          <Icon name="check" size={18} /> Registrar {direction === "ingreso" ? "ingreso" : "egreso"}
        </Btn>
      )}
    </div>
  );
}

function LoansView({ products, movements, addMovements, currentUser }) {
  const [search, setSearch] = useState("");
  const [showReturn, setShowReturn] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [returnSede, setReturnSede] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [deleteNote, setDeleteNote] = useState("");
  const [success, setSuccess] = useState("");
  const [checkedAll, setCheckedAll] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [returnQtys, setReturnQtys] = useState({});

  const canDelete = currentUser?.role === "admin" || currentUser?.role === "directora";

  const activeLoans = useMemo(() => {
    const byLoan = {};
    movements.filter(m => (m.type === "prestamo" || m.type === "devolucion") && m.person).forEach(m => {
      const key = m.loanId ? m.loanId : `legacy-${m.productId}-${m.person}`;
      if (!byLoan[key]) byLoan[key] = { loanId: key, person: m.person, date: m.date, items: {} };
      const pid = m.productId;
      if (!byLoan[key].items[pid]) byLoan[key].items[pid] = 0;
      byLoan[key].items[pid] += m.type === "prestamo" ? m.qty : -m.qty;
    });
    return Object.values(byLoan)
      .map(loan => ({ ...loan, items: Object.entries(loan.items).filter(([, qty]) => qty > 0).map(([pid, qty]) => ({ productId: Number(pid), qty })) }))
      .filter(loan => loan.items.length > 0);
  }, [movements]);

  const filtered = useMemo(() => {
    if (!search) return activeLoans;
    const s = search.toLowerCase();
    return activeLoans.filter(l => l.person?.toLowerCase().includes(s));
  }, [activeLoans, search]);

  const openReturn = (loan) => {
    const initChecked = {}, initQtys = {};
    loan.items.forEach(item => { initChecked[item.productId] = true; initQtys[item.productId] = item.qty; });
    setCheckedAll(true); setCheckedItems(initChecked); setReturnQtys(initQtys);
    setReturnSede(""); setReturnNote(""); setShowReturn(loan);
  };

  const toggleAll = (val) => {
    setCheckedAll(val);
    const updated = {};
    showReturn.items.forEach(item => { updated[item.productId] = val; });
    setCheckedItems(updated);
  };

  const toggleItem = (productId, val) => {
    const updated = { ...checkedItems, [productId]: val };
    setCheckedItems(updated);
    setCheckedAll(Object.values(updated).every(Boolean));
  };

  const selectedCount = Object.values(checkedItems).filter(Boolean).length;
  const selectedUnits = showReturn
    ? showReturn.items.filter(i => checkedItems[i.productId]).reduce((a, i) => a + (returnQtys[i.productId] || 0), 0)
    : 0;

  const handleReturn = async () => {
    if (!returnSede || !showReturn || selectedCount === 0) return;
    const now = new Date().toISOString();
    const retLoanId = genId();
    await addMovements(
      showReturn.items.filter(item => checkedItems[item.productId]).map(item => ({
        id: genId(), productId: item.productId, type: "devolucion",
        qty: returnQtys[item.productId] || item.qty,
        sede: returnSede, person: showReturn.person,
        notes: returnNote, operator: currentUser.name,
        date: now, loanId: retLoanId,
      }))
    );
    setShowReturn(null);
    setSuccess("Devolución registrada");
    setTimeout(() => setSuccess(""), 2500);
  };

  const handleDelete = async () => {
    if (!deleteNote || !showDelete) return;
    const now = new Date().toISOString();
    const delLoanId = genId();
    await addMovements(showDelete.items.map(item => ({
      id: genId(), productId: item.productId, type: "devolucion", qty: item.qty,
      sede: "Mariscal Cáceres", person: showDelete.person,
      notes: `[ELIMINADO] ${deleteNote}`,
      operator: currentUser.name, date: now, loanId: delLoanId,
    })));
    setShowDelete(null);
    setSuccess("Préstamo eliminado");
    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Préstamos Pendientes</SectionTitle>
      {success && <div style={{ padding: "14px 18px", borderRadius: 8, background: C.greenBg, color: C.green, fontSize: FS.md, fontWeight: 600, marginBottom: 18, textAlign: "center" }}>{success}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 22 }}>
        <Card style={{ padding: "20px 18px", textAlign: "center", borderLeft: `3px solid ${C.yellow}` }}>
          <div style={{ fontSize: 36, fontWeight: 600, color: C.yellow, fontFamily: FONT_NUM }}>{activeLoans.length}</div>
          <div style={{ fontSize: FS.xs, color: C.textMuted, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase", marginTop: 4 }}>Préstamos activos</div>
        </Card>
        <Card style={{ padding: "20px 18px", textAlign: "center", borderLeft: `3px solid ${C.yellow}` }}>
          <div style={{ fontSize: 36, fontWeight: 600, color: C.yellow, fontFamily: FONT_NUM }}>
            {activeLoans.reduce((a, l) => a + l.items.reduce((b, i) => b + i.qty, 0), 0)}
          </div>
          <div style={{ fontSize: FS.xs, color: C.textMuted, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase", marginTop: 4 }}>Unidades prestadas</div>
        </Card>
      </div>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textMuted }}><Icon name="search" size={18} /></div>
        <Input value={search} onChange={setSearch} placeholder="Buscar por consultora..." style={{ paddingLeft: 44 }} />
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: C.textMuted, fontSize: FS.base }}>
          {activeLoans.length === 0 ? "No hay préstamos pendientes" : "No se encontraron resultados"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(loan => {
            const days = Math.floor((Date.now() - new Date(loan.date).getTime()) / 86400000);
            const totalUnits = loan.items.reduce((a, i) => a + i.qty, 0);
            return (
              <Card key={loan.loanId} style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: FS.lg, color: C.text }}>{loan.person}</div>
                    <div style={{ fontSize: FS.sm, color: days > 14 ? C.red : C.textMuted, marginTop: 3, fontWeight: days > 14 ? 600 : 400 }}>
                      {days > 14 ? `⚠ ${days} días` : `${days} días`}
                    </div>
                  </div>
                  <Badge color={C.yellow} bg={C.yellowBg}>{totalUnits} ud.</Badge>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {loan.items.map(item => {
                    const prod = products.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                        <span style={{ fontSize: FS.md, color: C.text }}>{prod?.name || "?"}</span>
                        <span style={{ fontSize: FS.sm, color: C.textMuted }}>{item.qty} ud.</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openReturn(loan)} style={{ flex: 1, background: C.greenBg, border: `1px solid ${C.green}33`, borderRadius: 8, padding: "11px 16px", color: C.green, fontSize: FS.base, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY }}>Devolver</button>
                  {canDelete && <button onClick={() => { setDeleteNote(""); setShowDelete(loan); }} style={{ background: C.redBg, border: `1px solid ${C.red}33`, borderRadius: 8, padding: "11px 16px", color: C.red, fontSize: FS.base, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY }}>Eliminar</button>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showReturn !== null} onClose={() => setShowReturn(null)} title="Registrar Devolución">
        {showReturn && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px 16px", borderRadius: 8, background: C.bg, border: `1px solid ${C.borderLight}` }}>
              <div style={{ fontSize: FS.md, fontWeight: 600 }}>{showReturn.person}</div>
              <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 2 }}>
                {showReturn.items.length} producto{showReturn.items.length !== 1 ? "s" : ""} · {showReturn.items.reduce((a, i) => a + i.qty, 0)} ud.
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 8, background: C.goldBg, border: `1px solid ${C.goldMuted}33`, cursor: "pointer" }}>
              <input type="checkbox" checked={checkedAll} onChange={e => toggleAll(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: C.gold, cursor: "pointer", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: FS.md, fontWeight: 600 }}>Devolver todo el préstamo</div>
                <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 1 }}>Marca todos los productos</div>
              </div>
            </label>
            <div style={{ height: 1, background: C.border }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {showReturn.items.map(item => {
                const prod = products.find(p => p.id === item.productId);
                const isChecked = checkedItems[item.productId] ?? true;
                return (
                  <div key={item.productId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: isChecked ? C.white : C.bg }}>
                    <input type="checkbox" checked={isChecked} onChange={e => toggleItem(item.productId, e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: C.gold, cursor: "pointer", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: FS.md, fontWeight: 500, color: isChecked ? C.text : C.textMuted }}>{prod?.name || "?"}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: FS.sm, color: C.textMuted }}>Cant.:</span>
                      <input type="number" value={returnQtys[item.productId] ?? item.qty} min={1} max={item.qty} disabled={!isChecked}
                        onChange={e => setReturnQtys({ ...returnQtys, [item.productId]: Math.min(item.qty, Math.max(1, parseInt(e.target.value) || 1)) })}
                        style={{ width: 68, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: FS.base, fontFamily: FONT_BODY, textAlign: "center", outline: "none", opacity: isChecked ? 1 : 0.4 }} />
                      <span style={{ fontSize: FS.sm, color: C.textMuted }}>/ {item.qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div><label style={LBL}>Sede donde se devuelve</label><Select value={returnSede} onChange={setReturnSede} options={SEDES} placeholder="Seleccionar sede" /></div>
            <div><label style={LBL}>Nota (opcional)</label><Input value={returnNote} onChange={setReturnNote} placeholder="Agregar nota..." /></div>
            {selectedCount > 0 && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: C.greenBg, fontSize: FS.sm, color: C.green, fontWeight: 600 }}>
                Devolviendo {selectedCount} producto{selectedCount !== 1 ? "s" : ""} · {selectedUnits} unidad{selectedUnits !== 1 ? "es" : ""}
              </div>
            )}
            <div style={{ fontSize: FS.sm, color: C.textMuted }}>Registrado por: <strong>{currentUser?.name}</strong> · {new Date().toLocaleDateString("es-PE")}</div>
            <Btn onClick={handleReturn} disabled={!returnSede || selectedCount === 0} style={{ width: "100%" }}>
              <Icon name="check" size={18} /> Confirmar devolución
            </Btn>
          </div>
        )}
      </Modal>

      <Modal open={showDelete !== null} onClose={() => setShowDelete(null)} title="Eliminar Préstamo">
        {showDelete && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px 16px", borderRadius: 8, background: C.redBg, border: `1px solid ${C.red}22` }}>
              <div style={{ fontSize: FS.sm, color: C.red, fontWeight: 600 }}>Esto eliminará el préstamo completo.</div>
              <div style={{ fontSize: FS.sm, color: C.red, marginTop: 4, opacity: 0.8 }}>Se registrará como devolución con nota [ELIMINADO].</div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 8, background: C.bg }}>
              <div style={{ fontSize: FS.md, fontWeight: 600, marginBottom: 8 }}>{showDelete.person}</div>
              {showDelete.items.map(item => {
                const prod = products.find(p => p.id === item.productId);
                return <div key={item.productId} style={{ fontSize: FS.sm, color: C.textMuted, display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>{prod?.name || "?"}</span><span>{item.qty} ud.</span></div>;
              })}
            </div>
            <div><label style={LBL}>Motivo de eliminación *</label><Input value={deleteNote} onChange={setDeleteNote} placeholder="Escribe el motivo..." /></div>
            <div style={{ fontSize: FS.sm, color: C.textMuted }}>Eliminado por: <strong>{currentUser?.name}</strong></div>
            <Btn onClick={handleDelete} disabled={!deleteNote} variant="danger" style={{ width: "100%" }}>Eliminar préstamo completo</Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}

function HistoryView({ products, movements, removeMovement, currentUser }) {
  const [filterType, setFilterType] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [success, setSuccess] = useState("");

  const canDelete = currentUser?.role === "admin" || currentUser?.role === "directora";
  const sorted = useMemo(() => {
    let m = [...movements].reverse();
    if (filterType) m = m.filter(mv => mv.type === filterType);
    if (filterOperator) m = m.filter(mv => mv.operator === filterOperator);
    return m;
  }, [movements, filterType, filterOperator]);
  const operators = [...new Set(movements.map(m => m.operator))];

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await removeMovement(confirmDelete);
    setConfirmDelete(null);
    setSuccess("Movimiento eliminado");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Historial de Movimientos</SectionTitle>
      {success && <div style={{ padding: "14px 18px", borderRadius: 8, background: C.greenBg, color: C.green, fontSize: FS.md, fontWeight: 600, marginBottom: 18, textAlign: "center" }}>{success}</div>}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <Select value={filterType} onChange={setFilterType} options={MOVE_TYPES.filter(t => t.group !== "_legacy").map(t => ({ value: t.id, label: t.label }))} placeholder="Tipo" style={{ flex: 1, minWidth: 140 }} />
        <Select value={filterOperator} onChange={setFilterOperator} options={operators} placeholder="Operadora" style={{ flex: 1, minWidth: 140 }} />
      </div>
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: C.textMuted, fontSize: FS.base }}>No hay movimientos registrados</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {sorted.slice(0, 50).map(m => {
            const prod = products.find(p => p.id === m.productId);
            const type = MOVE_TYPES.find(t => t.id === m.type);
            const d = new Date(m.date);
            return (
              <Card key={m.id} style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{type?.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: FS.md, color: C.text }}>{prod?.name || "?"}</span>
                      <span style={{ fontSize: FS.md, fontWeight: 700, color: type?.color || C.text }}>
                        {type?.dir === 1 ? "+" : type?.dir === -1 ? "−" : "⇄"}{m.qty}
                      </span>
                    </div>
                    <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 4, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span>{type?.label}</span>
                      {m.sede && <span>· {m.sede}</span>}
                      {m.sedeFrom && <span>· {m.sedeFrom} → {m.sedeTo}</span>}
                      {m.person && <span>· {m.person}</span>}
                      {m.loanId && <span style={{ color: C.goldMuted }}>· #{m.loanId.slice(-4)}</span>}
                    </div>
                    {m.notes && <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 3, fontStyle: "italic" }}>"{m.notes}"</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div>
                      <div style={{ fontSize: FS.sm, color: C.textSecondary }}>{d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}</div>
                      <div style={{ fontSize: FS.xs, color: C.textMuted }}>{d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</div>
                      <div style={{ fontSize: FS.xs, color: C.gold, marginTop: 2, fontWeight: 600 }}>{m.operator}</div>
                    </div>
                    {canDelete && <button onClick={() => setConfirmDelete(m)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600, padding: "2px 0" }}>Eliminar</button>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Eliminar Movimiento">
        {confirmDelete && (() => {
          const prod = products.find(p => p.id === confirmDelete.productId);
          const type = MOVE_TYPES.find(t => t.id === confirmDelete.type);
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "14px 16px", borderRadius: 8, background: C.redBg, border: `1px solid ${C.red}22` }}>
                <div style={{ fontSize: FS.sm, color: C.red, fontWeight: 600 }}>Esta acción no se puede deshacer.</div>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 8, background: C.bg }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{type?.icon}</span>
                  <span style={{ fontSize: FS.md, fontWeight: 600 }}>{prod?.name || "?"}</span>
                  <span style={{ fontSize: FS.md, fontWeight: 700, color: type?.color }}>{type?.dir === 1 ? "+" : type?.dir === -1 ? "−" : "⇄"}{confirmDelete.qty}</span>
                </div>
                <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 4 }}>
                  {type?.label} · {new Date(confirmDelete.date).toLocaleDateString("es-PE")} · por {confirmDelete.operator}
                </div>
              </div>
              <div style={{ fontSize: FS.sm, color: C.textMuted }}>Eliminado por: <strong>{currentUser?.name}</strong></div>
              <Btn onClick={handleDelete} variant="danger" style={{ width: "100%" }}>Eliminar movimiento</Btn>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

function AdminView({ products, people, operators, currentUser,
  updateProduct, addProduct, bulkUpdateProducts,
  addConsultora, removeConsultora, updateConsultoraFn,
  addOperadora, updateOperadora, removeOperadora }) {
  const [tab, setTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(null);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddOperator, setShowAddOperator] = useState(false);
  const [showEditOperator, setShowEditOperator] = useState(null);
  const [newProd, setNewProd] = useState({ name: "", code: "", price: "" });
  const [editProd, setEditProd] = useState({ name: "", code: "", price: "" });
  const [newPerson, setNewPerson] = useState({ name: "", phone: "", address: "", dni: "", birthday: "" });
  const [showEditPerson, setShowEditPerson] = useState(null);
  const [editPerson, setEditPerson] = useState({ name: "", phone: "", address: "", dni: "", birthday: "" });
  const [newOperator, setNewOperator] = useState({ name: "", pin: "", role: "asistente" });
  const [editOp, setEditOp] = useState({ name: "", pin: "", role: "" });
  const [prodSearch, setProdSearch] = useState("");

  const canManageOps = currentUser.role === "admin" || currentUser.role === "directora";
  const tabs = [["products","Productos"],["people","Consultoras"]];
  if (canManageOps) tabs.push(["operators","Operadoras"]);

  const handleAddProduct = async () => {
    if (!newProd.name) return;
    await addProduct(newProd);
    setNewProd({ name: "", code: "", price: "" }); setShowAddProduct(false);
  };
  const openEditProduct = (p) => {
    setEditProd({ name: p.name, code: p.code, price: p.price });
    setShowEditProduct(p.id);
  };
  const handleEditProduct = async () => {
    if (!editProd.name) return;
    const orig = products.find(p => p.id === showEditProduct);
    if (!orig) return;
    await updateProduct({ ...orig, name: editProd.name, code: editProd.code, price: editProd.price });
    setShowEditProduct(null);
  };
  const handleAddPerson = async () => {
    if (!newPerson.name || people.find(p => p.name === newPerson.name)) return;
    await addConsultora(newPerson);
    setNewPerson({ name: "", phone: "", address: "", dni: "", birthday: "" }); setShowAddPerson(false);
  };
  const openEditPerson = (p, origIndex) => {
    setEditPerson({ name: p.name, phone: p.phone || "", address: p.address || "", dni: p.dni || "", birthday: p.birthday || "" });
    setShowEditPerson(origIndex);
  };
  const handleEditPerson = async () => {
    if (!editPerson.name) return;
    await updateConsultoraFn(showEditPerson, editPerson);
    setShowEditPerson(null);
  };
  const handleAddOperator = async () => {
    if (!newOperator.name || !newOperator.pin || newOperator.pin.length < 4) return;
    if (operators.find(o => o.name === newOperator.name)) return;
    await addOperadora(newOperator);
    setNewOperator({ name: "", pin: "", role: "asistente" }); setShowAddOperator(false);
  };
  const openEditOperator = (op) => { setEditOp({ name: op.name, pin: "", role: op.role }); setShowEditOperator(op.name); };
  const handleEditOperator = async () => {
    const orig = operators.find(o => o.name === showEditOperator);
    if (!orig) return;
    await updateOperadora(showEditOperator, { name: orig.name, role: editOp.role, pin: editOp.pin.length === 4 ? editOp.pin : orig.pin });
    setShowEditOperator(null);
  };

  const filteredProds = prodSearch ? products.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase())) : products;

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Administración</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {tabs.map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${tab === t ? C.gold : C.border}`,
              background: tab === t ? C.goldBg : C.white, color: tab === t ? C.gold : C.textMuted,
              cursor: "pointer", fontSize: FS.base, fontWeight: 600, fontFamily: FONT_BODY }}>{l}</button>
        ))}
      </div>

      {tab === "products" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <Input value={prodSearch} onChange={setProdSearch} placeholder="Buscar producto..." style={{ flex: 1 }} />
            <Btn onClick={() => setShowAddProduct(true)}><Icon name="plus" size={17} /> Agregar</Btn>
          </div>
          <div style={{ fontSize: FS.sm, color: C.textMuted, marginBottom: 10 }}>
            {products.filter(p => p.active).length} activos · {products.filter(p => !p.active).length} inactivos
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 480, overflowY: "auto" }}>
            {filteredProds.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 8, background: C.white, border: `1px solid ${C.border}`, opacity: p.active ? 1 : 0.5 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: FS.base, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}{!p.active && <span style={{ fontSize: FS.xs, color: C.textMuted, fontWeight: 400, marginLeft: 6 }}>(inactivo)</span>}
                  </div>
                  <div style={{ fontSize: FS.xs, color: C.textMuted, display: "flex", gap: 6 }}>
                    {p.code && <span>CÓD. {p.code}</span>}
                    {p.price && <span>· S/ {p.price}</span>}
                  </div>
                </div>
                <button onClick={() => openEditProduct(p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: FS.sm, color: C.gold, fontFamily: FONT_BODY, fontWeight: 600 }}>Editar</button>
                <button onClick={() => updateProduct({ ...p, active: !p.active })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: FS.sm, color: p.active ? C.red : C.green, fontFamily: FONT_BODY, fontWeight: 600 }}>{p.active ? "Desactivar" : "Activar"}</button>
              </div>
            ))}
          </div>
          <Modal open={showAddProduct} onClose={() => setShowAddProduct(false)} title="Agregar Producto">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={newProd.name} onChange={v => setNewProd({ ...newProd, name: v })} placeholder="Nombre del producto" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={LBL}>Código</label><Input value={newProd.code} onChange={v => setNewProd({ ...newProd, code: v })} placeholder="CÓD." /></div>
                <div><label style={LBL}>Precio (S/)</label><Input value={newProd.price} onChange={v => setNewProd({ ...newProd, price: v })} placeholder="0.00" /></div>
              </div>
              <Btn onClick={handleAddProduct} disabled={!newProd.name} style={{ width: "100%", marginTop: 8 }}>Agregar producto</Btn>
            </div>
          </Modal>
          <Modal open={showEditProduct !== null} onClose={() => setShowEditProduct(null)} title="Editar Producto">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={editProd.name} onChange={v => setEditProd({ ...editProd, name: v })} placeholder="Nombre del producto" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={LBL}>Código</label><Input value={editProd.code} onChange={v => setEditProd({ ...editProd, code: v })} placeholder="CÓD." /></div>
                <div><label style={LBL}>Precio (S/)</label><Input value={editProd.price} onChange={v => setEditProd({ ...editProd, price: v })} placeholder="0.00" /></div>
              </div>
              <Btn onClick={handleEditProduct} disabled={!editProd.name} style={{ width: "100%", marginTop: 8 }}>Guardar cambios</Btn>
            </div>
          </Modal>
        </>
      )}

      {tab === "people" && (
        <>
          <Btn onClick={() => setShowAddPerson(true)} style={{ width: "100%", marginBottom: 18 }}><Icon name="plus" size={17} /> Agregar consultora</Btn>
          {people.length === 0 ? (
            <div style={{ textAlign: "center", padding: 50, color: C.textMuted }}>
              <div style={{ fontSize: FS.md, marginBottom: 4 }}>No hay consultoras registradas</div>
              <div style={{ fontSize: FS.sm }}>Agrega consultoras para poder registrar préstamos</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[...people].sort((a, b) => a.name.localeCompare(b.name, "es")).map(p => {
                const origIndex = people.findIndex(pp => pp.name === p.name);
                return (
                  <div key={origIndex} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 8, background: C.white, border: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: FS.md, color: C.text, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: FS.xs, color: C.textMuted, display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                        {p.phone && <span>📞 {p.phone}</span>}
                        {p.dni && <span>DNI: {p.dni}</span>}
                        {p.birthday && <span>🎂 {p.birthday}</span>}
                        {p.address && <span>📍 {p.address}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEditPerson(p, origIndex)} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Editar</button>
                      <button onClick={() => removeConsultora(origIndex)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Modal open={showAddPerson} onClose={() => setShowAddPerson(false)} title="Agregar Consultora">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={newPerson.name} onChange={v => setNewPerson({ ...newPerson, name: v })} placeholder="Nombre completo" /></div>
              <div><label style={LBL}>Teléfono</label><Input value={newPerson.phone} onChange={v => setNewPerson({ ...newPerson, phone: v })} placeholder="Número de teléfono" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={LBL}>DNI</label><Input value={newPerson.dni} onChange={v => setNewPerson({ ...newPerson, dni: v })} placeholder="Número de DNI" /></div>
                <div><label style={LBL}>Cumpleaños</label><Input type="date" value={newPerson.birthday} onChange={v => setNewPerson({ ...newPerson, birthday: v })} /></div>
              </div>
              <div><label style={LBL}>Dirección</label><Input value={newPerson.address} onChange={v => setNewPerson({ ...newPerson, address: v })} placeholder="Dirección" /></div>
              <Btn onClick={handleAddPerson} disabled={!newPerson.name} style={{ width: "100%", marginTop: 8 }}>Agregar consultora</Btn>
            </div>
          </Modal>
          <Modal open={showEditPerson !== null} onClose={() => setShowEditPerson(null)} title="Editar Consultora">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={editPerson.name} onChange={v => setEditPerson({ ...editPerson, name: v })} placeholder="Nombre completo" /></div>
              <div><label style={LBL}>Teléfono</label><Input value={editPerson.phone} onChange={v => setEditPerson({ ...editPerson, phone: v })} placeholder="Número de teléfono" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={LBL}>DNI</label><Input value={editPerson.dni} onChange={v => setEditPerson({ ...editPerson, dni: v })} placeholder="Número de DNI" /></div>
                <div><label style={LBL}>Cumpleaños</label><Input type="date" value={editPerson.birthday} onChange={v => setEditPerson({ ...editPerson, birthday: v })} /></div>
              </div>
              <div><label style={LBL}>Dirección</label><Input value={editPerson.address} onChange={v => setEditPerson({ ...editPerson, address: v })} placeholder="Dirección" /></div>
              <Btn onClick={handleEditPerson} disabled={!editPerson.name} style={{ width: "100%", marginTop: 8 }}>Guardar cambios</Btn>
            </div>
          </Modal>
        </>
      )}

      {tab === "operators" && canManageOps && (
        <>
          <Btn onClick={() => setShowAddOperator(true)} style={{ width: "100%", marginBottom: 18 }}><Icon name="plus" size={17} /> Agregar operadora</Btn>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {operators.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 8, background: C.white, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: FS.md, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                  {o.name}
                  <span style={{ fontSize: FS.xs, padding: "3px 10px", borderRadius: 10, fontWeight: 600,
                    background: o.role === "admin" ? C.goldBg : o.role === "directora" ? C.blueBg : C.bg,
                    color: o.role === "admin" ? C.gold : o.role === "directora" ? C.blue : C.textMuted }}>
                    {ROLES[o.role]}
                  </span>
                  {o.pin === "0000" && <span style={{ fontSize: FS.xs, color: C.yellow }}>⚠ PIN default</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEditOperator(o)} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Editar</button>
                  {o.name !== currentUser.name && <button onClick={() => removeOperadora(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Eliminar</button>}
                </div>
              </div>
            ))}
          </div>
          <Modal open={showAddOperator} onClose={() => setShowAddOperator(false)} title="Agregar Operadora">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={newOperator.name} onChange={v => setNewOperator({ ...newOperator, name: v })} placeholder="Nombre" /></div>
              <div><label style={LBL}>PIN (4 dígitos) *</label><Input type="password" value={newOperator.pin} onChange={v => setNewOperator({ ...newOperator, pin: v.replace(/\D/g, "").slice(0, 4) })} placeholder="• • • •" style={{ letterSpacing: 6 }} /></div>
              <div><label style={LBL}>Rol *</label><Select value={newOperator.role} onChange={v => setNewOperator({ ...newOperator, role: v })} options={[{value:"asistente",label:"Asistente"},{value:"directora",label:"Directora"},{value:"admin",label:"Admin"}]} placeholder="Seleccionar rol" /></div>
              <Btn onClick={handleAddOperator} disabled={!newOperator.name || newOperator.pin.length < 4} style={{ width: "100%", marginTop: 8 }}>Agregar</Btn>
            </div>
          </Modal>
          <Modal open={showEditOperator !== null} onClose={() => setShowEditOperator(null)} title="Editar Operadora">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: FS.md, fontWeight: 600, padding: "8px 0" }}>{showEditOperator}</div>
              <div><label style={LBL}>Nuevo PIN (dejar vacío para no cambiar)</label><Input type="password" value={editOp.pin} onChange={v => setEditOp({ ...editOp, pin: v.replace(/\D/g, "").slice(0, 4) })} placeholder="• • • •" style={{ letterSpacing: 6 }} /></div>
              <div><label style={LBL}>Rol</label><Select value={editOp.role} onChange={v => setEditOp({ ...editOp, role: v })} options={[{value:"asistente",label:"Asistente"},{value:"directora",label:"Directora"},{value:"admin",label:"Admin"}]} /></div>
              <Btn onClick={handleEditOperator} style={{ width: "100%", marginTop: 8 }}>Guardar cambios</Btn>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
