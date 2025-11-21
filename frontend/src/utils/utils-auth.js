import { loginUser } from './utils-api';

export async function autoLogin(email, password, rememberMe = false) {
    const loginData = await loginUser(email.trim(), password);
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('accessToken', loginData.tokens.accessToken);
    storage.setItem('user', JSON.stringify(loginData.user));

    if (rememberMe) sessionStorage.removeItem('accessToken');
    else localStorage.removeItem('accessToken');

    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
}

export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

