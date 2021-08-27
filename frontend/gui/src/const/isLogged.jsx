const TOKEN_KEY = "token";

export const isLogged = () => {
    if (localStorage.getItem(TOKEN_KEY)) {
        return true;
    }
    return false;
};
