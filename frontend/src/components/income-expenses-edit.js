import { authorizedFetch } from "../utils/utils-api.js";
import { updateUrlWithPeriodAndDates } from "../utils/utils-url.js";

export class IncomeExpensesEdit {
    constructor() {
        this.container = document.querySelector('.container-income-expenses-edit');
        if (!this.container) return;

        this.typeSelect = this.container.querySelector('#incomeExpensesName');
        this.categorySelect = this.container.querySelector('#incomeExpensesCategory');
        this.amountInput = this.container.querySelector('#incomeExpensesAmount');
        this.dateInput = this.container.querySelector('#incomeExpensesDate');
        this.commentInput = this.container.querySelector('#incomeExpensesComment');

        if (!this.typeSelect || !this.categorySelect || !this.amountInput) return;

        this.init().catch(err => console.error(err));
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        this.currentPeriod = params.get('period') || 'day';
        this.currentDateFrom = params.get('dateFrom') || null;
        this.currentDateTo = params.get('dateTo') || null;

        const id = params.get('id');
        if (!id) return alert("ID операции не найден");
        this.operationId = id;

        const operation = await authorizedFetch(`http://localhost:3000/api/operations/${id}`);
        if (!operation) return alert('Не удалось загрузить операцию');

        this.typeSelect.value = operation.type;
        await this.loadCategories(operation.type, operation.category_id);

        this.amountInput.value = operation.amount ?? '';
        this.dateInput.value = operation.date ?? '';
        this.commentInput.value = operation.comment ?? '';

        this.typeSelect.addEventListener('change', () => {
            const t = this.typeSelect.value.toLowerCase().includes('доход') ? 'income' : 'expense';
            this.loadCategories(t).catch(console.error);
        });

        const btnSave = this.container.querySelector('.btn-success');
        if (btnSave) {
            btnSave.addEventListener('click', async () => {
                const data = {
                    type: this.typeSelect.value,
                    category_id: Number(this.categorySelect.value),
                    amount: Number(this.amountInput.value), // <-- обязательно Number()
                    date: this.dateInput.value,
                    comment: this.commentInput.value
                };
                if (!data.type || !data.category_id || !data.amount || !data.date) {
                    return alert('Заполните все обязательные поля!');
                }

                try {
                    await authorizedFetch(`http://localhost:3000/api/operations/${this.operationId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    updateUrlWithPeriodAndDates(this.currentPeriod, this.currentDateFrom, this.currentDateTo);
                    window.dispatchEvent(new Event('popstate'));

                    window.dispatchEvent(new Event('popstate'));

                    if (window.layoutInstance) {
                        await window.layoutInstance.renderBalance();
                    }

                } catch (err) {
                    console.error(err);
                    alert('Не удалось сохранить операцию');
                }
            });

        }

        const btnCancel = this.container.querySelector('.btn-danger');
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                const urlParams = new URLSearchParams();
                urlParams.set('period', this.currentPeriod);
                if (this.currentPeriod === 'interval') {
                    urlParams.set('dateFrom', this.currentDateFrom);
                    urlParams.set('dateTo', this.currentDateTo);
                }
                window.location.href = '/income-expenses?' + urlParams.toString();
            });
        }
    }

    async loadCategories(type, selectedCategoryId) {
        if (!type) return;
        try {
            const categories = await authorizedFetch(`http://localhost:3000/api/categories/${type}`);
            this.categorySelect.innerHTML = '<option value="" disabled>Категория...</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.title;
                if (selectedCategoryId && cat.id === selectedCategoryId) option.selected = true;
                this.categorySelect.appendChild(option);
            });
        } catch (err) {
            console.error(err);
        }
    }
}
