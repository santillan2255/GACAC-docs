(function () {
  "use strict";

  var STORAGE_KEY = "gacac-cuestionario-md-v1";
  var DEFAULT_MD = "copia-respuestas-stakeholder.md";

  var state = {
    md: "",
    items: [],
    index: 0,
    filter: "todas",
    fileHandle: null,
  };

  var el = {
    app: document.getElementById("app"),
    toast: document.getElementById("toast"),
    progText: document.getElementById("prog-text"),
    progBar: document.getElementById("prog-bar"),
    filtro: document.getElementById("filtro"),
    irId: document.getElementById("ir-id"),
  };

  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    setTimeout(function () {
      el.toast.classList.remove("show");
    }, 2200);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function field(block, name) {
    var re = new RegExp(
      "\\- \\*\\*" + name + ":\\*\\*\\s*(.+)",
      "i"
    );
    var m = block.match(re);
    return m ? m[1].trim() : "";
  }

  function parseOpciones(block) {
    var lines = block.split("\n");
    var inOpt = false;
    var opts = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (/^\-\s+\*\*Opciones:\*\*/i.test(line)) {
        inOpt = true;
        continue;
      }
      if (inOpt) {
        if (/^\s{2}-\s+/.test(line)) {
          var text = line.replace(/^\s{2}-\s+/, "").trim();
          var letter = "";
          var lm = text.match(/^([A-Z])\)\s*/);
          if (lm) {
            letter = lm[1];
            text = text.slice(lm[0].length);
          }
          opts.push({
            letter: letter,
            text: text,
            rec: /\(Recomendada\)/i.test(text),
            raw: line.replace(/^\s{2}-\s+/, "").trim(),
          });
        } else if (/^\-\s+\*\*/.test(line) && !/^\s{2}/.test(line)) {
          inOpt = false;
        }
      }
    }
    return opts;
  }

  function parseItems(md) {
    var parts = md.split(/^### (PA-[A-Z0-9]+(?:-[A-Z0-9]+)*)\s+—\s+(.+)$/m);
    var items = [];
    for (var i = 1; i < parts.length; i += 3) {
      var id = parts[i];
      var title = parts[i + 1].trim();
      var body = parts[i + 2] || "";
      items.push({
        id: id,
        title: title,
        pregunta: field(body, "Pregunta"),
        contexto: field(body, "Contexto"),
        estado: field(body, "Estado"),
        opciones: parseOpciones(body),
        elegida: field(body, "Opción elegida"),
        ampliacion: field(body, "Ampliación"),
        respondido: field(body, "Respondido"),
        blockStart: "### " + id,
      });
    }
    return items;
  }

  function answered(item) {
    var e = item.elegida;
    return e && e !== "—" && e !== "-";
  }

  function filteredIndices() {
    var idx = [];
    for (var i = 0; i < state.items.length; i++) {
      var it = state.items[i];
      if (state.filter === "pendientes" && answered(it)) continue;
      if (state.filter === "respondidas" && !answered(it)) continue;
      idx.push(i);
    }
    return idx;
  }

  function currentLogicalIndex() {
    var list = filteredIndices();
    var pos = list.indexOf(state.index);
    if (pos < 0 && list.length) {
      state.index = list[0];
      pos = 0;
    }
    return { list: list, pos: pos };
  }

  function patchBlock(md, id, elegida, ampliacion, fecha) {
    var re = new RegExp(
      "(### " + id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?)(?=\\n### PA-|\\n## |$)",
      "m"
    );
    var m = md.match(re);
    if (!m) return md;
    var block = m[1];
    block = block.replace(
      /(\- \*\*Opción elegida:\*\*)\s*.+/i,
      "$1 " + elegida
    );
    block = block.replace(
      /(\- \*\*Ampliación:\*\*)\s*.+/i,
      "$1 " + ampliacion.replace(/\n/g, " ")
    );
    block = block.replace(
      /(\- \*\*Respondido:\*\*)\s*.+/i,
      "$1 " + fecha
    );
    return md.slice(0, m.index) + block + md.slice(m.index + m[1].length);
  }

  function persistMd() {
    try {
      localStorage.setItem(STORAGE_KEY, state.md);
    } catch (e) {}
  }

  function loadStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setMd(text, fromFile) {
    state.md = text;
    state.items = parseItems(text);
    if (state.index >= state.items.length) state.index = 0;
    persistMd();
    render();
    if (fromFile) toast("Archivo cargado · " + state.items.length + " preguntas");
  }

  function updateProgress() {
    var done = state.items.filter(answered).length;
    var total = state.items.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    el.progText.textContent = done + " / " + total + " respondidas";
    el.progBar.style.width = pct + "%";
  }

  function renderQuestion() {
    var nav = currentLogicalIndex();
    var list = nav.list;
    if (!list.length) {
      el.app.innerHTML =
        '<div class="empty"><p>No hay preguntas con este filtro.</p></div>';
      updateProgress();
      return;
    }
    var it = state.items[state.index];
    if (!it) {
      state.index = list[0];
      it = state.items[state.index];
    }

    var optsHtml = "";
    if (it.opciones.length) {
      optsHtml = '<ul class="opciones" role="radiogroup" aria-label="Opciones">';
      for (var o = 0; o < it.opciones.length; o++) {
        var op = it.opciones[o];
        var val = op.letter || op.raw;
        var checked =
          it.elegida === val ||
          it.elegida === op.raw ||
          (op.letter && it.elegida.indexOf(op.letter + ")") === 0);
        var cls = "opcion" + (checked ? " sel" : "") + (op.rec ? " rec" : "");
        optsHtml +=
          '<li><label class="' +
          cls +
          '"><input type="radio" name="op" value="' +
          esc(val) +
          '" ' +
          (checked ? "checked" : "") +
          "><span>" +
          (op.rec ? '<span class="badge rec">Recomendada</span> ' : "") +
          esc(op.raw) +
          "</span></label></li>";
      }
      optsHtml +=
        '<li><label class="opcion' +
        (it.elegida === "OTRA" ? " sel" : "") +
        '"><input type="radio" name="op" value="OTRA" ' +
        (it.elegida === "OTRA" ? "checked" : "") +
        '><span><strong>Otra</strong> (texto libre abajo)</span></label></li>';
      optsHtml += "</ul>";
    } else {
      optsHtml =
        '<p class="estado-spec">Esta entrada no tiene opciones A/B/C en el MD; usá ampliación.</p>';
    }

    var posLabel = nav.pos + 1 + " / " + list.length;
    var estadoBadge = /Respondida/i.test(it.estado)
      ? '<span class="badge ok">Ya decidida en spec</span>'
      : /Asumida|Pendiente/i.test(it.estado)
        ? '<span class="badge warn">Spec: ' + esc(it.estado.slice(0, 48)) + "…</span>"
        : "";

    el.app.innerHTML =
      '<article class="card">' +
      '<div class="meta"><span class="badge">' +
      esc(it.id) +
      "</span>" +
      estadoBadge +
      '<span class="progress">' +
      esc(posLabel) +
      "</span></div>" +
      "<h2>" +
      esc(it.title) +
      "</h2>" +
      '<p class="pregunta">' +
      esc(it.pregunta || "(Sin enunciado en el MD)") +
      "</p>" +
      (it.contexto
        ? '<div class="contexto">' + esc(it.contexto) + "</div>"
        : "") +
      (it.estado
        ? '<p class="estado-spec"><strong>Estado en spec:</strong> ' +
          esc(it.estado) +
          "</p>"
        : "") +
      optsHtml +
      '<label class="field" for="amp">Ampliación o respuesta propia</label>' +
      '<textarea id="amp" placeholder="Opcional: matiz, condición, o respuesta completa si elegiste Otra">' +
      esc(it.ampliacion === "—" ? "" : it.ampliacion) +
      "</textarea>" +
      '<div class="nav">' +
      '<button type="button" id="btn-prev"' +
      (nav.pos <= 0 ? " disabled" : "") +
      ">Anterior</button>" +
      '<button type="button" class="primary" id="btn-save">Guardar y seguir</button>' +
      '<button type="button" id="btn-skip">Saltar</button>' +
      "</div></article>";

    document.getElementById("btn-prev").onclick = function () {
      if (nav.pos > 0) {
        state.index = list[nav.pos - 1];
        renderQuestion();
      }
    };
    document.getElementById("btn-skip").onclick = function () {
      if (nav.pos < list.length - 1) {
        state.index = list[nav.pos + 1];
        renderQuestion();
      }
    };
    document.getElementById("btn-save").onclick = saveCurrent;

    var radios = el.app.querySelectorAll('input[name="op"]');
    for (var r = 0; r < radios.length; r++) {
      radios[r].onchange = syncRadioStyles;
    }
    syncRadioStyles();
    updateProgress();
  }

  function syncRadioStyles() {
    var labels = el.app.querySelectorAll(".opciones label");
    for (var i = 0; i < labels.length; i++) {
      var inp = labels[i].querySelector("input");
      labels[i].classList.toggle("sel", inp && inp.checked);
    }
  }

  function saveCurrent() {
    var it = state.items[state.index];
    if (!it) return;
    var elegida = "—";
    var checked = el.app.querySelector('input[name="op"]:checked');
    if (checked) elegida = checked.value;
    var ampEl = document.getElementById("amp");
    var amp = (ampEl && ampEl.value.trim()) || "—";
    if (!checked && amp !== "—") elegida = "OTRA";
    if (elegida === "—" && amp === "—") {
      toast("Elegí una opción o escribí en ampliación");
      return;
    }
    var fecha = new Date().toISOString().slice(0, 16).replace("T", " ");
    state.md = patchBlock(state.md, it.id, elegida, amp, fecha);
    it.elegida = elegida;
    it.ampliacion = amp;
    it.respondido = fecha;
    persistMd();
    writeFileHandleIfAny();
    toast("Guardado en el MD · " + it.id);

    var nav = currentLogicalIndex();
    var list = nav.list;
    if (nav.pos < list.length - 1) {
      state.index = list[nav.pos + 1];
    }
    renderQuestion();
  }

  function render() {
    renderQuestion();
    if (el.filtro) el.filtro.value = state.filter;
    fillIdJump();
  }

  function fillIdJump() {
    if (!el.irId) return;
    var cur = el.irId.value;
    el.irId.innerHTML = "";
    for (var i = 0; i < state.items.length; i++) {
      var opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent =
        state.items[i].id + (answered(state.items[i]) ? " ✓" : "");
      if (String(i) === cur) opt.selected = true;
      el.irId.appendChild(opt);
    }
  }

  function exportMd() {
    var blob = new Blob([state.md], { type: "text/markdown;charset=utf-8" });
    var a = document.createElement("a");
    var d = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob);
    a.download = "copia-respuestas-stakeholder-" + d + ".md";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("MD exportado");
  }

  async function writeFileHandleIfAny() {
    if (!state.fileHandle) return;
    try {
      var w = await state.fileHandle.createWritable();
      await w.write(state.md);
      await w.close();
    } catch (e) {}
  }

  async function openWithPicker() {
    if (!window.showOpenFilePicker) {
      document.getElementById("file-input").click();
      return;
    }
    try {
      var handles = await window.showOpenFilePicker({
        types: [
          {
            description: "Markdown",
            accept: { "text/markdown": [".md"] },
          },
        ],
        multiple: false,
      });
      var file = await handles[0].getFile();
      state.fileHandle = handles[0];
      setMd(await file.text(), true);
    } catch (e) {
      if (e.name !== "AbortError") toast("No se pudo abrir el archivo");
    }
  }

  async function saveWithPicker() {
    if (state.fileHandle) {
      await writeFileHandleIfAny();
      toast("Guardado en el archivo abierto");
      return;
    }
    if (window.showSaveFilePicker) {
      try {
        var h = await window.showSaveFilePicker({
          suggestedName: "copia-respuestas-stakeholder.md",
          types: [
            {
              description: "Markdown",
              accept: { "text/markdown": [".md"] },
            },
          ],
        });
        state.fileHandle = h;
        await writeFileHandleIfAny();
        toast("Archivo guardado");
        return;
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    exportMd();
  }

  function initEvents() {
    document.getElementById("btn-open").onclick = openWithPicker;
    document.getElementById("btn-export").onclick = exportMd;
    document.getElementById("btn-save-file").onclick = saveWithPicker;
    document.getElementById("file-input").onchange = function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        state.fileHandle = null;
        setMd(reader.result, true);
      };
      reader.readAsText(f, "UTF-8");
    };
    if (el.filtro) {
      el.filtro.onchange = function () {
        state.filter = el.filtro.value;
        var list = filteredIndices();
        state.index = list.length ? list[0] : 0;
        render();
      };
    }
    if (el.irId) {
      el.irId.onchange = function () {
        state.index = parseInt(el.irId.value, 10) || 0;
        renderQuestion();
      };
    }
  }

  function boot() {
    initEvents();
    var stored = loadStored();
    if (stored && stored.indexOf("### PA-") !== -1) {
      setMd(stored, false);
      toast("Sesión recuperada del navegador");
      return;
    }
    fetch(DEFAULT_MD)
      .then(function (r) {
        if (!r.ok) throw new Error("no fetch");
        return r.text();
      })
      .then(function (t) {
        setMd(t, false);
      })
      .catch(function () {
        el.app.innerHTML =
          '<div class="empty"><p>Abrí <strong>copia-respuestas-stakeholder.md</strong> (la copia de trabajo, no el MD de especificación) con el botón superior, o serví esta carpeta con <code>python -m http.server</code>.</p></div>';
        updateProgress();
      });
  }

  boot();
})();