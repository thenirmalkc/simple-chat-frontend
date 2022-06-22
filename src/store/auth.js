import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '@constants/url';
import fetchData from '@store/api/fetchData';

import { actions as validationErrorActions } from '@store/validationError';

// AsyncThunk
const apiLogin = createAsyncThunk(
  'auth/apiLogin',
  async function (param = {}, thunkAPI) {
    try {
      const res = await fetch(apiUrl.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param.body),
        signal: param.signal
      });
      const { status } = res;
      const json = await res.json();
      if (status === 422) {
        thunkAPI.dispatch(validationErrorActions.setLoginError(json));
        throw { code: status, msg: 'Validation Error' };
      }
      if (status !== 200) throw { code: status, msg: json.msg };
      return json;
    } catch (err) {
      if (err.name === 'AbortError')
        return thunkAPI.rejectWithValue({
          code: 1,
          msg: 'fetch request aborted !!'
        });
      if (err.name === 'TypeError')
        return thunkAPI.rejectWithValue({
          code: 1,
          msg: 'failed to fetch !!'
        });
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const apiLogout = createAsyncThunk(
  'auth/apiLogout',
  async function (param = {}, thunkAPI) {
    try {
      const res = await fetch(apiUrl.logout, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      const { status } = res;
      const json = await res.json();
      if (status !== 200) throw { code: status, msg: json.msg };
      return json;
    } catch (err) {
      if (err.name === 'TypeError')
        return thunkAPI.rejectWithValue({
          code: 1,
          msg: 'failed to fetch !!'
        });
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const apiRefreshToken = createAsyncThunk(
  'auth/apiRefreshToken',
  async function (param = {}, thunkAPI) {
    try {
      const res = await fetch(apiUrl.refreshToken, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('refreshToken')
        }
      });
      const { status } = res;
      const json = await res.json();
      if (status !== 200) throw { code: status, msg: json.msg };
      return json;
    } catch (err) {
      if (err.name === 'TypeError')
        return thunkAPI.rejectWithValue({
          code: 1,
          msg: 'failed to fetch !!'
        });
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const apiRegisterUser = createAsyncThunk(
  'auth/apiRegisterUser',
  async function (param = {}, thunkAPI) {
    try {
      const [status, json] = await fetchData(
        apiUrl.registerUser,
        {
          method: 'POST',
          body: param.body,
          signal: param.signal
        },
        thunkAPI.dispatch,
        apiRegisterUser
      );
      if (status === 422) {
        thunkAPI.dispatch(validationErrorActions.setRegisterError(json));
        throw { code: status, msg: 'Validation Error' };
      }
      if (status !== 200) throw { code: status, msg: json.msg };
      return json;
    } catch (err) {
      if (err.name === 'AbortError')
        return thunkAPI.rejectWithValue({
          code: 1,
          msg: 'fetch request aborted !!'
        });
      if (err.name === 'TypeError')
        return thunkAPI.rejectWithValue({
          code: 1,
          msg: 'failed to fetch !!'
        });
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: '',
    data: { loggedIn: false },
    error: { code: 0, msg: '' }
  },
  reducers: {
    resetState: () => ({
      status: '',
      data: { loggedIn: false },
      error: { code: 0, msg: '' }
    }),
    resetError: (state, action) => {
      state.error.code = 0;
      state.error.msg = '';
    }
  },
  extraReducers: {
    [apiLogin.pending]: (state, action) => {
      state.status = 'PENDING';
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiLogin.fulfilled]: (state, action) => {
      state.status = 'SUCCESS';
      state.data.loggedIn = true;
      state.error.code = 0;
      state.error.msg = '';
      window.localStorage.setItem('refreshToken', action.payload.refreshToken);
      window.localStorage.setItem('accessToken', action.payload.accessToken);
    },
    [apiLogin.rejected]: (state, action) => {
      state.status = 'FAILED';
      state.error.code = action.payload.code;
      state.error.msg = action.payload.msg;
    },
    [apiRegisterUser.pending]: (state, action) => {
      state.status = 'PENDING';
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiRegisterUser.fulfilled]: (state, action) => {
      state.status = 'SUCCESS';
      state.data.loggedIn = true;
      state.error.code = 0;
      state.error.msg = '';
      window.localStorage.setItem('refreshToken', action.payload.refreshToken);
      window.localStorage.setItem('accessToken', action.payload.accessToken);
    },
    [apiRegisterUser.rejected]: (state, action) => {
      state.status = 'FAILED';
      state.error.code = action.payload.code;
      state.error.msg = action.payload.msg;
    },
    [apiLogout.pending]: (state, action) => {
      state.status = 'PENDING';
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiLogout.fulfilled]: (state, action) => {
      state.status = 'SUCCESS';
      state.data.loggedIn = false;
      state.error.code = 0;
      state.error.msg = '';
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('accessToken');
      window.location.reload();
    },
    [apiLogout.rejected]: (state, action) => {
      state.status = 'FAILED';
      state.data.loggedIn = false;
      state.error.code = action.payload.code;
      state.error.msg = action.payload.msg;
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('accessToken');
      window.location.reload();
    },
    [apiRefreshToken.pending]: (state, action) => {
      state.status = 'PENDING';
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiRefreshToken.fulfilled]: (state, action) => {
      state.status = 'SUCCESS';
      state.data.loggedIn = true;
      window.localStorage.setItem('refreshToken', action.payload.refreshToken);
      window.localStorage.setItem('accessToken', action.payload.accessToken);
    },
    [apiRefreshToken.rejected]: (state, action) => {
      state.status = 'FAILED';
      state.data.loggedIn = false;
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('accessToken');
    }
  }
});

const actions = {
  apiLogin,
  apiLogout,
  apiRegisterUser,
  apiRefreshToken
};
for (const key in authSlice.actions) actions[key] = authSlice.actions[key];

export { actions };
export default authSlice.reducer;
