// Get the modal
window.onload = function () {
  var modal = document.querySelector('.modal');
  modal.style.display = "block";
  const expenseForm = document.getElementById("expenseForm");
  const amountInput = document.getElementById("amountInput");
  const dateInput = document.getElementById("dateInput");
  const table = document.getElementById("expenseTable").getElementsByTagName("tbody")[0];
  const downloadBtn = document.getElementById("downloadBtn");
  const filenameInput = document.getElementById("filenameInput");
  const uploadBtn = document.getElementById("uploadBtn");

  // Add event listener to form submit
  expenseForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const amount = amountInput.value;
      const date = dateInput.value;

      if (amount === "" || date === "") {
          alert("Please fill in all fields.");
          return;
      }
      const row = table.insertRow();
      const amountCell = row.insertCell(0);
      const dateCell = row.insertCell(1);


      amountCell.textContent = amount;
      dateCell.textContent = date;

      // Clear form inputs
      amountInput.value = "";
      dateInput.value = "";

      updateTotal();
  });

// Add event listener to download button
downloadBtn.addEventListener("click", function () {
  const filename = filenameInput.value.trim();
  if (filename === "") {
      alert("Please enter a file name.");
      return;
  }
  // Create a new Workbook
  const wb = XLSX.utils.book_new();
  wb.Props = {
      Title: "Expense Tracker",
      Subject: "Expenses",
      Author: "Expense Tracker App",
      CreatedDate: new Date(),
  };
  wb.SheetNames.push("Sheet1");
  const tableName = "Expense Table";
  const ws_data = [tableName, "Amount", "Date"];
  // Loop through table rows and add data to worksheet
  const rows = table.rows;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowData = [tableName, row.cells[0].textContent, row.cells[1].textContent];
    ws_data.push(rowData);
  }

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Sheet1"] = ws;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

  // Save file using FileSaver.js
  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${filename}.xlsx`);

});


  // Utility function to convert string to ArrayBuffer
  function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
  }
  // Update the amountInput event listener
  amountInput.addEventListener("input", function () {
      // Get the input value
      let inputValue = amountInput.value;

      // Remove the £ symbol from the input value
      inputValue = inputValue.replace("£", "");

      // Check if the input value is not empty
      if (inputValue !== "") {
          // Add £ symbol at the beginning of the input value
          inputValue = "£" + inputValue;
      }

      // Set the updated input value
      amountInput.value = inputValue;
  });
  
  
  // Function to handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Clear existing table rows
      while (table.rows.length > 0) {
        table.deleteRow(0);
      }
  
      // Add rows from uploaded file
      for (let i = 1; i < rows.length; i++) {
        const row = table.insertRow();
        const amountCell = row.insertCell(0);
        const dateCell = row.insertCell(1);
  

        amountCell.textContent = rows[i][0];
        dateCell.textContent = rows[i][1];
      }
  
      updateTotal(); // Update the total after adding rows from the uploaded file
    };
  
    reader.readAsArrayBuffer(file);
  }

  

  // Function to update total amount
  function updateTotal() {
    let total = 0;
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const amountStr = rows[i].cells[0].innerHTML.replace("£", ""); // Get the amount value and remove the pound sign
        const amount = parseFloat(amountStr); // Convert the amount value to float
        total += amount; // Add the amount to total
    }
    document.getElementById("totalAmount").innerHTML = total.toFixed(2); // Update the total amount in the UI and round it to 2 decimal places
}

  

  // Add event listener to the button
  document.getElementById("uploadBtn").addEventListener("click", function () {
    document.getElementById("fileInput").click();
  });

  // Add event listener to the file input
  document.getElementById("fileInput").addEventListener("change", handleFileUpload);

   // Reset button event listener
   const resetBtn = document.getElementById("resetBtn");
   resetBtn.addEventListener("click", function () {
     // Clear form inputs
     amountInput.value = "";
     dateInput.value = "";
 
     // Clear table rows
     while (table.rows.length > 0) {
       table.deleteRow(0);
     }
 
     // Update total
     updateTotal();
   });

   // Get the buttons
var button1 = document.querySelector('#createBtn');
var button2 = document.querySelector('#uploadBtn');

// Add click event listeners to the buttons
button1.addEventListener('click', function() {
  modal.style.display = "none";
});

button2.addEventListener('click', function() {
  modal.style.display = "none";
});

document.getElementById("createBtn").addEventListener("click", function() {
  const customerName = window.prompt("Please enter the name of the customer:");
  if (customerName) {
      document.getElementById("expenseTable").getElementsByTagName("th")[0].textContent = customerName;
  }
});


}


