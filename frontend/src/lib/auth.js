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

export const getUserName = () => {
    const role = localStorage.getItem('name');
    return role;
}