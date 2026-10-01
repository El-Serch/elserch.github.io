/* elserch.com — shared behaviour. Loaded at the end of <body> on every page.
   The theme and language are set before first paint by a short inline
   script in each page's <head>; this file only handles changes after load. */

(function () {
    'use strict';
    var root = document.documentElement;

    /* ---------------------------------------------------------------- theme */
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var isDark = root.getAttribute('data-theme') === 'dark'
                || (!root.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
            var next = isDark ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
        });
    }

    /* ------------------------------------------------------------- language
       Bilingual pages carry every string as a lang="en"/lang="es" pair and one
       CSS rule hides the inactive one. Attributes can't hold pairs, so
       aria-labels use data-label-en/es and the title data-title-en/es. */
    function applyLang(lang) {
        root.setAttribute('lang', lang);
        var t = root.getAttribute('data-title-' + lang);
        if (t) document.title = t;
        [].forEach.call(document.querySelectorAll('[data-label-' + lang + ']'), function (el) {
            el.setAttribute('aria-label', el.getAttribute('data-label-' + lang));
        });
    }

    var langBtn = document.getElementById('langToggle');
    if (langBtn) {
        applyLang(root.getAttribute('lang') === 'es' ? 'es' : 'en');
        langBtn.addEventListener('click', function () {
            var next = root.getAttribute('lang') === 'es' ? 'en' : 'es';
            applyLang(next);
            try { localStorage.setItem('lang', next); } catch (e) {}
            // keep a ?lang= URL honest, or a reload would flip it back
            try {
                var url = new URL(location.href);
                if (url.searchParams.has('lang')) {
                    url.searchParams.set('lang', next);
                    history.replaceState(null, '', url);
                }
            } catch (e) {}
        });
    }

    /* --------------------------------------------------------- nav tracking
       Highlights the rail link for the section holding the viewport centre. */
    (function () {
        var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
        if (!links.length) return;
        var map = {}, targets = [];
        links.forEach(function (a) {
            var el = document.querySelector(a.getAttribute('href'));
            if (el) { map[el.id] = a; targets.push(el); }
        });
        if (!targets.length) return;

        var last = targets[targets.length - 1];
        var visible = {};
        var atFoot = false;
        var chosen = null;

        function paint() {
            var id = null;
            if (chosen) {
                id = chosen;
            } else if (atFoot) {
                // Once the page bottoms out, the final section sits below the
                // centre line and can never reach it, so pin it.
                id = last.id;
            } else {
                targets.forEach(function (t) { if (!id && visible[t.id]) id = t.id; });
                // Between tracked sections (e.g. "What I do", which isn't in the
                // nav), keep the last one scrolled past rather than going blank.
                if (!id) {
                    var mid = window.innerHeight / 2;
                    targets.forEach(function (t) { if (t.getBoundingClientRect().top <= mid) id = t.id; });
                }
            }
            links.forEach(function (a) { a.classList.toggle('is-active', map[id] === a); });
        }

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                var next = window.pageYOffset + window.innerHeight >= root.scrollHeight - 2;
                if (next !== atFoot) { atFoot = next; paint(); }
            });
        }

        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
                paint();
            }, { rootMargin: '-45% 0px -45% 0px' });
            targets.forEach(function (t) { obs.observe(t); });
        }

        // A click says exactly where the reader went. Near the foot of the page
        // several short sections share one scroll position, so honour the click
        // until the reader scrolls on their own.
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a) return;
            var id = a.getAttribute('href').slice(1);
            if (!map[id]) return;
            chosen = id;
            paint();
        });
        function release() { if (chosen) { chosen = null; paint(); } }
        window.addEventListener('wheel', release, { passive: true });
        window.addEventListener('touchmove', release, { passive: true });
        window.addEventListener('keydown', function (e) {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) > -1) release();
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
    })();

    /* ------------------------------------------------------ pricing → cards
       On narrow screens the comparison table is rebuilt as one card per plan.
       The table stays the only copy of the content. */
    function copyInto(target, cell) {
        [].forEach.call(cell.childNodes, function (n) { target.appendChild(n.cloneNode(true)); });
    }

    function markCells(table) {
        [].forEach.call(table.querySelectorAll('tbody td'), function (cell) {
            var t = cell.textContent.trim();
            if (t !== '✓' && t !== '—') return;
            var yes = t === '✓';
            cell.classList.add(yes ? 'is-yes' : 'is-no');
            cell.textContent = '';
            var glyph = document.createElement('span');
            glyph.setAttribute('aria-hidden', 'true');
            glyph.textContent = t;
            cell.appendChild(glyph);
            [['en', yes ? 'Included' : 'Not included'], ['es', yes ? 'Incluido' : 'No incluido']].forEach(function (l) {
                var said = document.createElement('span');
                said.className = 'sr-only';
                said.setAttribute('lang', l[0]);
                said.textContent = l[1];
                cell.appendChild(said);
            });
        });
    }

    function buildPricingCards(section) {
        var table = section.querySelector('.pricing-table');
        if (!table) return;
        var old = section.querySelector('.pricing-cards');
        if (old) old.parentNode.removeChild(old);

        var plans = [].slice.call(table.querySelectorAll('thead th')).slice(1);
        var rows = [].slice.call(table.querySelectorAll('tbody tr'));
        var deck = document.createElement('div');
        deck.className = 'pricing-cards';

        plans.forEach(function (th, i) {
            var card = document.createElement('article');
            card.className = 'pricing-card' + (th.classList.contains('recommended') ? ' is-recommended' : '');
            var badge = th.querySelector('.badge');
            if (badge) card.appendChild(badge.cloneNode(true));
            var name = document.createElement('h3');
            name.className = 'plan-name';
            copyInto(name, th.querySelector('.plan-name'));
            card.appendChild(name);

            var lead = {};
            var list = document.createElement('dl');
            list.className = 'plan-features';
            rows.forEach(function (tr) {
                var cell = tr.querySelectorAll('td')[i];
                var key = tr.getAttribute('data-key');
                if (key) { lead[key] = cell; return; }
                var item = document.createElement('div');
                item.className = 'feature' + (cell.classList.contains('is-no') ? ' is-excluded' : '');
                var dt = document.createElement('dt');
                copyInto(dt, tr.querySelector('th'));
                var dd = document.createElement('dd');
                dd.className = cell.className;
                copyInto(dd, cell);
                item.appendChild(dt);
                item.appendChild(dd);
                list.appendChild(item);
            });
            [['ideal', 'plan-ideal'], ['price', 'plan-price'], ['time', 'plan-time']].forEach(function (pair) {
                if (!lead[pair[0]]) return;
                var line = document.createElement('p');
                line.className = pair[1];
                copyInto(line, lead[pair[0]]);
                card.appendChild(line);
            });
            card.appendChild(list);
            deck.appendChild(card);
        });

        var wrap = section.querySelector('.pricing-table-wrap');
        wrap.parentNode.insertBefore(deck, wrap.nextSibling);
        section.classList.add('has-cards');
    }

    var pricing = document.querySelector('.pricing');
    if (pricing && pricing.querySelector('.pricing-table')) {
        markCells(pricing.querySelector('.pricing-table'));
        buildPricingCards(pricing);
    }

    /* --------------------------------------------------- unlock in place
       Prices are encrypted into <script type="application/json" id="lock-prices">
       by tools/lock.mjs in the private repo. The same key opens the locked
       case studies, and a key remembered from any of them opens this. */
    (function () {
        var holder = document.getElementById('lock-prices');
        var form = document.getElementById('unlockForm');
        if (!holder || !form || !pricing) return;
        var lock;
        try { lock = JSON.parse(holder.textContent); } catch (e) { return; }
        if (!lock || !lock.data) return;

        var STORE = 'elserch-private';
        var input = document.getElementById('unlockPassword');
        var button = document.getElementById('unlockSubmit');
        var error = document.getElementById('unlockError');
        var subtle = window.crypto && window.crypto.subtle;
        if (!subtle) {
            document.getElementById('unlockUnsupported').hidden = false;
            button.disabled = true;
            return;
        }

        // Must match normalise() in the private repo's gate and lock script:
        // capitals, spacing and accents (á → a, ñ → n) are ignored.
        function normalise(p) {
            return p.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase();
        }
        function fromB64(s) {
            var bin = atob(s), out = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
            return out;
        }
        function toB64(bytes) {
            var bin = '';
            for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
            return btoa(bin);
        }
        function deriveKey(password) {
            return subtle.importKey('raw', new TextEncoder().encode(normalise(password)), 'PBKDF2', false, ['deriveBits'])
                .then(function (base) {
                    return subtle.deriveBits({ name: 'PBKDF2', salt: fromB64(lock.salt), iterations: lock.iterations, hash: 'SHA-256' }, base, 256);
                })
                .then(function (bits) { return new Uint8Array(bits); });
        }
        function decrypt(raw) {
            var blob = fromB64(lock.data);
            return subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt'])
                .then(function (key) { return subtle.decrypt({ name: 'AES-GCM', iv: blob.slice(0, 12) }, key, blob.slice(12)); })
                .then(function (plain) { return new TextDecoder().decode(plain); });
        }
        // The decrypted fragment is the price row; swap it in and rebuild cards.
        function reveal(html) {
            var row = pricing.querySelector('.pricing-table tr[data-key="price"]');
            var holderBody = document.createElement('tbody');
            holderBody.innerHTML = html.trim();
            var fresh = holderBody.querySelector('tr');
            if (!row || !fresh) return;
            row.parentNode.replaceChild(fresh, row);
            buildPricingCards(pricing);
            form.classList.add('is-open');
        }

        var saved = null;
        try { saved = JSON.parse(sessionStorage.getItem(STORE) || 'null'); } catch (e) {}
        if (saved && saved.salt === lock.salt && saved.key) {
            decrypt(fromB64(saved.key)).then(reveal, function () {
                try { sessionStorage.removeItem(STORE); } catch (e) {}
            });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!input.value) { input.focus(); return; }
            form.classList.add('is-busy');
            button.disabled = true;
            error.hidden = true;
            var raw;
            deriveKey(input.value)
                .then(function (k) { raw = k; return decrypt(k); })
                .then(function (html) {
                    try { sessionStorage.setItem(STORE, JSON.stringify({ salt: lock.salt, key: toB64(raw) })); } catch (e) {}
                    reveal(html);
                    var price = pricing.querySelector('tr[data-key="price"] th');
                    if (price) { price.setAttribute('tabindex', '-1'); price.focus({ preventScroll: true }); }
                })
                .catch(function () {
                    form.classList.remove('is-busy');
                    button.disabled = false;
                    error.hidden = false;
                    input.select();
                    input.focus();
                });
        });
    })();
})();
