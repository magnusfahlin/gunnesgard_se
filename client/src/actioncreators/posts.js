import { POSTS_CREATE_POST } from '../actionTypes'

export const createPost = (username, title, text, location) => {

  return {
    type: POSTS_CREATE_POST,
    post: { author: username, title, text, location, date : new Date() },
  }
}