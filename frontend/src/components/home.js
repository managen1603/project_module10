import { renderIncomeExpensesCharts } from "../utils/utils-charts.js";
import { authorizedFetch } from "../utils/utils-api.js";

export class Home {
    constructor() {
        this.container = document.querySelector('.container-home');
        if (!this.container) return;

        this.filterButtons = this.container.querySelectorAll('.button-gray .btn-outline-secondary');
        this.dateFromInput = this.container.querySelector('#date-from');
        this.dateToInput = this.container.querySelector('#date-to');

        this.currentPeriod = 'day';
        this.currentDateFrom = null;
        this.currentDateTo = null;

        this.bindFilterEvents();
        void this.loadAndRender();
    }

    bindFilterEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', async () => {

                const warningEl = this.container.querySelector('.interval-warning');

                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const text = btn.textContent.trim().toLowerCase();

                switch (text) {
                    case "сегодня": this.currentPeriod = 'day'; break;
                    case "неделя": this.currentPeriod = 'week'; break;
                    case "месяц": this.currentPeriod = 'month'; break;
                    case "год": this.currentPeriod = 'year'; break;
                    case "все": this.currentPeriod = 'all'; break;
                    case "интервал":
                        this.currentPeriod = 'interval';
                        this.currentDateFrom = this.dateFromInput.value;
                        this.currentDateTo = this.dateToInput.value;

                        if (!this.currentDateFrom || !this.currentDateTo) {
                            warningEl.style.display = 'inline-block';
                            return;
                        } else {
                            warningEl.style.display = 'none';
                        }
                        break;
                }

                await this.loadAndRender();
            });
        });
    }

    async loadAndRender() {
        try {
            let url = `http://localhost:3000/api/operations?period=${this.currentPeriod}`;
            if (this.currentPeriod === 'interval') {
                url += `&dateFrom=${this.currentDateFrom}&dateTo=${this.currentDateTo}`;
            }

            const operations = await authorizedFetch(url);

            const incomeLabels = [];
            const incomeValues = [];
            const expensesLabels = [];
            const expensesValues = [];

            operations.forEach(op => {
                const label = op.comment ? `${op.comment}` : op.category;

                if (op.type === 'income') {
                    incomeLabels.push(label);
                    incomeValues.push(Number(op.amount));
                } else {
                    expensesLabels.push(label);
                    expensesValues.push(Number(op.amount));
                }
            });

            const incomeData = { labels: incomeLabels, values: incomeValues };
            const expensesData = { labels: expensesLabels, values: expensesValues };

            renderIncomeExpensesCharts(incomeData, expensesData);

        } catch (err) {
            console.error('Ошибка загрузки операций:', err);
        }
    }
}
