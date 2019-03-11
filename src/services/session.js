import Cookies from 'universal-cookie';
const cookie = new Cookies();


export const getToken = () => {
    const user = getUser()
    if (user)
        return user.token
    return null
}

export const getUser = () => {
    return cookie.get('user')
}

export const saveUser = (data) => {
    cookie.set('user', data, {path: '/'})
}

export const removeUser = (id) => {
    cookie.remove('user', {path: '/'})
    console.log(`cookie set to null ${getUser()}`)
}

export const setItem = (strName, value) => {
    return cookie.set(strName, value, {path: '/'})
}

export const getItem = (strName) => {
    return cookie.get(strName)
}

export const removeItem = (strName) => {
    return cookie.remove(strName, {path: '/'})
}