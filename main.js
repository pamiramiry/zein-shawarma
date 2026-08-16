/* ==========================================================================
   Zein Shawarma
   Rules live in DESIGN-RULES.md. Read it before editing.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. THE ONLY THING YOU EDIT WHEN THE REELS ARRIVE
     ------------------------------------------------------------------
     Drop the .mp4 files into assets/video/ and a matching .jpg into
     assets/img/posters/, then fill in src and poster below.
     While src is null the tile renders as a styled 9:16 placeholder,
     so the layout is already correct and nothing looks broken.
     Array order is display order. No HTML or CSS edits needed to change
     the videos.
  ------------------------------------------------------------------ */

  var IG = 'https://www.instagram.com/zein.shawarma/';

  var REELS = [
    /* reel-03 is the hero clip, so the rail opens on something else. */
    { src: 'assets/video/reel-07.mp4', poster: 'assets/img/posters/reel-07.jpg', dur: '0:26', cap: 'Chicken, pulled apart',           link: IG },
    { src: 'assets/video/reel-04.mp4', poster: 'assets/img/posters/reel-04.jpg', dur: '0:13', cap: 'Wrap, rolled and ready',         link: IG },
    { src: 'assets/video/reel-05.mp4', poster: 'assets/img/posters/reel-05.jpg', dur: '0:16', cap: 'Platter, built to order',        link: IG },
    { src: 'assets/video/reel-08.mp4', poster: 'assets/img/posters/reel-08.jpg', dur: '0:26', cap: 'Smashburger, cheese and onions', link: IG },
    { src: 'assets/video/reel-06.mp4', poster: 'assets/img/posters/reel-06.jpg', dur: '0:18', cap: 'The dessert run',                link: IG },
    { src: 'assets/video/reel-03.mp4', poster: 'assets/img/posters/reel-03.jpg', dur: '0:12', cap: 'Garlic toum, over the top',      link: IG },

    /* Held back on purpose: two are seasonal promos with stale prices burned
       into the footage, one is far too long and heavy for a rail card. Delete
       the `off: true` on any line to put it straight into the carousel. */
    { off: true, src: 'assets/video/reel-01.mp4', poster: 'assets/img/posters/reel-01.jpg', dur: '0:10', cap: 'Canada Day family tray special', link: IG },
    { off: true, src: 'assets/video/reel-02.mp4', poster: 'assets/img/posters/reel-02.jpg', dur: '0:11', cap: 'Grand opening, July 2024',       link: IG },
    { off: true, src: 'assets/video/reel-09.mp4', poster: 'assets/img/posters/reel-09.jpg', dur: '2:19', cap: 'A full review, in the car',      link: IG }
  ];

  /* ------------------------------------------------------------------
     HOURS. The only place opening times are written down.
     Drives the live chip, the hours table and the note under it.

     Times are 24h "HH:MM" in SHOP TIME, not the visitor's. A close that is
     smaller than the open means the shop runs past midnight.
     ------------------------------------------------------------------ */

  var SHOP_TZ = 'America/Toronto';

  var HOURS = {
    open:  '10:30',
    close: '24:00',
    label: '10:30 AM to 12:00 AM',
    note:  'Kitchen runs to midnight, seven days a week.'
  };

  /* Ramadan, Eid and holiday closures go here and nowhere else. Add an entry,
     the chip, the table, the note and the banner all follow it. Dates are
     inclusive and in shop time.

     A halal kitchen changes hours completely for Ramadan, so leaving the
     regular hours running through it is how a customer drives to a shut shop.

     Example:
     { from: '2027-02-08', to: '2027-03-09',
       open: '16:00', close: '02:00',
       label: '4:00 PM to 2:00 AM',
       note: 'Ramadan hours. Open for iftar through late.',
       banner: 'Ramadan hours are on: 4:00 PM to 2:00 AM.' },

     A closure is the same shape with open and close identical:
     { from: '2026-12-25', to: '2026-12-25', open: '00:00', close: '00:00',
       label: 'Closed', note: 'Closed for the day.',
       banner: 'Closed December 25.' },
  */
  var SPECIAL_HOURS = [];

  /* How many clips may run at once. Tuned to the viewport in tuneCap() once
     the marquee is measured: it has to cover every card on screen plus the
     ones about to slide in, or a visible card sits frozen on its poster. */
  var MAX_PLAYING = 4;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.5l9 5.5-9 5.5z"/></svg>';

  /* ------------------------------------------------------------------
     2. Video playback manager
     ------------------------------------------------------------------ */

  var playing = [];
  var waiting = [];

  function start(v) {
    if (reduceMotion || !v || playing.indexOf(v) !== -1) return;
    if (playing.length >= MAX_PLAYING) {
      if (waiting.indexOf(v) === -1) waiting.push(v);
      return;
    }
    playing.push(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { stop(v); });
  }

  /* How far off the middle of the screen a video currently sits. Used to give
     up a free slot to whichever queued card is closest to being seen, rather
     than whichever happened to be queued first. */
  function distance(v) {
    var r = v.getBoundingClientRect();
    return Math.abs(r.left + r.width / 2 - window.innerWidth / 2);
  }

  function stop(v) {
    if (!v) return;
    var i = playing.indexOf(v);
    if (i !== -1) playing.splice(i, 1);
    var w = waiting.indexOf(v);
    if (w !== -1) waiting.splice(w, 1);
    if (!v.paused) v.pause();

    while (waiting.length && playing.length < MAX_PLAYING) {
      waiting.sort(function (a, b) { return distance(a) - distance(b); });
      start(waiting.shift());
    }
  }

  /* Two rings around the viewport.

     The outer one buffers: it flips preload to auto so the file is already
     downloading long before the card matters. The inner one plays, and it is
     still well outside the visible area, so a card is running by the time it
     slides into view instead of drifting in as a still poster.

     At the marquee's 42px/s these work out to roughly 11 seconds of buffer
     lead and 5 seconds of playback lead. */
  var seen = null, prefetch = null;

  if ('IntersectionObserver' in window) {
    prefetch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var v = e.target;
        if (v.preload !== 'auto') {
          v.preload = 'auto';
          // changing preload alone does not always kick off a fetch
          if (v.readyState === 0 && v.paused) v.load();
        }
        prefetch.unobserve(v); // buffered once, and it stays buffered
      });
    }, { rootMargin: '200px 460px 200px 460px' });

    seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) start(v); else stop(v);
      });
      // threshold 0 so a card counts the instant any sliver of it reaches the
      // ring, not after a fifth of it has already crossed
    }, { threshold: 0, rootMargin: '0px 220px 0px 220px' });
  }

  function watch(v) {
    if (!seen) { start(v); return; }
    if (prefetch) prefetch.observe(v);
    seen.observe(v);
  }

  /* Builds a <video> configured the way every video on this site is
     configured: muted, inline, looping, and costing nothing until seen. */
  function makeVideo(src, poster) {
    var v = document.createElement('video');
    v.src = src;
    if (poster) v.poster = poster;
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('muted', '');
    v.preload = 'none';
    v.controls = false;
    // Grid and hero videos are decoration inside a button, so they stay out of
    // the tab order. Controls only ever appear inside the viewer.
    v.tabIndex = -1;
    /* Reduced motion shows the poster and never plays, so the file is not
       needed until someone opens the viewer. This used to say 'metadata',
       which cost 19 MB across the rail: these MP4s were never re-encoded
       with faststart, so their moov atom sits at the end of the file and
       Chrome drags almost the whole thing just to read it. */
    if (reduceMotion) v.preload = 'none';
    return v;
  }

  /* ------------------------------------------------------------------
     3. Hero
     ------------------------------------------------------------------ */

  /* The hero clip is 4.97 MB, which is most of a first visit, and this shop's
     audience is overwhelmingly a phone on mobile data. On a metered or slow
     connection the poster does the whole job for 102 KB. */
  function heavyMediaOK() {
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return true;                       // no signal either way, assume fine
    if (c.saveData) return false;              // user asked for less data. respect it
    return !/(^|-)(2g|slow-2g)$/.test(c.effectiveType || '');
  }

  (function hero() {
    var box = $('#heroMedia');
    if (!box) return;
    var src = box.getAttribute('data-src');
    var poster = box.getAttribute('data-poster');
    if (!src) return; // the .ph placeholder already fills the space

    /* Poster only. It is the first frame of the clip, so this looks like the
       video paused rather than like something failed to load. */
    if (!heavyMediaOK() || reduceMotion) {
      if (poster) {
        box.style.backgroundImage = 'url("' + poster + '")';
        box.classList.add('is-still');
        var img = new Image();
        img.onload = function () { var ph = $('.ph', box); if (ph) ph.remove(); };
        img.src = poster;
      }
      return;
    }

    // Only swap the placeholder out once the file actually loads.
    var probe = makeVideo(src, poster);
    probe.addEventListener('loadeddata', function () {
      var ph = $('.ph', box);
      if (ph) ph.remove();
    }, { once: true });
    probe.addEventListener('error', function () { probe.remove(); }, { once: true });

    box.insertBefore(probe, box.firstChild);
    probe.preload = 'auto';
    watch(probe);
  })();

  /* ------------------------------------------------------------------
     4. Reel carousel
     ------------------------------------------------------------------ */

  var live = [];      // reels that actually have a file, in rail order
  var rail = null;
  var railAuto = null; // set by buildRail: lets the viewer hold the drift

  (function reels() {
    rail = $('#reelRail');
    if (!rail) return;

    var shown = REELS.filter(function (r) { return !r.off; });

    shown.forEach(function (r) {
      var tile;

      if (r.src) {
        var item = { data: r, tile: null, dead: false };
        live.push(item);
        tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'reel';
        tile.setAttribute('aria-label', 'Play video: ' + r.cap);
        tile.dataset.live = String(live.length - 1);

        var v = makeVideo(r.src, r.poster);
        tile.appendChild(v);
        tile.insertAdjacentHTML('beforeend',
          '<span class="scrim"></span>' +
          (r.dur ? '<span class="reel__dur">' + esc(r.dur) + '</span>' : '') +
          '<span class="reel__play" aria-hidden="true">' + PLAY_ICON + '</span>' +
          '<span class="reel__cap">' + esc(r.cap) + '</span>');

        item.tile = tile;
        // A typo in REELS or a missing file must not leave a dead black square.
        v.addEventListener('error', function () { degrade(item); }, { once: true });
        watch(v);
      } else {
        tile = document.createElement('div');
        tile.className = 'reel reel--empty';
        tile.setAttribute('aria-hidden', 'true');
        tile.insertAdjacentHTML('beforeend',
          '<span class="ph" aria-hidden="true"><span class="ph__spit"></span></span>' +
          '<span class="scrim"></span>' +
          '<span class="reel__slot">' + esc(r.cap) + '</span>');
      }

      tile.tabIndex = -1; // the track is decorative; the player is the keyboard path
      rail.appendChild(tile);
    });

    if (!live.length) {
      var note = $('#reelNote');
      if (note) note.hidden = false;
    }

    rail.addEventListener('click', function (e) {
      var t = e.target.closest('.reel[data-live]');
      if (t) openViewer(parseInt(t.dataset.live, 10));
    });

    buildRail();
  })();

  /* ------------------------------------------------------------------
     Marquee engine, shared by the video reel and the stats ticker.

     The track holds enough duplicate copies of its children to cover the
     viewport twice, then a linear CSS animation slides it by exactly one
     copy and starts over. Because copy 2 sits precisely where copy 1
     began, the restart is invisible: items leave one edge and reappear at
     the other forever.

     --shift is measured from the live layout, never assumed to be 50%: a
     flex gap makes the two halves uneven, and a half-gap error shows up
     as a visible stutter once a lap.

     Speed is constant in pixels per second, so adding or removing items
     changes how long a lap takes, never how fast things move.

     opts:
       speed     px per second
       reverse   run the other way (the ticker, so it is not a copy)
       btn       pause control          btnText  its label element
       noun      what the control calls this band
       onClone   per-clone fixup, used only by the video band
       onMeasure runs after every re-measure, for band-specific tuning

     Returns { hold, release } so a caller can park it from outside.
     ------------------------------------------------------------------ */
  function makeMarquee(box, track, opts) {
    opts = opts || {};
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return null;

    var speed = opts.speed || 40;

    // Under reduced motion nothing moves, so duplicates would only add
    // weight. Leave the single set as a plain scrollable row.
    if (reduceMotion) return null;

    if (opts.reverse) track.classList.add('is-reverse');

    function addCopy() {
      originals.forEach(function (node) {
        var clone = node.cloneNode(true);
        clone.tabIndex = -1;
        if (opts.onClone) opts.onClone(clone);
        track.appendChild(clone);
      });
    }

    addCopy();
    // enough width that a full copy can slide away without ever exposing a gap
    var guard = 0;
    while (track.scrollWidth < box.clientWidth * 2 + 8 && guard++ < 8) addCopy();

    function measure() {
      var all = Array.prototype.slice.call(track.children);
      if (all.length <= originals.length) return 0;
      // distance from the first item to its twin in the next copy
      return all[originals.length].getBoundingClientRect().left
           - all[0].getBoundingClientRect().left;
    }

    function apply() {
      var shift = measure();
      if (shift <= 0) return;
      track.style.setProperty('--shift', shift + 'px');
      track.style.setProperty('--dur', (shift / speed).toFixed(2) + 's');
      if (opts.onMeasure) opts.onMeasure(box, track, originals);
    }

    // measure again once fonts and layout settle, or the width is wrong
    apply();
    window.addEventListener('load', apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);

    var rz = null;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(apply, 200);
    });

    /* ----------------------------------------------------------------
       Holds. The drift runs only when every one of these is clear, and
       any single hold parks it exactly where it stands. Each band owns
       its own hold set, so hovering one never stops the other.
       ---------------------------------------------------------------- */
    var holds = {};
    var stopped = false;   // the visitor pressed pause
    var onScreen = false;
    var noun = opts.noun || 'reel';

    function render() {
      var run = !stopped && onScreen && !document.hidden
             && Object.keys(holds).length === 0;
      track.classList.toggle('is-paused', !run);
    }

    function hold(key) { holds[key] = 1; render(); }
    function release(key) { delete holds[key]; render(); }

    // the hover behaviour: park it on the way in, carry on on the way out
    box.addEventListener('mouseenter', function () { hold('hover'); });
    box.addEventListener('mouseleave', function () { release('hover'); });

    // a touch holds it, then it drifts on again after a beat
    var settle = null;
    box.addEventListener('pointerdown', function () {
      hold('touch');
      clearTimeout(settle);
      settle = setTimeout(function () { release('touch'); }, 4000);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) hold('tab'); else release('tab');
    });

    // nothing should be moving off screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        render();
      }, { threshold: 0.08 }).observe(box);
    } else {
      onScreen = true;
    }

    if (opts.btn) {
      opts.btn.addEventListener('click', function () {
        stopped = !stopped;
        opts.btn.classList.toggle('is-stopped', stopped);
        opts.btn.setAttribute('aria-label',
          (stopped ? 'Start the moving ' : 'Pause the moving ') + noun);
        if (opts.btnText) opts.btnText.textContent = stopped ? 'Play' : 'Pause';
        render();
      });
    }

    render();
    return { hold: hold, release: release };
  }

  /* The video band. Everything video-specific stays here rather than in
     the engine: cloned video elements need their properties reset, and
     MAX_PLAYING has to track how many cards the viewport actually shows. */
  function buildRail() {
    var box = $('#reelMarquee');
    var openBtn = $('#reelOpen');
    if (!box || !rail) return;

    if (openBtn) {
      openBtn.addEventListener('click', function () { openViewer(0); });
      if (!live.length) openBtn.hidden = true;
    }

    railAuto = makeMarquee(box, rail, {
      speed: 42,
      noun: 'video reel',
      btn: $('#railPlay'),
      btnText: $('#railPlayText'),

      onClone: function (clone) {
        var cv = clone.querySelector('video');
        if (!cv) return;
        // cloneNode does not carry these across as properties
        cv.muted = true;
        cv.defaultMuted = true;
        cv.loop = true;
        cv.playsInline = true;
        cv.preload = 'none';
        watch(cv);
      },

      /* Every card on screen plus the ones in the play ring either side.
         A fixed cap of 4 left visible cards frozen on their posters as
         soon as the viewport was wide enough to show more than four. */
      onMeasure: function (b, t, originals) {
        var w = originals[0].getBoundingClientRect().width;
        var gap = parseFloat(getComputedStyle(t).columnGap) || 12;
        var per = w + gap;
        if (per <= 0) return;
        MAX_PLAYING = Math.max(3, Math.min(12, Math.ceil(b.clientWidth / per) + 3));
      }
    });
  }

  /* The stats band. Text only, slower, and running the other way so it
     reads as counterpoint to the video reel rather than a copy of it. */
  (function statTicker() {
    var box = $('#statMarquee');
    var track = $('#statTrack');
    if (!box || !track) return;
    makeMarquee(box, track, {
      speed: 22,
      reverse: true,
      noun: 'stats ticker',
      btn: $('#statPlay'),
      btnText: $('#statPlayText')
    });
  })();

  /* Falls a broken reel back to the same placeholder an unfilled slot uses,
     so a bad filename degrades quietly instead of showing a black tile. */
  function degrade(item) {
    if (item.dead) return;
    item.dead = true;
    var tile = item.tile;
    if (!tile) return;
    var v = tile.querySelector('video');
    if (v) { stop(v); v.remove(); }
    tile.removeAttribute('data-live');
    tile.disabled = true;
    tile.setAttribute('aria-hidden', 'true');
    tile.classList.add('reel--empty');
    var play = tile.querySelector('.reel__play');
    if (play) play.remove();
    var cap = tile.querySelector('.reel__cap');
    if (cap) cap.className = 'reel__slot';
    tile.insertAdjacentHTML('afterbegin',
      '<span class="ph" aria-hidden="true"><span class="ph__spit"></span></span>');
    if (live.every(function (x) { return x.dead; })) {
      var note = $('#reelNote');
      if (note) note.hidden = false;
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ------------------------------------------------------------------
     5. Fullscreen reel viewer
     ------------------------------------------------------------------ */

  var viewer = $('#viewer');
  var stage = $('#viewerStage');
  var capEl = $('#viewerCap');
  var soundBtn = $('#viewerSound');
  var soundLabel = $('#soundLabel');
  var current = 0;
  var opener = null;
  var wantSound = false;
  var scrollY = 0;

  function openViewer(idx) {
    if (!viewer || !live.length) return;
    opener = document.activeElement;
    scrollY = window.scrollY;
    current = idx;
    if (railAuto) railAuto.hold('viewer');
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    show(current);
    $('#viewerClose').focus();
    document.addEventListener('keydown', onKey);
  }

  function closeViewer() {
    if (!viewer || viewer.hidden) return;
    var v = $('video', stage);
    if (v) { stop(v); v.remove(); }
    viewer.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (railAuto) railAuto.release('viewer');
    window.scrollTo(0, scrollY);
    if (opener && opener.focus) opener.focus();
  }

  function show(idx) {
    var item = live[idx];
    if (!item || item.dead) return;
    var old = $('video', stage);
    if (old) { stop(old); old.remove(); }

    var v = makeVideo(item.data.src, item.data.poster);
    v.loop = true;
    v.preload = 'auto';
    v.muted = !wantSound;
    stage.appendChild(v);

    if (reduceMotion) {
      // Nothing autoplays. Give the viewer real controls to press instead.
      v.controls = true;
      v.tabIndex = 0;
    } else {
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.controls = true; v.tabIndex = 0; });
    }

    capEl.textContent = item.data.cap;
    setSoundUI();
  }

  function move(step) {
    var n = live.length;
    if (!n) return;
    var i = current, guard = 0;
    do { i = (i + step + n) % n; guard++; } while (live[i].dead && guard < n);
    if (live[i].dead) { closeViewer(); return; }
    current = i;
    show(current);
  }

  function setSoundUI() {
    soundBtn.classList.toggle('is-on', wantSound);
    soundLabel.textContent = wantSound ? 'Sound on' : 'Sound off';
    soundBtn.setAttribute('aria-label', wantSound ? 'Mute' : 'Unmute');
  }

  function onKey(e) {
    if (e.key === 'Escape') { closeViewer(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1); return; }
    if (e.key !== 'Tab') return;

    // keep focus inside the dialog
    var f = $$('button', viewer).filter(function (b) { return b.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (viewer) {
    $('#viewerClose').addEventListener('click', closeViewer);
    $('#viewerPrev').addEventListener('click', function () { move(-1); });
    $('#viewerNext').addEventListener('click', function () { move(1); });
    soundBtn.addEventListener('click', function () {
      wantSound = !wantSound;
      var v = $('video', stage);
      if (v) { v.muted = !wantSound; if (wantSound) v.play(); }
      setSoundUI();
    });
    viewer.addEventListener('click', function (e) {
      if (e.target === viewer || e.target === stage) closeViewer();
    });

    var y0 = null, x0 = null;
    stage.addEventListener('touchstart', function (e) {
      y0 = e.touches[0].clientY; x0 = e.touches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (y0 === null) return;
      var dy = e.changedTouches[0].clientY - y0;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dy) > 55 && Math.abs(dy) > Math.abs(dx)) move(dy < 0 ? 1 : -1);
      else if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1);
      y0 = x0 = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     6. Menu tabs
     ------------------------------------------------------------------ */

  (function tabs() {
    var list = $$('.tab');
    if (!list.length) return;

    function select(btn) {
      list.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }

    list.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = list[(i + d + list.length) % list.length];
        next.focus();
        select(next);
      });
    });

    // Highlight circles and strip links deep-link into a category.
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var tab = document.getElementById('tab-' + id);
      if (tab) a.addEventListener('click', function () { select(tab); });
    });
  })();

  /* ------------------------------------------------------------------
     7. Hours table and the live open / closed pill
     ------------------------------------------------------------------ */

  (function hours() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function toMin(hhmm) {
      var p = String(hhmm).split(':');
      return (+p[0]) * 60 + (+p[1] || 0);
    }

    function pretty(mins) {
      var h = Math.floor(mins / 60) % 24, m = mins % 60;
      var ap = h < 12 ? 'AM' : 'PM';
      var h12 = h % 12 === 0 ? 12 : h % 12;
      return h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
    }

    /* The shop's own clock, not the visitor's. Reading new Date().getHours()
       told anyone outside Eastern that a shut shop was open. */
    function shopNow() {
      var parts;
      try {
        parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: SHOP_TZ, hour12: false,
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', weekday: 'short'
        }).formatToParts(new Date());
      } catch (e) {
        var d = new Date();          // no Intl support: fall back to device time
        return {
          date: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2),
          mins: d.getHours() * 60 + d.getMinutes(),
          day: d.getDay()
        };
      }
      var get = function (t) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value;
        return '';
      };
      var hh = get('hour') === '24' ? '00' : get('hour');   // some engines report 24
      return {
        date: get('year') + '-' + get('month') + '-' + get('day'),
        mins: (+hh) * 60 + (+get('minute')),
        day: days.map(function (d) { return d.slice(0, 3); }).indexOf(get('weekday'))
      };
    }

    /* Whichever SPECIAL_HOURS entry covers today, else the regular hours. */
    function activeFor(dateStr) {
      for (var i = 0; i < SPECIAL_HOURS.length; i++) {
        var s = SPECIAL_HOURS[i];
        if (dateStr >= s.from && dateStr <= s.to) return s;
      }
      return HOURS;
    }

    var active = activeFor(shopNow().date);

    /* Table, note and banner all read from whichever entry is active, so a
       Ramadan line in SPECIAL_HOURS updates every one of them at once. */
    function render() {
      /* One line. Every entry in this model applies its label to all seven
         days, so a per-day table could only ever repeat itself. */
      var every = $('#hoursEvery');
      if (every) {
        every.innerHTML = active.label === 'Closed'
          ? '<b>Closed today</b>'
          : '<b>Every day</b><span>' + active.label + '</span>';
      }

      var note = $('#hoursNote');
      if (note && active.note) note.textContent = active.note;

      var banner = $('#hoursBanner');
      if (banner) {
        var show = active !== HOURS && active.banner;
        banner.textContent = show ? active.banner : '';
        banner.hidden = !show;
      }
    }

    render();

    function tick() {
      /* Re-read the date every tick. A page left open across midnight into a
         Ramadan or holiday entry has to pick it up without a reload. */
      var t = shopNow();
      var cur = activeFor(t.date);
      if (cur !== active) { active = cur; render(); }

      var openMin = toMin(active.open), closeMin = toMin(active.close);
      var mins = t.mins;

      var isOpen, left;
      if (openMin === closeMin) {           // a closure entry
        isOpen = false;
      } else if (closeMin > openMin) {      // same-day close
        isOpen = mins >= openMin && mins < closeMin;
        left = closeMin - mins;
      } else {                              // runs past midnight
        isOpen = mins >= openMin || mins < closeMin;
        left = mins >= openMin ? (1440 - mins) + closeMin : closeMin - mins;
      }

      var label;
      if (active.label === 'Closed') label = 'Closed today';
      else if (isOpen) label = left <= 60 ? 'Closing in ' + left + ' min' : 'Open now';
      else label = 'Opens ' + pretty(openMin);

      [['#statusChip', '#statusText'], ['#statusChip2', '#statusText2']].forEach(function (pair) {
        var chip = $(pair[0]), text = $(pair[1]);
        if (!chip || !text) return;
        chip.classList.toggle('is-open', isOpen);
        chip.classList.toggle('is-shut', !isOpen);
        text.textContent = label;
      });
    }

    tick();
    setInterval(tick, 60000);
  })();

  /* ------------------------------------------------------------------
     7b. Review dots
     ------------------------------------------------------------------
     The track itself is native CSS scroll-snap, so swiping works with this
     file removed entirely. All this adds is the position indicator.

     Dots count REACHABLE scroll stops, not quotes. At the grid breakpoint the
     track stops scrolling, so there are no stops and the dots hide themselves
     rather than sitting there dead.

     It never advances on its own. The page has exactly two moving bands and
     this is not allowed to become the third.
     ------------------------------------------------------------------ */

  (function reviewDots() {
    var track = $('#saysTrack');
    var wrap = $('#saysDots');
    if (!track || !wrap) return;

    var cards = $$('.say', track);
    if (cards.length < 2) return;
    var dots = [];

    function step() {
      var s = cards[1].offsetLeft - cards[0].offsetLeft;
      return s > 0 ? s : track.clientWidth || 1;
    }
    function maxScroll() { return Math.max(0, track.scrollWidth - track.clientWidth); }
    function pages() {
      if (maxScroll() <= 2) return 0;             // not scrollable: no dots
      return Math.max(1, Math.min(cards.length, Math.round(maxScroll() / step()) + 1));
    }
    function index() {
      var n = pages();
      if (!n) return 0;
      if (track.scrollLeft >= maxScroll() - 2) return n - 1;
      return Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / step())));
    }

    function build() {
      var n = pages();
      if (dots.length === n) return;              // unchanged, keep focus stable
      wrap.innerHTML = '';
      dots = [];
      for (var i = 0; i < n; i++) {
        (function (idx) {
          var d = document.createElement('button');
          d.type = 'button';
          d.setAttribute('role', 'tab');
          d.setAttribute('aria-label', 'Show review ' + (idx + 1) + ' of ' + n);
          d.addEventListener('click', function () {
            var left = idx >= n - 1 ? maxScroll() : cards[idx].offsetLeft - cards[0].offsetLeft;
            track.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
          });
          wrap.appendChild(d);
          dots.push(d);
        })(i);
      }
    }

    function sync() {
      var at = index();
      dots.forEach(function (d, i) {
        d.classList.toggle('is-on', i === at);
        d.setAttribute('aria-current', i === at ? 'true' : 'false');
      });
    }

    var raf;
    track.addEventListener('scroll', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    }, { passive: true });
    window.addEventListener('resize', function () { build(); sync(); });

    build();
    sync();
  })();

  /* ------------------------------------------------------------------
     8. Small stuff
     ------------------------------------------------------------------ */

  (function chrome() {
    var bar = $('#bar');
    var dock = $('.dock');
    var hero = $('#top');

    /* The dock stays off screen until the hero is behind you. Measured from
       the hero's own height rather than a fixed pixel count, so it stays
       right when the viewport changes. The 90px lead lets it arrive just
       before the hero fully clears rather than snapping in late. */
    function dockPoint() {
      return hero ? Math.max(200, hero.offsetHeight - 90) : 320;
    }

    if (bar || dock) {
      var docked = null;
      var onScroll = function () {
        var y = window.scrollY;
        if (bar) bar.classList.toggle('is-stuck', y > 40);
        if (dock) {
          var up = y > dockPoint();
          if (up !== docked) { dock.classList.toggle('is-up', up); docked = up; }
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    }

    var yr = $('#yr');
    if (yr) yr.textContent = String(new Date().getFullYear());

    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var targets = $$('.sec__head, .items, .proof, .find');
    targets.forEach(function (t) { t.classList.add('rv'); });
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        rv.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { rv.observe(t); });
  })();

})();
