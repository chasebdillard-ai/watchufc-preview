/* WatchUFC: UFC (default home) + PFL, Bellator MMA, Invicta FC and Power Slap hubs. Each hub: home rails, events, years, type hubs, search, in-page player, Continue Watching.
   UFC data is inlined (#data, short keys). Hub catalogs are separate JSON files fetched lazily the first time a hub opens (keeps the iPhone page slim). */
(function () {
  "use strict";
  var doc = document, main = doc.getElementById("main");
  var UFCRAW = {};
  try { UFCRAW = JSON.parse(doc.getElementById("data").textContent || "{}"); } catch (e) { UFCRAW = {}; }
  doc.getElementById("data").textContent = ""; // free the string
  var VER = window.HUB_VER || {};

  var TN = { E: "Full Event", F: "Full Fight", P: "Press Conference", W: "Weigh-ins & Faceoffs", I: "Interview & Media Day", D: "Embedded & Docs", H: "Highlights & Recaps", O: "More" };
  var TPL = { E: "Full Events", F: "Full Fights & Free Fights", P: "Press Conferences", W: "Weigh-ins & Faceoffs", I: "Interviews & Media Day", D: "Embedded, Countdown & Docs", H: "Highlights & Recaps", O: "More Videos" };
  var TORDER = ["E", "F", "P", "W", "I", "D", "H", "O"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- promotions ---------- */
  var HUBS = {
    ufc: { key: "ufc", name: "UFC", numP: "UFC", numbered: true, hero: "hero.jpg", logo: "", cw: "ufc_cw", file: "",
      eyebrow: "Walk out. Lights up. Fight.", h1: "Enter the <b>Octagon</b>", cage: "in the Octagon",
      pitch: "Every official UFC upload on YouTube, in one arena: full events, free fights, press conferences, weigh-ins and the stories behind them.",
      kinds: { num: "Numbered Event", fn: "Fight Night", espn: "UFC on ESPN", fox: "UFC on Fox", abc: "UFC on ABC", fx: "UFC on FX", fuel: "UFC on Fuel TV", live: "UFC Live", tuf: "TUF Finale", dwcs: "Contender Series", bjj: "UFC BJJ", para: "UFC on Paramount+" },
      lists: [{ id: "fightnights", chip: "Fight Nights & TV", title: "Fight <em>Nights</em> & TV", sub: "Fight Nights and UFC on Fox, ESPN, ABC, FX and Fuel TV", ks: ["fn", "espn", "fox", "abc", "fx", "fuel", "live", "para"] },
              { id: "series", chip: "Contender Series, TUF & BJJ", title: "Contender Series, <em>TUF</em> & BJJ", sub: "Dana White's Contender Series, The Ultimate Fighter finales and UFC BJJ", ks: ["tuf", "dwcs", "bjj"] }],
      railNum: "Numbered Events", railList: "Fight Nights", search: "Fighters, events, years…", searchEx: "an event like “UFC 300”",
      foot: "WatchUFC is a personal index of videos UFC publishes on its official YouTube channels. Videos play from YouTube. Not affiliated with or endorsed by UFC." },
    pfl: { key: "pfl", name: "PFL", numP: "PFL", numbered: false, hero: "pfl_hero.jpg", logo: "logo-pfl.png", cw: "ufc_cw_pfl", file: "pfl.json",
      eyebrow: "Regular Season. Playoffs. Championship.", h1: "The <b>League</b> of MMA", cage: "in the SmartCage",
      pitch: "Every official PFL upload on YouTube: full events, free fights, press conferences, weigh-ins and fight-week docs, organized by season like a real sports league, plus PFL Europe, MENA and Africa.",
      kinds: { season: "Regular Season", playoff: "Playoffs", champ: "Championship", europe: "PFL Europe", mena: "PFL MENA", africa: "PFL Africa", super: "Super Fights", pvb: "PFL vs Bellator", champs: "Champions Series", challenger: "Challenger Series", tent: "Global Fight Night", wsof: "WSOF (PFL origins)" },
      lists: [{ id: "global", chip: "Global Cards & Champions Series", title: "Global <em>Cards</em>", sub: "PFL city cards, Champions Series, Super Fights and PFL vs Bellator", ks: ["tent", "champs", "super", "pvb"] },
              { id: "regional", chip: "Europe, MENA & Africa", title: "PFL <em>Europe</em>, MENA & Africa", sub: "PFL's regional leagues", ks: ["europe", "mena", "africa"] },
              { id: "challenger", chip: "Challenger Series", title: "Challenger <em>Series</em>", sub: "PFL Challenger Series seasons", ks: ["challenger"] },
              { id: "wsof", chip: "WSOF Archive", title: "WSOF <em>Archive</em>", sub: "World Series of Fighting (2012–2017), the promotion that became the PFL", ks: ["wsof"] }],
      railNum: "Seasons", railList: "Global Cards", search: "PFL fighters, seasons, events…", searchEx: "a season like “2023 PFL”",
      foot: "WatchUFC's PFL hub is a personal index of videos PFL publishes on its official YouTube channels (PFL MMA, PFL Europe, PFL MENA, PFL Africa). Videos play from YouTube. Not affiliated with or endorsed by PFL." },
    bellator: { key: "bellator", name: "Bellator", numP: "Bellator", numbered: true, hero: "bellator_hero.jpg", logo: "logo-bellator.png", cw: "ufc_cw_bellator", file: "bellator.json",
      eyebrow: "Black. Red. Unbreakable.", h1: "Welcome to <b>Bellator</b>", cage: "in the Bellator cage",
      pitch: "Every official Bellator MMA upload on YouTube: Bellator 1 to 300+, the Champions Series, Japan, Paris and Dublin cards, full fights, press conferences and weigh-ins.",
      kinds: { num: "Numbered Event", champs: "Champions Series", japan: "Bellator Japan", europe: "Bellator Europe", special: "Special Event", kick: "Bellator Kickboxing" },
      lists: [{ id: "champs", chip: "Champions Series, Japan & Europe", title: "Champions <em>Series</em> & Tours", sub: "Bellator Champions Series, Japan (Rizin), Paris, Dublin, London and more", ks: ["champs", "japan", "europe", "special", "kick"] }],
      railNum: "Numbered Events", railList: "Champions Series & Tours", search: "Bellator fighters, events, years…", searchEx: "an event like “Bellator 300”",
      foot: "WatchUFC's Bellator hub is a personal index of videos Bellator MMA publishes on its official YouTube channel. Videos play from YouTube. Not affiliated with or endorsed by Bellator or PFL." },
    invicta: { key: "invicta", name: "Invicta FC", numP: "Invicta FC", numbered: true, hero: "invicta_hero.jpg", logo: "logo-invicta.png", cw: "ufc_cw_invicta", file: "invicta.json",
      eyebrow: "The home of women's MMA", h1: "Rise <b>Invicta</b>", cage: "in the Invicta cage",
      pitch: "Every official Invicta FC upload on YouTube: every numbered card from Invicta FC 1, the Phoenix Series, full fights and the champions who went on to rule the sport.",
      kinds: { num: "Numbered Event", phoenix: "Phoenix Series", special: "Special Event" },
      lists: [{ id: "phoenix", chip: "Phoenix Series & Specials", title: "Phoenix <em>Series</em>", sub: "Invicta's Phoenix Series, Phoenix Tournament and special cards", ks: ["phoenix", "special"] }],
      railNum: "Numbered Events", railList: "Phoenix Series", search: "Invicta fighters, events, years…", searchEx: "an event like “Invicta FC 50”",
      foot: "WatchUFC's Invicta FC hub is a personal index of videos Invicta Fighting Championships publishes on its official YouTube channel. Videos play from YouTube. Not affiliated with or endorsed by Invicta FC." },
    powerslap: { key: "powerslap", name: "Power Slap", numP: "Power Slap", numbered: true, hero: "powerslap_hero.jpg", logo: "logo-powerslap.png", cw: "ufc_cw_powerslap", file: "powerslap.json",
      eyebrow: "Power. Technique. Resolve.", h1: "Step up to the <b>Table</b>", cage: "at the Power Slap table", ff: "Full Matches",
      tn: { F: "Full Match", E: "Full Event / Episode", D: "All Access & Docs" }, tpl: { F: "Full Matches & Free Matches", E: "Full Events & Episodes", D: "All Access, Origins & Docs" },
      pitch: "Every official Power Slap upload on YouTube: every numbered card from Power Slap 1, Road to the Title, full matches, press conferences, weigh-ins and faceoffs.",
      kinds: { num: "Numbered Event", rtt: "Road to the Title" },
      lists: [{ id: "rtt", chip: "Road to the Title", title: "Road to the <em>Title</em>", sub: "Power Slap's reality series: Season 1 on TBS (2023), Seasons 2 and 3 on Rumble", ks: ["rtt"] }],
      railNum: "Numbered Events", railList: "Road to the Title", search: "Power Slap strikers, events, years…", searchEx: "an event like “Power Slap 12”",
      foot: "WatchUFC's Power Slap hub is a personal index of videos Power Slap publishes on its official YouTube channel (@powerslap). Videos play from YouTube. Not affiliated with or endorsed by Power Slap." },
    rizin: { key: "rizin", name: "RIZIN", numP: "RIZIN", numbered: true, hero: "rizin_hero.jpg", logo: "logo-rizin.png", cw: "ufc_cw_rizin", file: "rizin.json",
      eyebrow: "超 · Japan's fight festival", h1: "This is <b>RIZIN</b>", cage: "in the RIZIN ring",
      pitch: "Every official RIZIN FIGHTING FEDERATION upload on YouTube: hundreds of full fights from RIZIN.1 to RIZIN.55, Super RIZIN, LANDMARK and the New Year's Eve cards, plus press conferences, weigh-ins, faceoffs and post-fight interviews.",
      kinds: { num: "Numbered Event", super: "Super RIZIN", landmark: "RIZIN LANDMARK", trigger: "RIZIN TRIGGER", gp: "World Grand Prix", special: "Special Event" },
      lists: [{ id: "landmark", chip: "Super RIZIN, LANDMARK & Grand Prix", title: "Super RIZIN & <em>LANDMARK</em>", sub: "Super RIZIN, the LANDMARK series, TRIGGER, the World Grand Prix years and special cards", ks: ["super", "landmark", "trigger", "gp", "special"] }],
      railNum: "Numbered Events", railList: "Super RIZIN & LANDMARK", search: "RIZIN fighters, events, years…", searchEx: "an event like “RIZIN.45”",
      foot: "WatchUFC's RIZIN hub is a personal index of videos RIZIN FIGHTING FEDERATION publishes on its official YouTube channel (@RIZIN_FF). Videos play from YouTube. Some titles are in Japanese. Not affiliated with or endorsed by RIZIN." },
    pride: { key: "pride", name: "PRIDE", numP: "PRIDE", numbered: true, hero: "pride_hero.jpg", logo: "logo-pride.png", cw: "ufc_cw_pride", file: "pride.json",
      eyebrow: "PRIDE never die", h1: "The legend of <b>PRIDE</b>", cage: "in the PRIDE ring",
      pitch: "PRIDE Fighting Championships as UFC and UFC FIGHT PASS publish it on their official YouTube channels: full event replays, full fights, Grand Prix nights, Bushido and Shockwave classics from 1997 to 2007.",
      kinds: { num: "Numbered Event", gp: "Grand Prix", bushido: "Bushido", nye: "Shockwave & New Year's Eve", special: "Special Event" },
      lists: [{ id: "gp", chip: "Grand Prix, Bushido & Shockwave", title: "Grand Prix, <em>Bushido</em> & Shockwave", sub: "Final Conflict, Total Elimination, Critical Countdown, Bushido and the New Year's Eve cards", ks: ["gp", "bushido", "nye", "special"] }],
      railNum: "Numbered Events", railList: "Grand Prix & Bushido", search: "PRIDE fighters, events, years…", searchEx: "an event like “PRIDE 33”",
      foot: "WatchUFC's PRIDE hub is a personal index of PRIDE videos that UFC and UFC FIGHT PASS publish on their official YouTube channels (UFC owns the PRIDE library). Videos play from YouTube. Not affiliated with or endorsed by UFC." }
  };
  var HORDER = ["ufc", "pfl", "bellator", "invicta", "powerslap", "rizin", "pride"];
  var HUB = HUBS.ufc, CACHE = {}, ACTIVE = "";

  /* ---------- data model (swapped per hub) ---------- */
  var CHN, E, V, GEN, BYNUM, MAXNUM, byType, YEARS, IDX, QI;
  var TODAY = new Date().toISOString().slice(0, 10);
  var ALTLANG = /^\W*(arabic|french|hindi|russian|serbian|spanish|portuguese|chinese|german|italian|turkish|japanese|korean|indonesian) stream\b|subtitles|\bchoques?\b|\blutas?\b|trilog[ií]a|confronto|t[ií]tulo|[\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u3040-\u30ff\u4e00-\u9fff]/i; // Power Slap's foreign-language feeds go after the English one
  function newest(a, b) { return b.u - a.u || a.i - b.i; }
  function oldest(a, b) { return (a.y || 9999) - (b.y || 9999) || a.u - b.u || a.i - b.i; }
  function model(raw) {
    // video: [id, title, minutes, type, eventIdx, year, channelIdx, upload yymmdd]
    var m = { CHN: raw.c || [], GEN: raw.g || "" };
    m.V = (raw.v || []).map(function (r, i) { return { id: r[0], t: r[1], m: r[2], ty: r[3], e: r[4], y: r[5], c: r[6], u: r[7], i: i }; });
    m.E = (raw.e || []).map(function (r, i) { return { i: i, n: r[0], d: r[1], k: r[2], num: r[3], loc: r[4] || "", v: [] }; });
    m.V.forEach(function (v) { if (v.e >= 0 && m.E[v.e]) m.E[v.e].v.push(v); });
    m.BYNUM = {}; m.MAXNUM = 0;
    m.E.forEach(function (e) { if (e.num) { m.BYNUM[e.num] = e; if (e.d && e.d <= TODAY && e.num > m.MAXNUM) m.MAXNUM = e.num; } });
    m.byType = {}; TORDER.forEach(function (k) { m.byType[k] = []; });
    m.V.sort(newest); m.V.forEach(function (v, i) { v.i = i; (m.byType[v.ty] || m.byType.O).push(v); });
    m.E.forEach(function (e) { e.v.sort(function (a, b) { return (ALTLANG.test(a.t) ? 1 : 0) - (ALTLANG.test(b.t) ? 1 : 0) || a.i - b.i; }); });
    m.YEARS = {}; m.V.forEach(function (v) { if (v.y) (m.YEARS[v.y] = m.YEARS[v.y] || []).push(v); });
    m.IDX = {}; m.V.forEach(function (v) { m.IDX[v.id] = v; });
    m.QI = null;
    return m;
  }
  function useHub(key) {
    var m = CACHE[key]; HUB = HUBS[key]; ACTIVE = key;
    CHN = m.CHN; E = m.E; V = m.V; GEN = m.GEN; BYNUM = m.BYNUM; MAXNUM = m.MAXNUM; byType = m.byType; YEARS = m.YEARS; IDX = m.IDX; QI = m.QI;
    doc.body.className = "hub-" + key;
    var tc = doc.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", { ufc: "#070707", pfl: "#050505", bellator: "#080606", invicta: "#0a0709", powerslap: "#02030a", rizin: "#050505", pride: "#070303" }[key]);
    var T0 = { E: "Full Event", F: "Full Fight", D: "Embedded & Docs" }, P0 = { E: "Full Events", F: "Full Fights & Free Fights", D: "Embedded, Countdown & Docs" };
    ["E", "F", "D"].forEach(function (k) { TN[k] = (HUB.tn && HUB.tn[k]) || T0[k]; }); ["E", "F", "D"].forEach(function (k) { TPL[k] = (HUB.tpl && HUB.tpl[k]) || P0[k]; });
    doc.title = key === "ufc" ? "WatchUFC" : "WatchUFC · " + HUB.name;
    var ht = doc.getElementById("hubtag");
    ht.innerHTML = HUB.logo ? '<img src="' + HUB.logo + '" alt="' + HUB.name + '" />' : ""; ht.hidden = !HUB.logo;
    ht.setAttribute("href", "#" + key);
    sIn.placeholder = HUB.search; sIn.setAttribute("aria-label", "Search every " + HUB.name + " video");
    doc.getElementById("foottxt").textContent = HUB.foot;
    doc.getElementById("gen").textContent = GEN ? "Catalog updated " + GEN.slice(0, 4) + "-" + GEN.slice(4, 6) + "-" + GEN.slice(6, 8) + "." : "";
    [].forEach.call(doc.querySelectorAll(".tab[data-tab]"), function (t) { t.setAttribute("href", L(t.getAttribute("data-h"))); });
  }
  function L(h) { if (HUB.key === "ufc") return h; var r = h.replace(/^#/, ""); return "#" + HUB.key + (r && r !== "home" ? "/" + r : ""); }
  function fixLinks(root) {
    if (HUB.key === "ufc" || !root) return;
    [].forEach.call(root.querySelectorAll('a[href^="#"]'), function (a) {
      var h = a.getAttribute("href"); if (a.hasAttribute("data-hub") || /^#(pfl|bellator|invicta|powerslap|rizin|pride|live)\b/.test(h)) return;
      a.setAttribute("href", L(h));
    });
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function thumb(id, q) { return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/" + (q || "mqdefault") + ".jpg"; }
  function hm(m) { m = m || 0; var h = Math.floor(m / 60), r = m % 60; return h ? h + "h" + (r ? " " + r + "m" : "") : r + "m"; }
  function fdate(d) { if (!d) return ""; var p = d.split("-"); return MON[+p[1] - 1] + " " + (+p[2]) + ", " + p[0]; }
  function n(x) { return Number(x).toLocaleString("en-US"); }
  function plural(k, one, many) { return n(k) + " " + (k === 1 ? one : (many || one + "s")); }
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function evShort(e) {
    var m;
    if (HUB.key === "ufc") { m = e.n.match(/^UFC (\d+)(?::\s*(.+))?$/); return m ? { a: "UFC " + m[1], b: m[2] || "" } : { a: e.n.replace(/^UFC Fight Night:\s*/, "Fight Night: "), b: "" }; }
    if (e.num) { m = e.n.match(new RegExp("^" + reEsc(HUB.numP) + " (\\d+)(?::\\s*(.+))?$")); return m ? { a: HUB.numP + " " + m[1], b: m[2] || "" } : { a: e.n, b: "" }; }
    m = e.n.match(/^Power Slap: (Road to the Title) Season (\d)$/); if (m) return { a: m[1] + " S" + m[2], b: "Season " + m[2] + (e.loc ? " · " + e.loc : "") };
    m = e.n.match(/^(\d{4}) (PFL(?: Europe| MENA| Africa)? \d+)$/); if (m) return { a: m[2], b: m[1] + " " + (HUB.kinds[e.k] || "") };
    m = e.n.match(/^WSOF ?(\d+):\s*(.+)$/); if (m) return { a: "WSOF " + m[1], b: m[2] };
    m = e.n.match(/^([^:]+):\s*(.+)$/); if (m) return { a: m[1], b: m[2] };
    return { a: e.n, b: "" };
  }
  function evBig(e) { // [small label, big number] for tiles
    if (e.num) return [HUB.numP, e.num];
    var m = e.n.match(/^(\d{4}) PFL((?: Europe| MENA| Africa)?) (\d+)$/); if (m) return ["PFL" + m[2] + " · " + m[1], m[3]];
    m = e.n.match(/^(?:PFL|Bellator) Champions Series (\d+)$/); if (m) return ["Champions Series", m[1]];
    m = e.n.match(/^Phoenix Series (\d+)$/); if (m) return ["Phoenix Series", m[1]];
    m = e.n.match(/^Power Slap: Road to the Title Season (\d)$/); if (m) return ["Road to the Title", "S" + m[1]];
    m = e.n.match(/^WSOF ?(\d+)\b/); if (m) return ["WSOF", m[1]];
    return null;
  }
  function evThumb(e) {
    if (!e.v.length) return "";
    var pick = null;
    ["E", "P", "W", "F", "D", "I", "H", "O"].some(function (t) { pick = e.v.filter(function (v) { return v.ty === t; })[0]; return !!pick; });
    return thumb((pick || e.v[0]).id, "hqdefault");
  }
  function past(e) { return e.d && e.d <= TODAY; }
  function listFor(k) { var r = null; HUB.lists.forEach(function (l) { if (l.ks.indexOf(k) >= 0) r = l; }); return r; }

  /* ---------- contexts for Up next ---------- */
  var CTX = {}, CTXN = 0;
  function ctx(list) { var k = "c" + (++CTXN); CTX[k] = list; return k; }
  var PLAY = '<svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
  function card(v, cx, pos, o) {
    o = o || {};
    var e = v.e >= 0 ? E[v.e] : null, meta = [];
    if (!o.noEv && e) meta.push(evShort(e).a);
    meta.push(TN[v.ty]);
    if (v.y && !o.noYear) meta.push(v.y);
    var tag = v.ty === "E" ? '<span class="tag">' + (HUB.key === "powerslap" && /road to the title|camino al/i.test(v.t) ? "Full Episode" : "Full Event") + "</span>" : v.ty === "F" ? '<span class="tag tag--gold">' + TN.F + "</span>" : "";
    return '<button class="card' + (o.playing ? " is-playing" : "") + '" type="button" data-cx="' + cx + '" data-pos="' + pos + '" aria-label="' + esc("Play " + v.t + ", " + hm(v.m)) + '">' +
      '<span class="thumb"><img src="' + thumb(v.id) + '" alt="" loading="lazy" decoding="async" />' + (o.pin ? '<span class="tag tag--dark">' + esc(o.pin) + "</span>" : tag) +
      '<span class="dur">' + hm(v.m) + "</span></span><b>" + esc(v.t) + "</b><small>" + esc(meta.join(" · ")) + "</small></button>";
  }
  function cards(list, o) { var k = ctx(list); return list.map(function (v, i) { return card(v, k, i, o); }).join(""); }
  function evTile(e) {
    var s = evShort(e), th = evThumb(e), big = evBig(e);
    return '<button class="ev' + (e.v.length ? "" : " ev--none") + '" type="button" data-ev="' + e.i + '" aria-label="' + esc(e.n + ", " + fdate(e.d) + ", " + plural(e.v.length, "video")) + '">' +
      (th ? '<img src="' + th + '" alt="" loading="lazy" decoding="async" />' : "") +
      (big ? '<span class="ev__num"><em>' + esc(big[0]) + "</em>" + big[1] + "</span>" : "") +
      '<span class="ev__name">' + esc(big ? (s.b || (e.num ? "" : HUB.kinds[e.k] || "")) : s.a + (s.b ? ": " + s.b : "")) + "</span>" +
      '<span class="ev__meta">' + esc([e.d ? e.d.slice(0, 4) : "", e.v.length ? plural(e.v.length, "video") : "No uploads yet"].filter(Boolean).join(" · ")) + "</span></button>";
  }
  function sec(title, inner, moreHref, extra) {
    if (!inner && !extra) return "";
    return '<section class="sec"><div class="shead"><h2 class="h2">' + esc(title) + "</h2>" + (moreHref ? '<a class="more" href="' + moreHref + '">See all</a>' : "") + "</div>" + (extra || "") + inner + "</section>";
  }
  function rail(list, o) { return list.length ? '<div class="rail">' + cards(list, o) + "</div>" : ""; }

  /* ---------- batched grid (keeps DOM small on iPhone) ---------- */
  var BATCH = 36, pending = [];
  function batched(el, list, o) {
    var k = ctx(list), shown = 0, btn = doc.createElement("button");
    btn.className = "loadmore"; btn.type = "button";
    var grid = doc.createElement("div"); grid.className = "grid";
    el.appendChild(grid); el.appendChild(btn);
    function more() {
      var end = Math.min(list.length, shown + BATCH), h = "";
      for (var i = shown; i < end; i++) h += card(list[i], k, i, o);
      grid.insertAdjacentHTML("beforeend", h); shown = end;
      btn.hidden = shown >= list.length; btn.textContent = "Load more · " + n(list.length - shown) + " left";
    }
    btn.addEventListener("click", more); more();
    if (!list.length) grid.innerHTML = '<p class="empty">Nothing here yet.</p>';
    if ("IntersectionObserver" in window) {
      var ob = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting && !btn.hidden && btn.isConnected) more(); }); }, { rootMargin: "0px 0px 700px 0px" });
      ob.observe(btn); pending.push(ob);
    }
  }
  function clearObs() { pending.forEach(function (o) { try { o.disconnect(); } catch (e) {} }); pending = []; CTX = {}; CTXN = 0; }

  /* ---------- Continue Watching (this device, localStorage per hub: "ufc_cw", "ufc_cw_pfl", …) ---------- */
  function cwLoad() { try { var a = JSON.parse(localStorage.getItem(HUB.cw) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function cwSave(a) { try { localStorage.setItem(HUB.cw, JSON.stringify(a.slice(0, 20))); } catch (e) {} }
  function cwRecord(v) { var a = cwLoad(), old = null; a = a.filter(function (x) { if (x.id === v.id) { old = x; return false; } return true; }); a.unshift({ id: v.id, ts: Date.now(), prog: old ? old.prog || 0 : 0, dur: old && old.dur ? old.dur : v.m * 60 }); cwSave(a); }
  function cwProgress(key, id, t, d) {
    var k = HUBS[key].cw, a; try { a = JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { a = []; }
    var ch = false; a.forEach(function (x) { if (x.id === id) { if (d > 0) x.dur = Math.round(d); x.prog = d > 0 && t > d - 30 ? 0 : Math.round(t); ch = true; } });
    if (ch) try { localStorage.setItem(k, JSON.stringify(a.slice(0, 20))); } catch (e) {}
  }
  function cwStart(id) { var a = cwLoad(); for (var i = 0; i < a.length; i++) if (a[i].id === id) { var x = a[i]; if (!x.prog || x.prog <= 10 || (x.dur && x.prog >= x.dur - 30)) return 0; return x.prog; } return 0; }
  function cwRow() {
    var a = cwLoad().filter(function (x) { return IDX[x.id]; });
    if (!a.length) return "";
    var list = a.map(function (x) { return IDX[x.id]; }), k = ctx(list);
    return '<section class="sec" id="cw"><div class="shead"><h2 class="h2">Continue Watching</h2></div><div class="rail">' + a.map(function (x, i) {
      var v = IDX[x.id], d = x.dur || v.m * 60, pct = x.prog && d ? Math.max(3, Math.min(100, Math.round(x.prog / d * 100))) : 0;
      var h = card(v, k, i);
      if (pct) h = h.replace('<span class="dur">', '<span style="position:absolute;left:0;right:0;bottom:0;height:5px;background:#ffffff40"><span class="cwbar" style="display:block;height:100%;width:' + pct + '%"></span></span><span class="dur" style="bottom:11px">');
      return '<div style="position:relative">' + h + '<button type="button" data-cwx="' + esc(x.id) + '" aria-label="Remove from Continue Watching" style="position:absolute;top:6px;right:6px;width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:#000c;color:#fff;font:700 16px/1 sans-serif;cursor:pointer;padding:0">×</button></div>';
    }).join("") + "</div></section>";
  }
  var cwStop = function () {};
  function cwWatch(f, id) {
    var T = -1, D = 0, heard = false, saved = -1, key = HUB.key;
    function ping() { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*"); } catch (x) {} }
    function onMsg(ev) {
      if (!f.contentWindow || ev.source !== f.contentWindow) return;
      var m = ev.data; if (typeof m === "string") { try { m = JSON.parse(m); } catch (x) { return; } }
      if (!m || !m.info) return; heard = true;
      if (typeof m.info.currentTime === "number") T = m.info.currentTime;
      if (typeof m.info.duration === "number" && m.info.duration > 0) D = m.info.duration;
    }
    function flush() { if (T >= 0 && Math.round(T) !== saved) { saved = Math.round(T); cwProgress(key, id, T, D); } }
    function onHide() { if (doc.visibilityState === "hidden") flush(); }
    window.addEventListener("message", onMsg); f.addEventListener("load", ping);
    var p = setInterval(function () { if (!heard) ping(); }, 2000), s = setInterval(flush, 15000);
    doc.addEventListener("visibilitychange", onHide); window.addEventListener("pagehide", flush);
    return function () { flush(); clearInterval(p); clearInterval(s); window.removeEventListener("message", onMsg); doc.removeEventListener("visibilitychange", onHide); window.removeEventListener("pagehide", flush); };
  }

  /* ---------- player ---------- */
  var sheet = doc.getElementById("sheet"), stage = doc.getElementById("stage"), app = doc.getElementById("top"), lastFocus = null;
  function openPlayer(list, pos, from) {
    var v = list && list[pos]; if (!v) return;
    if (sheet.hidden) lastFocus = from || doc.activeElement;
    try { cwStop(); } catch (x) {} cwStop = function () {};
    cwRecord(v);
    var start = cwStart(v.id), org = /^https?:/.test(location.origin || "") ? location.origin : "";
    stage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + "?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1" +
      (org ? "&origin=" + encodeURIComponent(org) : "") + (start ? "&start=" + start : "") + '" title="' + esc(v.t) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    try { cwStop = cwWatch(stage.querySelector("iframe"), v.id); } catch (x) {}
    var e = v.e >= 0 ? E[v.e] : null;
    doc.getElementById("s-kick").textContent = [TN[v.ty], e ? evShort(e).a : "", CHN[v.c]].filter(Boolean).join(" · ");
    doc.getElementById("s-title").textContent = v.t;
    doc.getElementById("s-meta").textContent = [hm(v.m), v.y ? String(v.y) : "", e && e.d ? fdate(e.d) : ""].filter(Boolean).join(" · ");
    var acts = doc.getElementById("s-acts");
    acts.innerHTML = (e ? '<a class="btn btn--gold" href="#e/' + e.i + '" data-close-sheet="1">' + esc(e.num ? HUB.numP + " " + e.num + " event page" : "Event page") + "</a>" : "") +
      (v.y ? '<a class="btn btn--ghost" href="#y/' + v.y + '" data-close-sheet="1">' + v.y + "</a>" : "") +
      '<a class="btn btn--ghost" href="https://www.youtube.com/watch?v=' + encodeURIComponent(v.id) + '" target="_blank" rel="noopener">YouTube ↗</a>';
    fixLinks(acts);
    var nx = [];
    for (var i = 1; i < list.length && nx.length < 14; i++) nx.push(list[(pos + i) % list.length]);
    var sx = ctx(nx);
    doc.getElementById("s-next").innerHTML = nx.map(function (x, j) { return card(x, sx, j); }).join("");
    doc.getElementById("s-next-sec").hidden = !nx.length;
    if (sheet.hidden) {
      sheet.hidden = false; app.inert = true; doc.documentElement.style.overflow = "hidden";
      try { history.pushState({ sheet: 1 }, "", location.hash || "#home"); } catch (x) {}
      doc.getElementById("sheet-close").focus();
    }
    doc.getElementById("sheet-scroll").scrollTop = 0;
  }
  function closePlayer(fromPop) {
    if (sheet.hidden) return;
    try { cwStop(); } catch (x) {} cwStop = function () {};
    sheet.hidden = true; stage.innerHTML = ""; app.inert = false; doc.documentElement.style.overflow = "";
    if (!fromPop) { try { if (history.state && history.state.sheet) history.back(); } catch (x) {} }
    if (current === "home") { var old = doc.getElementById("cw"), html = cwRow(), sw = main.querySelector(".promos") || main.querySelector(".hero"); if (old) old.outerHTML = html; else if (html && sw) sw.insertAdjacentHTML("afterend", html); }
    if (lastFocus && lastFocus.focus && doc.contains(lastFocus)) lastFocus.focus();
  }
  doc.getElementById("sheet-close").addEventListener("click", function () { closePlayer(false); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closePlayer(false); });
  window.addEventListener("popstate", function () { if (!sheet.hidden) closePlayer(true); });

  /* ---------- views ---------- */
  var current = "home";
  function promoBar() {
    return '<nav class="promos" aria-label="Switch promotion"><span class="promos__h">Promotions</span><div class="promos__row">' + HORDER.map(function (k) {
      var h = HUBS[k], on = k === HUB.key;
      return '<a class="promo promo--' + k + '" data-hub="' + k + '" href="' + (k === "ufc" ? "#home" : "#" + k) + '"' + (on ? ' aria-current="page"' : "") + ">" +
        '<img src="' + (k === "ufc" ? "logo-ufc.png" : h.logo) + '" alt="" loading="lazy" /><span>' + esc(h.name) + "</span></a>";
    }).join("") + "</div></nav>";
  }
  function latestEvent() {
    var best = null;
    E.forEach(function (e) { if (e.v.length && past(e) && (HUB.numbered ? e.num : true) && (!best || (HUB.numbered ? e.num > best.num : e.d > best.d))) best = e; });
    return best;
  }
  function rangeStat() {
    if (HUB.numbered) return HUB.numP + " <b>1–" + MAXNUM + "</b>";
    var ys = Object.keys(seasons()).sort(); return "Seasons <b>" + ys[0] + "–" + ys[ys.length - 1] + "</b>";
  }
  function seasons() { var s = {}; E.forEach(function (e) { if (["season", "playoff", "champ"].indexOf(e.k) >= 0 && past(e)) (s[e.d.slice(0, 4)] = s[e.d.slice(0, 4)] || []).push(e); }); return s; }
  function homeView() {
    var h = "", ln = latestEvent(), fe = byType.E, nEv = E.filter(function (e) { return e.v.length; }).length;
    var feat = ln ? '<button class="feat" type="button" data-ev="' + ln.i + '"><small>' + (HUB.numbered ? "Latest numbered event" : "Latest event") + "</small><strong>" + esc(ln.n) + "</strong><span>" + esc(fdate(ln.d) + (ln.loc ? " · " + ln.loc : "") + " · " + plural(ln.v.length, "video")) + "</span></button>" : "";
    h += '<div class="hero"><img class="hero__bg" src="' + HUB.hero + '" alt="" fetchpriority="high" /><div class="hero__in">' +
      (HUB.logo ? '<img class="hero__logo" src="' + HUB.logo + '" alt="' + esc(HUB.name) + '" />' : "") +
      '<span class="eyebrow">' + esc(HUB.eyebrow) + "</span><h1>" + HUB.h1 + "</h1>" +
      "<p>" + esc(HUB.pitch) + "</p>" +
      '<div class="stats"><span class="stat"><b>' + n(V.length) + "</b> videos</span><span class=\"stat\"><b>" + n(byType.F.length) + "</b> " + (HUB.ff || "full fights").toLowerCase() + "</span><span class=\"stat\"><b>" + n(nEv) + "</b> events</span><span class=\"stat\">" + rangeStat() + "</span></div>" +
      feat + '<div class="btns">' + (ln ? '<button class="btn btn--red" type="button" data-play-ev="' + ln.i + '">' + PLAY + " Watch " + esc(ln.num ? HUB.numP + " " + ln.num : evShort(ln).a) + "</button>" : "") +
      '<a class="btn btn--ghost" href="#events">' + (HUB.numbered ? "Browse events" : "Browse seasons") + "</a></div></div></div>";
    h += promoBar();
    h += cwRow();
    h += sec("Latest", rail(V.slice(0, 20)), "#t/all");
    if (HUB.key === "powerslap") fe = fe.filter(function (v) { return !ALTLANG.test(v.t); });
    var feL = fe.filter(function (v) { return v.e >= 0; }).sort(function (a, b) { return (E[b.e].d || "") < (E[a.e].d || "") ? -1 : 1; });
    h += sec("Full Events", rail(feL.concat(fe.filter(function (v) { return v.e < 0; })).slice(0, 20)), "#t/E");
    var ff = HUB.key === "ufc" ? byType.F.filter(function (v) { return v.c <= 1 && /full fight|free fight/i.test(v.t); }) : byType.F;
    h += sec(HUB.ff || "Free Fights", rail(ff.slice(0, 20)), "#t/F");
    h += sec("Press Conferences", rail(byType.P.slice(0, 20)), "#t/P");
    if (HUB.numbered) {
      var nums = E.filter(function (e) { return e.num && e.v.length && past(e); }).sort(function (a, b) { return b.num - a.num; }).slice(0, 18);
      h += sec(HUB.railNum, '<div class="rail rail--ev">' + nums.map(evTile).join("") + "</div>", "#events");
    } else {
      var ss = seasons(), sy = Object.keys(ss).sort().reverse();
      h += sec("Seasons", '<div class="seasons">' + sy.map(function (y) {
        var L = ss[y], vids = 0; L.forEach(function (e) { vids += e.v.length; });
        var ch = L.filter(function (e) { return e.k === "champ"; })[0];
        return '<a class="season" href="#s/' + y + '"><strong>' + y + "</strong><span>" + plural(L.length, "card") + " · " + plural(vids, "video") + "</span>" + (ch ? "<em>Championship · " + esc(fdate(ch.d)) + "</em>" : "<em>Season</em>") + "</a>";
      }).join("") + "</div>", "#events");
      var champs = E.filter(function (e) { return e.k === "champ" && e.v.length; }).sort(function (a, b) { return a.d < b.d ? 1 : -1; });
      if (champs.length) h += sec("Championship Nights", '<div class="rail rail--ev">' + champs.map(evTile).join("") + "</div>", "#events");
    }
    var l0 = HUB.lists[0];
    var fns = E.filter(function (e) { return l0.ks.indexOf(e.k) >= 0 && e.v.length && past(e); }).sort(function (a, b) { return a.d < b.d ? 1 : -1; }).slice(0, 18);
    if (fns.length) h += sec(HUB.railList, '<div class="rail rail--ev">' + fns.map(evTile).join("") + "</div>", "#" + l0.id);
    if (HUB.key === "pfl") {
      var reg = E.filter(function (e) { return ["europe", "mena", "africa"].indexOf(e.k) >= 0 && e.v.length && past(e); }).sort(function (a, b) { return a.d < b.d ? 1 : -1; }).slice(0, 18);
      if (reg.length) h += sec("PFL Europe, MENA & Africa", '<div class="rail rail--ev">' + reg.map(evTile).join("") + "</div>", "#regional");
    }
    h += sec("Interviews & Media Day", rail(byType.I.slice(0, 20)), "#t/I");
    h += sec(HUB.key === "ufc" ? "Embedded & Countdown" : "Docs & Behind the Scenes", rail(byType.D.slice(0, 20)), "#t/D");
    h += sec("Weigh-ins & Faceoffs", rail(byType.W.slice(0, 20)), "#t/W");
    h += sec("Highlights & Recaps", rail(byType.H.slice(0, 20)), "#t/H");
    var yrs = Object.keys(YEARS).map(Number).sort(function (a, b) { return b - a; });
    h += sec("Browse by Year", '<div class="chips">' + yrs.map(function (y) { return '<a class="chip" href="#y/' + y + '">' + y + "<small>" + n(YEARS[y].length) + "</small></a>"; }).join("") + "</div>", "#years");
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  function evChips(on) {
    return '<div class="chips"><a class="chip" href="#events" aria-pressed="' + (on === "events") + '">' + (HUB.numbered ? "Numbered" : "Seasons") + "</a>" +
      HUB.lists.map(function (l) { return '<a class="chip" href="#' + l.id + '" aria-pressed="' + (on === l.id) + '">' + esc(l.chip) + "</a>"; }).join("") +
      '<a class="chip" href="#years">By year</a></div>';
  }
  function eventsView() {
    if (!HUB.numbered) return seasonsView();
    var nums = [], hi = MAXNUM;
    for (var i = 1; i <= hi; i++) nums.push(i);
    var has = nums.filter(function (i) { return BYNUM[i] && BYNUM[i].v.length; }).length;
    var h = '<div class="page-h"><h1 class="h1">Events by <em>Number</em></h1><p class="sub">' + esc(HUB.numP) + " 1 to " + esc(HUB.numP) + " " + hi + ". <b class=\"hl\">" + has + "</b> numbered events have official videos. Tap a number.</p></div>";
    h += evChips("events");
    var dec = {};
    nums.forEach(function (i) { var b = Math.floor((i - 1) / 50); (dec[b] = dec[b] || []).push(i); });
    Object.keys(dec).map(Number).sort(function (a, b) { return b - a; }).forEach(function (b) {
      var L = dec[b].slice().reverse();
      h += '<section class="sec"><h2 class="h2">' + esc(HUB.numP) + " " + (b * 50 + 1) + "–" + Math.min(hi, b * 50 + 50) + '</h2><div class="nums">' + L.map(function (i) {
        var e = BYNUM[i], c = e ? e.v.length : 0;
        return '<button class="num ' + (c ? "num--has" : "num--none") + '" type="button" data-ev="' + (e ? e.i : -1) + '" data-num="' + i + '" aria-label="' + esc(HUB.numP) + " " + i + (c ? ", " + plural(c, "video") : ", no official uploads") + '">' + i + (c ? "<small>" + c + "</small>" : "") + "</button>";
      }).join("") + "</div></section>";
    });
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  var SORDER = ["season", "playoff", "champ"];
  function seasonsView() {
    var ss = seasons(), sy = Object.keys(ss).sort().reverse();
    var h = '<div class="page-h"><h1 class="h1">The <em>Seasons</em></h1><p class="sub">Every PFL season from 2018: the regular season, the playoffs and the championship night, plus the global cards and regional leagues. Tap a season.</p></div>' + evChips("events");
    h += '<div class="seasons seasons--big">' + sy.map(function (y) {
      var L = ss[y], vids = 0; L.forEach(function (e) { vids += e.v.length; });
      return '<a class="season" href="#s/' + y + '"><strong>' + y + "</strong><span>" + plural(L.length, "card") + " · " + plural(vids, "video") + "</span><em>" +
        SORDER.map(function (k) { var c = L.filter(function (e) { return e.k === k; }).length; return c ? c + " " + HUB.kinds[k] : ""; }).filter(Boolean).join(" · ") + "</em></a>";
    }).join("") + "</div>";
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  function seasonView(y) {
    var L = E.filter(function (e) { return e.d && e.d.slice(0, 4) === String(y) && (e.v.length || SORDER.indexOf(e.k) >= 0) && past(e); });
    var h = '<div class="page-h"><a class="back" href="#events">‹ All seasons</a><span class="eyebrow">PFL Season</span><h1 class="h1"><em>' + y + "</em> Season</h1><p class=\"sub\">" + plural(L.length, "card") + "</p></div>";
    var groups = SORDER.concat(["challenger", "europe", "mena", "africa", "champs", "super", "pvb", "tent"]);
    groups.forEach(function (k) {
      var G = L.filter(function (e) { return e.k === k; }).sort(function (a, b) { return a.d < b.d ? -1 : 1; });
      if (G.length) h += sec(HUB.kinds[k] || k, '<div class="grid grid--ev">' + G.map(evTile).join("") + "</div>");
    });
    var vids = (YEARS[y] || []).length;
    h += '<a class="btn btn--ghost" style="justify-self:start" href="#y/' + y + '">Every ' + y + " video · " + n(vids) + "</a>";
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  function listEventsView(l) {
    var Ls = E.filter(function (e) { return e.v.length && l.ks.indexOf(e.k) >= 0; }).sort(function (a, b) { return (b.d || "") < (a.d || "") ? -1 : 1; });
    var h = '<div class="page-h"><h1 class="h1">' + l.title + '</h1><p class="sub">' + esc(l.sub) + " · " + plural(Ls.length, "event") + "</p></div>" + evChips(l.id);
    var by = {}; Ls.forEach(function (e) { var y = e.d ? e.d.slice(0, 4) : "Other"; (by[y] = by[y] || []).push(e); });
    Object.keys(by).sort().reverse().forEach(function (y) { h += '<section class="sec"><h2 class="h2">' + y + '</h2><div class="grid grid--ev">' + by[y].map(evTile).join("") + "</div></section>"; });
    if (!Ls.length) h += '<p class="empty">No videos tagged to these events yet.</p>';
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  function yearsView() {
    var yrs = Object.keys(YEARS).map(Number).sort(function (a, b) { return b - a; });
    var h = '<div class="page-h"><h1 class="h1">Browse by <em>Year</em></h1><p class="sub">' + (HUB.key === "ufc" ? "From UFC 1 in 1993 to tonight." : "Every year " + esc(HUB.name) + " has on YouTube.") + " Each year opens its events and every video from that year.</p></div><div class=\"years\">";
    h += yrs.map(function (y) {
      var evs = E.filter(function (e) { return e.d && +e.d.slice(0, 4) === y && e.v.length; }).length;
      return '<a class="yr" href="#y/' + y + '"><strong>' + y + "</strong><span>" + plural(evs, "event") + " · " + plural(YEARS[y].length, "video") + "</span></a>";
    }).join("") + "</div>";
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  function yearView(y) {
    var L = YEARS[y] || [], evs = E.filter(function (e) { return e.d && +e.d.slice(0, 4) === y && (e.v.length || e.num); }).sort(function (a, b) { return a.d < b.d ? 1 : -1; });
    var h = '<div class="page-h"><a class="back" href="#years">‹ All years</a><h1 class="h1"><em>' + y + "</em> " + esc(HUB.cage) + '</h1><p class="sub">' + plural(evs.filter(function (e) { return e.v.length; }).length, "event") + " with videos · " + plural(L.length, "video") + "</p></div>";
    if (evs.length) h += sec("Events of " + y, '<div class="grid grid--ev">' + evs.map(evTile).join("") + "</div>");
    main.innerHTML = '<div class="view">' + h + '<section class="sec"><div class="bar"><h2 class="h2">Every video from ' + y + '</h2></div><div class="chips" id="ych"></div><div id="ylist" class="sec"></div></section></div>';
    var counts = {}; L.forEach(function (v) { counts[v.ty] = (counts[v.ty] || 0) + 1; });
    var ych = doc.getElementById("ych"), cur = "all";
    function draw() {
      ych.innerHTML = ['<button class="chip" type="button" data-f="all" aria-pressed="' + (cur === "all") + '">All<small>' + n(L.length) + "</small></button>"].concat(TORDER.filter(function (t) { return counts[t]; }).map(function (t) {
        return '<button class="chip" type="button" data-f="' + t + '" aria-pressed="' + (cur === t) + '">' + esc(TPL[t]) + "<small>" + n(counts[t]) + "</small></button>";
      })).join("");
      var el = doc.getElementById("ylist"); el.innerHTML = "";
      batched(el, cur === "all" ? L : L.filter(function (v) { return v.ty === cur; }), { noYear: true });
    }
    ych.addEventListener("click", function (ev) { var b = ev.target.closest("[data-f]"); if (!b) return; cur = b.getAttribute("data-f"); draw(); });
    draw();
  }
  function eventView(i) {
    var e = E[i]; if (!e) return homeView();
    var s = evShort(e), th = evThumb(e);
    var prev = e.num ? BYNUM[e.num - 1] : null, next = e.num ? BYNUM[e.num + 1] : null;
    var lst = listFor(e.k), back = e.num || SORDER.indexOf(e.k) >= 0 ? (HUB.numbered ? ["#events", "All numbered events"] : ["#s/" + e.d.slice(0, 4), e.d.slice(0, 4) + " season"]) : lst ? ["#" + lst.id, lst.chip] : ["#events", "Events"];
    var h = '<div class="evhero">' + (th ? '<img src="' + th + '" alt="" />' : "") + '<div class="page-h"><a class="back" href="' + back[0] + '">‹ ' + esc(back[1]) + "</a>" +
      '<span class="eyebrow">' + esc(HUB.kinds[e.k] || "Event") + "</span>" +
      '<h1 class="h1">' + (e.num ? esc(HUB.numP) + " <em>" + e.num + "</em>" : esc(s.a)) + "</h1>" + (s.b ? '<p class="sub evsub">' + esc(s.b) + "</p>" : "") +
      '<p class="sub">' + esc([fdate(e.d), e.loc].filter(Boolean).join(" · ")) + " · " + plural(e.v.length, "video") + "</p>" +
      (e.v.length ? '<div class="btns"><button class="btn btn--red" type="button" data-play-ev="' + e.i + '">' + PLAY + " Play</button>" +
        (e.d ? '<a class="btn btn--ghost" href="#y/' + e.d.slice(0, 4) + '">' + e.d.slice(0, 4) + "</a>" : "") + "</div>" : "") +
      (e.num ? '<div class="btns">' + (prev ? '<a class="btn btn--ghost" href="#e/' + prev.i + '">‹ ' + esc(HUB.numP) + " " + prev.num + "</a>" : "") + (next && past(next) ? '<a class="btn btn--ghost" href="#e/' + next.i + '">' + esc(HUB.numP) + " " + next.num + " ›</a>" : "") + "</div>" : "") +
      "</div></div>";
    if (!e.v.length) h += '<p class="empty">' + esc(HUB.name) + " has no official uploads tagged to this event on YouTube yet. Try the Free Fights hub or search for the fighters.</p>";
    var g = {}; e.v.forEach(function (v) { (g[v.ty] = g[v.ty] || []).push(v); });
    TORDER.forEach(function (t) {
      if (!g[t]) return;
      var L = g[t].slice().sort(t === "F" || t === "I" ? function (a, b) { return a.u - b.u || a.i - b.i; } : newest);
      if (t === "E") L.sort(function (a, b) { return (ALTLANG.test(a.t) ? 1 : 0) - (ALTLANG.test(b.t) ? 1 : 0); }); // English feed before the dubbed ones (stable)
      h += '<section class="sec"><div class="shead"><h2 class="h2">' + esc(TPL[t]) + '</h2><span class="count"><b>' + L.length + "</b></span></div>" + (L.length > 8 ? '<div class="rail">' + cards(L, { noEv: true }) + "</div>" : '<div class="grid">' + cards(L, { noEv: true }) + "</div>") + "</section>";
    });
    main.innerHTML = '<div class="view">' + h + "</div>";
  }
  function typeView(t) {
    var L = t === "all" ? V : (byType[t] || []), dir = "new";
    var title = t === "all" ? "Everything, newest first" : TPL[t];
    var chs = {}; L.forEach(function (v) { chs[v.c] = (chs[v.c] || 0) + 1; });
    var ck = Object.keys(chs).map(Number).sort(function (a, b) { return chs[b] - chs[a]; }), cf = -1;
    var h = '<div class="page-h"><span class="eyebrow">' + esc(HUB.name) + '</span><h1 class="h1">' + esc(title) + '</h1><p class="count" id="tcount"></p></div>' +
      '<div class="chips">' + ["all"].concat(TORDER).map(function (k) { return '<a class="chip" href="#t/' + k + '" aria-pressed="' + (k === t) + '">' + esc(k === "all" ? "All" : TPL[k]) + "</a>"; }).join("") + "</div>" +
      '<div class="bar"><div class="chips" id="tch" style="margin:0;padding:0;flex:1"></div><div class="sort" id="tsort"><button type="button" data-d="new" aria-pressed="true">Newest</button><button type="button" data-d="old" aria-pressed="false">Oldest</button></div></div><div id="tlist" class="sec"></div>';
    main.innerHTML = '<div class="view">' + h + "</div>";
    function draw() {
      var X = cf < 0 ? L : L.filter(function (v) { return v.c === cf; });
      X = X.slice().sort(dir === "new" ? newest : oldest);
      doc.getElementById("tcount").innerHTML = "<b>" + n(X.length) + "</b> videos" + (cf >= 0 ? " from " + esc(CHN[cf]) : "");
      doc.getElementById("tch").innerHTML = ck.length > 1 ? ['<button class="chip" type="button" data-c="-1" aria-pressed="' + (cf < 0) + '">All channels</button>'].concat(ck.map(function (c) { return '<button class="chip" type="button" data-c="' + c + '" aria-pressed="' + (cf === c) + '">' + esc(CHN[c]) + "<small>" + n(chs[c]) + "</small></button>"; })).join("") : "";
      [].forEach.call(doc.querySelectorAll("#tsort button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-d") === dir)); });
      var el = doc.getElementById("tlist"); el.innerHTML = ""; batched(el, X);
    }
    doc.getElementById("tch").addEventListener("click", function (ev) { var b = ev.target.closest("[data-c]"); if (!b) return; cf = +b.getAttribute("data-c"); draw(); });
    doc.getElementById("tsort").addEventListener("click", function (ev) { var b = ev.target.closest("[data-d]"); if (!b) return; dir = b.getAttribute("data-d"); draw(); });
    draw();
  }
  function loadingView(k) {
    var h = HUBS[k];
    main.innerHTML = '<div class="view"><div class="hero hero--loading"><img class="hero__bg" src="' + h.hero + '" alt="" /><div class="hero__in">' + (h.logo ? '<img class="hero__logo" src="' + h.logo + '" alt="' + esc(h.name) + '" />' : "") +
      '<span class="eyebrow">Loading the ' + esc(h.name) + ' hub…</span><div class="spin" role="status" aria-label="Loading"></div></div></div></div>';
  }
  function failView(k) {
    main.innerHTML = '<div class="view"><div class="page-h"><h1 class="h1">Couldn’t load <em>' + esc(HUBS[k].name) + '</em></h1><p class="sub">Check your connection and try again.</p><div class="btns"><button class="btn btn--red" type="button" data-retry="' + k + '">Try again</button><a class="btn btn--ghost" data-hub="ufc" href="#home">UFC home</a></div></div></div>';
  }

  /* ---------- search (scoped to the open hub) ---------- */
  var sBtn = doc.getElementById("search-btn"), sRow = doc.getElementById("search-row"), sIn = doc.getElementById("search-input");
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
  function buildQ() {
    if (QI) return;
    var pre = norm(HUB.numP).replace(/ /g, "");
    QI = CACHE[HUB.key].QI = V.map(function (v) { var e = v.e >= 0 ? E[v.e] : null; return " " + norm(v.t + " " + (e ? e.n + " " + (e.num ? pre + e.num + " " + HUB.numP + " " + e.num : "") + " " + e.loc + " " + (HUB.kinds[e.k] || "") : "") + " " + (v.y || "") + " " + TN[v.ty] + " " + CHN[v.c]) + " "; });
  }
  var sT = 0;
  function runSearch() {
    var q = norm(sIn.value); if (!q) { route(); return; }
    buildQ();
    var w = q.split(" "), hits = [];
    for (var i = 0; i < V.length; i++) { var s = QI[i], ok = true; for (var j = 0; j < w.length; j++) if (s.indexOf(w[j]) < 0) { ok = false; break; } if (ok) hits.push(V[i]); }
    var evs = E.filter(function (e) { return e.v.length && w.every(function (x) { return norm(e.n + " " + e.loc + " " + (e.num ? HUB.numP + " " + e.num : "") + " " + (HUB.kinds[e.k] || "")).indexOf(x) >= 0; }); }).slice(0, 12);
    clearObs();
    main.innerHTML = '<div class="view"><div class="page-h"><span class="eyebrow">Searching ' + esc(HUB.name) + '</span><h1 class="h1">Search</h1><p class="count"><b>' + n(hits.length) + "</b> videos for “" + esc(sIn.value.trim()) + "”</p></div>" +
      (evs.length ? sec("Events", '<div class="rail rail--ev">' + evs.map(evTile).join("") + "</div>") : "") + '<div id="slist" class="sec"></div></div>';
    if (hits.length) batched(doc.getElementById("slist"), hits); else doc.getElementById("slist").innerHTML = '<p class="empty">Nothing matches. Try a fighter, ' + HUB.searchEx + ", or a year.</p>";
    fixLinks(main);
  }
  function openSearch() { sRow.hidden = false; sBtn.setAttribute("aria-expanded", "true"); sIn.focus(); }
  function closeSearch() { sRow.hidden = true; sBtn.setAttribute("aria-expanded", "false"); if (sIn.value) { sIn.value = ""; route(); } }
  sBtn.addEventListener("click", function () { if (sRow.hidden) openSearch(); else closeSearch(); });
  doc.getElementById("search-close").addEventListener("click", closeSearch);
  sIn.addEventListener("input", function () { clearTimeout(sT); sT = setTimeout(runSearch, 160); });
  sIn.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSearch(); if (e.key === "Enter") { sIn.blur(); } });

  /* ---------- hub loading ---------- */
  var LOADING = {};
  function loadHub(k, done) {
    if (CACHE[k]) return done(true);
    if (LOADING[k]) { LOADING[k].push(done); return; }
    LOADING[k] = [done];
    var url = HUBS[k].file + (VER[k] ? "?v=" + VER[k] : "");
    fetch(url, { cache: "default" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (raw) { CACHE[k] = model(raw); var cb = LOADING[k]; delete LOADING[k]; cb.forEach(function (f) { f(true); }); })
      .catch(function () { var cb = LOADING[k]; delete LOADING[k]; cb.forEach(function (f) { f(false); }); });
  }

  /* ---------- routing: #home, #events, #e/12 … for UFC; #pfl, #pfl/events, #bellator/e/12 … for hubs ---------- */
  function route() {
    clearObs();
    var h = (location.hash || "#home").slice(1), p = h.split("/"), key = "ufc";
    if (p[0] === "live") p = ["home"];
    if (HUBS[p[0]] && p[0] !== "ufc") { key = p[0]; p = p.slice(1); if (!p.length || !p[0]) p = ["home"]; }
    if (key !== ACTIVE || !CACHE[key]) {
      if (!CACHE[key]) {
        HUB = HUBS[key]; doc.body.className = "hub-" + key; loadingView(key);
        loadHub(key, function (ok) { if ((location.hash.slice(1).split("/")[0] || "home") !== key) return; if (ok) route(); else failView(key); });
        window.scrollTo(0, 0); return;
      }
      useHub(key);
    }
    var tab = "home";
    try {
      var lst = null; HUB.lists.forEach(function (l) { if (l.id === p[0]) lst = l; });
      if (p[0] === "events") { eventsView(); tab = "events"; current = "events"; }
      else if (lst) { listEventsView(lst); tab = "events"; current = "list"; }
      else if (p[0] === "s" && p[1]) { seasonView(+p[1]); tab = "events"; current = "s"; }
      else if (p[0] === "years") { yearsView(); tab = "years"; current = "years"; }
      else if (p[0] === "y" && p[1]) { yearView(+p[1]); tab = "years"; current = "y"; }
      else if (p[0] === "e" && p[1]) { eventView(+p[1]); tab = "events"; current = "e"; }
      else if (p[0] === "t" && p[1]) { typeView(p[1]); tab = p[1] === "F" ? "fights" : "home"; current = "t"; }
      else { homeView(); current = "home"; }
    } catch (err) { main.innerHTML = '<div class="view"><p class="empty">Something went wrong drawing this page.</p></div>'; if (window.console) console.error(err); }
    fixLinks(main);
    [].forEach.call(doc.querySelectorAll(".tab[data-tab]"), function (t) { if (t.getAttribute("data-tab") === tab) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current"); });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", function () { if (location.hash === "#live") return; if (sIn.value) { sIn.value = ""; sRow.hidden = true; sBtn.setAttribute("aria-expanded", "false"); } route(); });

  /* ---------- clicks ---------- */
  function playEvent(e) {
    var L = e.v.slice(), pick = null;
    ["E", "F", "P", "W", "D", "I", "H", "O"].some(function (t) { pick = L.filter(function (v) { return v.ty === t; }); return pick.length; });
    var order = []; TORDER.forEach(function (t) { L.forEach(function (v) { if (v.ty === t) order.push(v); }); });
    openPlayer(order, order.indexOf(pick[0]));
  }
  doc.addEventListener("click", function (ev) {
    var t = ev.target;
    var x = t.closest && t.closest("[data-cwx]");
    if (x) { ev.preventDefault(); ev.stopPropagation(); var id = x.getAttribute("data-cwx"); cwSave(cwLoad().filter(function (y) { return y.id !== id; })); var old = doc.getElementById("cw"); if (old) old.outerHTML = cwRow(); return; }
    var c = t.closest && t.closest("[data-cx]");
    if (c) { ev.preventDefault(); var Lc = CTX[c.getAttribute("data-cx")]; openPlayer(Lc, +c.getAttribute("data-pos"), c); return; }
    var pe = t.closest && t.closest("[data-play-ev]");
    if (pe) { ev.preventDefault(); playEvent(E[+pe.getAttribute("data-play-ev")]); return; }
    var e = t.closest && t.closest("[data-ev]");
    if (e) { ev.preventDefault(); var i = +e.getAttribute("data-ev"); if (i >= 0) location.hash = L("#e/" + i); return; }
    var rt = t.closest && t.closest("[data-retry]");
    if (rt) { ev.preventDefault(); route(); return; }
    var cs = t.closest && t.closest("[data-close-sheet]");
    if (cs) { var href = cs.getAttribute("href"); ev.preventDefault(); closePlayer(false); setTimeout(function () { location.hash = href; }, 60); return; }
    var lv = t.closest && t.closest("[data-live],#live-btn");
    if (lv) { ev.preventDefault(); if (window.__lvOpen) window.__lvOpen(); return; }
  });
  // warm the cache of a hub the moment the finger lands on its tile, so it opens instantly
  doc.addEventListener("pointerdown", function (ev) { var a = ev.target.closest && ev.target.closest("[data-hub]"); if (a && a.getAttribute("data-hub") !== "ufc") loadHub(a.getAttribute("data-hub"), function () {}); }, { passive: true });

  CACHE.ufc = model(UFCRAW); UFCRAW = null;
  useHub("ufc");
  route();
  window.UFC_TOTAL = { videos: CACHE.ufc.V.length, events: CACHE.ufc.E.length };
})();
