const table = document.querySelector('#kt_ViewTable');

if (!table) {
  console.log("Table not found");
} else {
  const url = window.location.href;
  if (url.includes("AttendanceSummaryForStudent")) {
    // Existing attendance logic
    const observer = new MutationObserver(() => {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        rows.forEach(row => {
          if (row.cells.length > 8) { // ensure columns exist
            const present = parseInt(row.cells[6].textContent.trim());
            const absent  = parseInt(row.cells[7].textContent.trim());
            const total   = parseInt(row.cells[8].textContent.trim());
            const lastElem = row.cells[9];
            const needed = Math.max(0, Math.ceil(3 * total - 4 * present));
            const extra = Math.floor(present/0.75 - total)
            if(needed>0){
              lastElem.innerHTML += `<div><span class="needed">${needed} ${needed == 1 ? 'class' : 'classes'} needed 😔</span></div>`
            }else if(extra>-1){
              lastElem.innerHTML += `<div><span class="needed">${extra} bunk(s) left ${extra== 0 ?'🙄' : '😃' }</span></div>`
            }
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(table, {
      childList: true,
      subtree: true
    });
  } else if (url.includes("InternalMarkForStudent")) {
    // New feature: sum columns horizontally for each row and show total
    let observer;
    const processTable = () => {
      if (observer) observer.disconnect();
      const rows = table.querySelectorAll('tr');
      if (rows.length > 1) {
        // Add 'Total' heading if not present
        const headerRow = rows[0];
        if (headerRow && headerRow.cells.length >= 8 && headerRow.cells[headerRow.cells.length - 1].textContent.trim() !== 'Total') {
          const th = document.createElement('th');
          th.textContent = 'Total';
          th.style.background = '#e0e0e0';
          headerRow.appendChild(th);
        }
        // For each data row, sum horizontally and add cell
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].cells;
          if (cells.length >= 8) {
            const parseCell = idx => {
              const val = cells[idx].textContent.trim();
              const num = parseFloat(val.replace(/[^\d.\-]/g, ''));
              return (!isNaN(num) && val !== '-' && val !== '') ? num : 0;
            };
            const total = parseCell(2) + parseCell(3) + parseCell(4) + parseCell(5) + parseCell(6) + parseCell(7);
            // Add or update total cell
            if (cells.length === 8) {
              const td = document.createElement('td');
              td.innerHTML = `<span class=\"needed\">${total}</span>`;
              rows[i].appendChild(td);
            } else if (cells.length === 9) {
              cells[8].innerHTML = `<span class=\"needed\">${total}</span>`;
            }
          }
        }
      }
      if (observer) observer.observe(table, { childList: true, subtree: true });
    };
    observer = new MutationObserver(() => {
      processTable();
    });
    processTable();
  }
}