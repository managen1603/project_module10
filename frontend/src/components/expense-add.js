import {authorizedFetch} from "../utils/utils-api";

export class ExpenseAdd {
    constructor() {
        this.container = document.querySelector('.container-expense-add');
        this.input = this.container?.querySelector('#expenseName');
        this.errorEl = this.container?.querySelector('.error-expense-add');
        this.btnCreate = this.container?.querySelector('.btn-success');
        this.btnCancel = this.container?.querySelector('.btn-danger');

        this.apiUrl = 'http://localhost:3000/api/categories/expense';

        this.init();
    }

    init() {
        if (!this.btnCreate || !this.input) return;

        this.btnCreate.addEventListener('click', () => this.createCategory());
        this.btnCancel.addEventListener('click', () => {
            window.location.href = '/expense';
        });

        this.input.addEventListener('input', () => {
            if (this.errorEl) this.errorEl.classList.add('d-none');
        });
    }

    async createCategory() {
        const title = this.input.value.trim();

        if (this.errorEl) this.errorEl.classList.add('d-none');

        if (!title) {
            if (this.errorEl) {
                this.errorEl.textContent = 'Введите название категории расхода';
                this.errorEl.classList.remove('d-none');
            }
            return;
        }

        try {
            await authorizedFetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });

            window.location.href = '/expense';

        } catch (err) {
            console.error('Ошибка создания категории расхода:', err);

            let msg = 'Не удалось создать категорию расхода';
            if (err.message.includes('This record already exists')) {
                msg = 'Такая категория расхода уже создана';
            }

            if (this.errorEl) {
                this.errorEl.textContent = msg;
                this.errorEl.classList.remove('d-none');
            }
        }
    }
}