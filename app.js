// Suivi du Fonds de Prevoyance - Single-file app (corrected for GitHub Pages)
const INITIAL = {"sheet_name": "Outil de suivi", "rows": 35, "cols": 18, "ecart_columns": [13, 15, 17], "data": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["Outil de suivi annuel du fonds de prévoyance", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["Copier coller dans toutes les cellules et colonnes en jaune\nProtéger le classeur sans mot de passe\nCopier / coller le Nom du Syndicat ici", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["Valeur du fonds de prévoyance en 2025", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "", "", "Stratégie 1", "", "Stratégie 2", "", "Stratégie 3", ""], ["Année", "No. Année", "Budget annuel", "Dépenses annuelles", "Apport annuel au fonds de prévoyance", "Intérêts des placements", "Apports additionnels", "", "Dépenses prévues dans le plan de maintien de l'actif", "", "Valeur du fonds de prévoyance à la fin de l'année", "", "Valeur cible", "Écart", "Valeur cible", "Écart", "Valeur cible", "Écart"], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", "", "A venir", "", "", "", "", "", "", ""]]};


function numberOrZero(v) {
  if (v === null || v === undefined) return 0;
  const n = parseFloat(String(v).replace(/[^0-9\-\.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function toStringSafe(v) {
  return v === null || v === undefined ? '' : String(v);
}

function DashboardApp() {
  const { useState, useEffect, useRef } = React;
  const [authenticated, setAuthenticated] = useState(false);
  const [pwd, setPwd] = useState('');
  const [data, setData] = useState(INITIAL.data);
  const [cols, setCols] = useState(INITIAL.cols);
  const [rows, setRows] = useState(INITIAL.rows);
  const ECART_COLS = INITIAL.ecart_columns || [];
  const tableRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    recalcAllEcarts(data);
    setTimeout(drawChart, 300);
  }, []);

  function tryLogin(e) {
    e && e.preventDefault && e.preventDefault();
    if (pwd === 'Cyril') setAuthenticated(true);
    else alert('Mot de passe incorrect');
  }

  function updateCell(r, c, value) {
    if (ECART_COLS.includes(c)) return;
    setData(prev => {
      const copy = prev.map(row => [...row]);
      while (r >= copy.length) copy.push(Array(cols).fill(''));
      while (c >= copy[r].length) copy[r].push('');
      copy[r][c] = value;
      recalcRowEcarts(copy, r);
      return copy;
    });
    setTimeout(drawChart, 100);
  }

  function recalcRowEcarts(copy, r) {
    ECART_COLS.forEach(ec => {
      const idxReal = ec - 1;
      const idxPrev = ec - 2;
      const real = idxReal >=0 && idxReal < copy[r].length ? numberOrZero(copy[r][idxReal]) : 0;
      const prev = idxPrev >=0 && idxPrev < copy[r].length ? numberOrZero(copy[r][idxPrev]) : 0;
      const val = real - prev;
      if (ec < copy[r].length) copy[r][ec] = String(val);
      else { while (ec >= copy[r].length) copy[r].push(''); copy[r][ec] = String(val); }
    });
  }

  function recalcAllEcarts(copy) {
    for (let r=0; r<copy.length; r++) recalcRowEcarts(copy, r);
    setData(copy.map(row => row.map(c=>toStringSafe(c))));
  }

  function exportExcel() {
    try {
      const wb = window.XLSX.utils.book_new();
      const ws = window.XLSX.utils.aoa_to_sheet(data);
      window.XLSX.utils.book_append_sheet(wb, ws, INITIAL.sheet_name || 'Sheet1');
      window.XLSX.writeFile(wb, (INITIAL.sheet_name || 'export') + '.xlsx');
    } catch (err) { alert('Erreur export Excel: ' + err); }
  }

  async function exportPDF() {
    try {
      const elem = tableRef.current;
      if (!elem) { alert('Table introuvable'); return; }
      const canvas = await window.html2canvas(elem, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save((INITIAL.sheet_name || 'export') + '.pdf');
    } catch (err) { alert('Erreur export PDF: ' + err); }
  }

  function drawChart() {
    try {
      const ctx = chartRef.current && chartRef.current.getContext('2d');
      if (!ctx) return;
      const sums = Array(cols).fill(0);
      for (let r=0; r<data.length; r++) for (let c=0; c<cols; c++) sums[c] += numberOrZero(data[r][c]);
      const labels = sums.map((_,i)=>'Col ' + i);
      const ds = sums.map(s=>s);
      if (window._suivi_chart) window._suivi_chart.destroy();
      window._suivi_chart = new window.Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Sums', data: ds }] },
        options: { responsive: true, maintainAspectRatio: false }
      });
    } catch (e) { console.warn(e); }
  }

  if (!authenticated) return React.createElement('div', {className:'min-h-screen flex items-center justify-center'}, 
    React.createElement('div', {className:'bg-white p-6 rounded shadow w-full max-w-md'}, 
      React.createElement('h2', {className:'text-xl font-bold mb-4'}, 'Connexion — Suivi du Fonds de Prevoyance'),
      React.createElement('form', {onSubmit:tryLogin},
        React.createElement('input', {type:'password', placeholder:'Mot de passe', value:pwd, onChange:(e)=>setPwd(e.target.value), className:'w-full p-2 border rounded mb-3'}),
        React.createElement('div', {className:'flex gap-2'},
          React.createElement('button', {className:'px-3 py-2 bg-blue-600 text-white rounded', onClick:tryLogin}, 'Se connecter'),
          React.createElement('button', {type:'button', className:'px-3 py-2 bg-gray-200 rounded', onClick:function(){setPwd('Cyril'); alert('Mot de passe rempli automatiquement (Cyril) pour tester');}}, 'Test')
        )
      ),
      React.createElement('p', {className:'text-sm text-gray-500 mt-3'}, 'Le mot de passe est celui que tu as demande : Cyril.')
    )
  );

  return React.createElement('div', {className:'min-h-screen flex'}, 
    React.createElement('aside', {className:'w-64 bg-white shadow p-4'},
      React.createElement('h2', {className:'text-lg font-bold mb-4'}, 'Suivi - Menu'),
      React.createElement('div', {className:'mb-4'},
        React.createElement('button', {onClick:exportExcel, className:'w-full py-2 bg-green-600 text-white rounded mb-2'}, 'Exporter Excel'),
        React.createElement('button', {onClick:exportPDF, className:'w-full py-2 bg-indigo-600 text-white rounded'}, 'Exporter PDF')
      ),
      React.createElement('div', {className:'text-sm text-gray-600 mt-6'},
        'Colonnes Ecart calculees automatiquement (Reel - Prevu)\n(heuristique: Reel = cellule juste a gauche de Ecart, Prevu = cellule deux a gauche).'
      )
    ),
    React.createElement('main', {className:'flex-1 p-6'},
      React.createElement('header', {className:'flex items-center justify-between mb-6'},
        React.createElement('h1', {className:'text-2xl font-bold'}, 'Suivi du Fonds de Prevoyance'),
        React.createElement('div', {className:'text-sm text-gray-500'}, 'Utilisateur: Cyril')
      ),
      React.createElement('div', {className:'grid grid-cols-3 gap-4 mb-6'},
        React.createElement('div', {className:'bg-white p-4 rounded shadow'}, React.createElement('h3', null, 'Total rows'), React.createElement('div', {className:'text-2xl font-bold'}, data.length)),
        React.createElement('div', {className:'bg-white p-4 rounded shadow'}, React.createElement('h3', null, 'Total cols'), React.createElement('div', {className:'text-2xl font-bold'}, cols)),
        React.createElement('div', {className:'bg-white p-4 rounded shadow'}, React.createElement('h3', null, 'Protected cols'), React.createElement('div', {className:'text-2xl font-bold'}, ECART_COLS.join(', ')))
      ),
      React.createElement('div', {className:'grid grid-cols-3 gap-4'},
        React.createElement('div', {className:'col-span-1 bg-white p-4 rounded shadow', style:{height:300}},
          React.createElement('canvas', {ref:chartRef, style:{width:'100%',height:'100%'}})
        ),
        React.createElement('div', {className:'col-span-2 bg-white p-4 rounded shadow overflow-auto'},
          React.createElement('div', {ref:tableRef},
            React.createElement('table', {className:'min-w-full table-auto border-collapse text-sm'},
              React.createElement('tbody', null,
                data.map(function(row,r){ return React.createElement('tr', {key:r, className: r%2===0 ? 'bg-white' : 'bg-gray-50'},
                  row.map(function(cell,c){ return React.createElement('td', {key:c, className:'border p-2 align-top', style:{minWidth:110}},
                    ECART_COLS.includes(c)
                      ? React.createElement('div', {className:'text-gray-700 whitespace-pre-wrap'}, toStringSafe(cell))
                      : React.createElement('textarea', {value:toStringSafe(cell), onChange:function(e){updateCell(r,c,e.target.value);}, className:'w-full min-h-[2rem] resize-none p-1 border rounded'})
                  ); })
                ); })
              )
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(DashboardApp));
