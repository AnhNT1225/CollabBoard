export const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
}

export const getUserId = () => {
    const userId = localStorage.getItem('userId');
    return userId;
}

export const getUserRole = () => {
    const role = localStorage.getItem('role');
    return role;
}