export const validators = {
    isEmpty(value) {
        return !value.trim();
    },

    isEmail(value) {
        return /\S+@\S+\.\S+/.test(value);
    },

    isPassword(value) {
        return /^[A-Za-z\d]{8,}$/.test(value);
    },

    isName(value) {
        return /^[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+)*$/.test(value);
    },

    isLastName(value) {
        return /^[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+)*$/.test(value);
    }
}
