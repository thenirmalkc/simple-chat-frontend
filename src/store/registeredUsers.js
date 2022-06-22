import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '@constants/url';
import fetchData from '@store/api/fetchData';

// AsyncThunk
const apiGetRegisteredUsers = createAsyncThunk(
  'registeredUsers/apiGetRegisteredUsers',
  async function (param = {}, thunkAPI) {
    try {
      const [status, json] = await fetchData(
        apiUrl.getRegisteredUsers,
        {
          method: 'GET',
          signal: param.signal
        },
        thunkAPI.dispatch,
        apiGetRegisteredUsers
      );
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
const registeredUsersSlice = createSlice({
  name: 'registeredUsers',
  initialState: {
    status: '',
    data: { users: [] },
    error: { code: 0, msg: '' }
  },
  extraReducers: {
    [apiGetRegisteredUsers.pending]: (state, action) => {
      state.status = 'PENDING';
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiGetRegisteredUsers.fulfilled]: (state, action) => {
      state.status = 'SUCCESS';
      state.data.users = [...action.payload];
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiGetRegisteredUsers.rejected]: (state, action) => {
      state.status = 'FAILED';
      state.error.code = action.payload.code;
      state.error.msg = action.payload.msg;
    }
  }
});

const actions = { apiGetRegisteredUsers };
for (const key in registeredUsersSlice.actions)
  actions[key] = registeredUsersSlice.actions[key];

export { actions };
export default registeredUsersSlice.reducer;
