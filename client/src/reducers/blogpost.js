import C from '../constants'
import initialState from './../data/initialState'

const blogpost = (state = initialState.blogpost, action) => {
    switch (action.type) {
        case C.LOGIN_SUCCESS_USER:
            return {
                ...state,
                type: action.type,
                showAddComment: true,
                showComments: true
            }
        default:
            return {
                    ...state,
                    type: action.type,
                    showAddComment: false,
                    showComments: false
                }
    }
}

export default blogpost;