import { MENU_SHOW_DEFAULT, MENU_SHOW_ALL } from "../actionTypes";
import initialState from "./../data/initialState";

const menu = (state = initialState.menu, action) => {
  switch (action.type) {
    case MENU_SHOW_DEFAULT:
      return { showAll: false };
    case MENU_SHOW_ALL:
      return { showAll: true };

    default:
      return state;
  }
};

export default menu;
