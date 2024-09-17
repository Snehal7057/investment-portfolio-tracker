document.addEventListener('DOMContentLoaded', () => {
    const investments = [];
    const totalValueElement = document.getElementById('total-value');
    const investmentTable = document.getElementById('investment-table').getElementsByTagName('tbody')[0];
    const addInvestmentButton = document.getElementById('add-investment-button');
    const addInvestmentForm = document.getElementById('add-investment-form');
    const updateInvestmentForm = document.getElementById('update-investment-form');
    const pieChartCanvas = document.getElementById('pie-chart');
    let pieChart;

    // Show Add Investment Form
    addInvestmentButton.addEventListener('click', () => {
        addInvestmentForm.classList.toggle('hidden');
        updateInvestmentForm.classList.add('hidden');
    });

    // Add New Investment
    document.getElementById('submit-new-investment').addEventListener('click', () => {
        const assetName = document.getElementById('new-asset-name').value;
        const invested = parseFloat(document.getElementById('new-invested').value);
        const currentValue = parseFloat(document.getElementById('new-current-value').value);

        if (assetName && !isNaN(invested) && !isNaN(currentValue)) {
            investments.push({ assetName, invested, currentValue });
            updateInvestmentTable();
            updatePieChart();
            addInvestmentForm.classList.add('hidden');
        } else {
            alert('Please enter valid investment details.');
        }
    });

    // Update Investment
    document.getElementById('submit-update-investment').addEventListener('click', () => {
        const index = parseInt(document.getElementById('update-asset-index').value);
        const assetName = document.getElementById('update-asset-name').value;
        const invested = parseFloat(document.getElementById('update-invested').value);
        const currentValue = parseFloat(document.getElementById('update-current-value').value);

        if (assetName && !isNaN(invested) && !isNaN(currentValue)) {
            investments[index] = { assetName, invested, currentValue };
            updateInvestmentTable();
            updatePieChart();
            updateInvestmentForm.classList.add('hidden');
        } else {
            alert('Please enter valid investment details.');
        }
    });

    // Remove Investment
    window.removeInvestment = (index) => {
        investments.splice(index, 1);
        updateInvestmentTable();
        updatePieChart();
    };

    // Show Update Investment Form
    window.showUpdateForm = (index) => {
        const investment = investments[index];
        document.getElementById('update-asset-name').value = investment.assetName;
        document.getElementById('update-invested').value = investment.invested.toFixed(2);
        document.getElementById('update-current-value').value = investment.currentValue.toFixed(2);
        document.getElementById('update-asset-index').value = index;
        updateInvestmentForm.classList.remove('hidden');
        addInvestmentForm.classList.add('hidden');
    };

    // Update Investment Table
    function updateInvestmentTable() {
        investmentTable.innerHTML = '';
        let totalValue = 0;

        investments.forEach((investment, index) => {
            const row = investmentTable.insertRow();
            row.insertCell().textContent = investment.assetName;
            row.insertCell().textContent = `$${investment.invested.toFixed(2)}`;
            row.insertCell().textContent = `$${investment.currentValue.toFixed(2)}`;
            row.insertCell().textContent = `${(((investment.currentValue - investment.invested) / investment.invested) * 100).toFixed(2)}%`;
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button onclick="showUpdateForm(${index})">Update</button>
                <button onclick="removeInvestment(${index})">Remove</button>
            `;
            totalValue += investment.currentValue;
        });

        totalValueElement.textContent = `$${totalValue.toFixed(2)}`;
    }

    // Update Pie Chart
    function updatePieChart() {
        const labels = investments.map(inv => inv.assetName);
        const data = investments.map(inv => inv.currentValue);

        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Asset Distribution',
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                return `${label}: $${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
});

