import { POST_VIEWER_SHOW_FEATURES, POST_VIEWER_HIDE_FEATURES } from "./../actionTypes";
import initialState from "./../data/initialState";

const postViewer = (state = initialState.posts, action) => {
  switch (action.type) {
    case POST_VIEWER_SHOW_FEATURES:
      return {
        type: action.type,
        showAddComment: true,
        showComments: true
      };
    case POST_VIEWER_HIDE_FEATURES:
      return {
        type: action.type,
        showAddComment: false,
        showComments: false
      };

    default:
      return state
  }
};

export default postViewer;
