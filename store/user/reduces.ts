import { userActionTypes } from "./action";
import { UserState } from "../../types";

const userInitialState: UserState = {
  users: [],
  message: null,
  error: false,
  errors: null,
};

export default function reducer(state = userInitialState, action: any) {
  switch (action.type) {
    case userActionTypes.GET:
      return {
        users: action.payload.data,
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialState.errors,
      };
    case userActionTypes.ADD:
      return {
        users: [action.payload.data, ...state.users],
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialState.errors,
      };
    case userActionTypes.UPDATE: {
      const userIndex = state.users.findIndex(
        (user) => user._id == action.payload.data._id
      );

      Object.assign(state.users[userIndex], action.payload.data);

      return {
        users: state.users,
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialState.errors,
      };
    }
    case userActionTypes.DELETE: {
      const userIndex = state.users.findIndex(
        (user) => user._id == action.payload.data
      );

      if (userIndex != -1) state.users.splice(userIndex, 1);

      return {
        users: state.users,
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialState.errors,
      };
    }
    case userActionTypes.ERROR:
      const errors = new Map<string, string>();

      for (const key in action.payload.errors) {
        errors.set(key, action.payload.errors[key]);
      }

      return {
        users: state.users,
        error: action.payload.error,
        errors: errors,
        message: action.payload.message,
      };
    case userActionTypes.RESET:
      return {
        users: state.users,
        message: userInitialState.message,
        error: false,
        errors: new Map<string, string>(),
      };
    default:
      return state;
  }
}
