import { MODAL_OPEN, MODAL_CLOSE } from "../actionTypes";
import initialState from "./../data/initialState";

const modal = (state = initialState.modal, action) => {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...state,
        show: true,
        type : action.modalType,
        text : action.text
      };
    case MODAL_CLOSE:
      return {
        ...state,
        show: false,
        type : undefined,
        text : undefined
      };
    default:
      return state;
  }
};

export default modal;
