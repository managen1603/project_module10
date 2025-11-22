import {getCurrentUser} from "../utils/utils-auth";

export class Layout {

    constructor() {
        this.renderUserInfo();
        this.initProfileMenu();

        this.initCategories();
        this.highlightActiveMenu();
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

        links.forEach(link => {
            if (link.getAttribute('href') === window.location.pathname) {

                link.classList.add('active');

                if (sub && sub.contains(link)) {
                    sub.classList.remove('d-none');

                    wrapper.classList.add('active-block');

                    const icon = toggle.querySelector('i');
                    icon.classList.remove('bi-chevron-right');
                    icon.classList.add('bi-chevron-down');
                }

                if (link === toggle) {
                    wrapper.classList.add('active-block');
                }
            }
        });
    }
}

