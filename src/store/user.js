import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '@constants/url';
import fetchData from '@store/api/fetchData';

// AsyncThunk
const apiGetUser = createAsyncThunk(
  'auth/apiGetUser',
  async function (param = {}, thunkAPI) {
    try {
      const [status, json] = await fetchData(
        apiUrl.getUser,
        {
          method: 'GET',
          signal: param.signal
        },
        thunkAPI.dispatch,
        apiGetUser
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
const userSlice = createSlice({
  name: 'user',
  initialState: {
    status: '',
    data: { id: '' },
    error: { code: 0, msg: '' }
  },
  reducers: {
    resetState: () => ({
      status: '',
      data: { id: '' },
      error: { code: 0, msg: '' }
    })
  },
  extraReducers: {
    [apiGetUser.pending]: (state, action) => {
      state.status = 'PENDING';
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiGetUser.fulfilled]: (state, action) => {
      state.status = 'SUCCESS';
      state.data.id = action.payload._id;
      state.error.code = 0;
      state.error.msg = '';
    },
    [apiGetUser.rejected]: (state, action) => {
      state.status = 'FAILED';
      state.error.code = action.payload.code;
      state.error.msg = action.payload.msg;
    }
  }
});

const actions = { apiGetUser };
for (const key in userSlice.actions) actions[key] = userSlice.actions[key];

export { actions };
export default userSlice.reducer;
