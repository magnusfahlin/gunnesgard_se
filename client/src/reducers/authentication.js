import {LOGIN_SUCCESS_USER, LOGOUT_SUCCESS} from '../actionTypes'
import initialState from './../data/initialState'

const authentication = (state = initialState.authentication, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS_USER:
            return {
                ...state,
                type: action.type,
                username: action.username
            }
        case LOGOUT_SUCCESS:
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