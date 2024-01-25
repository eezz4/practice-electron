const { ipcRenderer } = window.require("electron");

export function printTest() {
  const root = document.getElementById("root");
  if (root === null) throw new Error("check #root");

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  root.appendChild(doc.body);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust
  root.style.webkitPrintColorAdjust = "exact";
  root.style.background = "#66dd66";

  const tableBody = document.getElementById("tableBody");
  if (tableBody === null) throw new Error("check #tableBody");
  const row = tableBody.firstElementChild;
  if (row === null) throw new Error("check tableBodyRow");

  const rows = Array.from({ length: 250 }).map((_, idx) => {
    const tableRow = row.cloneNode(true);
    tableRow.childNodes.forEach((v) => {
      if (v instanceof HTMLTableCellElement) v.textContent = idx.toString();
    });
    return tableRow;
  });

  tableBody.append(...rows);

  document.getElementById("printBtnLarge").addEventListener("click", () => {
    // Test reproduction path: LARGE_INCH_PRINT button handler
    ipcRenderer.invoke("printChannel", {
      printBackground: true,
      margins: {
        top: 10.0, // large inch
        bottom: 10.0, // large inch
      },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: makeTemplate(
        "footer-leftleftleftleftleftleftleftleftleftleftleftleftleftleft"
      ),
    });
  });

  document.getElementById("printBtnNormal").addEventListener("click", () => {
    // Test reproduction path: NORMAL_PRINT button handler
    ipcRenderer.invoke("printChannel", {
      printBackground: true,
      margins: {
        top: 1.0, // normal inch
        bottom: 1.0, // normal inch
      },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: makeTemplate(
        "footer-leftleftleftleftleftleftleftleftleftleftleftleftleftleft"
      ),
    });
  });
}

function makeTemplate(str) {
  return `
        <div style="
          display:flex;
          justify-content:space-between;
          font-size:20px;
          width:100%;
          padding:3%;"
          >  
          <span>${str}</span>
          <div style="display:flex">
            <span class="pageNumber"></span>
            <span>/</span>
            <span class="totalPages"></span>
          </div>
        </div>`;
}

const htmlString = `
  <button id="printBtnLarge" style="width: 200px; height: 40px">LARGE_INCH_PRINT</button>
  <button id="printBtnNormal" style="width: 200px; height: 40px">NORMAL_PRINT</button>
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
    </thead>
    <tbody id="tableBody">
      <tr>
        <td>Data 1-1</td>
        <td>Data 1-2</td>
      </tr>
    </tbody>
  </table>
`;
