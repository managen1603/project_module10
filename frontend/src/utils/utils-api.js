const BASE_URL = 'http://localhost:3000/api';

export async function loginUser(email, password, rememberMe = false) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, rememberMe})
    });
    if (!response.ok) throw new Error('Ошибка авторизации');
    return response.json();
}

export async function signUpUser(name, lastName, email, password, passwordRepeat) {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, lastName, email, password, passwordRepeat})
    });
    if (!response.ok) throw new Error('Ошибка регистрации');
    return response.json();
}

function getAccessToken() {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || null;
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || null;
}

function getTokenStorage() {
    return localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
}

async function refreshToken() {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('Нет refresh-токена');

    const storage = getTokenStorage();
    console.log('Отправляем refresh-token:', refresh);

    const response = await fetch(`${BASE_URL}/refresh`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refreshToken: refresh})
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить токен');
    }

    const data = await response.json();

    storage.setItem('accessToken', data.tokens.accessToken);
    storage.setItem('refreshToken', data.tokens.refreshToken);

    return data.tokens.accessToken;
}

export async function authorizedFetch(url, options = {}) {
    let token = getAccessToken();
    if (!options.headers) options.headers = {};
    options.headers['x-auth-token'] = token;

    let response = await fetch(url, options);

    if (response.status === 401) {
        console.log('Access-токен истёк, обновляем...');
        token = await refreshToken();
        options.headers['x-auth-token'] = token;
        response = await fetch(url, options);
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка запроса: ${response.status} - ${errorText}`);
    }

    return response.json();
}

export async function getBalance() {
    return await authorizedFetch(`${BASE_URL}/balance`);
}

export async function updateBalance(newBalance) {
    return await authorizedFetch(`${BASE_URL}/balance`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newBalance})
    });
}
