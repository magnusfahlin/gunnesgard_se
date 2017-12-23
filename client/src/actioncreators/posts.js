import { POSTS_CREATE_SUCCESS, POSTS_CREATE_FAILURE, POSTS_CREATE_REQUEST, POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE } from '../actionTypes'
import { thunkCreator, getApi, postApi } from './utils'

export const createPost = (username, title, text, location) => thunkCreator({
  types: [ POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE ],
  promise: postApi("posts", { author: username, title, text, location, date : new Date() })
             .then(response => response.json())
})

export const fetchPosts = () => thunkCreator({
  types: [ POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE ],
  promise: getApi("posts?sort=date&sortOrder=desc")
             .then(response => response.json())
})