import { createSlice } from '@reduxjs/toolkit';

// Slice
const validationErrorSlice = createSlice({
  name: 'validationError',
  initialState: {
    login: { email: '', password: '' },
    register: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      password: ''
    }
  },
  reducers: {
    resetState: () => ({
      login: { email: '', password: '' },
      register: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        password: ''
      }
    }),
    resetLoginMsg: (state, action) => {
      state.login[action.payload] = '';
    },
    resetLoginAllMsg: (state, action) => {
      for (const key in state.login) state.login[key] = '';
    },
    setLoginError: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        const { name, msg } = action.payload[i];
        state.login[name] = msg;
      }
    },
    resetRegisterMsg: (state, action) => {
      state.register[action.payload] = '';
    },
    resetRegisterAllMsg: (state, action) => {
      for (const key in state.register) state.register[key] = '';
    },
    setRegisterError: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        const { name, msg } = action.payload[i];
        state.register[name] = msg;
      }
    }
  }
});

const actions = {};
for (const key in validationErrorSlice.actions)
  actions[key] = validationErrorSlice.actions[key];

export { actions };
export default validationErrorSlice.reducer;
