const { ipcRenderer } = window.require("electron");

export function printTest() {
  const root = document.getElementById("root");
  if (root === null) throw new Error("check #root");

  // HTML 문자열을 파싱하여 DOM 요소로 변환
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

  document.getElementById("printBtn").addEventListener("click", () => {
    ipcRenderer.invoke("printChannel", {
      printBackground: true,
      margins: {
        // margin unit is inches, not pixels.
        // Using a value that is too high will result in a `content area is empty` exception.
        // After that, only a restart will restore Electron's print functionality.
        bottom: 1.0,
        marginType: "default",
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
  <button id="printBtn" style="width: 120px; height: 40px">printBtn</button>
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
