import { agenActionTypes } from "./action";
import { AgenState } from "../../types";

const agenInitialState: AgenState = {
  agens: [],
  message: null,
  error: false,
  errors: null,
};

export default function reducer(state = agenInitialState, action: any) {
  switch (action.type) {
    case agenActionTypes.GET:
      return {
        agens: action.payload.data,
        message: action.payload.message,
        error: action.payload.error,
        errors: agenInitialState.errors,
      };
    case agenActionTypes.ADD:
      return {
        agens: [action.payload.data, ...state.agens],
        message: action.payload.message,
        error: action.payload.error,
        errors: agenInitialState.errors,
      };
    case agenActionTypes.UPDATE: {
      const agenIndex = state.agens.findIndex(
        (agen) => agen._id == action.payload.data._id
      );

      Object.assign(state.agens[agenIndex], action.payload.data);

      return {
        agens: state.agens,
        message: action.payload.message,
        error: action.payload.error,
        errors: agenInitialState.errors,
      };
    }
    case agenActionTypes.DELETE: {
      const agenIndex = state.agens.findIndex(
        (agen) => agen._id == action.payload.data
      );

      if (agenIndex != -1) state.agens.splice(agenIndex, 1);

      return {
        agens: state.agens,
        message: action.payload.message,
        error: action.payload.error,
        errors: agenInitialState.errors,
      };
    }
    case agenActionTypes.ERROR:
      const errors = new Map<string, string>();

      for (const key in action.payload.errors) {
        errors.set(key, action.payload.errors[key]);
      }

      return {
        agens: state.agens,
        error: action.payload.error,
        errors: errors,
        message: action.payload.message,
      };
    case agenActionTypes.RESET:
      return {
        agens: state.agens,
        message: agenInitialState.message,
        error: false,
        errors: new Map<string, string>(),
      };
    default:
      return state;
  }
}
