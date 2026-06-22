/* AI Red Team Skill — UI logic. Vanilla JS, no dependencies, works offline. */
(function () {
  "use strict";

  var DATA = { techniques: [], tools: [], mappings: null, refs: {} };
  var STATE = {
    view: "techniques",
    search: "",
    domains: new Set(),
    phases: new Set(),
    frameworks: new Set(),
    findings: load("artrt.findings", [])
  };
  var FW_KEYS = ["attack", "atlas", "owasp", "owaspLlm", "nist"];

  /* ---------- utilities ---------- */
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function load(k, def) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function refUrl(key) { return DATA.refs[key] || "#"; }
  function domainName(id) {
    var d = (DATA.mappings.domains || []).find(function (x) { return x.id === id; });
    return d ? d.name : id;
  }
  function phaseName(id) {
    var p = (DATA.mappings.phases || []).find(function (x) { return x.id === id; });
    return p ? p.name : id;
  }
  function toast(msg) {
    var t = el("div", "toast", esc(msg));
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  /* ---------- robust data loader (handles repo-root and Docker layouts) ---------- */
  function fetchJSON(name) {
    var candidates = ["data/" + name, "../data/" + name, "./data/" + name];
    var i = 0;
    function tryNext() {
      if (i >= candidates.length) return Promise.reject(new Error("not found: " + name));
      var url = candidates[i++];
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).catch(tryNext);
    }
    return tryNext();
  }

  /* ---------- rendering ---------- */
  function fwTags(frameworks) {
    var out = "";
    FW_KEYS.forEach(function (k) {
      (frameworks[k] || []).forEach(function (id) {
        out += '<span class="tag fw-' + k + '">' + esc(id) + "</span>";
      });
    });
    return out;
  }

  function matchTechnique(t) {
    if (STATE.domains.size && !STATE.domains.has(t.domain)) return false;
    if (STATE.phases.size && !STATE.phases.has(t.phase)) return false;
    if (STATE.frameworks.size) {
      var has = false;
      STATE.frameworks.forEach(function (fw) {
        if ((t.frameworks[fw] || []).length) has = true;
      });
      if (!has) return false;
    }
    if (STATE.search) {
      var hay = (t.id + " " + t.name + " " + t.description + " " +
        FW_KEYS.map(function (k) { return (t.frameworks[k] || []).join(" "); }).join(" ") + " " +
        (t.tools || []).join(" ")).toLowerCase();
      if (hay.indexOf(STATE.search) === -1) return false;
    }
    return true;
  }

  function matchTool(t) {
    if (STATE.domains.size) {
      var inDomain = (t.domains || []).some(function (d) { return STATE.domains.has(d); });
      if (!inDomain) return false;
    }
    if (STATE.search) {
      var hay = (t.id + " " + t.name + " " + t.purpose + " " + (t.domains || []).join(" ")).toLowerCase();
      if (hay.indexOf(STATE.search) === -1) return false;
    }
    return true;
  }

  function renderGrid() {
    var grid = $("#grid");
    grid.innerHTML = "";
    var items, count;
    if (STATE.view === "techniques") {
      items = DATA.techniques.filter(matchTechnique);
      count = items.length;
      items.forEach(function (t) {
        var card = el("div", "card");
        card.innerHTML =
          '<div class="card-top"><h3>' + esc(t.name) + '</h3><span class="tid">' + esc(t.id) + "</span></div>" +
          '<p>' + esc(t.description) + "</p>" +
          '<div class="tagrow"><span class="pill">' + esc(domainName(t.domain)) + '</span>' +
          '<span class="pill">' + esc(phaseName(t.phase)) + "</span></div>" +
          '<div class="tagrow">' + fwTags(t.frameworks) + "</div>";
        card.addEventListener("click", function () { openDrawer(t); });
        grid.appendChild(card);
      });
    } else {
      items = DATA.tools.filter(matchTool);
      count = items.length;
      items.forEach(function (t) {
        var card = el("div", "card tool-card");
        card.innerHTML =
          '<div class="card-top"><h3>' + esc(t.name) + '</h3><span class="tid">' + esc(t.id) + "</span></div>" +
          '<p>' + esc(t.purpose) + "</p>" +
          '<div class="pillrow">' + (t.domains || []).map(function (d) {
            return '<span class="pill">' + esc(domainName(d)) + "</span>";
          }).join("") + "</div>" +
          '<div class="tagrow"><a href="' + esc(t.install) + '" target="_blank" rel="noopener">Install / docs ↗</a>' +
          ' · <a href="' + esc(refUrl(t.reference)) + '" target="_blank" rel="noopener">reference ↗</a></div>';
        grid.appendChild(card);
      });
    }
    $("#result-count").textContent = count;
    $("#empty").classList.toggle("hidden", count !== 0);
  }

  function openDrawer(t) {
    var b = $("#drawer-body");
    var fwRows = "";
    FW_KEYS.forEach(function (k) {
      var ids = t.frameworks[k] || [];
      if (!ids.length) return;
      var label = ({ attack: "MITRE ATT&CK", atlas: "MITRE ATLAS", owasp: "OWASP", owaspLlm: "OWASP LLM 2025", nist: "NIST AI RMF" })[k];
      fwRows += '<div class="k">' + label + '</div><div>' + ids.map(function (id) {
        return '<span class="tag fw-' + k + '">' + esc(id) + "</span>";
      }).join(" ") + "</div>";
    });
    var toolLinks = (t.tools || []).map(function (id) {
      var tool = DATA.tools.find(function (x) { return x.id === id; });
      var url = tool ? tool.install : "#";
      var nm = tool ? tool.name : id;
      return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(nm) + " ↗</a>";
    }).join(" ");
    var refLinks = (t.references || []).map(function (r) {
      return '<a href="' + esc(refUrl(r)) + '" target="_blank" rel="noopener">' + esc(r) + " ↗</a>";
    }).join(" ");

    b.innerHTML =
      "<h2>" + esc(t.name) + "</h2><div class='tid'>" + esc(t.id) + "</div>" +
      "<div class='section'><h4>Summary</h4><p>" + esc(t.description) + "</p></div>" +
      "<div class='section'><h4>Classification</h4><div class='kv'>" +
        "<div class='k'>Domain</div><div>" + esc(domainName(t.domain)) + "</div>" +
        "<div class='k'>Kill-chain phase</div><div>" + esc(phaseName(t.phase)) + "</div>" +
        fwRows + "</div></div>" +
      (toolLinks ? "<div class='section'><h4>Tools</h4><div class='reflist'>" + toolLinks + "</div></div>" : "") +
      "<div class='section'><h4>Recommendation</h4><div class='reco'>" + esc(t.recommendation) + "</div></div>" +
      (refLinks ? "<div class='section'><h4>References</h4><div class='reflist'>" + refLinks + "</div></div>" : "") +
      "<div class='drawer-actions'>" +
        "<button class='btn-accent' id='add-finding'>Add to findings</button>" +
        "<a class='btn-ghost' href='" + esc(refUrl(t.references && t.references[0])) + "' target='_blank' rel='noopener'>Open reference</a>" +
      "</div>";

    $("#add-finding").addEventListener("click", function () { addFinding(t); });
    showOverlay();
    $("#drawer").classList.remove("hidden");
  }

  /* ---------- findings ---------- */
  function addFinding(t) {
    if (STATE.findings.some(function (f) { return f.id === t.id; })) {
      toast("Already in findings");
      return;
    }
    STATE.findings.push({
      id: t.id, name: t.name, domain: t.domain, phase: t.phase,
      frameworks: t.frameworks, description: t.description,
      recommendation: t.recommendation, references: t.references || [], tools: t.tools || []
    });
    save("artrt.findings", STATE.findings);
    updateFindingsCount();
    toast("Added to findings");
  }
  function removeFinding(id) {
    STATE.findings = STATE.findings.filter(function (f) { return f.id !== id; });
    save("artrt.findings", STATE.findings);
    updateFindingsCount();
    renderTray();
  }
  function updateFindingsCount() { $("#findings-count").textContent = STATE.findings.length; }

  function renderTray() {
    var list = $("#tray-list");
    list.innerHTML = "";
    if (!STATE.findings.length) {
      list.innerHTML = "<p class='muted'>No findings yet. Open a technique and click <strong>Add to findings</strong>.</p>";
      return;
    }
    STATE.findings.forEach(function (f) {
      var item = el("div", "tray-item");
      item.innerHTML = "<div><strong>" + esc(f.id) + "</strong> — " + esc(f.name) +
        "<div class='meta'>" + esc(domainName(f.domain)) + " · " + esc(phaseName(f.phase)) + "</div></div>";
      var btn = el("button", null, "×");
      btn.title = "Remove";
      btn.addEventListener("click", function () { removeFinding(f.id); });
      item.appendChild(btn);
      list.appendChild(item);
    });
  }

  function findingsMarkdown() {
    var fwLine = function (f) {
      var parts = [];
      if ((f.frameworks.attack || []).length) parts.push("ATT&CK: " + f.frameworks.attack.join(", "));
      if ((f.frameworks.atlas || []).length) parts.push("ATLAS: " + f.frameworks.atlas.join(", "));
      if ((f.frameworks.owasp || []).length) parts.push("OWASP: " + f.frameworks.owasp.join(", "));
      if ((f.frameworks.owaspLlm || []).length) parts.push("OWASP LLM: " + f.frameworks.owaspLlm.join(", "));
      if ((f.frameworks.nist || []).length) parts.push("NIST AI RMF: " + f.frameworks.nist.join(", "));
      return parts.join(" · ") || "—";
    };
    var out = "# Red Team Findings Draft\n\n" +
      "> Authorized engagement only. Complete severity, evidence (defanged, no secrets), and status before sharing.\n\n";
    STATE.findings.forEach(function (f, i) {
      out += "## " + (i + 1) + ". [" + f.id + "] " + f.name + "\n" +
        "- **Severity:** _TBD (Critical | High | Medium | Low | Info)_\n" +
        "- **Domain:** " + domainName(f.domain) + "\n" +
        "- **Kill-chain phase:** " + phaseName(f.phase) + "\n" +
        "- **Framework mapping:** " + fwLine(f) + "\n" +
        "- **Description:** " + f.description + "\n" +
        "- **Impact:** _TBD_\n" +
        "- **Evidence:** _TBD (defanged; no secrets or customer data)_\n" +
        "- **Recommendation:** " + f.recommendation + "\n" +
        "- **References:** " + (f.references || []).map(function (r) {
          return "[" + r + "](" + refUrl(r) + ")";
        }).join(", ") + "\n" +
        "- **Status:** Open\n\n";
    });
    return out;
  }

  function exportMarkdown() {
    if (!STATE.findings.length) { toast("No findings to export"); return; }
    var blob = new Blob([findingsMarkdown()], { type: "text/markdown" });
    var a = el("a");
    a.href = URL.createObjectURL(blob);
    a.download = "redteam-findings-draft.md";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(a.href);
    toast("Exported Markdown");
  }
  function copyMarkdown() {
    if (!STATE.findings.length) { toast("No findings to copy"); return; }
    var text = findingsMarkdown();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied to clipboard"); },
        function () { fallbackCopy(text); });
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    var ta = el("textarea"); ta.value = text; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); toast("Copied"); } catch (e) { toast("Copy failed"); }
    ta.remove();
  }

  /* ---------- filters / chips ---------- */
  function buildChips(containerSel, items, set, labelFn, valFn) {
    var c = $(containerSel);
    c.innerHTML = "";
    items.forEach(function (it) {
      var val = valFn(it);
      var chip = el("button", "chip", esc(labelFn(it)));
      if (set.has(val)) chip.classList.add("active");
      chip.addEventListener("click", function () {
        if (set.has(val)) { set.delete(val); chip.classList.remove("active"); }
        else { set.add(val); chip.classList.add("active"); }
        renderGrid();
      });
      c.appendChild(chip);
    });
  }

  function buildFilters() {
    buildChips("#filter-domains", DATA.mappings.domains, STATE.domains,
      function (d) { return d.name; }, function (d) { return d.id; });
    var phases = DATA.mappings.phases.slice().sort(function (a, b) { return a.order - b.order; });
    buildChips("#filter-phases", phases, STATE.phases,
      function (p) { return p.name; }, function (p) { return p.id; });
    buildChips("#filter-frameworks", DATA.mappings.frameworks, STATE.frameworks,
      function (f) { return f.name; }, function (f) { return f.id; });
  }

  /* ---------- overlay / drawers ---------- */
  function showOverlay() { $("#overlay").classList.remove("hidden"); }
  function closeAll() {
    $("#drawer").classList.add("hidden");
    $("#tray").classList.add("hidden");
    $("#overlay").classList.add("hidden");
  }

  /* ---------- wiring ---------- */
  function wire() {
    $("#search").addEventListener("input", function (e) {
      STATE.search = e.target.value.trim().toLowerCase();
      renderGrid();
    });
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("active"); });
        tab.classList.add("active");
        STATE.view = tab.getAttribute("data-view");
        $("#filter-phases").parentElement.style.display = STATE.view === "tools" ? "none" : "";
        $("#filter-frameworks").parentElement.style.display = STATE.view === "tools" ? "none" : "";
        renderGrid();
      });
    });
    $("#clear-filters").addEventListener("click", function () {
      STATE.domains.clear(); STATE.phases.clear(); STATE.frameworks.clear();
      buildFilters(); renderGrid();
    });
    $("#findings-btn").addEventListener("click", function () {
      renderTray(); showOverlay(); $("#tray").classList.remove("hidden");
    });
    $("#drawer-close").addEventListener("click", closeAll);
    $("#tray-close").addEventListener("click", closeAll);
    $("#overlay").addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    $("#export-md").addEventListener("click", exportMarkdown);
    $("#copy-md").addEventListener("click", copyMarkdown);
    $("#clear-findings").addEventListener("click", function () {
      if (!STATE.findings.length) return;
      if (confirm("Clear all findings?")) {
        STATE.findings = []; save("artrt.findings", STATE.findings);
        updateFindingsCount(); renderTray();
      }
    });
  }

  /* ---------- boot ---------- */
  Promise.all([
    fetchJSON("techniques.json"),
    fetchJSON("tools.json"),
    fetchJSON("mappings.json")
  ]).then(function (res) {
    DATA.techniques = res[0].techniques || [];
    DATA.tools = res[1].tools || [];
    DATA.mappings = res[2];
    DATA.refs = res[2].references || {};
    buildFilters();
    wire();
    updateFindingsCount();
    renderGrid();
    $("#data-status").textContent =
      DATA.techniques.length + " techniques · " + DATA.tools.length + " tools loaded";
  }).catch(function (err) {
    $("#data-status").textContent = "Failed to load data — serve from repo root or via deploy/.";
    $("#grid").innerHTML =
      "<div class='empty'>Could not load <code>data/*.json</code>.<br/>" +
      "Run from the repo root: <code>python3 -m http.server 8080</code> then open " +
      "<code>http://localhost:8080/ui/</code>, or use Docker (<code>deploy/</code>).<br/><br/>" +
      esc(String(err)) + "</div>";
  });
})();
