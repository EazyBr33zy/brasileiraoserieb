/* ===== Busca Decode — Injeção Eletrônica ===== */
(function () {
  "use strict";

  // ---------- Estado ----------
  let REGISTROS = [];
  const el = {
    busca: document.getElementById("busca"),
    limpar: document.getElementById("btn-limpar"),
    filtroMontadora: document.getElementById("filtro-montadora"),
    filtroSoDecode: document.getElementById("filtro-so-decode"),
    resumo: document.getElementById("resumo"),
    lista: document.getElementById("lista"),
    vazio: document.getElementById("vazio"),
  };

  // ---------- Utilidades ----------
  const norm = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const escHtml = (s) =>
    (s || "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  // remove acentos e pontuação para comparação de carros (ex.: "cross!" -> "cross")
  const cleanToken = (s) => norm(s).replace(/[^a-z0-9.\-+ ]/g, "");

  // variações toleradas p/ UCE Bosch: MED17.5.20 ⇄ 17.5.20 ⇄ ME17 etc.
  const variantesTermo = (t) => {
    const v = new Set([t]);
    if (/^med?\d/.test(t)) v.add(t.replace(/^med/, ""));       // med17 -> 17 / me17 -> 17
    if (/^\d/.test(t)) { v.add("me" + t); v.add("med" + t); }  // 17.5.20 -> me17.5.20 / med17.5.20
    return [...v];
  };

  function casaRegistro(r, termo) {
    if (!termo) return { achou: true, carrosMatch: new Set() };
    const t = cleanToken(termo);
    if (!t) return { achou: true, carrosMatch: new Set() };

    const variantes = variantesTermo(t);
    const contemQualquer = (texto) => {
      const n = cleanToken(texto);
      return variantes.some((v) => n.includes(v));
    };

    const campos = [r.uce, r.montadora, r.fabricante, r.equipamento, r.programa, r.memoria, r.observacao];
    const achouTexto = campos.some(contemQualquer);

    const carrosMatch = new Set();
    (r.carros || []).forEach((carro) => {
      if (contemQualquer(carro)) carrosMatch.add(carro);
    });

    return { achou: achouTexto || carrosMatch.size > 0, carrosMatch };
  }

  // ---------- Decodificação / IMO OFF ----------
  function temDecode(r) {
    return norm(r.imo_off) === "sim";
  }

  // ---------- Carregamento dos dados ----------
  async function carregarDados() {
    try {
      const resp = await fetch("dados.json");
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const json = await resp.json();
      REGISTROS = json.registros || [];
      init();
    } catch (err) {
      console.error("Erro ao carregar dados.json:", err);
      el.lista.innerHTML =
        '<div class="card"><p style="color:#f87171">⚠️ Não foi possível carregar <b>dados.json</b>. ' +
        "Abra esta página por um servidor local (ex.: <code>python3 -m http.server</code>) ou incorpore os dados diretamente no app.js.</p></div>";
    }
  }

  // ---------- Filtro de montadora (select) ----------
  function montarFiltroMontadora() {
    const fabs = [...new Set(REGISTROS.map((r) => r.fabricante).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
    fabs.forEach((f) => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      el.filtroMontadora.appendChild(opt);
    });
  }

  // ---------- Busca ----------
  // (casaRegistro definido acima, com variantes de UCE Bosch)

  function destacar(texto, termo) {
    const safe = escHtml(texto);
    if (!termo) return safe;
    const t = cleanToken(termo);
    if (t.length < 2) return safe;
    const re = new RegExp("((" + variantesTermo(t).map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + "))", "gi");
    return safe.replace(re, "<mark>$1</mark>");
  }

  // ---------- Badges SIM/NÃO ----------
  function badgeSimNaov(valor) {
    const v = norm(valor);
    if (v === "sim") return '<span class="badge badge-ok">SIM</span>';
    if (v === "não" || v === "nao") return '<span class="badge badge-no">NÃO</span>';
    if (!v) return '<span class="badge badge-np">—</span>';
    return '<span class="badge badge-warn">' + escHtml(valor) + "</span>";
  }

  // ---------- Renderização ----------
  function renderCard(r, termo, carrosMatch) {
    const dec = temDecode(r);
    const infoItem = (lbl, val, vazioMsg) =>
      `<div class="info"><span class="lbl">${lbl}</span><span class="val ${val ? "" : "vazio"}">${
        val ? destacar(val, termo) : vazioMsg
      }</span></div>`;

    let chipsHtml = "";
    const carros = r.carros || [];
    if (carros.length) {
      // prioriza os carros que casaram com a busca; mostra até 14 chips
      const destacados = carros.filter((c) => carrosMatch.has(c));
      const restantes = carros.filter((c) => !carrosMatch.has(c));
      const ordem = [...destacados, ...restantes].slice(0, 14);
      chipsHtml =
        '<div class="carros">' +
        ordem
          .map(
            (c) =>
              `<span class="chip ${carrosMatch.has(c) ? "destaque" : ""}">${escHtml(c)}</span>`
          )
          .join("") +
        (carros.length > 14 ? `<span class="chip">+${carros.length - 14}</span>` : "") +
        "</div>";
    }

    const obsHtml = r.observacao
      ? `<div class="obs">📝 ${destacar(r.observacao, termo)}</div>`
      : "";

    return (
      '<article class="card">' +
      '<div class="card-top">' +
      `<span class="uce">${destacar(r.uce || "(UCE não informada)", termo)}</span>` +
      `<span class="badge badge-fab">${destacar(r.fabricante || "", termo)}</span>` +
      (r.montadora ? `<span class="badge badge-mont">${destacar(r.montadora, termo)}</span>` : "") +
      (dec
        ? '<span class="badge badge-ok">✓ IMO OFF disponível</span>'
        : '<span class="badge badge-no">✕ Sem IMO OFF</span>') +
      "</div>" +
      '<div class="card-grid">' +
      `<div class="info"><span class="lbl">Original com imob.</span>${badgeSimNaov(r.original_com_imob)}</div>` +
      `<div class="info"><span class="lbl">IMO OFF</span>${badgeSimNaov(r.imo_off)}</div>` +
      infoItem("Equipamento que lê", r.equipamento, "Não especificado") +
      infoItem("Programa p/ IMO OFF", r.programa, "Não especificado") +
      infoItem("Tipo de memória", r.memoria, "Não especificado") +
      "</div>" +
      chipsHtml +
      obsHtml +
      "</article>"
    );
  }

  function render() {
    const termo = el.busca.value.trim();
    const fabSel = el.filtroMontadora.value;
    const soDecode = el.filtroSoDecode.checked;

    const visiveis = [];
    REGISTROS.forEach((r) => {
      if (fabSel && r.fabricante !== fabSel) return;
      if (soDecode && !temDecode(r)) return;
      const { achou, carrosMatch } = casaRegistro(r, termo);
      if (achou) visiveis.push({ r, carrosMatch });
    });

    // ordenação: matches de UCE primeiro, depois alfabética por fabricante/UCE
    visiveis.sort((a, b) => {
      const ta = cleanToken(termo);
      if (ta) {
        const aUce = cleanToken(a.r.uce).startsWith(ta) ? 0 : 1;
        const bUce = cleanToken(b.r.uce).startsWith(ta) ? 0 : 1;
        if (aUce !== bUce) return aUce - bUce;
      }
      return (
        String(a.r.fabricante).localeCompare(String(b.r.fabricante), "pt-BR") ||
        String(a.r.uce).localeCompare(String(b.r.uce), "pt-BR", { numeric: true })
      );
    });

    el.lista.innerHTML = visiveis.map(({ r, carrosMatch }) => renderCard(r, termo, carrosMatch)).join("");

    const totalDecodes = REGISTROS.filter(temDecode).length;
    if (visiveis.length === 0) {
      el.vazio.classList.remove("oculto");
      el.resumo.innerHTML = `Nenhum resultado para <b>${escHtml(termo) || "este filtro"}</b>.`;
    } else {
      el.vazio.classList.add("oculto");
      el.resumo.innerHTML =
        `Exibindo <b>${visiveis.length}</b> de <b>${REGISTROS.length}</b> sistemas` +
        (termo ? ` para “<b>${escHtml(termo)}</b>”` : "") +
        ` · <b>${totalDecodes}</b> com IMO OFF no catálogo.`;
    }
  }

  // ---------- Eventos ----------
  function init() {
    montarFiltroMontadora();
    el.busca.addEventListener("input", render);
    el.limpar.addEventListener("click", () => {
      el.busca.value = "";
      el.busca.focus();
      render();
    });
    el.filtroMontadora.addEventListener("change", render);
    el.filtroSoDecode.addEventListener("change", render);
    render();
  }

  // ---------- Start ----------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", carregarDados);
  } else {
    carregarDados();
  }
})();
