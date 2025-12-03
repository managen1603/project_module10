import {loginUser} from './utils-api';

export async function autoLogin(email, password, rememberMe = false) {
    const loginData = await loginUser(email.trim(), password);

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('accessToken', loginData.tokens.accessToken);
    storage.setItem('refreshToken', loginData.tokens.refreshToken);
    storage.setItem('user', JSON.stringify(loginData.user));

    if (rememberMe) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
    } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
}

export function getCurrentUser() {
    let user = localStorage.getItem('user');

    if (!user) {
        user = sessionStorage.getItem('user');
    }

    return user ? JSON.parse(user) : null;
}

