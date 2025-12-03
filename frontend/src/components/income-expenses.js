import { authorizedFetch } from "../utils/utils-api.js";
import { updateUrlWithPeriodAndDates } from "../utils/utils-url.js";

export class IncomeExpenses {
    constructor() {
        this.container = document.querySelector('.container-income-expenses');
        if (!this.container) return;

        this.btnCreateIncome = this.container.querySelector('.btn-success');
        this.btnCreateExpense = this.container.querySelector('.btn-danger');
        this.filterButtons = this.container.querySelectorAll('.button-gray .btn-outline-secondary');
        this.dateFromInput = this.container.querySelector('#date-from');
        this.dateToInput = this.container.querySelector('#date-to');
        this.tableBody = this.container.querySelector('tbody');

        this.modal = this.container.querySelector('.modal');
        this.btnConfirmDelete = this.modal.querySelector('.btn-success');
        this.btnCancelDelete = this.modal.querySelector('.btn-danger');
        this.operationIdToDelete = null;

        const params = new URLSearchParams(window.location.search);
        this.currentPeriod = params.get('period') || 'day';
        this.currentDateFrom = params.get('dateFrom') || '';
        this.currentDateTo = params.get('dateTo') || '';

        this.setActiveFilterButton();
        this.bindEvents();
        this.bindFilterEvents();
        this.init().catch(err => console.error(err));
    }

    async init() {
        await this.loadOperations(this.currentPeriod, this.currentDateFrom, this.currentDateTo);
    }

    setActiveFilterButton() {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            const text = btn.textContent.trim().toLowerCase();
            if (
                (text === 'сегодня' && this.currentPeriod === 'day') ||
                (text === 'неделя' && this.currentPeriod === 'week') ||
                (text === 'месяц' && this.currentPeriod === 'month') ||
                (text === 'год' && this.currentPeriod === 'year') ||
                (text === 'все' && this.currentPeriod === 'all') ||
                (text === 'интервал' && this.currentPeriod === 'interval')
            ) btn.classList.add('active');
        });
    }

    bindEvents() {
        if (this.btnCreateIncome) {
            this.btnCreateIncome.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = '/income-expenses-add?type=income&period=' + this.currentPeriod;
            });
        }
        if (this.btnCreateExpense) {
            this.btnCreateExpense.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = '/income-expenses-add?type=expense&period=' + this.currentPeriod;
            });
        }
    }

    bindFilterEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', async () => {

                const warningEl = this.container.querySelector('.interval-warning');

                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const text = btn.textContent.trim().toLowerCase();
                let period = 'all';
                let dateFrom = null;
                let dateTo = null;

                switch (text) {
                    case "сегодня": period = "day"; break;
                    case "неделя": period = "week"; break;
                    case "месяц": period = "month"; break;
                    case "год": period = "year"; break;
                    case "все": period = "all"; break;
                    case "интервал":
                        period = "interval";
                        dateFrom = this.dateFromInput.value;
                        dateTo = this.dateToInput.value;

                        if (!dateFrom || !dateTo) {
                            warningEl.style.display = 'inline-block';
                            return;
                        } else {
                            warningEl.style.display = 'none';
                        }
                        break;
                }

                this.currentPeriod = period;
                this.currentDateFrom = dateFrom;
                this.currentDateTo = dateTo;

                await this.loadOperations(this.currentPeriod, this.currentDateFrom, this.currentDateTo);
            });
        });
    }

    async loadOperations(period = 'day', dateFrom = null, dateTo = null) {
        try {
            let url = `http://localhost:3000/api/operations?period=${period}`;
            if (period === 'interval') url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            const operations = await authorizedFetch(url);
            this.renderTable(operations);

            window.dispatchEvent(new CustomEvent('operationsLoaded'));

        } catch (e) {
            console.error("Ошибка загрузки операций:", e);
        }
    }

    renderTable(data) {
        this.tableBody.innerHTML = '';
        if (!data || !data.length) {
            this.tableBody.innerHTML = `<tr><td colspan="7" class="py-3">Нет операций</td></tr>`;
            return;
        }
        data.forEach((op, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${op.type === 'income' ? "Доход" : "Расход"}</td>
                <td>${op.category}</td>
                <td>${op.amount}</td>
                <td>${op.date}</td>
                <td>${op.comment || ""}</td>
                <td>
                    <a href="javascript:void(0)" class="btn btn-sm border-0 ms-1 btn-delete" data-id="${op.id}">
                        <i class="bi bi-trash"></i>
                    </a>
                    <a href="/income-expenses-edit?id=${op.id}&period=${this.currentPeriod}${this.currentPeriod === 'interval'
                ? `&dateFrom=${this.currentDateFrom}&dateTo=${this.currentDateTo}`
                : ''}" class="btn btn-sm border-0 ms-1">
                        <i class="bi bi-pencil"></i>
                    </a>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
        this.bindDeleteButtons();
    }

    bindDeleteButtons() {
        const buttons = this.tableBody.querySelectorAll('.btn-delete');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.operationIdToDelete = btn.dataset.id;
                this.modal.style.display = 'block';
            });
        });

        this.btnConfirmDelete.addEventListener('click', async () => {
            if (!this.operationIdToDelete) return;
            try {
                await authorizedFetch(`http://localhost:3000/api/operations/${this.operationIdToDelete}`, { method: "DELETE" });
                this.operationIdToDelete = null;
                this.modal.style.display = 'none';

                updateUrlWithPeriodAndDates(this.currentPeriod, this.currentDateFrom, this.currentDateTo);

                await this.loadOperations(this.currentPeriod, this.currentDateFrom, this.currentDateTo);
                if (window.layoutInstance) await window.layoutInstance.renderBalance();

            } catch (e) {
                console.error("Ошибка удаления:", e);
                this.modal.style.display = 'none';
            }
        });

        this.btnCancelDelete.addEventListener('click', () => {
            this.operationIdToDelete = null;
            this.modal.style.display = 'none';
        });
    }
}
