import { POSTS_CREATE_POST, POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE } from '../actionTypes'
import { thunkCreator, getApi } from './utils'

export const createPost = (username, title, text, location) => {

  return {
    type: POSTS_CREATE_POST,
    post: { author: username, title, text, location, date : new Date() },
  }
}

export const fetchPosts = () => thunkCreator({
  types: [ POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE ],
  promise: getApi("post")
             .then(response => response.json())
})