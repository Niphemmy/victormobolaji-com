/* ==========================================================================
   victormobolaji.com — interaction engine
   nav · scroll progress · 3D tilt · magnetic buttons · parallax ·
   scroll reveals · word rotator · count-up · forms · calendly
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- nav scroll state + progress bar ---------- */
  var nav = $(".nav");
  var bar = $(".scroll-progress");
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 8);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var drawer = $(".drawer"), scrim = $(".scrim"), toggle = $(".nav-toggle"), closeBtn = $(".drawer-close");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (toggle) toggle.addEventListener("click", function () { setDrawer(!drawer.classList.contains("open")); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setDrawer(false); });
  if (scrim) scrim.addEventListener("click", function () { setDrawer(false); });
  $$(".drawer a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* ---------- scroll reveals (.reveal, .r3d, .draw-line) ---------- */
  var revealEls = $$(".reveal, .r3d, .draw-line");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 3D tilt engine ---------- */
  if (fine && !reduce) {
    $$(".tilt").forEach(function (card) {
      var maxX = parseFloat(card.getAttribute("data-tilt-x") || "9");
      var maxY = parseFloat(card.getAttribute("data-tilt-y") || "12");
      var raf = null, rx = 0, ry = 0;
      function apply() {
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateZ(0)";
        raf = null;
      }
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        ry = (px - 0.5) * 2 * maxY;
        rx = -(py - 0.5) * 2 * maxX;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener("pointerenter", function () { card.classList.add("is-tilting"); });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        rx = ry = 0;
        card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      });
    });

    /* spotlight var for non-tilt cards */
    $$(".spotlight").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) {
    $$(".magnetic").forEach(function (btn) {
      var strength = parseFloat(btn.getAttribute("data-mag") || "0.35");
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * strength + "px," + y * strength + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------- hero portrait + badge parallax (mouse) ---------- */
  if (fine && !reduce) {
    var heroMedia = $(".hero-media");
    if (heroMedia) {
      var port = $(".hero-portrait", heroMedia);
      window.addEventListener("pointermove", function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5);
        var cy = (e.clientY / window.innerHeight - 0.5);
        if (port) port.style.transform = "rotateY(" + cx * 10 + "deg) rotateX(" + (-cy * 8) + "deg) translateZ(0)";
      }, { passive: true });
    }
  }

  /* ---------- word rotator ---------- */
  $$(".rotator").forEach(function (rot) {
    var words = $$("span", rot);
    if (words.length < 2) return;
    var i = 0;
    words[0].classList.add("active");
    if (reduce) return;
    setInterval(function () {
      var cur = words[i];
      i = (i + 1) % words.length;
      var nxt = words[i];
      cur.classList.remove("active"); cur.classList.add("out");
      nxt.classList.remove("out"); nxt.classList.add("active");
      setTimeout(function () { cur.classList.remove("out"); }, 600);
    }, 2400);
  });

  /* ---------- count-up ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window && !reduce) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c); });
    } else {
      counters.forEach(function (c) {
        c.textContent = (c.getAttribute("data-prefix") || "") + c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
      });
    }
  }

  /* ---------- accordion ---------- */
  $$(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".acc-item");
      var body = $(".acc-body", item);
      var open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      body.style.maxHeight = open ? body.scrollHeight + "px" : 0;
    });
  });

  /* ---------- Calendly popup (lazy) ---------- */
  var CAL = "https://calendly.com/victorniffy";
  function loadCalendly(cb) {
    if (window.Calendly) return cb && cb();
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true; s.onload = function () { cb && cb(); };
    document.body.appendChild(s);
  }
  $$("[data-calendly]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      loadCalendly(function () {
        if (window.Calendly) window.Calendly.initPopupWidget({ url: CAL });
      });
    });
  });
  // inline embed
  var inline = $("#calendly-inline");
  if (inline) {
    loadCalendly(function () {
      if (window.Calendly) window.Calendly.initInlineWidget({ url: CAL + "?hide_gdpr_banner=1&primary_color=d3af37", parentElement: inline });
    });
  }

  /* ---------- forms (Web3Forms POST + mailto fallback) ----------
     Set data-access on the form to a Web3Forms access key to enable real
     submission. Until then, every submit gracefully falls back to a mailto
     so nothing is ever lost. The lead magnet always delivers the checklist. */
  function serialize(form) {
    var o = {}; new FormData(form).forEach(function (v, k) { o[k] = v; }); return o;
  }
  function setStatus(form, kind, msg) {
    var box = $(".form-status", form) || $(".form-status", form.parentNode);
    if (!box) return;
    box.className = "form-status show " + kind;
    box.textContent = msg;
  }
  function mailtoFallback(data, subject, to) {
    var body = Object.keys(data).filter(function (k) { return k[0] !== "_" && k !== "botcheck"; })
      .map(function (k) { return k + ": " + data[k]; }).join("\n");
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="botcheck"]') && form.querySelector('[name="botcheck"]').value) return;
      var data = serialize(form);
      var type = form.getAttribute("data-form");
      var to = form.getAttribute("data-to") || "info@northernstarbusinessconsult.com";
      var subject = form.getAttribute("data-subject") || "New message from victormobolaji.com";
      var key = form.getAttribute("data-access");
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : "";

      // lead magnet always delivers the reward immediately
      function deliver() {
        if (type === "lead") {
          var dl = form.getAttribute("data-download");
          if (dl) { var a = document.createElement("a"); a.href = dl; a.download = ""; a.target = "_blank"; document.body.appendChild(a); a.click(); a.remove(); }
        }
      }

      if (!key || key === "REPLACE_WITH_WEB3FORMS_KEY") {
        // no backend configured yet — deliver + mailto fallback
        deliver();
        setStatus(form, "ok", type === "lead"
          ? "Your checklist is downloading. Check your downloads folder."
          : "Opening your email app to send. If nothing happens, email " + to + " directly.");
        mailtoFallback(data, subject, to);
        form.reset();
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
      data.access_key = key;
      data.subject = subject;
      data.from_name = data.name || "victormobolaji.com";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.success) {
          deliver();
          setStatus(form, "ok", type === "lead"
            ? "You're in. Your Revenue Roadmap Checklist is downloading now."
            : "Thank you. Your message is in, I will reply within one business day.");
          form.reset();
        } else { throw new Error(res.message || "failed"); }
      }).catch(function () {
        deliver();
        setStatus(form, "ok", "Saved. Opening your email app as a backup.");
        mailtoFallback(data, subject, to);
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  });
})();
