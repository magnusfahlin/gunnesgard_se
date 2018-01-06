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
      let byIndex = action.result.map(post => post.id);
      let byId = action.result.reduce((map, post) => {
        let commentsbyIndex = [];
        let commentsbyId = [];
        if (post.comments && Array.isArray(post.comments)) {
          commentsbyIndex = post.comments.map(comment => comment.id);
          commentsbyId = post.comments.reduce((commentMap, comment) => {
            commentMap[comment.id] = comment;
            return commentMap;
          }, {});
        }
        post.comments = {
          byIndex: commentsbyIndex,
          byId: commentsbyId
        };

        post.commentCreateRequest = false;
        post.commentCreateError = false;

        map[post.id] = post;
        return map;
      }, {});

      return {
        loading: false,
        error: false,
        postCreateRequest: false,
        postCreateError: false,
        posts: { byIndex, byId }
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
      let commentsbyIndex = [];
      let commentsbyId = [];
      if (post.comments && Array.isArray(post.comments)) {
        commentsbyIndex = post.comments.map(comment => comment.id);
        commentsbyId = post.comments.reduce((commentMap, comment) => {
          commentMap[comment.id] = comment;
          return commentMap;
        }, {});
      }
      post.comments = {
        byIndex: commentsbyIndex,
        byId: commentsbyId
      };

      if (state.posts.byId[post.id] == undefined) {
        state.posts.byIndex = [post.id, ...state.posts.byIndex];
      }

      state.posts.byId[post.id] = post;

      return {
        loading: false,
        error: false,
        posts: {
          byIndex: state.posts.byIndex,
          byId: state.posts.byId
        }
      };
    }
    case Action.POST_COMMENT_CREATE_REQUEST: {
      state.posts.byId[action.postId].commentCreateRequest = true;
      state.posts.byId[action.postId].commentCreateError = false;

      return {
        ...state
      };
    }
    case Action.POST_COMMENT_CREATE_FAILURE: {
      state.posts.byId[action.postId].commentCreateRequest = false;
      state.posts.byId[action.postId].commentCreateError = true;

      return {
        ...state
      };
    }
    case Action.LOGIN_SUCCESS: {
      return {
        ...state,
        showAddComment: true,
        showComments: true
      };
    }
    case Action.LOGOUT_SUCCESS: {
      return {
        ...state,
        showAddComment: false,
        showComments: false
      };
    }
    default:
      return state;
  }
}
