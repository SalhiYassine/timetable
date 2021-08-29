import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
} from '../constants/userConstants';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers = { headers: { 'Content-Type': 'application/json' } };

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    // Logging In adds a cookie which can be used for future requests
    const loginResponse = await axios.post('api/users/login', {
      email,
      password,
    });

    // If there were no errors then we can fetch the user profile
    const { data } = await axios.get(`/api/users/profile`);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data.isAdmin,
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    // Registering adds a cookie which can be used for future requests
    const registerResponse = await axios.post('api/users', {
      name,
      email,
      password,
    });

    // If there were no errors then we can fetch the user profile
    const { data } = await axios.get(`/api/users/profile`);

    dispatch({ type: USER_REGISTER_SUCCESS });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.isAdmin });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/users/profile`);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data.isAdmin,
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: 'User Not Logged In.',
    });
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logOut = () => async (dispatch) => {
  await axios.get(`/api/users/logout`);
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: USER_LOGOUT });
};
