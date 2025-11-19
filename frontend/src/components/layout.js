import {getCurrentUser} from "../utils/utils-auth";

export class Layout {

    constructor() {
        this.renderUserInfo();
        this.initProfileMenu();
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
        const menu = profileBlock.querySelector('.profile-menu');
        const logoutBtn = menu.querySelector('a');

        // Показываем меню при наведении
        profileBlock.addEventListener('mouseenter', () => {
            menu.classList.remove('d-none');
        });

        // Прячем меню, когда мышь ушла
        profileBlock.addEventListener('mouseleave', () => {
            menu.classList.add('d-none');
        });

        // Обработчик выхода
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.history.pushState({}, '', '/login');
            window.dispatchEvent(new Event('popstate'));
        });
    }
}