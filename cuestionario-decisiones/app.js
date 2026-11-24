(function () {
  "use strict";

  var STORAGE_KEY = "gacac-cuestionario-md-v1";
  var STORAGE_AREA = "gacac-cuestionario-area-v1";
  var DEFAULT_MD = "copia-respuestas-stakeholder.md";
  var INDICE_URL = "indice-02.json";

  var MODULOS = [
    ["PA-CFG-P", "Parámetros ProCoop (catálogo T04b)"],
    ["PA-STACK", "Negociación stack GoodApps"],
    ["PA-BRD", "Marca y naming"],
    ["PA-BIA", "Reportes, BI y APIs (T10)"],
    ["PA-CAT", "Catálogo y contratos (M02)"],
    ["PA-CFG", "Configuración central (T04)"],
    ["PA-CMP", "Compras y proveedores (M12)"],
    ["PA-COB", "Cuenta corriente y cobranza (M07)"],
    ["PA-COM", "Comunicaciones (T09)"],
    ["PA-CON", "Contabilidad (M15)"],
    ["PA-CRM", "Atención y CRM (M09)"],
    ["PA-DAT", "Modelo de datos (T05)"],
    ["PA-FAC", "Facturación (M05)"],
    ["PA-FIS", "Fiscal e impuestos (M06)"],
    ["PA-IAM", "Identidad, roles, acceso (T02)"],
    ["PA-INS", "Institucional / socios (M17)"],
    ["PA-INT", "Integraciones (T06)"],
    ["PA-MED", "Medición y consumos (M03)"],
    ["PA-MIG", "Migración ProCoop (T07)"],
    ["PA-MOR", "Mora y recupero (M08)"],
    ["PA-NFR", "Requisitos no funcionales (T08)"],
    ["PA-PER", "Personas y titulares (M01)"],
    ["PA-PLA", "Plataforma SaaS (T01)"],
    ["PA-POR", "Portal del socio (M19)"],
    ["PA-SOC", "Servicios sociales y flota (M18)"],
    ["PA-STK", "Stock y activos (M13)"],
    ["PA-SUE", "Personal y sueldos (M16)"],
    ["PA-TAR", "Tarifas y motor de cálculo (M04)"],
    ["PA-TEC", "Técnica y campo (M10)"],
    ["PA-TES", "Tesorería y bancos (M14)"],
    ["PA-UXD", "Experiencia y marca (T03)"],
    ["PA-VEN", "Ventas y presupuestos (M11)"],
    ["PA-WFL", "Workflow y documentos (T11)"],
  ];

  var OLAS_PLAIN = {
    O11: "la etapa de reportes avanzados e indicadores (ola 11 del plan)",
    O10: "la etapa de servicios sociales y flota (ola 10 del plan)",
    O9: "la etapa de comunicaciones ampliadas (ola 9 del plan)",
    O8: "la etapa contable y de compras (ola 8 del plan)",
    O7: "la etapa de facturación y cobranza consolidada (ola 7 del plan)",
    O5: "la primera etapa operativa en producción (ola 5 del plan)",
    O3: "la etapa de instalación y catálogo (ola 3 del plan)",
    O1: "la etapa de arranque del proyecto (ola 1 del plan)",
    O0: "la etapa previa a producción (ola 0 del plan)",
  };

  var GLOSSARIO_RE = [
    { re: /\bDEC-\d+\b/g, term: "DEC-…", desc: "Decisión formal del proyecto (archivo 01-registro-decisiones)." },
    { re: /\bBASE §[\d.]+\b/g, term: "BASE §…", desc: "Apartado del documento base funcional (relevamiento ProCoop)." },
    { re: /\bO\d{1,2}\b/g, term: "Ola O…", desc: "Entrega del plan por olas (O5 temprana, O11 avanzada, etc.)." },
    { re: /\bRF-[A-Z]+-\d+/g, term: "RF-…", desc: "Requisito funcional identificado en un anexo." },
    { re: /\bJOB-[A-Z]+-\d+/g, term: "JOB-…", desc: "Proceso automático / tarea programada del sistema." },
    { re: /\bProCoop\b/g, term: "ProCoop", desc: "Sistema legado que la cooperativa usa hoy." },
    { re: /\btenant\b/gi, term: "tenant", desc: "Cada cooperativa como cliente aislado en la plataforma." },
    { re: /\bSCD2\b/g, term: "SCD2", desc: "Forma de guardar historial de datos que cambian en el tiempo." },
    {
      re: /replica set/gi,
      term: "réplica",
      desc: "Copia de lectura de la base; en implementación vigente (DEC-111) suele ser réplica o base analítica en Azure SQL.",
    },
    {
      re: /MongoDB|Mongo\b/i,
      term: "Motor de datos",
      desc: "En lectura del cuestionario: equivalente Azure SQL (DEC-111). El anexo puede decir Mongo.",
    },
    {
      re: /\bDEC-001\b/g,
      term: "DEC-001",
      desc: "Stack anterior (Node/Mongo); reemplazado por DEC-111 (.NET + Azure SQL).",
    },
    {
      re: /\bDEC-111\b/g,
      term: "DEC-111",
      desc: "Decisión de stack vigente: .NET, Azure SQL, React.",
    },
  ];

  var state = {
    md: "",
    items: [],
    index: 0,
    filter: "todas",
    areaFilter: "todos",
    fileHandle: null,
    indice: {},
  };

  var el = {
    app: document.getElementById("app"),
    toast: document.getElementById("toast"),
    progText: document.getElementById("prog-text"),
    progBar: document.getElementById("prog-bar"),
    filtro: document.getElementById("filtro"),
    filtroArea: document.getElementById("filtro-area"),
    buscar: document.getElementById("buscar-pa"),
    buscarList: document.getElementById("buscar-list"),
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
    var escName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var patterns = [
      new RegExp("^\\-\\s+\\*\\*" + escName + ":\\*\\*\\s*(.+)$", "im"),
      new RegExp("^\\-\\s+\\*\\*" + escName + "\\*\\*:\\s*(.+)$", "im"),
      new RegExp("^\\*\\*" + escName + ":\\*\\*\\s*(.+)$", "im"),
      new RegExp("^\\*\\*" + escName + "\\*\\*:\\s*(.+)$", "im"),
    ];
    var p;
    for (p = 0; p < patterns.length; p++) {
      var m = block.match(patterns[p]);
      if (m) return m[1].trim();
    }
    return "";
  }

  function splitBoldLetterOptions(s) {
    var text = String(s || "").trim();
    if (!text) return [];
    var re = /\*\*([A-Z])(?:\s*\([^)]*\))?:\*\*\s*/g;
    var marks = [];
    var match;
    while ((match = re.exec(text)) !== null) {
      marks.push({ letter: match[1], start: match.index, head: match[0].length });
    }
    if (!marks.length) return [];
    var opts = [];
    var i;
    for (i = 0; i < marks.length; i++) {
      var bodyStart = marks[i].start + marks[i].head;
      var bodyEnd = i + 1 < marks.length ? marks[i + 1].start : text.length;
      var body = text.slice(bodyStart, bodyEnd).trim();
      body = body.replace(/^\*\*([A-Z]):\*\*\s*/i, "").trim();
      opts.push({
        letter: marks[i].letter,
        text: body,
        rec: /Recomendada/i.test(text.slice(marks[i].start, bodyEnd)),
        raw: marks[i].letter + ") " + body,
      });
    }
    return opts;
  }

  function splitInlineOptions(s) {
    var text = String(s || "").trim();
    if (!text) return [];
    if (/\*\*[A-Z]\s*(\([^)]*\))?:\*\*/.test(text)) {
      return splitBoldLetterOptions(text);
    }
    var re = /\b([A-Z])\)\s*/g;
    var marks = [];
    var match;
    while ((match = re.exec(text)) !== null) {
      marks.push({ letter: match[1], start: match.index, head: match[0].length });
    }
    if (!marks.length) return [];
    var opts = [];
    var i;
    for (i = 0; i < marks.length; i++) {
      var bodyStart = marks[i].start + marks[i].head;
      var bodyEnd = i + 1 < marks.length ? marks[i + 1].start : text.length;
      var body = text.slice(bodyStart, bodyEnd).trim();
      opts.push({
        letter: marks[i].letter,
        text: body,
        rec: /\(\s*Recomendada\s*\)/i.test(body) || /\*\*\(\s*Recomendada\s*\)\*\*/i.test(body),
        raw: marks[i].letter + ") " + body,
      });
    }
    return opts;
  }

  function moduloKey(id) {
    var i;
    for (i = 0; i < MODULOS.length; i++) {
      if (id.indexOf(MODULOS[i][0]) === 0) return MODULOS[i][0];
    }
    var m = id.match(/^PA-([A-Z]+)/);
    return m ? "PA-" + m[1] : "PA-OTROS";
  }

  function moduloLabel(id) {
    var key = moduloKey(id);
    var i;
    for (i = 0; i < MODULOS.length; i++) {
      if (MODULOS[i][0] === key) return MODULOS[i][1];
    }
    return key === "PA-OTROS"
      ? "Otras decisiones"
      : "Área " + key.replace(/^PA-/, "") + " (anexo en la especificación)";
  }

  function labelForModKey(key) {
    var i;
    for (i = 0; i < MODULOS.length; i++) {
      if (MODULOS[i][0] === key) return MODULOS[i][1];
    }
    return key;
  }

  function anexoPrincipal(it) {
    if (!it.anexo) return "";
    var a = String(it.anexo).trim();
    var m = a.match(/^(M\d+|T\d+[a-z]?)/i);
    return m ? m[1].toUpperCase() : a.split(/\s+/)[0];
  }

  function itemMatchesArea(it) {
    if (state.areaFilter === "todos") return true;
    if (state.areaFilter.indexOf("mod:") === 0) {
      return it.moduloKey === state.areaFilter.slice(4);
    }
    if (state.areaFilter.indexOf("anexo:") === 0) {
      var ax = state.areaFilter.slice(6);
      var p = it.anexoPrincipal || anexoPrincipal(it);
      if (p === ax) return true;
      if (it.anexo && String(it.anexo).toUpperCase().indexOf(ax) === 0) {
        return true;
      }
    }
    return false;
  }

  function enrichItems() {
    var i;
    for (i = 0; i < state.items.length; i++) {
      var it = state.items[i];
      var row = state.indice[it.id];
      it.moduloKey = moduloKey(it.id);
      it.modulo = moduloLabel(it.id);
      if (row) {
        it.anexo = row.anexo;
        it.tituloIndice = row.titulo;
        it.recomendadaIndice = row.recomendada;
        it.estadoIndice = row.estadoIndice;
      }
      it.anexoPrincipal = anexoPrincipal(it);
      it.specOpcion = inferSpecOpcion(it);
    }
  }

  function inferSpecOpcion(it) {
    var impacto = (it.impacto || "").trim();
    var estado = (it.estado || "").trim();
    var indice = (it.estadoIndice || "").trim();
    var blob = [estado, indice, impacto].join("\n");
    var i;
    var patsCerrada = [
      /(?:Respondida|Asumida)[^:]{0,80}:\s*opción\s*([A-E])\b/i,
      /(?:Respondida|Asumida)[^:]{0,80}:\s*([A-E])\b/i,
      /opción\s+([A-E])\s*[.;](?!\s*no)/i,
    ];
    for (i = 0; i < patsCerrada.length; i++) {
      var mc = blob.match(patsCerrada[i]);
      if (mc) {
        return {
          letter: mc[1].toUpperCase(),
          modo: /Respondida/i.test(blob) ? "cerrada" : "asumida",
          fuente: /Respondida|Asumida/i.test(estado) ? "estado" : "indice",
        };
      }
    }
    if (/Asumida|Respondida/i.test(indice) && impacto) {
      var patsImp = [
        /(?:se\s+asume|se\s+aplica|se\s+usa)\s+([A-E])\b/i,
        /(?:se\s+asume|se\s+aplica|se\s+usa)[^.]{0,100}?\b([A-E])\s+como\b/i,
        /\b([A-E])\s+como\s+default\b/i,
        /\bdefault[^.]{0,60}?\b([A-E])\b/i,
        /^\s*([A-E])\s*[\(;]/m,
        /\b([A-E])\s*\(PRM-/i,
      ];
      for (i = 0; i < patsImp.length; i++) {
        var mi = impacto.match(patsImp[i]);
        if (mi) {
          return {
            letter: mi[1].toUpperCase(),
            modo: /Asumida/i.test(indice) ? "asumida" : "default",
            fuente: "impacto",
          };
        }
      }
    }
    if (impacto) {
      var patsDef = [
        /(?:se\s+asume|se\s+aplica|se\s+usa)\s+([A-E])\b/i,
        /(?:se\s+asume|se\s+aplica|se\s+usa)[^.]{0,100}?\b([A-E])\s+como\b/i,
        /\b([A-E])\s+como\s+default\b/i,
      ];
      for (i = 0; i < patsDef.length; i++) {
        var md = impacto.match(patsDef[i]);
        if (md) {
          return { letter: md[1].toUpperCase(), modo: "default", fuente: "impacto" };
        }
      }
    }
    return null;
  }

  function specOpcionBadge(op, spec) {
    if (!spec || !op.letter || op.letter.toUpperCase() !== spec.letter) return "";
    if (spec.modo === "cerrada") {
      return '<span class="badge spec-cerrada">Cerrada en spec</span> ';
    }
    if (spec.modo === "asumida") {
      return '<span class="badge spec-asumida">Asumida en spec</span> ';
    }
    return '<span class="badge spec-default">Default en spec</span> ';
  }

  function textoGlosario(it) {
    return [
      it.pregunta,
      it.contexto,
      it.impacto,
      it.bloquea,
      it.estado,
      it.recomendadaIndice || "",
    ].join(" ");
  }

  function glosarioList(text) {
    var vistos = {};
    var out = [];
    var g;
    for (g = 0; g < GLOSSARIO_RE.length; g++) {
      var item = GLOSSARIO_RE[g];
      item.re.lastIndex = 0;
      if (item.re.test(text) && !vistos[item.term]) {
        vistos[item.term] = true;
        out.push(item);
      }
    }
    return out;
  }

  /** Lectura de contexto: menciona stack vigente sin mezclar motores en la misma frase. */
  function applyStackLensReadable(text) {
    if (!text) return "";
    var t = String(text);
    t = t.replace(
      /DEC-001\/DEC-004 fijan MongoDB y despliegue agnóstico/gi,
      "DEC-111 fija Azure SQL en GoodApps (el anexo aún redacta Mongo como legado)"
    );
    t = t.replace(
      /\bDEC-001\b/g,
      "el stack anterior del anexo (reemplazado por DEC-111)"
    );
    t = t.replace(/\bDEC-111\b/g, "DEC-111 (Azure SQL y .NET, vigente)");
    t = t.replace(/\bMongoDB\b/gi, "Azure SQL");
    t = t.replace(/\bMongo\b/gi, "Azure SQL");
    t = t.replace(/replica set/gi, "réplica de lectura en Azure SQL");
    t = t.replace(/\ben Mongo\b/gi, "en Azure SQL");
    t = t.replace(/BullMQ/g, "colas del backend .NET");
    return t;
  }

  /** Opciones y decisiones: solo redacción afirmativa del stack vigente (DIR-13). */
  function applyStackLensForOptions(text) {
    if (!text) return "";
    var t = String(text);
    t = t.replace(
      /Cluster\s+MongoDB\s+separado\s+dedicado\s+a\s+analítica/gi,
      "Base Azure SQL separada dedicada solo a analítica"
    );
    t = t.replace(
      /miembro oculto del replica set con etiqueta\s*[`']?analytics[`']?/gi,
      "réplica de solo lectura en Azure SQL reservada para analítica"
    );
    t = t.replace(
      /Base lógica\s*(?:<\s*db\s*>|la base de datos)_analytics/gi,
      "Base analítica _analytics en el mismo Azure SQL"
    );
    t = t.replace(/secundarios operativos/gi, "réplicas operativas de Azure SQL");
    t = t.replace(/replica set/gi, "réplica de lectura en Azure SQL");
    t = t.replace(/\bMongoDB\b/gi, "Azure SQL");
    t = t.replace(/\bMongo\b/gi, "Azure SQL");
    t = t.replace(/PITR estándar de Mongo gestionado/gi, "restauración punto-en-tiempo de Azure SQL");
    t = t.replace(/envelope encryption propio en Mongo/gi, "cifrado en Azure SQL");
    t = t.replace(/\bNode\+Mongo\b/gi, ".NET y Azure SQL");
    t = t.replace(/\bDEC-001\b/g, "DEC-111");
    t = t.replace(/BullMQ/g, "colas del backend .NET");
    return t;
  }

  function humanizeCore(text) {
    if (!text) return "";
    var t = String(text);
    var i;
    var keys = Object.keys(OLAS_PLAIN).sort(function (a, b) {
      return b.length - a.length;
    });
    for (i = 0; i < keys.length; i++) {
      t = t.replace(
        new RegExp("\\b" + keys[i] + "\\b", "g"),
        OLAS_PLAIN[keys[i]]
      );
    }
    t = t.replace(/\bO(\d{1,2})\b/g, "la ola $1 del plan de entregas");
    t = t.replace(/`bi_\*`/gi, "las tablas de datos para reportes e indicadores (BI)");
    t = t.replace(/`([^`]+)`/g, function (_, c) {
      if (/^bi_/i.test(c)) return "datos analíticos (" + c + ")";
      if (c.indexOf("_") !== -1 && c.indexOf("*") !== -1) {
        return c.replace(/_/g, " ").replace(/\*/g, "");
      }
      return c;
    });
    t = t.replace(/<\s*db\s*>/gi, "la base de datos");
    t = t.replace(/<[a-z0-9_]+>/gi, function (m) {
      return m.replace(/[<>]/g, "");
    });
    t = t.replace(/\/api\/[^\s,?]+/gi, "un servicio de API");
    t = t.replace(
      /\bRF-[A-Z]+-\d+(?:\s+a\s+RF-[A-Z]+-\d+)?/gi,
      "requisitos del módulo"
    );
    t = t.replace(/\bJOB-[A-Z]+-\d+(?:\s+a\s+\d+)?/gi, "procesos automáticos");
    t = t.replace(/\bDEC-\d+/g, function (m) {
      if (m === "DEC-001" || m === "DEC-111") return m;
      return "una decisión ya registrada";
    });
    t = t.replace(/BASE §[\d.]+/gi, "el relevamiento funcional");
    t = t.replace(/\bCTR-[A-Z]+-\d+/gi, "un criterio técnico");
    t = t.replace(/\bPRM-[A-Z]+-\d+/gi, "un parámetro");
    t = t.replace(/\bAPI-[A-Z]+-\d+/gi, "un servicio de interfaz");
    t = t.replace(/\s+/g, " ").trim();
    return t;
  }

  function humanizeForReader(text) {
    return humanizeCore(applyStackLensReadable(text));
  }

  function businessSummaryAnalyticsOption(body) {
    var b = String(body || "");
    if (
      /replica|_analytics|`analytics`|etiqueta.*analytics/i.test(b) &&
      /(Recomendada)|aislamiento de carga|prioridad 0|Base lógica/i.test(b)
    ) {
      return (
        "Mismo Azure SQL de la plataforma: base analítica en réplica de solo lectura " +
        "(recomendada — aísla la carga sin montar otro motor)."
      );
    }
    if (/Cluster MongoDB|Base Azure SQL separada dedicada/i.test(b)) {
      return "Entorno Azure SQL aparte, solo para BI: máximo aislamiento, mayor costo y operación.";
    }
    if (/Sin almacén|todo BI sobre/i.test(b)) {
      return "Sin capa analítica dedicada: BI sobre réplicas operativas (más simple, riesgo en hora pico).";
    }
    return "";
  }

  var ANEXO_LABELS = {
    M01: "personas",
    M05: "facturación",
    M07: "cobranza",
    M09: "atención",
    M15: "contabilidad",
    M17: "institucional",
    M19: "portal del socio",
    T02: "identidad y permisos",
    T05: "modelo de datos",
    T10: "reportes y BI",
    T11: "workflow",
  };

  function camelToWords(s) {
    return String(s)
      .replace(/_/g, " ")
      .replace(/([a-zà-ú])([A-Z])/g, "$1 $2")
      .trim();
  }

  function friendlyCapability(code) {
    var parts = String(code).split(".");
    var modMap = {
      bia: "reportes",
      iam: "accesos",
      cob: "cobranza",
      fac: "facturación",
      pla: "plataforma",
      cfg: "configuración",
    };
    var actMap = {
      ver: "ver",
      crear: "crear",
      editar: "editar",
      consumir: "usar",
      eliminar: "eliminar",
    };
    if (parts.length < 2) return camelToWords(code);
    var mod = modMap[parts[0]] || parts[0];
    if (parts.length === 2) {
      return mod + " · " + (actMap[parts[1]] || parts[1]);
    }
    var recurso = parts[1].replace(/_/g, " ");
    var act = actMap[parts[2]] || parts[2];
    return "permiso de " + act + " " + recurso + " (" + mod + ")";
  }

  function shortenToSentence(s, max) {
    if (!s || s.length <= max) return s;
    var cut = s.slice(0, max);
    var sp = cut.lastIndexOf(" ");
    if (sp > max * 0.6) cut = cut.slice(0, sp);
    return cut + "…";
  }

  function stripOpcionMeta(raw) {
    return String(raw || "")
      .replace(/^\s*[A-Z]\)\s*/, "")
      .replace(/\s*\*\*\(Recomendada\)\*\*/gi, "")
      .replace(/\s*\(Recomendada\)/gi, "")
      .trim();
  }

  function humanizeOptionDeep(text) {
    if (!text) return "";
    var t = applyStackLensForOptions(String(text));
    t = t.replace(/§(\d+(?:\.\d+)*)/g, "apartado $1 del anexo");
    t = t.replace(/`([^`]+)`/g, function (_, c) {
      if (/^[a-z0-9]+(\.[a-z0-9_.]+)+$/i.test(c) && c.indexOf(" ") === -1) {
        if (c.indexOf(":") !== -1) return c.replace(":", ": ").replace(/_/g, " ");
        return friendlyCapability(c);
      }
      if (/^[a-z]+[A-Z]/.test(c) || c.indexOf("_") !== -1) return "campo " + camelToWords(c);
      return c;
    });
    t = t.replace(/\b(M\d{2}|T\d{2}[a-z]?)\b/g, function (m) {
      var lab = ANEXO_LABELS[m];
      return lab ? lab + " (" + m + ")" : m;
    });
    t = t.replace(/\b(scopes?)\s+`([^`]+)`/gi, "permisos $2");
    t = t.replace(/→/g, " enlaza con ");
    t = t.replace(
      /\bRF-[A-Z]+-\d+(?:\s+a\s+RF-[A-Z]+-\d+)?/gi,
      "requisitos del módulo"
    );
    t = t.replace(/\bCOL-[A-Z]+-\d+/gi, "tabla del modelo");
    t = t.replace(/\bpublic:\s*true/gi, "marcar como API pública (con controles)");
    t = humanizeCore(t);
    return t.replace(/\s+/g, " ").trim();
  }

  function humanizeClauseShort(clause) {
    var c = clause.trim();
    if (!c) return "";
    if (/^Agregar §8/i.test(c) || /transición y estado inicial/i.test(c)) {
      return "Documentar estados y transiciones que faltaban en tablas.";
    }
    if (/declarar destinos/i.test(c)) {
      return "Definir a qué tablas apuntan escenarios, plantillas y códigos de catálogo.";
    }
    if (/renombrar/i.test(c)) {
      return "Unificar nombres de campos con el modelo de datos común.";
    }
    if (/agregar §7/i.test(c) || /tablas derivadas/i.test(c)) {
      return "Completar las tablas de campos que el anexo no tenía detalladas.";
    }
    if (/bia\.|capabilit|scopes?/i.test(c)) {
      return "Usar permisos del producto (ver reportes, exportar, APIs) en lugar de reglas sueltas.";
    }
    if (/mapeo.*T02|§4\.4/i.test(c)) {
      return "Alinear permisos ERP con la matriz de identidad.";
    }
    if (/^No en la primera/i.test(c)) {
      return "Postergar para una versión posterior, sin cerrar la puerta.";
    }
    if (/^Sí en /i.test(c)) {
      return "Habilitar en la ola indicada, con controles.";
    }
    if (/^Nunca\.?$/i.test(c)) {
      return "No implementar esta variante.";
    }
    if (/^Dejar /i.test(c)) {
      return "Mantener solo texto narrativo, sin cerrar tablas ni contratos.";
    }
    return shortenToSentence(humanizeOptionDeep(c), 140);
  }

  function optionLeadOneLiner(body) {
    if (
      /§8|transición|estado inicial/i.test(body) &&
      (/§7|tabla|campo|colecci/i.test(body) || /renombrar/i.test(body))
    ) {
      return (
        "Cerrar el hueco del anexo: estados en tablas, campos documentados, " +
        "enlaces entre datos y permisos alineados al resto del proyecto."
      );
    }
    if (/solo en texto|como reglas/i.test(body) && !/Agregar §/i.test(body)) {
      return "Dejar la decisión solo descrita en prosa, sin formalizar tablas ni permisos.";
    }
    return shortenToSentence(humanizeOptionDeep(body), 200);
  }

  function optionDisplayParts(raw) {
    var body = stripOpcionMeta(raw);
    var dash = body.indexOf(" — ");
    var accion = dash === -1 ? body : body.slice(0, dash).trim();
    var beneficio = dash === -1 ? "" : body.slice(dash + 3).trim();
    var clauses = accion.split(/\s*;\s*/).filter(Boolean);
    var lead;
    var bullets = [];
    if (beneficio) {
      var bizDash = businessSummaryAnalyticsOption(accion);
      var benH = humanizeOptionDeep(beneficio);
      if (bizDash) {
        lead = bizDash;
      } else {
        var accionH = shortenToSentence(humanizeOptionDeep(accion), 180);
        lead = accionH ? accionH + " — " + benH : benH;
      }
    } else if (businessSummaryAnalyticsOption(accion)) {
      lead = businessSummaryAnalyticsOption(accion);
    } else if (clauses.length > 1) {
      lead = optionLeadOneLiner(accion);
      var i;
      for (i = 0; i < clauses.length && i < 7; i++) {
        var b = humanizeClauseShort(clauses[i]);
        if (b) bullets.push(b);
      }
    } else {
      lead = optionLeadOneLiner(accion);
    }
    return { lead: lead, bullets: bullets, tecnico: body, accion: accion, beneficio: beneficio };
  }

  function mainQuestionText(it) {
    var raw = (it.pregunta || "").trim();
    var h = humanizeForReader(raw);
    if (!h && it.title) {
      h = "¿Cuál es la decisión sobre «" + it.title + "»?";
    }
    if (h && h.indexOf("¿") !== 0) h = "¿" + h;
    if (h && h.indexOf("?") === -1) h = h + "?";
    return h;
  }

  function hasTechnicalMarkers(text) {
    if (!text) return false;
    return /`|\/api\/|\bO\d{1,2}\b|\bRF-|\bJOB-|\bDEC-|\bBASE §/.test(text);
  }

  function buildPreguntaHtml(it) {
    var main = mainQuestionText(it);
    var parts = [];
    parts.push('<p class="pregunta">' + esc(main) + "</p>");
    if (it.modulo) {
      parts.push(
        '<p class="pregunta-ambito"><strong>Ámbito:</strong> ' +
          esc(it.modulo) +
          (it.anexo ? " · anexo " + esc(it.anexo) : "") +
          "</p>"
      );
    }
    if (it.pregunta && hasTechnicalMarkers(it.pregunta)) {
      parts.push(
        '<details class="tecnica-inline"><summary>Redacción técnica original (códigos de la spec)</summary><p class="pregunta-tecnica">' +
          esc(it.pregunta) +
          "</p></details>"
      );
    }
    return parts.join("");
  }

  function formatOpcion(raw) {
    var parts = optionDisplayParts(raw);
    var letter = "";
    var lm = String(raw).match(/^\s*([A-Z])\)/);
    if (lm) letter = lm[1] + ")";
    var html = '<span class="op-wrap">';
    html +=
      '<span class="op-main-line"><span class="op-letter">' +
      esc(letter) +
      "</span> <span class=\"op-lead\">" +
      esc(parts.lead) +
      "</span></span>";
    if (parts.bullets.length) {
      html += '<ul class="op-bullets">';
      var b;
      for (b = 0; b < parts.bullets.length; b++) {
        html += "<li>" + esc(parts.bullets[b]) + "</li>";
      }
      html += "</ul>";
    }
    var showTech =
      (parts.beneficio && parts.accion) ||
      parts.tecnico.length > 80 ||
      /`|§|RF-|Mongo|replica|M\d|T\d/i.test(parts.tecnico);
    if (showTech) {
      var techBody;
      var techSum = "Detalle spec";
      if (parts.beneficio && parts.accion) {
        techBody =
          '<p class="op-accion-resumen">' +
          esc(shortenToSentence(humanizeOptionDeep(parts.accion), 400)) +
          "</p>";
      } else {
        techSum = "Texto técnico original";
        techBody = "<p>" + esc(parts.tecnico) + "</p>";
      }
      html +=
        '<details class="op-tecnica op-tecnica--tail"><summary>' +
        esc(techSum) +
        "</summary>" +
        techBody +
        "</details>";
    }
    html += "</span>";
    return html;
  }

  function buildContextHtml(it) {
    var parts = [];
    var sub =
      it.tituloIndice && it.tituloIndice !== it.title
        ? '<p class="subtitulo">' + esc(it.tituloIndice) + "</p>"
        : "";

    parts.push(
      '<details class="context-wrap"><summary class="context-wrap-sum">Contexto y ayuda (tocar para abrir)</summary><div class="context-wrap-body">'
    );

    parts.push('<section class="lectura-simple" aria-labelledby="ctx-tit">');
    parts.push('<h3 id="ctx-tit">Para orientarte</h3><ul>');
    if (it.modulo) parts.push("<li><strong>Área:</strong> " + esc(it.modulo) + "</li>");
    if (it.anexo) parts.push("<li><strong>Anexo / fuente:</strong> " + esc(it.anexo) + "</li>");
    parts.push(
      "<li><strong>De qué se trata:</strong> " + esc(it.title) + "</li>"
    );
    if (it.recomendadaIndice) {
      parts.push(
        "<li><strong>Recomendación vigente en el índice 02:</strong> " +
          esc(humanizeForReader(it.recomendadaIndice)) +
          "</li>"
      );
    }
    if (it.specOpcion) {
      var sp = it.specOpcion;
      var specTxt =
        sp.modo === "cerrada"
          ? "Opción " + sp.letter + " (decisión cerrada en el anexo / índice 02)"
          : sp.modo === "asumida"
            ? "Opción " + sp.letter + " (asumida en la especificación)"
            : "Opción " + sp.letter + " (default si no respondés en esta copia)";
      parts.push("<li><strong>Qué hace la spec hoy:</strong> " + esc(specTxt) + "</li>");
    }
    if (it.impacto) {
      parts.push(
        "<li><strong>Si no respondés en esta copia:</strong> " +
          esc(humanizeForReader(it.impacto)) +
          "</li>"
      );
    }
    parts.push("</ul></section>");
    parts.push(sub);

    if (it.contexto) {
      parts.push(
        '<details class="context-block"><summary>Antecedentes (técnicos)</summary><p class="contexto">' +
          esc(humanizeForReader(it.contexto)) +
          '</p><p class="hint-ctx">Versión con códigos en la spec, solo si la necesitás: ' +
          esc(it.contexto) +
          ".</p></details>"
      );
    }
    if (it.bloquea) {
      parts.push(
        '<details class="context-block"><summary>Qué partes del proyecto dependen de esto</summary><p class="contexto">' +
          esc(humanizeForReader(it.bloquea)) +
          '</p><p class="hint-ctx">Referencia técnica: ' +
          esc(it.bloquea) +
          ".</p></details>"
      );
    }
    var est = it.estado || it.estadoIndice;
    if (est) {
      parts.push(
        '<details class="context-block"><summary>Qué dice la especificación oficial hoy</summary><p class="estado-spec">' +
          esc(est) +
          "</p></details>"
      );
    }
    var gloss = glosarioList(textoGlosario(it));
    if (gloss.length) {
      parts.push(
        '<details class="context-block"><summary>Glosario de esta pregunta</summary><dl class="glosario">'
      );
      var j;
      for (j = 0; j < gloss.length; j++) {
        parts.push(
          "<dt>" +
            esc(gloss[j].term) +
            "</dt><dd>" +
            esc(gloss[j].desc) +
            "</dd>"
        );
      }
      parts.push("</dl></details>");
    }
    parts.push("</div></details>");
    return parts.join("");
  }

  function opcionesLineRest(line) {
    var m = line.match(/^\-\s+\*\*Opciones(?::\*\*|\*\*:)\s*(.*)$/i);
    return m ? m[1].trim() : null;
  }

  function parseOpciones(block) {
    var lines = block.split("\n");
    var inOpt = false;
    var opts = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].replace(/\r$/, "");
      var rest = opcionesLineRest(line);
      if (rest !== null) {
        if (rest && /\b[A-Z]\)/.test(rest)) {
          return splitInlineOptions(rest);
        }
        inOpt = true;
        continue;
      }
      var bareOpt = line.match(/^\*\*Opciones(?::\*\*|\*\*:)\s*(.*)$/i);
      if (bareOpt) {
        if (bareOpt[1] && /\b[A-Z]\)/.test(bareOpt[1])) {
          return splitInlineOptions(bareOpt[1]);
        }
        inOpt = true;
        continue;
      }
      if (inOpt) {
        var dashOpt = line.match(/^-\s+([A-Z])\)\s*(.*)$/);
        if (dashOpt) {
          var dText = dashOpt[2].trim();
          opts.push({
            letter: dashOpt[1],
            text: dText,
            rec: /\(Recomendada\)/i.test(dText),
            raw: dashOpt[1] + ") " + dText,
          });
          continue;
        }
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
        } else if (
          (/^\*\*/.test(line) || (/^\-\s+\*\*/.test(line) && !/^-\s+[A-Z]\)/.test(line))) &&
          !/^\s{2}/.test(line)
        ) {
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
        impacto: field(body, "Impacto si no se responde"),
        bloquea: field(body, "Bloquea"),
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
      if (!itemMatchesArea(it)) continue;
      if (state.filter === "pendientes" && answered(it)) continue;
      if (state.filter === "respondidas" && !answered(it)) continue;
      idx.push(i);
    }
    return idx;
  }

  function areaFilterLabel() {
    if (state.areaFilter === "todos") return "";
    if (state.areaFilter.indexOf("mod:") === 0) {
      return labelForModKey(state.areaFilter.slice(4));
    }
    if (state.areaFilter.indexOf("anexo:") === 0) {
      return "Anexo " + state.areaFilter.slice(6);
    }
    return "";
  }

  function fillAreaSelect() {
    if (!el.filtroArea || !state.items.length) return;
    var prev = state.areaFilter;
    var modCounts = {};
    var anexoCounts = {};
    var i;
    for (i = 0; i < state.items.length; i++) {
      var it = state.items[i];
      modCounts[it.moduloKey] = (modCounts[it.moduloKey] || 0) + 1;
      var ax = it.anexoPrincipal || anexoPrincipal(it);
      if (ax) anexoCounts[ax] = (anexoCounts[ax] || 0) + 1;
    }
    el.filtroArea.innerHTML = "";
    var optAll = document.createElement("option");
    optAll.value = "todos";
    optAll.textContent = "Todas las áreas (" + state.items.length + ")";
    el.filtroArea.appendChild(optAll);

    var ogMod = document.createElement("optgroup");
    ogMod.label = "Por módulo / tema (código PA)";
    var modKeys = Object.keys(modCounts).sort(function (a, b) {
      return labelForModKey(a).localeCompare(labelForModKey(b), "es");
    });
    for (i = 0; i < modKeys.length; i++) {
      var mk = modKeys[i];
      var o = document.createElement("option");
      o.value = "mod:" + mk;
      o.textContent =
        labelForModKey(mk) + " (" + modCounts[mk] + ")";
      ogMod.appendChild(o);
    }
    el.filtroArea.appendChild(ogMod);

    var ogAx = document.createElement("optgroup");
    ogAx.label = "Por anexo (índice 02)";
    var axKeys = Object.keys(anexoCounts).sort(function (a, b) {
      var ga = /^M/.test(a) ? 0 : 1;
      var gb = /^M/.test(b) ? 0 : 1;
      if (ga !== gb) return ga - gb;
      return a.localeCompare(b, "es", { numeric: true });
    });
    for (i = 0; i < axKeys.length; i++) {
      var ak = axKeys[i];
      var oa = document.createElement("option");
      oa.value = "anexo:" + ak;
      oa.textContent = ak + " (" + anexoCounts[ak] + " preguntas)";
      ogAx.appendChild(oa);
    }
    el.filtroArea.appendChild(ogAx);

    var ok = false;
    for (i = 0; i < el.filtroArea.options.length; i++) {
      if (el.filtroArea.options[i].value === prev) {
        ok = true;
        break;
      }
    }
    state.areaFilter = ok ? prev : "todos";
    el.filtroArea.value = state.areaFilter;
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

  function countMdAnswers() {
    var n = 0;
    var i;
    for (i = 0; i < state.items.length; i++) {
      if (answered(state.items[i])) n++;
    }
    return n;
  }

  function readCurrentForm() {
    var elegida = "—";
    var checked =
      el.app && el.app.querySelector('input[name="op"]:checked');
    if (checked) elegida = checked.value;
    var ampEl = document.getElementById("amp");
    var amp = (ampEl && ampEl.value.trim()) || "—";
    if (!checked && amp !== "—") elegida = "OTRA";
    return { elegida: elegida, ampliacion: amp };
  }

  function persistItemToMd(it, elegida, ampliacion, opts) {
    opts = opts || {};
    if (!it) return false;
    if (elegida === "—" && ampliacion === "—") return false;
    var fecha =
      it.respondido && it.respondido !== "—"
        ? it.respondido
        : new Date().toISOString().slice(0, 16).replace("T", " ");
    state.md = patchBlock(state.md, it.id, elegida, ampliacion, fecha);
    it.elegida = elegida;
    it.ampliacion = ampliacion;
    it.respondido = fecha;
    persistMd();
    if (opts.writeFile !== false) writeFileHandleIfAny();
    if (!opts.silent) toast("Guardado · " + it.id);
    return true;
  }

  function persistCurrentForm(opts) {
    var it = state.items[state.index];
    if (!it) return false;
    var form = readCurrentForm();
    if (form.elegida === "—" && form.ampliacion === "—") return false;
    return persistItemToMd(it, form.elegida, form.ampliacion, opts);
  }

  /** Vuelca todas las respuestas en memoria al MD (antes de exportar). */
  function flushAllKnownAnswersToMd() {
    persistCurrentForm({ silent: true, writeFile: false });
    var i;
    for (i = 0; i < state.items.length; i++) {
      var it = state.items[i];
      if (!answered(it) && (!it.ampliacion || it.ampliacion === "—")) continue;
      var fecha =
        it.respondido && it.respondido !== "—"
          ? it.respondido
          : new Date().toISOString().slice(0, 16).replace("T", " ");
      state.md = patchBlock(
        state.md,
        it.id,
        it.elegida,
        it.ampliacion || "—",
        fecha
      );
    }
    persistMd();
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
    enrichItems();
    if (state.index >= state.items.length) state.index = 0;
    persistMd();
    render();
    if (fromFile) toast("Archivo cargado · " + state.items.length + " preguntas");
  }

  function updateProgress() {
    var done = state.items.filter(answered).length;
    var total = state.items.length;
    var list = filteredIndices();
    var doneFilt = 0;
    var j;
    for (j = 0; j < list.length; j++) {
      if (answered(state.items[list[j]])) doneFilt++;
    }
    var pct = total ? Math.round((done / total) * 100) : 0;
    var area = areaFilterLabel();
    if (state.areaFilter !== "todos" && list.length) {
      el.progText.textContent =
        doneFilt +
        " / " +
        list.length +
        " en " +
        area +
        " · " +
        done +
        " / " +
        total +
        " global";
    } else {
      el.progText.textContent = done + " / " + total + " respondidas";
    }
    el.progBar.style.width = pct + "%";
  }

  function renderQuestion() {
    var nav = currentLogicalIndex();
    var list = nav.list;
    if (!list.length) {
      el.app.innerHTML =
        '<div class="empty"><p>No hay preguntas con este filtro. Probá otra <strong>Área</strong> o cambiá <strong>Ver</strong>.</p></div>';
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
        var isSpec =
          it.specOpcion &&
          op.letter &&
          op.letter.toUpperCase() === it.specOpcion.letter;
        var cls =
          "opcion" +
          (checked ? " sel" : "") +
          (op.rec ? " rec" : "") +
          (isSpec ? " spec-op" : "");
        optsHtml +=
          '<li><label class="' +
          cls +
          '"><input type="radio" name="op" value="' +
          esc(val) +
          '" ' +
          (checked ? "checked" : "") +
          "><span>" +
          (op.rec ? '<span class="badge rec">Recomendada</span> ' : "") +
          specOpcionBadge(op, it.specOpcion) +
          formatOpcion(op.raw) +
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

    var areaNote = areaFilterLabel();
    var posLabel =
      nav.pos +
      1 +
      " / " +
      list.length +
      (areaNote ? " · " + areaNote : "");
    var estLine = (it.estado || it.estadoIndice || "").trim();
    var estadoBadge = "";
    if (/Respondida/i.test(estLine)) {
      estadoBadge = '<span class="badge ok">Cerrada en spec</span>';
    } else if (/Pendiente/i.test(estLine)) {
      estadoBadge =
        '<span class="badge warn">Pendiente en índice 02</span>';
    }

    el.app.innerHTML =
      '<article class="card card--layout-dock">' +
      '<div class="card__body">' +
      '<div class="meta"><span class="badge">' +
      esc(it.id) +
      "</span>" +
      estadoBadge +
      '<span class="progress">' +
      esc(posLabel) +
      "</span></div>" +
      '<p class="tema-etq">Tema</p>' +
      "<h2 class=\"tema-tit\">" +
      esc(it.title) +
      "</h2>" +
      buildPreguntaHtml(it) +
      '<h3 class="opciones-tit">Tu respuesta</h3>' +
      optsHtml +
      '<div class="amp-block">' +
      '<div class="amp-head">' +
      '<label class="field" for="amp">Ampliación o respuesta propia</label>' +
      '<button type="button" id="btn-dictado" class="btn-dictado" title="Dictar con el micrófono">Dictar voz</button>' +
      "</div>" +
      '<textarea id="amp" rows="4" placeholder="Opcional: matiz, condición, o respuesta completa si elegiste Otra. Podés dictar con el botón.">' +
      esc(it.ampliacion === "—" ? "" : it.ampliacion) +
      "</textarea></div>" +
      buildContextHtml(it) +
      "</div>" +
      '<aside class="nav nav-panel" aria-label="Navegación de la pregunta">' +
      '<p class="nav-panel-pos">' +
      esc(posLabel) +
      "</p>" +
      '<button type="button" id="btn-prev"' +
      (nav.pos <= 0 ? " disabled" : "") +
      ">Anterior</button>" +
      '<button type="button" class="primary" id="btn-save">Guardar y seguir</button>' +
      '<button type="button" id="btn-skip">Saltar</button>' +
      "</aside></article>";

    document.getElementById("btn-prev").onclick = function () {
      if (nav.pos > 0) {
        state.index = list[nav.pos - 1];
        renderQuestion();
      }
    };
    document.getElementById("btn-skip").onclick = function () {
      persistCurrentForm({ silent: true, writeFile: true });
      if (nav.pos < list.length - 1) {
        state.index = list[nav.pos + 1];
        renderQuestion();
      }
    };
    document.getElementById("btn-save").onclick = saveCurrent;

    var radios = el.app.querySelectorAll('input[name="op"]');
    for (var r = 0; r < radios.length; r++) {
      radios[r].onchange = function () {
        syncRadioStyles();
        persistCurrentForm({ silent: true, writeFile: true });
        updateProgress();
      };
    }
    syncRadioStyles();
    var ampEl = document.getElementById("amp");
    if (ampEl) {
      ampEl.onblur = function () {
        persistCurrentForm({ silent: true, writeFile: true });
        updateProgress();
      };
    }
    bindDictation("btn-dictado", "amp");
    updateProgress();
  }

  function speechSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function bindDictation(btnId, textareaId) {
    var btn = document.getElementById(btnId);
    var ta = document.getElementById(textareaId);
    if (!btn || !ta) return;
    if (!speechSupported()) {
      btn.disabled = true;
      btn.title = "Dictado no disponible (probá Chrome o Safari en el celular)";
      return;
    }
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = null;
    var listening = false;
    btn.onclick = function () {
      if (listening && rec) {
        rec.stop();
        return;
      }
      rec = new Rec();
      rec.lang = "es-AR";
      rec.continuous = true;
      rec.interimResults = false;
      listening = true;
      btn.classList.add("listening");
      btn.textContent = "Detener";
      btn.setAttribute("aria-pressed", "true");
      rec.onresult = function (ev) {
        var chunk = "";
        var i;
        for (i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) {
            chunk += ev.results[i][0].transcript;
          }
        }
        if (chunk) {
          var sep =
            ta.value.length && !/\s$/.test(ta.value) ? " " : "";
          ta.value += sep + chunk.trim();
        }
      };
      rec.onerror = function (e) {
        listening = false;
        btn.classList.remove("listening");
        btn.textContent = "Dictar voz";
        btn.setAttribute("aria-pressed", "false");
        if (e.error === "not-allowed") {
          toast("Permiso de micrófono denegado");
        } else {
          toast("No se pudo dictar (" + (e.error || "error") + ")");
        }
      };
      rec.onend = function () {
        listening = false;
        btn.classList.remove("listening");
        btn.textContent = "Dictar voz";
        btn.setAttribute("aria-pressed", "false");
      };
      try {
        rec.start();
        toast("Escuchando…");
      } catch (err) {
        toast("No se pudo iniciar el micrófono");
      }
    };
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
    var form = readCurrentForm();
    if (form.elegida === "—" && form.ampliacion === "—") {
      toast("Elegí una opción o escribí en ampliación");
      return;
    }
    persistItemToMd(it, form.elegida, form.ampliacion, { silent: false });

    var nav = currentLogicalIndex();
    var list = nav.list;
    if (nav.pos < list.length - 1) {
      state.index = list[nav.pos + 1];
    }
    renderQuestion();
  }

  function render() {
    fillAreaSelect();
    renderQuestion();
    if (el.filtro) el.filtro.value = state.filter;
    fillSearchHints();
  }

  function parseSearchQuery(raw) {
    if (!raw) return "";
    var m = String(raw).match(/^(PA-[A-Z0-9]+(?:-[A-Z0-9]+)*)/i);
    if (m) return m[1].toUpperCase();
    return String(raw).trim().toLowerCase();
  }

  function jumpToSearch(raw) {
    var q = parseSearchQuery(raw);
    var ql = q.toLowerCase();
    if (!ql) {
      toast("Escribí un código (PA-…) o una palabra del título");
      return;
    }
    var list = filteredIndices();
    var k;
    for (k = 0; k < list.length; k++) {
      var it = state.items[list[k]];
      if (
        it.id.toUpperCase() === q ||
        it.id.toLowerCase().indexOf(ql) === 0 ||
        it.title.toLowerCase().indexOf(ql) !== -1 ||
        (it.tituloIndice &&
          it.tituloIndice.toLowerCase().indexOf(ql) !== -1)
      ) {
        state.index = list[k];
        renderQuestion();
        if (el.buscar) el.buscar.value = it.id + " — " + it.title;
        toast("Ir a " + it.id);
        return;
      }
    }
    toast("Nada coincide con el filtro actual");
  }

  function fillSearchHints() {
    if (!el.buscarList) return;
    el.buscarList.innerHTML = "";
    var list = filteredIndices();
    var k;
    var max = 60;
    for (k = 0; k < list.length && k < max; k++) {
      var it = state.items[list[k]];
      var opt = document.createElement("option");
      opt.value = it.id + " — " + it.title;
      el.buscarList.appendChild(opt);
    }
    if (el.buscar && state.items[state.index]) {
      var cur = state.items[state.index];
      el.buscar.placeholder =
        "Ej. " + cur.id + " o «" + cur.title.slice(0, 24) + "…»";
    }
  }

  function exportMd() {
    flushAllKnownAnswersToMd();
    var n = countMdAnswers();
    var total = state.items.length;
    if (n === 0) {
      toast("El archivo saldría vacío: marcá al menos una opción antes");
      return;
    }
    var blob = new Blob([state.md], { type: "text/markdown;charset=utf-8" });
    var a = document.createElement("a");
    var d = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob);
    a.download = "copia-respuestas-stakeholder-" + d + ".md";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Exportado: " + n + " / " + total + " respuestas en el .md");
    if (n < total * 0.5) {
      setTimeout(function () {
        toast("Quedaron menos de la mitad: ¿faltó marcar opciones en algunas?");
      }, 2400);
    }
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
    flushAllKnownAnswersToMd();
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
    window.addEventListener("beforeunload", function () {
      flushAllKnownAnswersToMd();
    });
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
    if (el.filtroArea) {
      el.filtroArea.onchange = function () {
        state.areaFilter = el.filtroArea.value;
        try {
          localStorage.setItem(STORAGE_AREA, state.areaFilter);
        } catch (e) {}
        var list = filteredIndices();
        state.index = list.length ? list[0] : 0;
        render();
      };
    }
    var btnBuscar = document.getElementById("btn-buscar");
    if (btnBuscar) {
      btnBuscar.onclick = function () {
        jumpToSearch(el.buscar && el.buscar.value);
      };
    }
    if (el.buscar) {
      el.buscar.onkeydown = function (ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          jumpToSearch(el.buscar.value);
        }
      };
    }
  }

  function loadIndice() {
    return fetch(INDICE_URL)
      .then(function (r) {
        return r.ok ? r.json() : {};
      })
      .catch(function () {
        return {};
      });
  }

  function boot() {
    initEvents();
    loadIndice().then(function (idx) {
      state.indice = idx || {};
      try {
        var sa = localStorage.getItem(STORAGE_AREA);
        if (sa) state.areaFilter = sa;
      } catch (e) {}
      var stored = loadStored();
      if (stored && stored.indexOf("### PA-") !== -1) {
        setMd(stored, false);
        toast("Seguís donde quedaste");
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
            '<div class="empty"><p>Recargá esta página en el <strong>mismo navegador</strong> donde venías trabajando. Si cambiaste de computadora, pedinos tu último export y usá <strong>Más → Importar archivo…</strong></p></div>';
          updateProgress();
        });
    });
  }

  boot();
})();