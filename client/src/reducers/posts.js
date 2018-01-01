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
      let byId = action.result.map(post => post._id);
      let byHash = action.result.reduce((map, post) => {
        let commentsById = [];
        let commentsByHash = [];
        if (post.comments && Array.isArray(post.comments)) {
          commentsById = post.comments.map(comment => comment._id);
          commentsByHash = post.comments.reduce((commentMap, comment) => {
            commentMap[comment._id] = post;
            return commentMap;
          }, {});
        }
        post.comments = {
          byId: commentsById,
          byHash: commentsByHash
        };

        post.commentCreateRequest = false;
        post.commentCreateError = false;

        map[post._id] = post;
        return map;
      }, {});

      return {
        loading: false,
        error: false,
        postCreateRequest: false,
        postCreateError: false,
        posts: { byId, byHash }
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
      let commentsById = [];
      let commentsByHash = [];
      if (post.comments && Array.isArray(post.comments)) {
        commentsById = post.comments.map(comment => comment._id);
        commentsByHash = post.comments.reduce((commentMap, comment) => {
          commentMap[comment._id] = comment;
          return commentMap;
        }, {});
      }
      post.comments = {
        byId: commentsById,
        byHash: commentsByHash
      };

      if (state.posts.byHash[post._id] == undefined) {
        state.posts.byId = [post._id, ...state.posts.byId];
      }

      state.posts.byHash[post._id] = post;

      return {
        loading: false,
        error: false,
        posts: {
          byId: state.posts.byId,
          byHash: state.posts.byHash
        }
      };
    }
    case Action.POST_COMMENT_CREATE_REQUEST: {
      state.posts.byHash[action.postId].commentCreateRequest = true;
      state.posts.byHash[action.postId].commentCreateError = false;

      return {
        ...state
      };
    }
    case Action.POST_COMMENT_CREATE_FAILURE: {
      state.posts.byHash[action.postId].commentCreateRequest = false;
      state.posts.byHash[action.postId].commentCreateError = true;

      return {
        ...state
      };
    }
    case Action.LOGIN_SUCCESS_USER: {
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
