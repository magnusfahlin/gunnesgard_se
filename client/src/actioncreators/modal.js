import * as A from "../actionTypes";
import { MODAL_OPEN, MODAL_CLOSE } from "../actionTypes";

export const openModal = (type, text, args) => dispatch =>
  dispatch({ type: MODAL_OPEN, modaltype: type, args });

export const closeModal = () => dispatch =>
{
  return dispatch({ type: MODAL_CLOSE });
}
