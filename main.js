document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');
    const totalIncomeElement = document.getElementById('totalIncome');
    const totalSpentElement = document.getElementById('totalSpent');
  
    let totalIncome = 0;
    let totalSpent = 0;
  
    // Clear localStorage on page load
    localStorage.clear();
  
    // Initialize Chart.js (Pie Chart)
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [], // Categories will go here
        datasets: [{
          label: 'Expenses by Category',
          data: [], // Amounts will go here
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `₹${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  
    // Add transaction
    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const amount = parseFloat(document.getElementById('amount').value);
      const category = document.getElementById('category').value;
      const paymentType = document.getElementById('paymentType').value;
      const date = new Date().toLocaleString(); // Get current date and time
  
      if (amount && category && paymentType) {
        addTransaction(amount, category, paymentType, date);
        saveTransaction(amount, category, paymentType, date);
        updateTotals(amount, category);
        updateChart(category, amount);
        transactionForm.reset();
      }
    });
  
    // Add transaction to list
    function addTransaction(amount, category, paymentType, date) {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${category}</span>
        <span>₹${amount.toFixed(2)}</span>
        <span>${date}</span>
      `;
      transactionList.appendChild(li);
    }
  
    // Save transaction to localStorage
    function saveTransaction(amount, category, paymentType, date) {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      transactions.push({ amount, category, paymentType, date });
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  
    // Update totals
    function updateTotals(amount, category) {
      if (category === 'Salary') {
        totalIncome += amount;
        totalIncomeElement.textContent = `₹${totalIncome.toFixed(2)}`;
      } else {
        totalSpent += amount;
        totalSpentElement.textContent = `₹${totalSpent.toFixed(2)}`;
      }
    }
  
    // Update chart
    function updateChart(category, amount) {
      const index = expenseChart.data.labels.indexOf(category);
  
      if (index === -1) {
        // Add new category
        expenseChart.data.labels.push(category);
        expenseChart.data.datasets[0].data.push(amount);
      } else {
        // Update existing category
        expenseChart.data.datasets[0].data[index] += amount;
      }
  
      expenseChart.update();
    }
  });