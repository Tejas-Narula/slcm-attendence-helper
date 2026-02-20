const table = document.querySelector('#kt_ViewTable');

if (!table) {
  console.log("Table not found");
} else {

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

          if(needed && needed>0){
            lastElem.innerHTML += `<br><span class="needed">attend ${needed} more classes</span>`
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
}