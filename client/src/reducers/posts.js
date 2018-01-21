import * as Action from "../actionTypes";
import initialState from "./../data/initialState";
import * as postActions from "./../actioncreators/posts.js";

export default function postsReducer(state = initialState.posts, action) {
  switch (action.type) {
    case Action.POSTS_FETCH_REQUEST: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }
    case Action.POSTS_FETCH_SUCCESS: {
      let indexByIdMap = {};
      let i = 0;
      let newPosts = [];
      action.result.forEach(post => {
        indexByIdMap[post.id] = i++;

        let c_indexByIdMap = {};
        if (post.comments && Array.isArray(post.comments)) {
          post.comments.forEach(comment => {
            c_indexByIdMap[comment.id] = i++;
          });
        }

        post.commentsIndexByIdMap = c_indexByIdMap;
        post.commentCreateRequest = false;
        post.commentCreateError = false;
        newPosts.push(post);
      });

      return {
        loading: false,
        error: false,
        postCreateRequest: false,
        postCreateError: false,
        indexByIdMap: indexByIdMap,
        posts: newPosts
      };
    }
    case Action.POSTS_FETCH_FAILURE: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }
    case Action.POSTS_CREATE_REQUEST: {
      return {
        ...state,
        PostCreateRequest: true,
        PostCreateError: false
      };
    }
    case Action.POSTS_CREATE_FAILURE: {
      return {
        ...state,
        postCreateRequest: false,
        postCreateError: true
      };
    }
    case Action.POSTS_CREATE_SUCCESS:
    case Action.POST_FETCH_SUCCESS: {
      let post = action.result;

      let c_indexByIdMap = {};
      let i = 0;
      post.comments.forEach(comment => {
        c_indexByIdMap[comment.id] = i++;
      });

      post.commentsIndexByIdMap = c_indexByIdMap;
      post.commentCreateRequest = false;
      post.commentCreateError = false;

      let indexByIdMap = state.indexByIdMap;
      const index = indexByIdMap[post.id];
      let newPosts;
      if (index == undefined) {
        indexByIdMap = {};
        state.posts.forEach(post => (indexByIdMap[post.id] = i++));
        newPosts = [post, ...state.posts];
      } else {
        newPosts = [
          ...state.posts.slice(0, index),
          post,
          ...state.posts.slice(index + 1)
        ];
      }
      return {
        loading: false,
        error: false,
        indexByIdMap: indexByIdMap,
        posts: newPosts
      };
    }
    case Action.POST_COMMENT_CREATE_REQUEST: {
      const index = state.indexByIdMap[action.postId];
      state.posts[index].commentCreateRequest = true;
      state.posts[index].commentCreateError = false;

      return {
        ...state
      };
    }
    case Action.POST_COMMENT_CREATE_FAILURE: {
      const index = state.indexByIdMap[action.postId];
      state.posts[index].commentCreateRequest = false;
      state.posts[index].commentCreateError = true;

      return {
        ...state
      };
    }
    default:
      return state;
  }
}
