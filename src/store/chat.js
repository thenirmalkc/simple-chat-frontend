import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '@constants/url';
import fetchData from '@store/api/fetchData';

// AsyncThunk
const apiGetChatMsgs = createAsyncThunk(
  'chat/apiGetChatMsgs',
  async function (param = {}, thunkAPI) {
    try {
      const chat = thunkAPI.getState().chat;
      const [status, json] = await fetchData(
        apiUrl.getChatMsgsById(chat.getMsgs.data.id),
        {
          method: 'GET',
          signal: param.signal
        },
        thunkAPI.dispatch,
        apiGetChatMsgs
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

const apiSendChatMsg = createAsyncThunk(
  'chat/apiSendChatMsg',
  async function (param = {}, thunkAPI) {
    try {
      const chat = thunkAPI.getState().chat;
      const [status, json] = await fetchData(
        apiUrl.sendChatMsgById(chat.sendMsg.data.id),
        {
          method: 'POST',
          body: param.body,
          signal: param.signal
        },
        thunkAPI.dispatch,
        apiSendChatMsg
      );
      if (status === 422) throw { code: status, msg: 'Validation Error' };
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

const apiGetUnseenMsgs = createAsyncThunk(
  'chat/apiGetUnseenMsgs',
  async function (param = {}, thunkAPI) {
    try {
      const [status, json] = await fetchData(
        apiUrl.getUnseenMsgs,
        {
          method: 'GET',
          signal: param.signal
        },
        thunkAPI.dispatch,
        apiGetUnseenMsgs
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
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    getMsgs: {
      status: '',
      data: { id: '', msgs: [] },
      error: { code: 0, msg: '' }
    },
    sendMsg: {
      status: '',
      data: { id: '', msg: {} },
      error: { code: 0, msg: '' }
    },
    unseenMsgs: {
      status: '',
      data: [],
      error: { code: 0, msg: '' }
    }
  },
  reducers: {
    addMsg: (state, action) => {
      state.getMsgs.data.msgs.push(action.payload);
    },
    setGetMsgsUser: (state, action) => {
      state.getMsgs.data.id = action.payload;
    },
    setSendMsgUser: (state, action) => {
      state.sendMsg.data.id = action.payload;
    },
    updateUnseenMsgsById: (state, action) => {
      const data = state.unseenMsgs.data.find(
        x => x.senderId === action.payload
      );
      data.unseen++;
    },
    resetUnseenMsgsById: (state, action) => {
      const data = state.unseenMsgs.data.find(
        x => x.senderId === action.payload
      );
      data.unseen = 0;
    },
    addUnseenMsgs: (state, action) => {
      state.unseenMsgs.data.push(action.payload);
    }
  },
  extraReducers: {
    [apiGetChatMsgs.pending]: (state, action) => {
      state.getMsgs.status = 'PENDING';
      state.getMsgs.error.code = 0;
      state.getMsgs.error.msg = '';
    },
    [apiGetChatMsgs.fulfilled]: (state, action) => {
      state.getMsgs.status = 'SUCCESS';
      state.getMsgs.data.msgs = action.payload;
      state.getMsgs.error.code = 0;
      state.getMsgs.error.msg = '';
    },
    [apiGetChatMsgs.rejected]: (state, action) => {
      state.getMsgs.status = 'FAILED';
      state.getMsgs.error.code = action.payload.code;
      state.getMsgs.error.msg = action.payload.msg;
    },
    [apiSendChatMsg.pending]: (state, action) => {
      state.sendMsg.status = 'PENDING';
      state.sendMsg.error.code = 0;
      state.sendMsg.error.msg = '';
    },
    [apiSendChatMsg.fulfilled]: (state, action) => {
      state.sendMsg.status = 'SUCCESS';
      state.sendMsg.data.msg = action.payload;
      state.sendMsg.error.code = 0;
      state.sendMsg.error.msg = '';
    },
    [apiSendChatMsg.rejected]: (state, action) => {
      state.sendMsg.status = 'FAILED';
      state.sendMsg.error.code = action.payload.code;
      state.sendMsg.error.msg = action.payload.msg;
    },
    [apiGetUnseenMsgs.pending]: (state, action) => {
      state.unseenMsgs.status = 'PENDING';
      state.unseenMsgs.error.code = 0;
      state.unseenMsgs.error.msg = '';
    },
    [apiGetUnseenMsgs.fulfilled]: (state, action) => {
      state.unseenMsgs.status = 'SUCCESS';
      const data = [...action.payload, ...state.unseenMsgs.data];
      state.unseenMsgs.data = data.filter(
        (x, i) => data.findIndex(y => y.senderId === x.senderId) === i
      );
      state.unseenMsgs.error.code = 0;
      state.unseenMsgs.error.msg = '';
    },
    [apiGetUnseenMsgs.rejected]: (state, action) => {
      state.unseenMsgs.status = 'FAILED';
      state.unseenMsgs.error.code = action.payload.code;
      state.unseenMsgs.error.msg = action.payload.msg;
    }
  }
});

const actions = { apiGetChatMsgs, apiSendChatMsg, apiGetUnseenMsgs };
for (const key in chatSlice.actions) actions[key] = chatSlice.actions[key];

export { actions };
export default chatSlice.reducer;
