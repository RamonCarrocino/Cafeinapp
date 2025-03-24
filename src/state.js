export const AUTH_STATUS = {
  NONE: 'NONE',
  INITIAL: 'INITIAL',
  AUTHORIZED: 'AUTHORIZED',
};

export const INITIAL_STATE = {
  status: AUTH_STATUS.INITIAL,
};

export const actions = {
  AUTH_NONE: 'AUTH_NONE',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  ADD_CITY: 'ADD_CITY',
};

export const reducer = (state, {type, payload}) => {
  switch (type) {
    case actions.AUTH_NONE: {
      return {...state, status: AUTH_STATUS.NONE};
    }

    case actions.AUTH_LOGIN: {
      return {
        ...state,
        status: AUTH_STATUS.AUTHORIZED,
        data: {...state.data, ...payload},
      };
    }

    case actions.AUTH_LOGOUT: {
      return {...state, status: AUTH_STATUS.NONE, data: {}};
    }

    case actions.ADD_CITY: {
      return {...state, data: {...state.data, city: payload}};
    }

    default:
      return state;
  }
};
