"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════
// DATA & CONSTANTS
// ═══════════════════════════════════════════════
const SEDES = ["Mariscal Cáceres", "San Agustín"];
const ROLES = { admin: "Admin", directora: "Directora", asistente: "Asistente" };
const DEFAULT_OPERATORS = [
  { name: "Eliane", pin: "0000", role: "admin" },
  { name: "Elena", pin: "0000", role: "directora" },
  { name: "Janeth", pin: "0000", role: "asistente" },
];
const DEFAULT_CATEGORIES = [
  "Sin categoría", "Fragancias Damas", "Fragancias Varones", "Desodorantes Damas",
  "Desodorantes Varones", "Línea Vivo", "Línea Tratamiento",
  "Maquillaje", "Total Block"
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

const INITIAL_RAW = [[1,"Adrenaline","Fragancias Damas","245","145",0,0],[2,"Adrenaline Alegria","Fragancias Damas","","",2,0],[3,"Adrenalina All","Fragancias Damas","","",0,0],[4,"A La Vida","Fragancias Damas","","",1,0],[5,"Aires Del Amazonas","Fragancias Damas","","",0,0],[6,"Aires Del Los Andes","Fragancias Damas","","",1,0],[7,"Aires Del Caribe","Fragancias Damas","","",0,0],[8,"Ccori","Fragancias Damas","2035","",3,0],[9,"Ccori Rose","Fragancias Damas","","",2,0],[10,"Ccori Cristal","Fragancias Damas","","",0,0],[11,"Ccori Cristal Rose","Fragancias Damas","","",1,0],[12,"Cielo","Fragancias Damas","2211","179",2,0],[13,"Cielo En Rosa","Fragancias Damas","2211","179",2,0],[14,"Dulce Amistad","Fragancias Damas","2182","145",1,0],[15,"Dulce Vanidad","Fragancias Damas","","",2,0],[16,"Di Que Si","Fragancias Damas","","",1,0],[17,"Di Que Si Caramel","Fragancias Damas","","",1,0],[18,"Gaia Elixir","Fragancias Damas","","",2,0],[19,"Gaia","Fragancias Damas","","",1,0],[20,"Icono","Fragancias Damas","","",1,0],[21,"Icono Intense","Fragancias Damas","","",1,0],[22,"Liberatta","Fragancias Damas","236","239",1,0],[23,"Liberatta Noire","Fragancias Damas","","",0,0],[24,"Liberatta Viva","Fragancias Damas","","",0,0],[25,"Pasion","Fragancias Damas","","",1,0],[26,"Temptation","Fragancias Damas","79946","",3,0],[27,"Temptatacion Mystic","Fragancias Damas","","",1,0],[28,"Osadia","Fragancias Damas","","",0,0],[29,"Osadia Infinita","Fragancias Damas","","",1,0],[30,"Xiss","Fragancias Damas","2214","99",3,0],[31,"Xiss Active","Fragancias Damas","2214","99",1,0],[32,"Mix & Chic Peach Tonic","Fragancias Damas","","",1,0],[33,"Mix & Chic Apple Tonic","Fragancias Damas","","",2,0],[34,"Mix & Chic Berry Tonic","Fragancias Damas","","",2,0],[35,"Mix & Chic Mango Tonico","Fragancias Damas","","",2,0],[36,"L'Essence Violeta Salvaje","Fragancias Damas","","",2,0],[37,"L'Essence Cerezo Silvestre","Fragancias Damas","","",1,0],[38,"L'Essence Orquidea Exotico","Fragancias Damas","","",1,0],[39,"L'Essence Mimosa Radiante","Fragancias Damas","","",1,0],[40,"Soy Sexi","Fragancias Damas","","",1,0],[41,"Soy Glow","Fragancias Damas","","",2,0],[42,"Soy Latina","Fragancias Damas","","",1,0],[43,"Soy Poderosa","Fragancias Damas","","",2,0],[44,"Soy Unica","Fragancias Damas","","",2,0],[45,"Arom","Fragancias Varones","2194","169",2,0],[46,"Arom Absolut","Fragancias Varones","210","192",1,0],[47,"Arom Element","Fragancias Varones","2177","192",2,0],[48,"Adrenaline","Fragancias Varones","245","145",1,0],[49,"Adrenaline All","Fragancias Varones","","",0,0],[50,"Dendur","Fragancias Varones","206","192",2,0],[51,"Dendur Destiny","Fragancias Varones","2201","192",3,0],[52,"Evolution","Fragancias Varones","","",1,0],[53,"Indomito","Fragancias Varones","","",1,0],[54,"Jaque","Fragancias Varones","203","220",2,0],[55,"Musk","Fragancias Varones","2218","",2,0],[56,"Ohm","Fragancias Varones","201","230",3,0],[57,"Ohm Plateado","Fragancias Varones","","",1,0],[58,"Ohm Black","Fragancias Varones","201","230",1,0],[59,"Ohm Soul","Fragancias Varones","","",2,0],[60,"Osadia","Fragancias Varones","","",2,0],[61,"Paralel 43°","Fragancias Varones","","",3,0],[62,"Savour","Fragancias Varones","","",0,0],[63,"Solo","Fragancias Varones","","",2,0],[64,"Solo Elixir","Fragancias Varones","","",1,0],[65,"Selecto","Fragancias Varones","2161","",1,0],[66,"Temptation","Fragancias Varones","","",1,0],[67,"Temptation Black","Fragancias Varones","2192","202",1,0],[68,"Xool","Fragancias Varones","221","",3,0],[69,"Zentro","Fragancias Varones","212","220",2,0],[70,"Ccori","Desodorantes Damas","","",2,0],[71,"Ccori Rose","Desodorantes Damas","","",3,0],[72,"Ccori Cristal","Desodorantes Damas","","",0,0],[73,"Cielo","Desodorantes Damas","","",4,0],[74,"Gaia","Desodorantes Damas","","",4,0],[75,"Osadia","Desodorantes Damas","","",1,0],[76,"Temptation","Desodorantes Damas","","",3,0],[77,"Efective Original","Desodorantes Damas","","",4,0],[78,"Efective Brisa Floral","Desodorantes Damas","","",3,0],[79,"Efective Aclarante","Desodorantes Damas","","",3,0],[80,"Efective Clinical","Desodorantes Damas","","",3,0],[81,"Efective Sensitive","Desodorantes Damas","","",3,0],[82,"Efective Aerosol Clinical","Desodorantes Damas","","",2,0],[83,"Efective Aerosol Aclarante","Desodorantes Damas","","",2,0],[84,"Efective Aerosol Original","Desodorantes Damas","","",2,0],[85,"Arom","Desodorantes Varones","","",3,0],[86,"Arom Absolut","Desodorantes Varones","","",0,0],[87,"Arom Element","Desodorantes Varones","","",0,0],[88,"Dendur Destiny","Desodorantes Varones","","",2,0],[89,"Evolucion","Desodorantes Varones","","",2,0],[90,"Foco Discover","Desodorantes Varones","","",2,0],[91,"Temptation","Desodorantes Varones","","",1,0],[92,"Solo","Desodorantes Varones","","",2,0],[93,"Solo Elixir","Desodorantes Varones","","",1,0],[94,"Ohm","Desodorantes Varones","","",2,0],[95,"Ohm Black","Desodorantes Varones","","",3,0],[96,"Ohm Soul","Desodorantes Varones","","",2,0],[97,"Zentro","Desodorantes Varones","","",1,0],[98,"Gel Hidratante","Línea Vivo","","",2,0],[99,"Desodorante","Línea Vivo","","",1,0],[100,"Jabon Facial Gel","Línea Vivo","","",1,0],[101,"Jabon en Barra","Línea Vivo","","",1,0],[102,"Shampoo","Línea Vivo","","",3,0],[103,"Aqua Fix Gel Limpiador","Línea Tratamiento","","",4,0],[104,"Aqua Fix Hidratante Dia","Línea Tratamiento","","",2,0],[105,"Aqua Fix Gel Noche","Línea Tratamiento","","",1,0],[106,"Elixir De Vida Gel Limpiador","Línea Tratamiento","","",2,0],[107,"Elixir De Vida Crema Hidratante","Línea Tratamiento","","",2,0],[108,"Elixir De Vida Crema Nutritiva","Línea Tratamiento","","",1,0],[109,"Elixir De Vida Crema para Ojos","Línea Tratamiento","","",2,0],[110,"Extracto Divino Espuma Limpiadora","Línea Tratamiento","","",2,0],[111,"Extracto Divino Crema Hidratante","Línea Tratamiento","","",1,0],[112,"Extracto Divino Crema Nutritiva","Línea Tratamiento","","",1,0],[113,"Extracto Divino Crema para Ojos","Línea Tratamiento","","",2,0],[114,"Extracto Divino Crema Cuello y Escote","Línea Tratamiento","","",1,0],[115,"Pigment Control Limpiador","Línea Tratamiento","","",2,0],[116,"Pigment Control Crema Hidratante","Línea Tratamiento","","",2,0],[117,"Perfect Balance Limpiador","Línea Tratamiento","","",1,0],[118,"Perfect Balance Hidratante Matificante","Línea Tratamiento","","",1,0],[119,"Perfect Balance Gel Focalizado","Línea Tratamiento","","",1,0],[120,"Sensi Derm Leche Limpiadora","Línea Tratamiento","","",1,0],[121,"Sensi Derm Crema Hidratante","Línea Tratamiento","","",1,0],[122,"Suero Antigrasa Ácido Salicílico","Línea Tratamiento","","",2,0],[123,"Suero Antioxidante Vitamina C","Línea Tratamiento","","",2,0],[124,"Suero Antiedad Óleo Reparador","Línea Tratamiento","","",1,0],[125,"Suero Antimanchas Niacinamida","Línea Tratamiento","","",2,0],[126,"Suero Hidratante Ácido Hialurónico","Línea Tratamiento","","",3,0],[127,"Suero Antiarrugas Bakuchiol","Línea Tratamiento","","",2,0],[128,"Mascarilla Exfoliante Purificante","Línea Tratamiento","","",1,0],[129,"Mascarilla Antigrasa Detoxificante","Línea Tratamiento","","",3,0],[130,"Desmaquillador Doble Fase","Línea Tratamiento","","",1,0],[131,"Desmaquillador Agua Micelar","Línea Tratamiento","","",1,0],[132,"Desmaquillador Agua Micelar Piel Sensible","Línea Tratamiento","","",2,0],[133,"Desmaquillador Gel","Línea Tratamiento","","",1,0],[134,"Totalist Aguacate Pote","Línea Tratamiento","","",3,0],[135,"Totalist Jalea Real Pote","Línea Tratamiento","","",2,0],[136,"Totalist Concha de Nácar Pote","Línea Tratamiento","","",3,0],[137,"Totalist Concha de Nácar Tubo","Línea Tratamiento","","",1,0],[138,"Totalist Suero Aguacate","Línea Tratamiento","","",1,0],[139,"Totalist Suero Jalea Real","Línea Tratamiento","","",1,0],[140,"Blum Shampoo Reparación Intensiva","Línea Tratamiento","","",1,0],[141,"Blum Shampoo Hidratación Extrema","Línea Tratamiento","","",1,0],[142,"Blum Shampoo Protección Total","Línea Tratamiento","","",1,0],[143,"Blum Shampoo Anticaspa","Línea Tratamiento","","",1,0],[144,"Blum Acondicionador Reparación Intensiva","Línea Tratamiento","","",1,0],[145,"Blum Acondicionador Hidratación Extrema","Línea Tratamiento","","",1,0],[146,"Blum Acondicionador Protección Total","Línea Tratamiento","","",2,0],[147,"Blum Mascarilla Reparadora","Línea Tratamiento","","",2,0],[148,"Blum Suero Reparador De Puntas","Línea Tratamiento","","",1,0],[149,"Blum Crema Moldeadora Rizos","Línea Tratamiento","","",0,0],[150,"Blum Gel Fijador Rizos","Línea Tratamiento","","",1,0],[151,"Bio Milk Loción Corporal Original","Línea Tratamiento","","",0,0],[152,"Bio Milk Loción Mora Arándano","Línea Tratamiento","","",1,0],[153,"Bio Milk Loción Fresa Frambuesa","Línea Tratamiento","","",3,0],[154,"Bio Milk Loción Leche Vegetal","Línea Tratamiento","","",5,0],[155,"Bio Milk Loción Sensi Derm","Línea Tratamiento","","",2,0],[156,"Bio Milk Loción Soy Única","Línea Tratamiento","","",1,0],[157,"Bio Milk Jabón Barra Original Set","Línea Tratamiento","","",1,0],[158,"Bio Milk Jabón Barra Mora Arándano","Línea Tratamiento","","",1,0],[159,"Bio Milk Jabón Barra Fresa Frambuesa","Línea Tratamiento","","",2,0],[160,"Body Spa Uña De Gato Loción","Línea Tratamiento","","",1,0],[161,"Body Spa Uña De Gato Manteca","Línea Tratamiento","","",1,0],[162,"Body Spa Uña De Gato Exfoliante","Línea Tratamiento","","",4,0],[163,"Body Spa Uña De Gato Crema Manos","Línea Tratamiento","","",6,0],[164,"Body Spa Cacao Loción","Línea Tratamiento","","",2,0],[165,"Body Spa Cacao Crema Manos","Línea Tratamiento","","",4,0],[166,"Body Spa Cacao Manteca","Línea Tratamiento","","",0,0],[167,"Body Spa Cacao Exfoliante","Línea Tratamiento","","",0,0],[168,"Petit Pom Pom Shampoo","Línea Tratamiento","","",1,0],[169,"Petit Pom Pom Colonia","Línea Tratamiento","","",1,0],[170,"Petit Pom Pom Jabón Barra","Línea Tratamiento","","",3,0],[171,"Petit Pom Pom Jabón Líquido","Línea Tratamiento","","",2,0],[172,"Petit Pom Pom Loción","Línea Tratamiento","","",2,0],[173,"Body Spa Kids Shampoo","Línea Tratamiento","","",2,0],[174,"Body Spa Kids Acondicionador","Línea Tratamiento","","",2,0],[175,"Body Spa Kids Colonia Niño","Línea Tratamiento","","",1,0],[176,"Body Spa Kids Colonia Niña","Línea Tratamiento","","",2,0],[177,"Eau Vitale Colonia Lavanda","Línea Tratamiento","","",3,0],[178,"Eau Vitale Colonia Té Verde","Línea Tratamiento","","",2,0],[179,"Eau Vitale Colonia Flor Naranjo","Línea Tratamiento","","",4,0],[180,"Eau Vitale Colonia Rosas","Línea Tratamiento","","",3,0],[181,"Eau Vitale Jabón Lavanda","Línea Tratamiento","","",2,0],[182,"Eau Vitale Jabón Té Verde","Línea Tratamiento","","",1,0],[183,"Eau Vitale Jabón Flor Naranjo","Línea Tratamiento","","",1,0],[184,"Eau Vitale Jabón Rosas","Línea Tratamiento","","",1,0],[185,"Loción De Seda Ámbar y Miel","Línea Tratamiento","","",1,0],[186,"Loción De Seda Lima y Jazmín","Línea Tratamiento","","",1,0],[187,"Loción De Seda Rosa Musk","Línea Tratamiento","","",0,0],[188,"Loción De Seda Magnolia y Vainilla","Línea Tratamiento","","",0,0],[189,"Loción De Seda Perlas y Rosas","Línea Tratamiento","","",1,0],[190,"Loción Perfumada Ccori","Línea Tratamiento","","",0,0],[191,"Loción Perfumada Ccori Rose","Línea Tratamiento","","",1,0],[192,"Loción Perfumada Gaia","Línea Tratamiento","","",1,0],[193,"Loción Perfumada Ícono","Línea Tratamiento","","",1,0],[194,"Loción Perfumada Osadía Infinita","Línea Tratamiento","","",1,0],[195,"Loción Perfumada Temptation Mystic","Línea Tratamiento","","",0,0],[196,"Loción Perfumada Cielo En Rosa","Línea Tratamiento","","",2,0],[197,"Jabón Barra Cielo","Línea Tratamiento","","",2,0],[198,"Jabón Barra Ccori Cristal Rose","Línea Tratamiento","","",1,0],[199,"Jabón Barra Temptation Dama","Línea Tratamiento","","",1,0],[200,"Jabón Barra Temptation Hombre","Línea Tratamiento","","",2,0],[201,"Jabón Barra Solo","Línea Tratamiento","","",1,0],[202,"Jabón Barra Ohm","Línea Tratamiento","","",1,0],[203,"Jabón Barra Osadía","Línea Tratamiento","","",1,0],[204,"Gel After Shave Ohm","Línea Tratamiento","","",0,0],[205,"Gel de Baño Ohm Soul","Línea Tratamiento","","",0,0],[206,"Gel de Baño Temptation Black","Línea Tratamiento","","",0,0],[207,"BB Cream Antiedad Claro","Línea Tratamiento","","",1,0],[208,"BB Cream Antiedad Mediano","Línea Tratamiento","","",1,0],[209,"BB Cream Matificante Claro","Línea Tratamiento","","",2,0],[210,"BB Cream Matificante Mediano","Línea Tratamiento","","",2,0],[211,"BB Cream Hidratante Mediano","Línea Tratamiento","","",2,0],[212,"BB Cream Hidratante Claro","Línea Tratamiento","","",1,0],[213,"BB Lips Honey","Línea Tratamiento","","",3,0],[214,"BB Lips Natural","Línea Tratamiento","","",3,0],[215,"BB Lips Natural Pink","Línea Tratamiento","","",0,0],[216,"Base de Maquillaje Antiedad","Maquillaje","","",3,0],[217,"Base de Maquillaje Hidratante","Maquillaje","","",0,0],[218,"Base de Maquillaje Matificante","Maquillaje","","",5,0],[219,"Barra Multiuso YA","Maquillaje","","",1,0],[220,"Barra Multifuncional","Maquillaje","","",0,0],[221,"Corrector en Barra","Maquillaje","","",0,0],[222,"Corrector Líquido Antiedad","Maquillaje","","",0,0],[223,"Delineador Tatto","Maquillaje","","",0,0],[224,"Delineador Punta Inteligente","Maquillaje","","",1,0],[225,"Delineador Punta Pincel YA","Maquillaje","","",4,0],[226,"Delineador Perfilador Cejas Marrón","Maquillaje","","",1,0],[227,"Delineador Retráctil Cejas","Maquillaje","","",4,0],[228,"Delineador P/Agua Ojos","Maquillaje","","",5,0],[229,"Delineador en Gel","Maquillaje","","",0,0],[230,"Delineador Lápiz YA","Maquillaje","","",14,0],[231,"Duo de Cejas","Maquillaje","","",2,0],[232,"Delineador de Labios","Maquillaje","","",2,0],[233,"Esmalte de Uñas","Maquillaje","","",0,0],[234,"Esmalte Brillo Secante","Maquillaje","","",2,0],[235,"Esmalte Base Brillo Efecto Gel","Maquillaje","","",1,0],[236,"Esmalte Base Fortalecedor","Maquillaje","","",1,0],[237,"Labial Hydralip Ámbar Rosa Toscana","Maquillaje","","",1,0],[238,"Hydralip Líquido Mate","Maquillaje","","",3,0],[239,"Hydralip Líquido Satinado","Maquillaje","","",1,0],[240,"Labial Mate Barra YA Cereza","Maquillaje","","",1,0],[241,"Polvo Suelto","Maquillaje","","",0,0],[242,"Paleta Sombras YA","Maquillaje","","",0,0],[243,"Paleta Multifuncional","Maquillaje","","",1,0],[244,"Polvos YA","Maquillaje","","",3,0],[245,"Primer Serum","Maquillaje","","",2,0],[246,"Polvo Full Powder Tono 2","Maquillaje","","",1,0],[247,"Polvo Compacto Elixir","Maquillaje","","",2,0],[248,"Rímel XL","Maquillaje","","",3,0],[249,"Rímel Ultra Resist","Maquillaje","","",5,0],[250,"Rímel Multibenefit","Maquillaje","","",0,0],[251,"Rímel YA","Maquillaje","","",0,0],[252,"Rímel Crece Extreme P/Agua","Maquillaje","","",0,0],[253,"Rímel Crece Extreme Normal","Maquillaje","","",1,0],[254,"Rubor Compacto","Maquillaje","","",3,0],[255,"Spray Fijador Maquillaje","Maquillaje","","",2,0],[256,"Bloqueador Compacto Mediano 1","Total Block","","",3,0],[257,"Bloqueador Compacto Mediano 2","Total Block","","",1,0],[258,"Bloqueador Compacto Claro","Total Block","","",1,0],[259,"Bloqueador Compacto Repuesto Med 1","Total Block","","",1,0],[260,"Bloqueador Compacto Repuesto Med 2","Total Block","","",0,0],[261,"Bloqueador Compacto Repuesto Claro","Total Block","","",3,0],[262,"Bloqueador Compacto Mineral","Total Block","","",3,0],[263,"Bloqueador Total Block 80g","Total Block","","",6,0],[264,"Bloqueador Total Block Jumbo","Total Block","","",4,0],[265,"Bloqueador Sport","Total Block","","",3,0],[266,"Bloqueador Kids","Total Block","","",4,0],[267,"Bloqueador Dermafusión Normal","Total Block","","",1,0],[268,"Bloqueador Dermafusión Color","Total Block","","",1,0],[269,"Bloqueador Gel Velvet","Total Block","","",2,0],[270,"Bloqueador Matt Color","Total Block","","",2,0],[271,"Bloqueador Matificante","Total Block","","",4,0],[272,"Bloqueador Mineral","Total Block","","",2,0],[273,"Bloqueador Bifásico","Total Block","","",2,0],[274,"Repelente Total Block","Total Block","","",3,0]];

function loadInitialProducts() {
  return INITIAL_RAW.map(r => ({
    id: r[0], name: r[1], category: r[2], code: r[3], price: r[4],
    stock: { mc: r[5], sa: r[6] }, active: true
  }));
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwALuyQiBRe0oZlbQpycJa1oyCOSw9hYMM1fGXESYmNG2T7-6Niax8La7JUjmfViPbi/exec";

async function gsRead(action) {
  try {
    const r = await fetch(`${APPS_SCRIPT_URL}?action=${action}`, { redirect: "follow" });
    const text = await r.text();
    try {
      const d = JSON.parse(text);
      return d.rows || [];
    } catch {
      console.error("gsRead parse error:", text.slice(0, 200));
      return [];
    }
  } catch (e) { console.error("gsRead error:", e); return []; }
}

async function gsWrite(action, data, extra = "") {
  try {
    const params = new URLSearchParams({ action, data: JSON.stringify(data) });
    if (extra) extra.split("&").forEach(p => { const [k,v] = p.split("="); params.set(k,v); });
    const r = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { redirect: "follow" });
    const text = await r.text();
    try { return JSON.parse(text); }
    catch { console.error("gsWrite parse error:", text.slice(0, 200)); return { error: "Parse error" }; }
  } catch (e) { console.error("gsWrite error:", e); return { error: e.toString() }; }
}

function parseProducts(rows) {
  return rows.map(r => ({
    id: Number(r.ID) || 0, name: r.Nombre || "", category: r["Categoría"] || "Sin categoría",
    code: String(r["Código"] || ""), price: String(r.Precio || ""),
    stock: { mc: Number(r["Stock MC"]) || 0, sa: Number(r["Stock SA"]) || 0 },
    active: r.Activo !== "No"
  }));
}

// ← MODIFICADO: lee loanId
function parseMovements(rows) {
  return rows.map(r => ({
    id: r.ID || "", productId: Number(r["Producto ID"]) || 0, type: r.Tipo || "",
    qty: Math.abs(Number(r.Cantidad)) || 0, sede: r.Sede || "",
    sedeFrom: r["Sede Origen"] || "", sedeTo: r["Sede Destino"] || "",
    person: r.Consultora || "", notes: r.Notas || "",
    operator: r.Operadora || "", date: r.Fecha || "",
    loanId: r["Loan ID"] || "", // ← NUEVO
    _row: r._row
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
function parseCategorias(rows) { return rows.map(r => r.Nombre).filter(Boolean); }

// ═══════════════════════════════════════════════
// YANBAL BRAND COLORS
// ═══════════════════════════════════════════════
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

// ← MODIFICADO: font sizes más grandes en toda la app
const FS = {
  xs: 13, sm: 15, base: 16, md: 17, lg: 19, xl: 22, xxl: 28, title: 32,
};

// ═══════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════
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
    trash: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
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
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(44,40,37,0.4)", backdropFilter: "blur(4px)" }} />
      <div onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: 30, maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto",
          position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(44,40,37,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: FS.xl, fontFamily: FONT, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted,
            cursor: "pointer", padding: 4 }}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: FS.title, fontWeight: 600, color: C.text, margin: "0 0 24px", fontFamily: FONT,
    letterSpacing: -0.3 }}>{children}</h2>
);

const LBL = { fontSize: FS.xs, color: "#9e9790", display: "block", marginBottom: 7,
  textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 };

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
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
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const reload = useCallback(async () => {
    const [prods, movs, cons, ops, cats] = await Promise.all([
      gsRead("getProducts"), gsRead("getMovements"), gsRead("getConsultoras"),
      gsRead("getOperadoras"), gsRead("getCategorias")
    ]);
    if (prods.length === 0 && ops.length === 0) throw new Error("No data returned from Google Sheets");
    setProducts(parseProducts(prods));
    setMovements(parseMovements(movs));
    setPeople(parseConsultoras(cons));
    setOperators(ops.length > 0 ? parseOperadoras(ops) : DEFAULT_OPERATORS);
    setCategories(cats.length > 0 ? parseCategorias(cats) : DEFAULT_CATEGORIES);
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
        ID: product.id, Nombre: product.name, "Categoría": product.category,
        "Código": product.code, Precio: product.price,
        "Stock MC": product.stock.mc, "Stock SA": product.stock.sa, Activo: product.active ? "Sí" : "No"
      });
    });
  }, [withSave]);

  const addProduct = useCallback(async (product) => {
    await withSave(async () => {
      const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      await gsWrite("addProduct", {
        ID: maxId, Nombre: product.name, "Categoría": product.category,
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

  // ← NUEVO: escribe múltiples movimientos con el mismo loanId
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

  const addConsultora = useCallback(async (consultora) => {
    await withSave(() => gsWrite("addConsultora", {
      Nombre: consultora.name, "Teléfono": consultora.phone || "",
      "Dirección": consultora.address || "", DNI: consultora.dni || "",
      "Cumpleaños": consultora.birthday || ""
    }));
  }, [withSave]);
  const removeConsultora = useCallback(async (index) => {
    await withSave(() => gsWrite("removeConsultora", {}, `row=${index + 1}`));
  }, [withSave]);
  const updateConsultoraFn = useCallback(async (index, consultora) => {
    await withSave(() => gsWrite("updateConsultora", {
      Nombre: consultora.name, "Teléfono": consultora.phone || "",
      "Dirección": consultora.address || "", DNI: consultora.dni || "",
      "Cumpleaños": consultora.birthday || ""
    }, `row=${index + 1}`));
  }, [withSave]);

  const addCategoria = useCallback(async (name) => {
    await withSave(() => gsWrite("addCategoria", { Nombre: name }));
  }, [withSave]);
  const updateCategoria = useCallback(async (index, name) => {
    await withSave(() => gsWrite("updateCategoria", { Nombre: name }, `row=${index + 1}`));
  }, [withSave]);
  const removeCategoria = useCallback(async (index) => {
    await withSave(() => gsWrite("removeCategoria", {}, `row=${index + 1}`));
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
        ID: p.id, Nombre: p.name, "Categoría": p.category,
        "Código": p.code, Precio: p.price,
        "Stock MC": p.stock.mc, "Stock SA": p.stock.sa, Activo: p.active ? "Sí" : "No"
      }));
      await gsWrite("updateProducts", data);
    });
  }, [withSave]);

  const can = useCallback((action) => {
    if (!currentUser) return false;
    const r = currentUser.role;
    if (r === "admin") return true;
    if (r === "directora") return true;
    if (["view_stock","register_move","view_loans","view_history","manage_products","manage_categories","manage_people"].includes(action)) return true;
    return false;
  }, [currentUser]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: FONT_BODY }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: FS.sm, letterSpacing: 5, color: C.gold, fontWeight: 600, fontFamily: FONT_BODY }}>YANBAL</div>
        <div style={{ color: C.textMuted, fontSize: FS.base, marginTop: 8 }}>Cargando inventario...</div>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: FONT_BODY, padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: FS.sm, letterSpacing: 5, color: C.gold, fontWeight: 600 }}>YANBAL</div>
        <div style={{ color: C.red, fontSize: FS.lg, marginTop: 16, fontWeight: 600 }}>Error de conexión</div>
        <div style={{ color: C.textMuted, fontSize: FS.base, marginTop: 8, lineHeight: 1.5 }}>
          No se pudo conectar con Google Sheets.
        </div>
        <button onClick={() => { setLoadError(false); setLoading(true); reload().then(() => setLoading(false)).catch(() => { setLoadError(true); setLoading(false); }); }}
          style={{ marginTop: 20, padding: "13px 26px", borderRadius: 8, border: "none",
            background: C.gold, color: "#fff", fontWeight: 600, fontSize: FS.base, cursor: "pointer", fontFamily: FONT_BODY }}>
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!currentUser) return <LoginScreen operators={operators} onSelect={setCurrentUser} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT_BODY, color: C.text }}>
      {saving && <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: C.gold, zIndex: 9999,
        animation: "pulse 1s ease-in-out infinite" }}><style>{`@keyframes pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }`}</style></div>}
      <Header user={currentUser} onLogout={() => setCurrentUser(null)} />
      <Nav page={page} setPage={setPage} can={can} />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 100px" }}>
        {page === "stock" && <StockView products={products} movements={movements} categories={categories} />}
        {page === "move" && <MoveView products={products} people={people} movements={movements}
          user={currentUser.name} addMovement={addMovement} addMovements={addMovements} />}
        {page === "loans" && <LoansView products={products} movements={movements}
          addMovements={addMovements} currentUser={currentUser} can={can} />}
        {page === "history" && <HistoryView products={products} movements={movements}
          removeMovement={removeMovement} currentUser={currentUser} />}
        {page === "admin" && <AdminView products={products} people={people} operators={operators} categories={categories}
          currentUser={currentUser} can={can}
          updateProduct={updateProduct} addProduct={addProduct} bulkUpdateProducts={bulkUpdateProducts}
          addConsultora={addConsultora} removeConsultora={removeConsultora} updateConsultoraFn={updateConsultoraFn}
          addOperadora={addOperadora} updateOperadora={updateOperadora} removeOperadora={removeOperadora}
          addCategoria={addCategoria} updateCategoria={updateCategoria} removeCategoria={removeCategoria} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════
function LoginScreen({ operators, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const op = operators.find(o => o.name === selected);
    if (!op) return;
    if (op.pin === "0000") { onSelect({ name: op.name, role: op.role }); }
    else if (op.pin === pin) { onSelect({ name: op.name, role: op.role }); }
    else { setError("PIN incorrecto"); setPin(""); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: FONT_BODY, padding: 20 }}>
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
                  style={{ padding: "18px 22px", borderRadius: 10, border: `1px solid ${C.border}`,
                    background: C.white, color: C.text, fontSize: FS.md, fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s", fontFamily: FONT_BODY, textAlign: "left",
                    display: "flex", alignItems: "center", gap: 14, boxShadow: C.shadow }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.goldBg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: C.gold, fontWeight: 700, fontSize: FS.md, fontFamily: FONT }}>
                      {op.name.charAt(0).toUpperCase()}
                    </span>
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
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: FS.sm, fontFamily: FONT_BODY, marginTop: 4 }}>← Cambiar usuario</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <div style={{ color: C.textMuted, fontSize: FS.sm, marginBottom: 4 }}>Ingresa tu PIN</div>
                <Input type="password" value={pin} onChange={v => { setPin(v.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                  placeholder="• • • •" style={{ textAlign: "center", fontSize: 28, letterSpacing: 12 }} />
                {error && <div style={{ color: C.red, fontSize: FS.sm }}>{error}</div>}
                <Btn onClick={handleLogin} disabled={pin.length < 4} style={{ width: "100%" }}>Entrar</Btn>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: FS.sm, fontFamily: FONT_BODY, marginTop: 4 }}>← Cambiar usuario</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HEADER & NAV
// ═══════════════════════════════════════════════
function Header({ user, onLogout }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 20px", maxWidth: 900, margin: "0 auto", background: C.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: C.gold, letterSpacing: 5, fontFamily: FONT_BODY }}>YANBAL</span>
            <span style={{ color: C.border, fontSize: 22, lineHeight: 1 }}>|</span>
            <span style={{ fontSize: FS.md, color: C.text, fontWeight: 500, fontFamily: FONT }}>Inventario</span>
          </div>
          <div style={{ fontSize: FS.xs, color: C.textMuted, marginTop: 3, letterSpacing: 0.3 }}>
            Directora Elena Sta. Gadea — Uso exclusivo
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.goldBg,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.gold, fontWeight: 700, fontSize: FS.base }}>{user.name.charAt(0)}</span>
            </div>
            <div>
              <div style={{ fontSize: FS.base, color: C.text, fontWeight: 500 }}>{user.name}</div>
              <div style={{ fontSize: FS.xs, color: C.textMuted }}>{ROLES[user.role]}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: C.textMuted,
            cursor: "pointer", fontFamily: FONT_BODY, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2, padding: "4px 8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span style={{ fontSize: 10, letterSpacing: 0.3 }}>Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Nav({ page, setPage, can }) {
  const items = [
    { id: "stock", icon: "box", label: "Stock" },
    { id: "move", icon: "move", label: "Movimiento" },
    { id: "loans", icon: "users", label: "Préstamos" },
    { id: "history", icon: "history", label: "Historial" },
    { id: "admin", icon: "settings", label: "Admin" },
  ];
  return (
    <div style={{ display: "flex", gap: 0, padding: "0 20px", maxWidth: 900, margin: "0 auto",
      overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      {items.map(item => (
        <button key={item.id} onClick={() => setPage(item.id)}
          style={{ padding: "16px 20px", border: "none", background: "transparent",
            color: page === item.id ? C.gold : C.textMuted,
            cursor: "pointer", fontSize: FS.base, fontWeight: page === item.id ? 600 : 500,
            display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
            fontFamily: FONT_BODY, transition: "all 0.15s", letterSpacing: 0.2,
            borderBottom: page === item.id ? `2px solid ${C.gold}` : "2px solid transparent",
            marginBottom: -1, borderRadius: 0 }}>
          <Icon name={item.icon} size={17} />{item.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// STOCK VIEW
// ═══════════════════════════════════════════════
function StockView({ products, movements, categories }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
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
      if (catFilter && p.category !== catFilter) return false;
      const st = computedStock[p.id] || { mc: 0, sa: 0 };
      const total = st.mc + st.sa;
      const sedeQty = sedeFilter === "Mariscal Cáceres" ? st.mc : sedeFilter === "San Agustín" ? st.sa : total;
      if (stockFilter === "disponible" && sedeQty <= 0) return false;
      if (stockFilter === "agotado" && sedeQty > 0) return false;
      if (stockFilter === "bajo" && (sedeQty <= 0 || sedeQty > 3)) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [products, search, catFilter, sedeFilter, stockFilter, computedStock]);

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
        <Select value={catFilter} onChange={setCatFilter} options={categories} placeholder="Categoría" style={{ flex: 1, minWidth: 140 }} />
        <Select value={sedeFilter} onChange={setSedeFilter} options={SEDES} placeholder="Todas las sedes" style={{ flex: 1, minWidth: 140 }} />
        <Select value={stockFilter} onChange={setStockFilter}
          options={[{value:"disponible",label:"Con stock"},{value:"agotado",label:"Sin stock"},{value:"bajo",label:"Stock bajo"}]}
          placeholder="Estado" style={{ flex: 1, minWidth: 120 }} />
      </div>
      <div style={{ fontSize: FS.sm, color: C.textMuted, marginBottom: 10, fontWeight: 500 }}>
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.map(p => {
          const st = computedStock[p.id] || { mc: 0, sa: 0 };
          const total = st.mc + st.sa;
          return (
            <Card key={p.id} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: FS.md, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 4, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: C.goldMuted }}>{p.category}</span>
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

// ═══════════════════════════════════════════════
// MOVE VIEW — ← MODIFICADO: carrito para préstamos
// ═══════════════════════════════════════════════
function MoveView({ products, people, movements, user, addMovement, addMovements }) {
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

  // ← NUEVO: carrito para préstamos multi-producto
  const [cart, setCart] = useState([]);
  const [cartProductId, setCartProductId] = useState("");
  const [cartProductSearch, setCartProductSearch] = useState("");
  const [cartQty, setCartQty] = useState("1");

  const isLoan = type === "prestamo";
  const filteredProducts = useMemo(() => {
    const search = isLoan ? cartProductSearch : productSearch;
    if (!search) return products.filter(p => p.active);
    const s = search.toLowerCase();
    return products.filter(p => p.active && (p.name.toLowerCase().includes(s) || p.code.includes(s)));
  }, [products, productSearch, cartProductSearch, isLoan]);

  const moveType = MOVE_TYPES.find(t => t.id === type);
  const needsPerson = type === "prestamo" || type === "devolucion";
  const isTraslado = type === "traslado_in" || type === "traslado_out";
  const availableTypes = MOVE_TYPES.filter(t => t.group === direction);

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

  const removeFromCart = (productId) => setCart(cart.filter(c => c.productId !== productId));

  const loanId = useMemo(() => Date.now().toString(36) + Math.random().toString(36).slice(2, 6), [type]);

  const handleSubmit = async () => {
    if (isLoan) {
      if (!person || !sede || cart.length === 0) return;
      const now = new Date().toISOString();
      const movements = cart.map(item => ({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        productId: item.productId, type: "prestamo", qty: item.qty,
        sede, person, notes, operator: user, date: now, loanId,
      }));
      await addMovements(movements);
    } else {
      const parsedQty = Math.abs(parseInt(qty));
      if (!type || !productId || !parsedQty || parsedQty <= 0) return;
      if (!isTraslado && !sede) return;
      if (isTraslado && (!sedeFrom || !sedeTo)) return;
      if (needsPerson && !person) return;
      await addMovement({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        productId: parseInt(productId), type, qty: parsedQty,
        sede: isTraslado ? "" : sede,
        sedeFrom: isTraslado ? sedeFrom : "", sedeTo: isTraslado ? sedeTo : "",
        person: needsPerson ? person : "", notes, operator: user,
        date: new Date().toISOString(), loanId: "",
      });
    }
    setSuccess(true);
    setTimeout(() => { setSuccess(false); resetForm(); }, 1500);
  };

  const isSubmitDisabled = isLoan
    ? !person || !sede || cart.length === 0
    : !type || !productId || !qty || (!isTraslado && !sede) || (isTraslado && (!sedeFrom || !sedeTo)) || (needsPerson && !person);

  if (success) return (
    <div style={{ textAlign: "center", padding: "80px 20px", marginTop: 26 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenBg,
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        color: C.green }}><Icon name="check" size={28} /></div>
      <div style={{ fontSize: FS.xxl, fontWeight: 500, color: C.green, fontFamily: FONT }}>Registrado</div>
      <div style={{ color: C.textMuted, fontSize: FS.md, marginTop: 8 }}>Movimiento guardado correctamente</div>
    </div>
  );

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Registrar Movimiento</SectionTitle>

      {/* Step 1: Dirección */}
      <Card style={{ marginBottom: 14 }}>
        <label style={LBL}>Dirección</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "ingreso", label: "Ingreso", icon: "📥", desc: "Entra producto al stock", color: C.green },
            { id: "egreso", label: "Egreso", icon: "📤", desc: "Sale producto del stock", color: C.red },
          ].map(d => (
            <button key={d.id} onClick={() => { setDirection(d.id); setType(""); setCart([]); }}
              style={{ padding: "18px 14px", borderRadius: 10, border: `2px solid ${direction === d.id ? d.color : C.border}`,
                background: direction === d.id ? d.color + "0a" : C.white, cursor: "pointer",
                textAlign: "center", fontFamily: FONT_BODY, transition: "all 0.15s" }}>
              <div style={{ fontSize: 26 }}>{d.icon}</div>
              <div style={{ fontSize: FS.md, fontWeight: 700, color: direction === d.id ? d.color : C.text, marginTop: 6 }}>{d.label}</div>
              <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 2 }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Step 2: Tipo */}
      {direction && (
        <Card style={{ marginBottom: 14 }}>
          <label style={LBL}>Motivo</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {availableTypes.map(t => (
              <button key={t.id} onClick={() => { setType(t.id); setCart([]); }}
                style={{ padding: "14px 16px", borderRadius: 8, border: `1.5px solid ${type === t.id ? C.gold : C.border}`,
                  background: type === t.id ? C.goldBg : C.white, cursor: "pointer",
                  textAlign: "left", fontFamily: FONT_BODY, transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ fontSize: FS.md, fontWeight: 600, color: type === t.id ? C.gold : C.text }}>{t.label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 3: Detalles */}
      {type && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* ── PRÉSTAMO: carrito multi-producto ── */}
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
                      <Input value={cartProductSearch}
                        onChange={s => { setCartProductSearch(s); setCartProductId(""); }}
                        placeholder="Buscar producto..." />
                      {cartProductSearch && !cartProductId && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
                          maxHeight: 200, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 8,
                          marginTop: 4, background: C.white, boxShadow: C.shadowHover }}>
                          {filteredProducts.slice(0, 20).map(p => (
                            <div key={p.id} onClick={() => { setCartProductId(p.id.toString()); setCartProductSearch(p.name); }}
                              style={{ padding: "11px 14px", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`,
                                fontSize: FS.sm, display: "flex", justifyContent: "space-between" }}
                              onMouseEnter={e => e.currentTarget.style.background = C.bg}
                              onMouseLeave={e => e.currentTarget.style.background = C.white}>
                              <span>{p.name}</span>
                              <span style={{ color: C.textMuted, fontSize: FS.xs }}>{p.category}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input type="number" value={cartQty} min="1"
                      onChange={e => setCartQty(e.target.value.replace(/[^0-9]/g, ""))}
                      style={{ width: 72, padding: "13px 10px", borderRadius: 8, border: `1px solid ${C.border}`,
                        fontSize: FS.base, fontFamily: FONT_BODY, textAlign: "center", outline: "none" }} />
                    <Btn onClick={addToCart} disabled={!cartProductId} variant="secondary"
                      style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <Icon name="plus" size={16} /> Agregar
                    </Btn>
                  </div>
                  {/* Cart items */}
                  {cart.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {cart.map(item => (
                        <div key={item.productId} style={{ display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: FS.md, fontWeight: 500 }}>{item.name}</div>
                          </div>
                          <Badge color={C.yellow} bg={C.yellowBg}>{item.qty} ud.</Badge>
                          <button onClick={() => removeFromCart(item.productId)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "2px 4px" }}>
                            <Icon name="x" size={16} />
                          </button>
                        </div>
                      ))}
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.yellowBg,
                        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: FS.sm, color: C.yellow, fontWeight: 600 }}>Total</span>
                        <Badge color={C.yellow} bg={C.yellowBg}>
                          {cart.reduce((a, c) => a + c.qty, 0)} unidades
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "18px 14px", textAlign: "center", color: C.textMuted,
                      fontSize: FS.sm, border: `1px dashed ${C.border}`, borderRadius: 8 }}>
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
              /* ── OTROS MOVIMIENTOS: flujo original ── */
              <>
                <div>
                  <label style={LBL}>Producto</label>
                  <Input value={productSearch} onChange={s => { setProductSearch(s); setProductId(""); }} placeholder="Buscar producto..." />
                  {productSearch && !productId && (
                    <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 4, background: C.white, boxShadow: C.shadowHover }}>
                      {filteredProducts.slice(0, 20).map(p => (
                        <div key={p.id} onClick={() => { setProductId(p.id.toString()); setProductSearch(p.name); }}
                          style={{ padding: "11px 14px", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`,
                            fontSize: FS.sm, display: "flex", justifyContent: "space-between" }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = C.white}>
                          <span>{p.name}</span>
                          <span style={{ color: C.textMuted, fontSize: FS.xs }}>{p.category}</span>
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
                    <div><label style={LBL}>Sede origen</label>
                      <Select value={sedeFrom} onChange={setSedeFrom} options={SEDES} placeholder="Desde..." /></div>
                    <div style={{ color: C.goldMuted, paddingBottom: 16, fontSize: 20 }}>→</div>
                    <div><label style={LBL}>Sede destino</label>
                      <Select value={sedeTo} onChange={setSedeTo} options={SEDES.filter(s => s !== sedeFrom)} placeholder="Hacia..." /></div>
                  </div>
                ) : (
                  <div><label style={LBL}>Sede</label>
                    <Select value={sede} onChange={setSede} options={SEDES} placeholder="Seleccionar sede" /></div>
                )}
                {needsPerson && (
                  <div><label style={LBL}>{type === "prestamo" ? "Prestado a" : "Devuelto por"}</label>
                    <Select value={person} onChange={setPerson}
                      options={people.length > 0 ? people.map(p => typeof p === "string" ? p : p.name) : ["(Agrega consultoras en Admin)"]}
                      placeholder="Seleccionar consultora" /></div>
                )}
                <div><label style={LBL}>Notas (opcional)</label>
                  <Input value={notes} onChange={setNotes} placeholder="Agregar nota..." /></div>
              </>
            )}
          </div>
        </Card>
      )}

      {type && (
        <Btn onClick={handleSubmit} disabled={isSubmitDisabled}
          style={{ width: "100%", padding: "16px 20px", fontSize: FS.md, borderRadius: 10 }}>
          <Icon name="check" size={18} /> Registrar {direction === "ingreso" ? "ingreso" : "egreso"}
        </Btn>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// LOANS VIEW — ← MODIFICADO: agrupado por loanId + devolución con checkboxes
// ═══════════════════════════════════════════════
function LoansView({ products, movements, addMovements, currentUser, can }) {
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

  // ← NUEVO: agrupa por loanId. Préstamos legacy (sin loanId) → cada uno como grupo individual
  const activeLoans = useMemo(() => {
    const byLoan = {};
    movements
      .filter(m => (m.type === "prestamo" || m.type === "devolucion") && m.person)
      .forEach(m => {
        const key = m.loanId
          ? m.loanId
          : `legacy-${m.productId}-${m.person}`;
        if (!byLoan[key]) byLoan[key] = { loanId: key, person: m.person, date: m.date, items: {} };
        const pid = m.productId;
        if (!byLoan[key].items[pid]) byLoan[key].items[pid] = 0;
        byLoan[key].items[pid] += m.type === "prestamo" ? m.qty : -m.qty;
      });
    return Object.values(byLoan)
      .map(loan => ({
        ...loan,
        items: Object.entries(loan.items)
          .filter(([, qty]) => qty > 0)
          .map(([productId, qty]) => ({ productId: Number(productId), qty })),
      }))
      .filter(loan => loan.items.length > 0);
  }, [movements]);

  const filtered = useMemo(() => {
    if (!search) return activeLoans;
    const s = search.toLowerCase();
    return activeLoans.filter(l => l.person?.toLowerCase().includes(s));
  }, [activeLoans, search]);

  const openReturn = (loan) => {
    const initChecked = {};
    const initQtys = {};
    loan.items.forEach(item => {
      initChecked[item.productId] = true;
      initQtys[item.productId] = item.qty;
    });
    setCheckedAll(true);
    setCheckedItems(initChecked);
    setReturnQtys(initQtys);
    setReturnSede("");
    setReturnNote("");
    setShowReturn(loan);
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
    const returnLoanId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const movs = showReturn.items
      .filter(item => checkedItems[item.productId])
      .map(item => ({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        productId: item.productId, type: "devolucion",
        qty: returnQtys[item.productId] || item.qty,
        sede: returnSede, person: showReturn.person,
        notes: returnNote, operator: currentUser.name,
        date: now, loanId: returnLoanId,
      }));
    await addMovements(movs);
    setShowReturn(null);
    setSuccess("Devolución registrada");
    setTimeout(() => setSuccess(""), 2500);
  };

  const openDelete = (loan) => { setDeleteNote(""); setShowDelete(loan); };

  const handleDelete = async () => {
    if (!deleteNote || !showDelete) return;
    const now = new Date().toISOString();
    const delLoanId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const movs = showDelete.items.map(item => ({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      productId: item.productId, type: "devolucion", qty: item.qty,
      sede: "Mariscal Cáceres", person: showDelete.person,
      notes: `[ELIMINADO] ${deleteNote}`,
      operator: currentUser.name, date: now, loanId: delLoanId,
    }));
    await addMovements(movs);
    setShowDelete(null);
    setSuccess("Préstamo eliminado");
    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Préstamos Pendientes</SectionTitle>

      {success && (
        <div style={{ padding: "14px 18px", borderRadius: 8, background: C.greenBg, color: C.green,
          fontSize: FS.md, fontWeight: 600, marginBottom: 18, textAlign: "center" }}>{success}</div>
      )}

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
        <Input value={search} onChange={setSearch} placeholder="Buscar por nombre de consultora..." style={{ paddingLeft: 44 }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: C.textMuted, fontSize: FS.base }}>
          {activeLoans.length === 0 ? "No hay préstamos pendientes" : "No se encontraron préstamos para esta consultora"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((loan) => {
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
                {/* Items del préstamo */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {loan.items.map(item => {
                    const prod = products.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "8px 0",
                        borderBottom: `1px solid ${C.borderLight}` }}>
                        <span style={{ fontSize: FS.md, color: C.text }}>{prod?.name || "?"}</span>
                        <span style={{ fontSize: FS.sm, color: C.textMuted }}>{prod?.category} · {item.qty} ud.</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openReturn(loan)}
                    style={{ flex: 1, background: C.greenBg, border: `1px solid ${C.green}33`, borderRadius: 8,
                      padding: "11px 16px", color: C.green, fontSize: FS.base, fontWeight: 600,
                      cursor: "pointer", fontFamily: FONT_BODY }}>Devolver</button>
                  {canDelete && (
                    <button onClick={() => openDelete(loan)}
                      style={{ background: C.redBg, border: `1px solid ${C.red}33`, borderRadius: 8,
                        padding: "11px 16px", color: C.red, fontSize: FS.base, fontWeight: 600,
                        cursor: "pointer", fontFamily: FONT_BODY }}>Eliminar</button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Modal Devolución con checkboxes ── */}
      <Modal open={showReturn !== null} onClose={() => setShowReturn(null)} title="Registrar Devolución">
        {showReturn && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Resumen */}
            <div style={{ padding: "14px 16px", borderRadius: 8, background: C.bg, border: `1px solid ${C.borderLight}` }}>
              <div style={{ fontSize: FS.md, fontWeight: 600, color: C.text }}>{showReturn.person}</div>
              <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 2 }}>
                {showReturn.items.length} producto{showReturn.items.length !== 1 ? "s" : ""} · {showReturn.items.reduce((a, i) => a + i.qty, 0)} ud. totales
              </div>
            </div>

            {/* Checkbox seleccionar todos */}
            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              borderRadius: 8, background: C.goldBg, border: `1px solid ${C.goldMuted}33`, cursor: "pointer" }}>
              <input type="checkbox" checked={checkedAll}
                onChange={e => toggleAll(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: C.gold, cursor: "pointer", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: FS.md, fontWeight: 600, color: C.text }}>Devolver todo el préstamo</div>
                <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 1 }}>Marca todos los productos</div>
              </div>
            </label>

            <div style={{ height: 1, background: C.border }} />

            {/* Items individuales */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {showReturn.items.map(item => {
                const prod = products.find(p => p.id === item.productId);
                const isChecked = checkedItems[item.productId] ?? true;
                return (
                  <div key={item.productId} style={{ display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
                    background: isChecked ? C.white : C.bg, transition: "background 0.1s" }}>
                    <input type="checkbox" checked={isChecked}
                      onChange={e => toggleItem(item.productId, e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: C.gold, cursor: "pointer", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: FS.md, fontWeight: 500, color: isChecked ? C.text : C.textMuted }}>{prod?.name || "?"}</div>
                      <div style={{ fontSize: FS.sm, color: C.textMuted, marginTop: 2 }}>{prod?.category}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: FS.sm, color: C.textMuted }}>Cant.:</span>
                      <input type="number"
                        value={returnQtys[item.productId] ?? item.qty}
                        min={1} max={item.qty}
                        disabled={!isChecked}
                        onChange={e => setReturnQtys({ ...returnQtys, [item.productId]: Math.min(item.qty, Math.max(1, parseInt(e.target.value) || 1)) })}
                        style={{ width: 68, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`,
                          fontSize: FS.base, fontFamily: FONT_BODY, textAlign: "center", outline: "none",
                          opacity: isChecked ? 1 : 0.4 }} />
                      <span style={{ fontSize: FS.sm, color: C.textMuted }}>/ {item.qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sede */}
            <div>
              <label style={LBL}>Sede donde se devuelve</label>
              <Select value={returnSede} onChange={setReturnSede} options={SEDES} placeholder="Seleccionar sede" />
            </div>
            <div>
              <label style={LBL}>Nota (opcional)</label>
              <Input value={returnNote} onChange={setReturnNote} placeholder="Agregar nota..." />
            </div>

            {/* Resumen selección */}
            {selectedCount > 0 && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: C.greenBg,
                fontSize: FS.sm, color: C.green, fontWeight: 600 }}>
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

      {/* ── Modal Eliminar ── */}
      <Modal open={showDelete !== null} onClose={() => setShowDelete(null)} title="Eliminar Préstamo">
        {showDelete && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px 16px", borderRadius: 8, background: C.redBg, border: `1px solid ${C.red}22` }}>
              <div style={{ fontSize: FS.sm, color: C.red, fontWeight: 600 }}>Esto eliminará el préstamo completo.</div>
              <div style={{ fontSize: FS.sm, color: C.red, marginTop: 4, opacity: 0.8 }}>Se registrará como devolución con nota [ELIMINADO].</div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 8, background: C.bg }}>
              <div style={{ fontSize: FS.md, fontWeight: 600, color: C.text, marginBottom: 8 }}>{showDelete.person}</div>
              {showDelete.items.map(item => {
                const prod = products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} style={{ fontSize: FS.sm, color: C.textMuted, display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                    <span>{prod?.name || "?"}</span>
                    <span>{item.qty} ud.</span>
                  </div>
                );
              })}
            </div>
            <div>
              <label style={LBL}>Motivo de eliminación *</label>
              <Input value={deleteNote} onChange={setDeleteNote} placeholder="Escribe el motivo..." />
            </div>
            <div style={{ fontSize: FS.sm, color: C.textMuted }}>Eliminado por: <strong>{currentUser?.name}</strong></div>
            <Btn onClick={handleDelete} disabled={!deleteNote} variant="danger" style={{ width: "100%" }}>
              Eliminar préstamo completo
            </Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HISTORY VIEW
// ═══════════════════════════════════════════════
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
      {success && (
        <div style={{ padding: "14px 18px", borderRadius: 8, background: C.greenBg, color: C.green,
          fontSize: FS.md, fontWeight: 600, marginBottom: 18, textAlign: "center" }}>{success}</div>
      )}
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
                    {canDelete && (
                      <button onClick={() => setConfirmDelete(m)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.red,
                          fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600, padding: "2px 0" }}>Eliminar</button>
                    )}
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
                  <span style={{ fontSize: FS.md, fontWeight: 600, color: C.text }}>{prod?.name || "?"}</span>
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

// ═══════════════════════════════════════════════
// ADMIN VIEW
// ═══════════════════════════════════════════════
function AdminView({ products, people, operators, categories, currentUser, can,
  updateProduct, addProduct, bulkUpdateProducts,
  addConsultora, removeConsultora, updateConsultoraFn,
  addOperadora, updateOperadora, removeOperadora,
  addCategoria, updateCategoria, removeCategoria }) {
  const [tab, setTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(null);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddOperator, setShowAddOperator] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(null);
  const [showEditOperator, setShowEditOperator] = useState(null);
  const [newProd, setNewProd] = useState({ name: "", category: "", code: "", price: "" });
  const [editProd, setEditProd] = useState({ name: "", category: "", code: "", price: "" });
  const [newPerson, setNewPerson] = useState({ name: "", phone: "", address: "", dni: "", birthday: "" });
  const [showEditPerson, setShowEditPerson] = useState(null);
  const [editPerson, setEditPerson] = useState({ name: "", phone: "", address: "", dni: "", birthday: "" });
  const [newOperator, setNewOperator] = useState({ name: "", pin: "", role: "asistente" });
  const [editOp, setEditOp] = useState({ name: "", pin: "", role: "" });
  const [newCategory, setNewCategory] = useState("");
  const [editCatName, setEditCatName] = useState("");
  const [prodSearch, setProdSearch] = useState("");

  const canManageOps = currentUser.role === "admin" || currentUser.role === "directora";

  const handleAddProduct = async () => {
    if (!newProd.name || !newProd.category) return;
    await addProduct(newProd);
    setNewProd({ name: "", category: "", code: "", price: "" }); setShowAddProduct(false);
  };
  const openEditProduct = (p) => {
    setEditProd({ name: p.name, category: p.category, code: p.code, price: p.price });
    setShowEditProduct(p.id);
  };
  const handleEditProduct = async () => {
    if (!editProd.name || !editProd.category) return;
    const orig = products.find(p => p.id === showEditProduct);
    if (!orig) return;
    await updateProduct({ ...orig, name: editProd.name, category: editProd.category, code: editProd.code, price: editProd.price });
    setShowEditProduct(null);
  };
  const handleToggleProduct = async (p) => { await updateProduct({ ...p, active: !p.active }); };
  const handleAddPerson = async () => {
    if (!newPerson.name || people.find(p => p.name === newPerson.name)) return;
    await addConsultora(newPerson);
    setNewPerson({ name: "", phone: "", address: "", dni: "", birthday: "" }); setShowAddPerson(false);
  };
  const handleRemovePerson = async (i) => { await removeConsultora(i); };
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
  const openEditOperator = (op) => {
    setEditOp({ name: op.name, pin: "", role: op.role });
    setShowEditOperator(op.name);
  };
  const handleEditOperator = async () => {
    const orig = operators.find(o => o.name === showEditOperator);
    if (!orig) return;
    await updateOperadora(showEditOperator, {
      name: orig.name, role: editOp.role,
      pin: editOp.pin.length === 4 ? editOp.pin : orig.pin
    });
    setShowEditOperator(null);
  };
  const handleRemoveOperator = async (i) => { await removeOperadora(i); };
  const handleAddCategory = async () => {
    if (!newCategory || categories.includes(newCategory)) return;
    await addCategoria(newCategory); setNewCategory(""); setShowAddCategory(false);
  };
  const openEditCategory = (cat, idx) => { setEditCatName(cat); setShowEditCategory(idx); };
  const handleEditCategory = async () => {
    if (!editCatName || (editCatName !== categories[showEditCategory] && categories.includes(editCatName))) return;
    const oldName = categories[showEditCategory];
    await updateCategoria(showEditCategory, editCatName);
    if (oldName !== editCatName) {
      await bulkUpdateProducts(products.map(p => p.category === oldName ? { ...p, category: editCatName } : p));
    }
    setShowEditCategory(null);
  };
  const handleRemoveCategory = async (i, cat) => {
    const count = products.filter(p => p.category === cat).length;
    if (count > 0) await bulkUpdateProducts(products.map(p => p.category === cat ? { ...p, category: "Sin categoría" } : p));
    await removeCategoria(i);
  };

  const filteredProds = prodSearch ? products.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase())) : products;
  const tabs = [["products","Productos"],["categories","Categorías"],["people","Consultoras"]];
  if (canManageOps) tabs.push(["operators","Operadoras"]);

  return (
    <div style={{ marginTop: 26 }}>
      <SectionTitle>Administración</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {tabs.map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${tab === t ? C.gold : C.border}`,
              background: tab === t ? C.goldBg : C.white, color: tab === t ? C.gold : C.textMuted,
              cursor: "pointer", fontSize: FS.base, fontWeight: 600, fontFamily: FONT_BODY, letterSpacing: 0.2 }}>{l}</button>
        ))}
      </div>

      {tab === "products" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <Input value={prodSearch} onChange={setProdSearch} placeholder="Buscar producto..." style={{ flex: 1 }} />
            <Btn onClick={() => setShowAddProduct(true)}><Icon name="plus" size={17} /> Agregar</Btn>
          </div>
          <div style={{ fontSize: FS.sm, color: C.textMuted, marginBottom: 10, fontWeight: 500 }}>
            {products.filter(p => p.active).length} activos · {products.filter(p => !p.active).length} inactivos
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 480, overflowY: "auto" }}>
            {filteredProds.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                borderRadius: 8, background: C.white, border: `1px solid ${C.border}`, opacity: p.active ? 1 : 0.5 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: FS.base, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                    {!p.active && <span style={{ fontSize: FS.xs, color: C.textMuted, fontWeight: 400, marginLeft: 6 }}>(inactivo)</span>}
                  </div>
                  <div style={{ fontSize: FS.xs, color: C.textMuted, display: "flex", gap: 6 }}>
                    <span>{p.category}</span>
                    {p.code && <span>· CÓD. {p.code}</span>}
                    {p.price && <span>· S/ {p.price}</span>}
                  </div>
                </div>
                <button onClick={() => openEditProduct(p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: FS.sm, color: C.gold, fontFamily: FONT_BODY, fontWeight: 600 }}>Editar</button>
                <button onClick={() => handleToggleProduct(p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: FS.sm, color: p.active ? C.red : C.green, fontFamily: FONT_BODY, fontWeight: 600 }}>{p.active ? "Desactivar" : "Activar"}</button>
              </div>
            ))}
          </div>
          <Modal open={showAddProduct} onClose={() => setShowAddProduct(false)} title="Agregar Producto">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={newProd.name} onChange={v => setNewProd({ ...newProd, name: v })} placeholder="Nombre del producto" /></div>
              <div><label style={LBL}>Categoría *</label><Select value={newProd.category} onChange={v => setNewProd({ ...newProd, category: v })} options={categories} placeholder="Seleccionar" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={LBL}>Código</label><Input value={newProd.code} onChange={v => setNewProd({ ...newProd, code: v })} placeholder="CÓD." /></div>
                <div><label style={LBL}>Precio (S/)</label><Input value={newProd.price} onChange={v => setNewProd({ ...newProd, price: v })} placeholder="0.00" /></div>
              </div>
              <Btn onClick={handleAddProduct} disabled={!newProd.name || !newProd.category} style={{ width: "100%", marginTop: 8 }}>Agregar producto</Btn>
            </div>
          </Modal>
          <Modal open={showEditProduct !== null} onClose={() => setShowEditProduct(null)} title="Editar Producto">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={LBL}>Nombre *</label><Input value={editProd.name} onChange={v => setEditProd({ ...editProd, name: v })} placeholder="Nombre del producto" /></div>
              <div><label style={LBL}>Categoría *</label><Select value={editProd.category} onChange={v => setEditProd({ ...editProd, category: v })} options={categories} placeholder="Seleccionar" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={LBL}>Código</label><Input value={editProd.code} onChange={v => setEditProd({ ...editProd, code: v })} placeholder="CÓD." /></div>
                <div><label style={LBL}>Precio (S/)</label><Input value={editProd.price} onChange={v => setEditProd({ ...editProd, price: v })} placeholder="0.00" /></div>
              </div>
              <Btn onClick={handleEditProduct} disabled={!editProd.name || !editProd.category} style={{ width: "100%", marginTop: 8 }}>Guardar cambios</Btn>
            </div>
          </Modal>
        </>
      )}

      {tab === "categories" && (
        <>
          <Btn onClick={() => setShowAddCategory(true)} style={{ width: "100%", marginBottom: 18 }}><Icon name="plus" size={17} /> Agregar categoría</Btn>
          <div style={{ fontSize: FS.sm, color: C.textMuted, marginBottom: 10, fontWeight: 500 }}>{categories.length} categoría{categories.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {categories.map((cat, i) => {
              const count = products.filter(p => p.category === cat).length;
              const isProtected = cat === "Sin categoría";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 8, background: C.white, border: `1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontSize: FS.md, color: C.text }}>{cat}</span>
                    <span style={{ fontSize: FS.sm, color: C.textMuted, marginLeft: 8 }}>{count} producto{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!isProtected && <button onClick={() => openEditCategory(cat, i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Editar</button>}
                    {!isProtected && <button onClick={() => handleRemoveCategory(i, cat)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Eliminar</button>}
                  </div>
                </div>
              );
            })}
          </div>
          <Modal open={showAddCategory} onClose={() => setShowAddCategory(false)} title="Agregar Categoría">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input value={newCategory} onChange={setNewCategory} placeholder="Nombre de la categoría" />
              <Btn onClick={handleAddCategory} disabled={!newCategory} style={{ width: "100%" }}>Agregar</Btn>
            </div>
          </Modal>
          <Modal open={showEditCategory !== null} onClose={() => setShowEditCategory(null)} title="Editar Categoría">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input value={editCatName} onChange={setEditCatName} placeholder="Nombre de la categoría" />
              <Btn onClick={handleEditCategory} disabled={!editCatName} style={{ width: "100%" }}>Guardar</Btn>
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
              {[...people].sort((a, b) => a.name.localeCompare(b.name, "es")).map((p) => {
                const origIndex = people.findIndex(pp => pp.name === p.name);
                return (
                  <div key={origIndex} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", borderRadius: 8, background: C.white, border: `1px solid ${C.border}` }}>
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
                      <button onClick={() => handleRemovePerson(origIndex)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Eliminar</button>
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
            {operators.map((o, i) => {
              const isSelf = o.name === currentUser.name;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 8, background: C.white, border: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: FS.md, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                      {o.name}
                      <span style={{ fontSize: FS.xs, padding: "3px 10px", borderRadius: 10, fontWeight: 600,
                        background: o.role === "admin" ? C.goldBg : o.role === "directora" ? C.blueBg : C.bg,
                        color: o.role === "admin" ? C.gold : o.role === "directora" ? C.blue : C.textMuted }}>
                        {ROLES[o.role]}
                      </span>
                      {o.pin === "0000" && <span style={{ fontSize: FS.xs, color: C.yellow }}>⚠ PIN default</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEditOperator(o)} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Editar</button>
                    {!isSelf && <button onClick={() => handleRemoveOperator(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: FS.sm, fontFamily: FONT_BODY, fontWeight: 600 }}>Eliminar</button>}
                  </div>
                </div>
              );
            })}
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
              <div style={{ fontSize: FS.md, fontWeight: 600, color: C.text, padding: "8px 0" }}>{showEditOperator}</div>
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
