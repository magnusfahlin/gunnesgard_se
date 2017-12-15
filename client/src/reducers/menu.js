import C from '../constants'
import initialState from './../data/initialState'

const menu = (state = initialState.menu, action) => {
    switch (action.type) {
        case C.LOGIN_SUCCESS_USER:
            return [
                {
                    "topic" : "Home",
                    "link": "/home"
                },
                {
                    "topic" : "Blog",
                    "link": "/blog"
                },
                {
                    "topic" : "Mina Uppgifter",
                    "link": "/myaccount"
                }]
        default:
            return initialState.menu
    }
}

export default menu;