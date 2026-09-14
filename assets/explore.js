/* ============================================================
   Data Glass — Data Explorer shared JS
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
        if (n === null || n === undefined || isNaN(n)) return '—';
        return Math.round(n).toLocaleString('en-US');
    }

    function fmtCurrency(n) {
        if (n === null || n === undefined || isNaN(n)) return '—';
        if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
        if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
        if (Math.abs(n) >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
        return '$' + Math.round(n).toLocaleString('en-US');
    }

    function fmtPct(n, digits) {
        if (n === null || n === undefined || isNaN(n)) return '—';
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
    // High-contrast qualitative palette — distinct hues, not shades of the same color,
    // so multiple agencies/series are easy to tell apart at a glance.
    const CHART_COLORS = ['#1B365D', '#C0392B', '#1E8449', '#B7791F', '#7D3C98', '#117864', '#D35400', '#2980B9'];

    function baseChartOptions(overrides) {
        return Object.assign({
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { labels: { color: '#444', font: { size: 12 } } },
                tooltip: { backgroundColor: '#1B365D', titleFont: { size: 13 }, bodyFont: { size: 12 } }
            },
            scales: {
                x: { ticks: { color: '#666' }, grid: { color: '#F0F0F0' } },
                y: { ticks: { color: '#666' }, grid: { color: '#F0F0F0' } }
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
        NAVY, STEEL, CHART_COLORS, baseChartOptions, initChrome
    };
})();
