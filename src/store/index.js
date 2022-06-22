import { configureStore } from '@reduxjs/toolkit';

// Reducers
import registeredUsersReducer from '@store/registeredUsers';
import authReducer from '@store/auth';
import validationErrorReducer from '@store/validationError';
import chatReducer from '@store/chat';
import userReducer from '@store/user';

const store = configureStore({
  reducer: {
    registeredUsers: registeredUsersReducer,
    auth: authReducer,
    validationError: validationErrorReducer,
    chat: chatReducer,
    user: userReducer
  }
});

export default store;
