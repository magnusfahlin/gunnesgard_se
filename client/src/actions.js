import C from './constants'

export const signIn = (user, password) =>
    ({
        type: C.LOGIN_SUCCESS_USER,
        username: user,
        password: password
    })

export const signOut = () =>
    ({
        type: C.LOGOUT_SUCCESS
    })
