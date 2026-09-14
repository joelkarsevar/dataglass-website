/* ============================================================
   Data Glass - Data Explorer shared JS
   ============================================================ */

const Explorer = (() => {
    const cache = {};

    async function loadJSON(path) {
        if (cache[path]) return cache[path];
        const res = await fetch(path);
        if (!res.ok) throw new Error('Failed to load ' + path);
        const data = await res.json();
        cache[path] = data;
        return data;
    }

    const loadTrends = () => loadJSON('data/govtwide_trends.json');
    const loadAgencyScores = () => loadJSON('data/agency_scores.json');
    const loadExemptions = () => loadJSON('data/exemptions.json');
    const loadAgencyDetail = () => loadJSON('data/agency_detail.json');
    const loadAwards = () => loadJSON('data/awards.json');

    function fmtNum(n) {
        if (n === null || n === undefined || isNaN(n)) return '-';
        return Math.round(n).toLocaleString('en-US');
    }

    function fmtCurrency(n) {
        if (n === null || n === undefined || isNaN(n)) return '-';
        if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
        if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
        if (Math.abs(n) >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
        return '$' + Math.round(n).toLocaleString('en-US');
    }

    function fmtPct(n, digits) {
        if (n === null || n === undefined || isNaN(n)) return '-';
        return n.toFixed(digits === undefined ? 1 : digits) + '%';
    }

    function scoreClass(score) {
        if (score === null || score === undefined) return '';
        if (score >= 75) return 'score-high';
        if (score >= 50) return 'score-mid';
        return 'score-low';
    }

    function slugify(name) {
        return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'agency';
    }

    const NAVY = '#1B365D';
    const STEEL = '#2A4A7A';
    // High-contrast qualitative palette, spread across the color wheel with
    // varied lightness, so adjacent agencies never look like shades of one another.
    const CHART_COLORS = ['#1B365D', '#D7263D', '#2A9D8F', '#F4A100', '#8E44AD', '#3A86FF', '#6A994E', '#C2185B'];

    // Fixed per-metric colors, reused across every chart so "Received" is
    // always the same blue everywhere on the site, "Backlog" always the same
    // red, etc. Keeps the visual language consistent page to page.
    const METRIC_COLORS = {
        received: '#1B365D',
        processed: '#5B8AC4',
        backlog: '#C0392B',
        appeals_backlog: '#6A4C93',
        total_cost: '#1B4332',
        processing_cost: '#1B4332',
        litigation_cost: '#74C69D',
        cost_per_request: '#1B4332',
        staff: '#8E44AD',
        simple: '#2A9D8F',
        complex: '#F4A100',
        grant: '#2A9D8F',
        partial: '#F4A100',
        denial: '#9B2226',
        closed: '#94A3B8',
    };

    function baseChartOptions(overrides) {
        return Object.assign({
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: {
                        color: '#555', font: { size: 11.5, weight: '600' },
                        usePointStyle: true, pointStyle: 'circle', boxWidth: 7, boxHeight: 7,
                        padding: 14,
                    },
                    position: 'top', align: 'end',
                },
                tooltip: {
                    backgroundColor: '#1B365D', titleFont: { size: 13, weight: '600' }, bodyFont: { size: 12 },
                    padding: 10, cornerRadius: 6, boxPadding: 4, usePointStyle: true,
                }
            },
            scales: {
                x: { ticks: { color: '#666', font: { size: 11 } }, grid: { color: '#F5F5F5' } },
                y: { ticks: { color: '#666', font: { size: 11 } }, grid: { color: '#F5F5F5' } }
            }
        }, overrides || {});
    }

    // ---------- Tab bar + search wiring ----------
    function initChrome(activeId) {
        document.querySelectorAll('.explorer-tab').forEach(el => {
            if (el.dataset.tab === activeId) el.classList.add('active');
        });

        const searchInput = document.getElementById('explorer-search-input');
        const searchBtn = document.getElementById('explorer-search-btn');
        if (!searchInput) return;

        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        });

        let nameToSlug = {};
        loadAgencyDetail().then(agencies => {
            nameToSlug = {};
            Object.values(agencies).forEach(a => { nameToSlug[a.agency] = a.slug; });
            const names = Object.values(agencies).map(a => a.agency).sort();
            const datalist = document.getElementById('agency-datalist');
            if (datalist) {
                datalist.innerHTML = names.map(n => `<option value="${n}">`).join('');
            }
        }).catch(() => {});

        function goSearch() {
            const val = searchInput.value.trim();
            if (!val) return;
            const slug = nameToSlug[val] || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            window.location.href = 'agency.html?a=' + encodeURIComponent(slug);
        }

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') goSearch();
        });
        if (searchBtn) searchBtn.addEventListener('click', goSearch);
    }

    return {
        loadTrends, loadAgencyScores, loadExemptions, loadAgencyDetail, loadAwards,
        fmtNum, fmtCurrency, fmtPct, scoreClass, slugify,
        NAVY, STEEL, CHART_COLORS, METRIC_COLORS, baseChartOptions, initChrome
    };
})();
