import UserService from "../../services/user";

export const agenActionTypes = {
  GET: "GET_USER",
  ADD: "ADD_USER",
  UPDATE: "UPDATE_USER",
  DELETE: "DELETE_USER",
  ERROR: "ERROR_USER",
  RESET: "RESET_USER",
};

export const getAgens = () => async (dispatch: any) => {
  const res = await UserService.getAll("agen");

  return dispatch({ type: agenActionTypes.GET, payload: res });
};

export const addAgen = (formData: FormData) => async (dispatch: any) => {
  try {
    const res = await UserService.post("agen", formData);
    return dispatch({ type: agenActionTypes.ADD, payload: res });
  } catch (error: any) {
    return dispatch({ type: agenActionTypes.ERROR, payload: error });
  }
};

export const editAgen =
  (formData: FormData, id: string) => async (dispatch: any) => {
    try {
      const res = await UserService.put(formData, id);
      return dispatch({ type: agenActionTypes.UPDATE, payload: res });
    } catch (error: any) {
      return dispatch({ type: agenActionTypes.ERROR, payload: error });
    }
  };

export const deleteAgen = (id: string) => async (dispatch: any) => {
  try {
    const res = await UserService.delete(id);
    return dispatch({ type: agenActionTypes.DELETE, payload: res });
  } catch (error: any) {
    return dispatch({ type: agenActionTypes.ERROR, payload: error });
  }
};

export const setStatusAgen =
  (status: boolean, id: string) => async (dispatch: any) => {
    try {
      const res = await UserService.putStatus(status, id);
      return dispatch({ type: agenActionTypes.UPDATE, payload: res });
    } catch (error: any) {
      return dispatch({ type: agenActionTypes.ERROR, payload: error });
    }
  };

export const resetAgen = () => (dispatch: any) => {
  return dispatch({ type: agenActionTypes.RESET });
};
