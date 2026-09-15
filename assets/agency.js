/* ============================================================
   Agency Profile Page logic
   ============================================================ */
(function() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('a');

    const DISP_LABELS = {
        full_grants: 'Full Grant', partial_grants: 'Partial Grant', full_denials: 'Full Denial (Exemption)',
        no_records: 'No Records', referred: 'Referred', withdrawn: 'Withdrawn', fee_related: 'Fee Related',
        not_described: 'Not Reasonably Described', improper: 'Improper Request', not_agency_record: 'Not Agency Record',
        duplicate: 'Duplicate', other: 'Other',
    };
    const DISP_COLORS = {
        full_grants: '#2A9D8F', partial_grants: '#F4A100', full_denials: '#9B2226', no_records: '#5C6BC0',
        referred: '#6A4C93', withdrawn: '#457B9D', fee_related: '#B08968', not_described: '#588157',
        improper: '#BC6C25', not_agency_record: '#C9184A', duplicate: '#8D99AE', other: '#495057',
    };
    const EX_LABELS = {
        exemptions_ex_1:'Ex 1 \u2013 National Security', exemptions_ex_2:'Ex 2 \u2013 Internal Personnel Rules',
        exemptions_ex_3:'Ex 3 \u2013 Other Statutes', exemptions_ex_4:'Ex 4 \u2013 Trade Secrets/Business Info',
        exemptions_ex_5:'Ex 5 \u2013 Privileged Communications', exemptions_ex_6:'Ex 6 \u2013 Personal Privacy',
        exemptions_ex_7a:'Ex 7A \u2013 Interfere with Proceedings', exemptions_ex_7b:'Ex 7B \u2013 Fair Trial',
        exemptions_ex_7c:'Ex 7C \u2013 Personal Privacy (Law Enforcement)', exemptions_ex_7d:'Ex 7D \u2013 Confidential Source',
        exemptions_ex_7e:'Ex 7E \u2013 Law Enforcement Techniques', exemptions_ex_7f:'Ex 7F \u2013 Safety of Individuals',
        exemptions_ex_8:'Ex 8 \u2013 Financial Institutions', exemptions_ex_9:'Ex 9 \u2013 Geological Info'
    };

    function sparkline(canvasId, values, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx || !values.length) return;
        // Fixed, non-responsive size measured once from the container avoids
        // Chart.js's ResizeObserver-driven resizing, which is what causes
        // tiny sparklines to render inconsistently (or stretch) depending on
        // exact layout timing.
        const rect = ctx.parentElement.getBoundingClientRect();
        const w = Math.round(rect.width) || 60;
        const h = Math.round(rect.height) || 22;
        ctx.width = w;
        ctx.height = h;
        const cleanValues = values.map(v => (v === undefined || isNaN(v)) ? null : v);
        new Chart(ctx, {
            type: 'line',
            data: { labels: cleanValues.map((_,i)=>i), datasets: [{ data: cleanValues, borderColor: color, borderWidth: 2.5, pointRadius: 0, fill: false, tension: 0.25, spanGaps: true }] },
            options: { responsive: false, maintainAspectRatio: false, animation: false, plugins: { legend: { display:false }, tooltip: { enabled:false } },
                scales: { x: { display:false }, y: { display:false } }, elements: { line: { borderJoinStyle: 'round' } } }
        });
    }

    function delta(cur, prior) {
        if (cur === null || prior === null || prior === undefined || prior === 0) return '';
        const pct = (cur - prior) / prior * 100;
        const cls = pct >= 0 ? 'up' : 'down';
        return `<div class="agency-kpi-delta ${cls}">${pct >= 0 ? '\u25B2' : '\u25BC'} ${Math.abs(pct).toFixed(1)}% vs prior year</div>`;
    }

    function renderHeader(a, latest, prior) {
        document.getElementById('agency-badge').textContent = (a.abbrev || a.agency.slice(0,3)).slice(0,4).toUpperCase();
        document.getElementById('agency-badge').setAttribute('title', a.agency);
        document.getElementById('agency-eyebrow').textContent = `FY ${latest.year} Annual FOIA Report`;
        document.getElementById('agency-title').textContent = a.agency;
        document.getElementById('agency-subtitle').textContent = `${latest.component_count} reporting component${latest.component_count===1?'':'s'} \u00b7 slug: ${a.slug}`;
        document.title = a.agency + ' \u2014 FOIA Data Explorer';

        const kpiRow = document.getElementById('agency-kpi-row');
        kpiRow.innerHTML = `
            <div class="agency-kpi-card">
                <div class="agency-kpi-label"><span>Received</span><div class="agency-kpi-spark"><canvas id="spark-received"></canvas></div></div>
                <div class="agency-kpi-value">${Explorer.fmtNum(latest.received)}</div>
                ${delta(latest.received, prior && prior.received)}
            </div>
            <div class="agency-kpi-card">
                <div class="agency-kpi-label"><span>Processed</span></div>
                <div class="agency-kpi-value">${Explorer.fmtNum(latest.processed)}</div>
                <div class="agency-kpi-delta" style="color:#888;">${latest.received ? Math.round(latest.processed/latest.received*100) : '\u2014'}% of received</div>
            </div>
            <div class="agency-kpi-card">
                <div class="agency-kpi-label"><span>Pending Year-End</span></div>
                <div class="agency-kpi-value">${Explorer.fmtNum(latest.pending_end)}</div>
            </div>
            <div class="agency-kpi-card">
                <div class="agency-kpi-label"><span>Backlog</span><div class="agency-kpi-spark"><canvas id="spark-backlog"></canvas></div></div>
                <div class="agency-kpi-value">${Explorer.fmtNum(latest.backlog)}</div>
                ${delta(latest.backlog, prior && prior.backlog)}
            </div>
            <div class="agency-kpi-card">
                <div class="agency-kpi-label"><span>Cost (Total)</span></div>
                <div class="agency-kpi-value">${Explorer.fmtCurrency(latest.cost)}</div>
            </div>
            <div class="agency-kpi-card">
                <div class="agency-kpi-label"><span>Staff (FTE)</span></div>
                <div class="agency-kpi-value">${latest.staff ? latest.staff.toLocaleString() : '\u2014'}</div>
            </div>
        `;

        const years = a.years.slice(-8);
        sparkline('spark-received', years.map(y=>y.received), '#2980B9');
        sparkline('spark-backlog', years.map(y=>y.backlog), '#C0392B');
    }

    function renderOverview(latest) {
        const rt = latest.response_time || {};
        document.getElementById('panel-overview').innerHTML = `
            <div class="agency-cards-row">
                <div class="agency-card">
                    <h4>Response Time</h4>
                    <div class="sub">Median days from receipt to closure</div>
                    <div class="response-time-grid">
                        <div class="response-time-box"><div class="label">Simple</div><div class="value">${rt.simple_median ?? '\u2014'}d</div><div class="meta">avg ${rt.simple_avg ?? '\u2014'}d</div></div>
                        <div class="response-time-box"><div class="label">Complex</div><div class="value">${rt.complex_median ?? '\u2014'}d</div><div class="meta">avg ${rt.complex_avg ?? '\u2014'}d</div></div>
                        <div class="response-time-box"><div class="label">Expedited</div><div class="value">${rt.expedited_median ?? '\u2014'}d</div><div class="meta">avg ${rt.expedited_avg ?? '\u2014'}d</div></div>
                    </div>
                </div>
                <div class="agency-card">
                    <h4>Disposition</h4>
                    <div class="sub">What happened to processed requests</div>
                    ${dispositionSummaryHtml(latest.disposition)}
                </div>
                <div class="agency-card">
                    <h4>Exemptions Used</h4>
                    <div class="sub">Counts of each exemption cited</div>
                    ${exemptionBarListHtml(latest.exemptions, 5)}
                </div>
            </div>
        `;
    }

    function dispositionSummaryHtml(disp) {
        if (!disp || !disp.total) return '<div class="sub">No disposition data reported.</div>';
        const total = disp.total;
        const grantRate = ((disp.full_grants||0) + (disp.partial_grants||0)) / total * 100;
        const denialRate = (disp.full_denials||0) / total * 100;
        const order = ['full_grants','partial_grants','full_denials','no_records','other'];
        const rest = Object.keys(DISP_LABELS).filter(k => !order.includes(k));
        const bucket = {};
        order.forEach(k => bucket[k] = disp[k] || 0);
        bucket.other = (bucket.other||0) + rest.reduce((s,k) => s + (disp[k]||0), 0);
        const segs = Object.entries(bucket).filter(([,v]) => v > 0);
        const bar = segs.map(([k,v]) => `<div style="width:${(v/total*100).toFixed(2)}%;background:${DISP_COLORS[k]};" title="${DISP_LABELS[k]}: ${Explorer.fmtNum(v)}"></div>`).join('');
        const legend = segs.map(([k,v]) => `<span><span class="dot" style="background:${DISP_COLORS[k]};"></span>${DISP_LABELS[k]} <strong>${Explorer.fmtNum(v)}</strong> \u00b7 ${(v/total*100).toFixed(1)}%</span>`).join('');
        return `
            <div class="disposition-rate-line">Grant rate: <strong>${grantRate.toFixed(1)}%</strong> \u00b7 Full denial rate: <strong>${denialRate.toFixed(1)}%</strong></div>
            <div class="disposition-bar">${bar}</div>
            <div class="disposition-legend">${legend}</div>
        `;
    }

    function exemptionBarListHtml(ex, limit) {
        if (!ex) return '<div class="sub">No exemption data reported.</div>';
        const entries = Object.entries(ex).filter(([,v]) => v && v > 0).sort((a,b) => b[1]-a[1]);
        if (!entries.length) return '<div class="sub">No exemptions cited.</div>';
        const total = entries.reduce((s,[,v]) => s+v, 0);
        const shown = limit ? entries.slice(0, limit) : entries;
        const max = shown[0][1];
        return shown.map(([k,v]) => `
            <div class="bar-list-row">
                <div class="bar-list-label-row"><span class="name">${EX_LABELS[k] || k}</span><span class="count">${Explorer.fmtNum(v)} \u00b7 ${(v/total*100).toFixed(1)}%</span></div>
                <div class="bar-list-track"><div class="bar-list-fill" style="width:${(v/max*100).toFixed(1)}%;"></div></div>
            </div>
        `).join('');
    }

    function renderOverTime(a) {
        document.getElementById('panel-overtime').innerHTML = `
            <div class="agency-cards-row" style="grid-template-columns:1fr 1fr;">
                <div class="agency-card"><h4>Requests</h4><div class="sub">Received vs. processed, by fiscal year</div><div class="chart-canvas-wrap"><canvas id="agency-chart-volume"></canvas></div></div>
                <div class="agency-card"><h4>Backlog</h4><div class="sub">Pending requests at fiscal year end</div><div class="chart-canvas-wrap"><canvas id="agency-chart-backlog"></canvas></div></div>
            </div>
            <div class="agency-cards-row" style="grid-template-columns:1fr 1fr;">
                <div class="agency-card"><h4>Total Cost</h4><div class="sub">Program cost by fiscal year</div><div class="chart-canvas-wrap"><canvas id="agency-chart-cost"></canvas></div></div>
                <div class="agency-card"><h4>Staffing</h4><div class="sub">Full-time FOIA staff (FTE)</div><div class="chart-canvas-wrap"><canvas id="agency-chart-staff"></canvas></div></div>
            </div>
        `;
        const years = a.years;
        const labels = years.map(y => 'FY' + y.year);
        const opt = Explorer.baseChartOptions();
        new Chart(document.getElementById('agency-chart-volume'), { type: 'line', data: { labels, datasets: [
            { label: 'Received', data: years.map(y=>y.received), borderColor: Explorer.NAVY, tension:0.3 },
            { label: 'Processed', data: years.map(y=>y.processed), borderColor: '#2980B9', tension:0.3 },
        ]}, options: opt });
        new Chart(document.getElementById('agency-chart-backlog'), { type: 'line', data: { labels, datasets: [
            { label: 'Backlog', data: years.map(y=>y.backlog), borderColor: Explorer.METRIC_COLORS.backlog, fill:false, tension:0.3 },
        ]}, options: opt });
        new Chart(document.getElementById('agency-chart-cost'), { type: 'bar', data: { labels, datasets: [
            { label: 'Total Cost', data: years.map(y=>y.cost), backgroundColor: Explorer.NAVY },
        ]}, options: opt });
        new Chart(document.getElementById('agency-chart-staff'), { type: 'bar', data: { labels, datasets: [
            { label: 'Staff (FTE)', data: years.map(y=>y.staff), backgroundColor: '#B7791F' },
        ]}, options: opt });
    }

    function renderComponents(a, latest) {
        const chips = (latest.components||[]).map(c => `<span class="component-chip">${c}</span>`).join('');
        document.getElementById('panel-components').innerHTML = `
            <div class="agency-card">
                <h4>Reporting Components \u2014 FY${latest.year}</h4>
                <div class="sub">${latest.component_count} subunit${latest.component_count===1?'':'s'} rolled up into this agency's total</div>
                <div class="component-chip-grid">${chips || '<span class="sub">No subunits reported separately.</span>'}</div>
            </div>
        `;
    }

    function renderDisposition(latest) {
        const disp = latest.disposition || {};
        const rows = Object.keys(DISP_LABELS).map(k => [k, disp[k]||0]).filter(([,v]) => v>0).sort((a,b)=>b[1]-a[1]);
        const total = disp.total || rows.reduce((s,[,v])=>s+v,0);
        document.getElementById('panel-disposition').innerHTML = `
            <div class="agency-card">
                <h4>Full Disposition Breakdown \u2014 FY${latest.year}</h4>
                <div class="sub">${Explorer.fmtNum(total)} total processed requests</div>
                ${rows.map(([k,v]) => `
                    <div class="bar-list-row">
                        <div class="bar-list-label-row"><span class="name">${DISP_LABELS[k]}</span><span class="count">${Explorer.fmtNum(v)} \u00b7 ${total? (v/total*100).toFixed(1):0}%</span></div>
                        <div class="bar-list-track"><div class="bar-list-fill" style="background:${DISP_COLORS[k]};width:${rows[0][1]? (v/rows[0][1]*100).toFixed(1):0}%;"></div></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderExemptions(latest) {
        document.getElementById('panel-exemptions').innerHTML = `
            <div class="agency-card">
                <h4>Exemptions Used \u2014 FY${latest.year}</h4>
                <div class="sub">Counts of each exemption cited (b(n))</div>
                ${exemptionBarListHtml(latest.exemptions, null)}
            </div>
        `;
    }

    function renderBacklog(a, latest) {
        const oldest = (latest.oldest_pending||[]).slice().sort((x,y)=>y-x);
        document.getElementById('panel-backlog').innerHTML = `
            <div class="agency-cards-row" style="grid-template-columns:1.3fr 1fr;">
                <div class="agency-card"><h4>Backlog Over Time</h4><div class="chart-canvas-wrap"><canvas id="agency-chart-backlog2"></canvas></div></div>
                <div class="agency-card">
                    <h4>Oldest Pending Requests</h4>
                    <div class="sub">Age in business days, FY${latest.year}</div>
                    ${oldest.length ? oldest.map((d,i) => `<div class="bar-list-row"><div class="bar-list-label-row"><span class="name">#${i+1} oldest</span><span class="count">${Explorer.fmtNum(d)} days</span></div><div class="bar-list-track"><div class="bar-list-fill" style="background:#C0392B;width:${(d/oldest[0]*100).toFixed(1)}%;"></div></div></div>`).join('') : '<div class="sub">No aged-case data reported.</div>'}
                </div>
            </div>
        `;
        const years = a.years;
        new Chart(document.getElementById('agency-chart-backlog2'), { type: 'line', data: { labels: years.map(y=>'FY'+y.year), datasets: [
            { label: 'Backlog', data: years.map(y=>y.backlog), borderColor: Explorer.METRIC_COLORS.backlog, fill:false, tension:0.3 },
        ]}, options: Explorer.baseChartOptions() });
    }

    function renderCost(a, latest) {
        const cpr = latest.processed ? (latest.cost||0)/latest.processed : null;
        const lcpr = latest.received ? (latest.litigation_cost||0)/latest.received : null;
        document.getElementById('panel-cost').innerHTML = `
            <div class="agency-cards-row">
                <div class="agency-card"><h4>Cost Per Request</h4><div class="agency-kpi-value">${cpr!==null?Explorer.fmtCurrency(cpr):'\u2014'}</div><div class="sub">Total cost \u00f7 requests processed</div></div>
                <div class="agency-card"><h4>Litigation Cost Per Request</h4><div class="agency-kpi-value">${lcpr!==null?Explorer.fmtCurrency(lcpr):'\u2014'}</div><div class="sub">Litigation cost \u00f7 requests received</div></div>
                <div class="agency-card"><h4>Fees Collected</h4><div class="agency-kpi-value">${Explorer.fmtCurrency(latest.fees_collected)}</div><div class="sub">FY${latest.year}</div></div>
            </div>
            <div class="agency-card"><h4>Total Cost Over Time</h4><div class="chart-canvas-wrap"><canvas id="agency-chart-cost2"></canvas></div></div>
        `;
        const years = a.years;
        new Chart(document.getElementById('agency-chart-cost2'), { type: 'bar', data: { labels: years.map(y=>'FY'+y.year), datasets: [
            { label: 'Total Cost', data: years.map(y=>y.cost), backgroundColor: Explorer.NAVY },
            { label: 'Litigation Cost', data: years.map(y=>y.litigation_cost), backgroundColor: '#C0392B' },
        ]}, options: Explorer.baseChartOptions() });
    }

    function renderAppeals(a, latest) {
        const ap = latest.appeals || {};
        document.getElementById('panel-appeals').innerHTML = `
            <div class="agency-cards-row">
                <div class="agency-card"><h4>Appeals Received</h4><div class="agency-kpi-value">${Explorer.fmtNum(ap.received)}</div><div class="sub">FY${latest.year}</div></div>
                <div class="agency-card"><h4>Appeals Processed</h4><div class="agency-kpi-value">${Explorer.fmtNum(ap.processed)}</div><div class="sub">Median response: ${ap.median_days ?? '\u2014'} days</div></div>
                <div class="agency-card"><h4>Appeals Backlog</h4><div class="agency-kpi-value">${Explorer.fmtNum(ap.backlog)}</div><div class="sub">Pending at FY${latest.year} end</div></div>
            </div>
            <div class="agency-card">
                <h4>Appeal Outcomes</h4>
                <div class="sub">Of appeals processed in FY${latest.year}</div>
                ${['affirmed','partially_reversed','reversed'].map(k => {
                    const labels = {affirmed:'Affirmed', partially_reversed:'Partially Reversed/Remanded', reversed:'Completely Reversed/Remanded'};
                    const v = ap[k] || 0;
                    const max = Math.max(ap.affirmed||0, ap.partially_reversed||0, ap.reversed||0, 1);
                    return `<div class="bar-list-row"><div class="bar-list-label-row"><span class="name">${labels[k]}</span><span class="count">${Explorer.fmtNum(v)}</span></div><div class="bar-list-track"><div class="bar-list-fill" style="width:${(v/max*100).toFixed(1)}%;"></div></div></div>`;
                }).join('')}
            </div>
        `;
    }

    function initTabs() {
        document.querySelectorAll('.agency-subtab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.agency-subtab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.agency-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('panel-' + tab.dataset.subtab).classList.add('active');
            });
        });
    }

    function init() {
        initTabs();
        if (!slug) {
            document.getElementById('agency-root').innerHTML = '<div class="agency-not-found">No agency specified. <a href="overview.html">Go to the Data Explorer</a></div>';
            return;
        }
        Explorer.loadAgencyDetail().then(agencies => {
            const a = agencies[slug];
            if (!a || !a.years.length) {
                document.getElementById('agency-root').innerHTML = `<div class="agency-not-found">No data found for "${slug}". <a href="overview.html">Go to the Data Explorer</a></div>`;
                return;
            }
            const latest = a.years[a.years.length - 1];
            const prior = a.years.length > 1 ? a.years[a.years.length - 2] : null;
            renderHeader(a, latest, prior);
            renderOverview(latest);
            renderOverTime(a);
            renderComponents(a, latest);
            renderDisposition(latest);
            renderExemptions(latest);
            renderBacklog(a, latest);
            renderCost(a, latest);
            renderAppeals(a, latest);
        }).catch(err => {
            document.getElementById('agency-root').innerHTML = '<div class="agency-not-found">Could not load agency data.</div>';
            console.error(err);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
