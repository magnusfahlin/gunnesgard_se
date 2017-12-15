import C from '../constants'
import initialState from './../data/initialState'

const authentication = (state = initialState.authentication, action) => {
    switch (action.type) {
        case C.LOGIN_SUCCESS_USER:
            return {
                ...state,
                type: action.type,
                username: action.username
            }
        case C.LOGOUT_SUCCESS:
            return {
                    ...state,
                    type: action.type,
                    username : "",
                }
        default :
            return state
    }
}

export default authentication;