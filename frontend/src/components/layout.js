import {getCurrentUser} from "../utils/utils-auth";
import {getBalance, updateBalance} from "../utils/utils-api";

export class Layout {

    constructor() {
        this.renderUserInfo();
        this.initProfileMenu();
        this.initCategories();
        this.highlightActiveMenu();

        void this.renderBalance();
        void this.initBalanceUpdate();

        this.balanceLoaded = false;

        window.layoutInstance = this;
    }

    async renderBalance() {
        const span = document.getElementById('balance-amount');
        if (!span) return;

        try {
            const data = await getBalance();
            const balance = Number(data.balance);
            if (isNaN(balance)) throw new Error('Баланс не является числом');

            span.textContent = `${balance.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`;
            span.title = 'Текущий баланс';
            this.balanceLoaded = true;
        } catch (error) {
            console.error('Ошибка при получении баланса', error);
            span.textContent = 'Нет данных';
            span.title = 'Не удалось загрузить баланс. Попробуйте позже';
            this.balanceLoaded = false;
        }
    }

    async initBalanceUpdate() {
        const balanceDiv = document.getElementById('balance');
        const modal = document.getElementById('balance-modal');
        const input = document.getElementById('balance-input');
        const saveBtn = document.getElementById('balance-save');
        const cancelBtn = document.getElementById('balance-cancel');

        balanceDiv.addEventListener('click', () => {
            if (!this.balanceLoaded) {
                alert('Баланс не загружен, редактирование недоступно.');
                return;
            }

            const span = document.getElementById('balance-amount');
            input.value = span.textContent.replace('$', '');

            modal.classList.remove('d-none');
        });

        cancelBtn.addEventListener('click', () => {
            modal.classList.add('d-none');
        });

        saveBtn.addEventListener('click', async () => {
            const newBalance = Number(input.value);
            if (isNaN(newBalance)) return alert('Введите число');

            try {
                const data = await updateBalance(newBalance);
                document.getElementById('balance-amount').textContent = `${data.balance}$`;
            } catch (err) {
                console.error('Ошибка при обновлении баланса', err);
                alert('Не удалось обновить баланс');
            } finally {
                modal.classList.add('d-none');
            }
        });
    }

    renderUserInfo() {
        const user = getCurrentUser();
        if (!user) return;

        const span = document.querySelector('.profile span');

        if (span) {
            span.textContent = `${user.name} ${user.lastName}`;
        }
    }

    initProfileMenu() {
        const profileBlock = document.querySelector('.profile');
        if (!profileBlock) return;

        const menu = profileBlock.querySelector('.profile-menu');
        const logoutBtn = menu.querySelector('a');

        profileBlock.addEventListener('mouseenter', () => {
            menu.classList.remove('d-none');
        });

        profileBlock.addEventListener('mouseleave', () => {
            menu.classList.add('d-none');
        });

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('user');

            window.history.pushState({}, '', '/login');
            window.dispatchEvent(new Event('popstate'));
        });
    }

    initCategories() {
        const toggle = document.getElementById('categories-toggle');
        const wrapper = document.querySelector('.categories-wrapper');
        const sub = document.querySelector('.categories-sub');
        const links = document.querySelectorAll('.nav-link[href]');

        if (!toggle || !sub || !wrapper) return;

        toggle.addEventListener('click', (e) => {
            e.preventDefault();

            sub.classList.toggle('d-none');

            wrapper.classList.toggle('active-block');

            const icon = toggle.querySelector('i');
            icon.classList.toggle('bi-chevron-right');
            icon.classList.toggle('bi-chevron-down');

            links.forEach(link => link.classList.remove('active'));
        });
    }

    highlightActiveMenu() {
        const links = document.querySelectorAll('.nav-link[href]');
        const wrapper = document.querySelector('.categories-wrapper');
        const sub = document.querySelector('.categories-sub');
        const toggle = document.getElementById('categories-toggle');
        const path = window.location.pathname;

        links.forEach(link => link.classList.remove('active'));
        if (wrapper) wrapper.classList.remove('active-block');
        if (sub) sub.classList.add('d-none');
        if (toggle) {
            const icon = toggle.querySelector('i');
            icon.classList.remove('bi-chevron-down');
            icon.classList.add('bi-chevron-right');
        }

        links.forEach(link => {
            const href = link.getAttribute('href');

            if (!sub.contains(link)) {
                if (href === '/income-expenses' &&
                    (path === '/income-expenses' || path === '/income-expenses-add' || path === '/income-expenses-edit')) {
                    link.classList.add('active');
                }
                if (href === path) link.classList.add('active');
                return;
            }

            if ((href === '/income' &&
                    (path === '/income' || path === '/income-add' || path === '/income-edit')) ||
                (href === '/expense' &&
                    (path === '/expense' || path === '/expense-add' || path === '/expense-edit'))) {

                link.classList.add('active');
                sub.classList.remove('d-none');
                wrapper.classList.add('active-block');

                const icon = toggle.querySelector('i');
                icon.classList.remove('bi-chevron-right');
                icon.classList.add('bi-chevron-down');
            }
        });
    }
}

