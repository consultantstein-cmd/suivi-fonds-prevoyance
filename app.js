
const e = React.createElement;

function App() {
  const [password, setPassword] = React.useState("");
  const [auth, setAuth] = React.useState(false);
  const [data, setData] = React.useState([["A", "B", "C"], ["1", "2", "3"]]);

  function handleLogin() {
    if (password === "Cyril") setAuth(true);
    else alert("Mot de passe incorrect");
  }

  function updateCell(r,c,val) {
    const copy = data.map(row => [...row]);
    copy[r][c] = val;
    setData(copy);
  }

  function exportExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Fonds");
    XLSX.writeFile(wb, "suivi_fonds.xlsx");
  }

  async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("table");
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10);
    pdf.save("suivi_fonds.pdf");
  }

  if (!auth) {
    return e("div", null,
      e("h2", null, "Connexion"),
      e("input", {type:"password", onChange:(ev)=>setPassword(ev.target.value)}),
      e("button", {onClick:handleLogin}, "Entrer")
    );
  }

  return e("div", null,
    e("h1", null, "Suivi du Fonds de Prévoyance"),
    e("table", {id:"table", border:1},
      data.map((row,r)=>
        e("tr", {key:r},
          row.map((cell,c)=>
            e("td", {key:c},
              e("input", {
                value:cell,
                onChange:(ev)=>updateCell(r,c,ev.target.value)
              })
            )
          )
        )
      )
    ),
    e("button", {onClick:exportExcel}, "Exporter Excel"),
    e("button", {onClick:exportPDF}, "Exporter PDF")
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));
