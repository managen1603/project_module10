import { Chart, PieController, ArcElement, Legend, Tooltip } from 'chart.js';

const legendSpacingPlugin = {
    id: 'legendSpacing',
    beforeInit(chart, args, options) {
        const originalFit = chart.legend.fit;
        chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += options?.extraSpace || 0;
        };
    }
};

Chart.register(PieController, ArcElement, Legend, Tooltip, legendSpacingPlugin);

let incomeChartInstance = null;
let expensesChartInstance = null;

export function renderIncomeExpensesCharts() {
    const incomeCtx = document.getElementById('incomeChart');
    const expensesCtx = document.getElementById('expensesChart');

    if (!incomeCtx || !expensesCtx) return;

    if (incomeChartInstance) incomeChartInstance.destroy();
    if (expensesChartInstance) expensesChartInstance.destroy();

    incomeChartInstance = new Chart(incomeCtx, {
        type: 'pie',
        data: {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [500, 150, 350, 470, 210],
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                legendSpacing: {
                    extraSpace: 40
                }
            }
        }
    });

    expensesChartInstance = new Chart(expensesCtx, {
        type: 'pie',
        data: {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [300, 500, 800, 400, 900],
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                legendSpacing: {
                    extraSpace: 40
                }
            }
        }
    });
}
