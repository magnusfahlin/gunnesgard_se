import * as A from "../actionTypes";
import { MODAL_OPEN, MODAL_CLOSE } from "../actionTypes";

export const openModal = (type, text) => dispatch =>
  dispatch({ type: MODAL_OPEN, modaltype: type, text });

export const closeModal = (type, text) => dispatch =>
  dispatch({ type: MODAL_OPEN, modaltype: type, text });
