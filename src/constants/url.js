const rootApiUrl = 'https://demo-simple-chat-backend.herokuapp.com';
const socketUrl = 'ws://demo-simple-chat-backend.herokuapp.com';

// const rootApiUrl = 'http://localhost:7000';
// const socketUrl = 'ws://localhost:7000';

const apiUrl = {
  getUser: `${rootApiUrl}/user`,
  getRegisteredUsers: `${rootApiUrl}/users`,
  login: `${rootApiUrl}/web/login`,
  registerUser: `${rootApiUrl}/user/register`,
  refreshToken: `${rootApiUrl}/web/token/refresh`,
  logout: `${rootApiUrl}/web/logout`,
  sendChatMsgById: id => `${rootApiUrl}/user/${id}/message`,
  getChatMsgsById: id => `${rootApiUrl}/user/${id}/messages`,
  verifyAccessToken: `${rootApiUrl}/token/access/verify`,
  getUnseenMsgs: `${rootApiUrl}/user/unseen/messages`
};

export { apiUrl, socketUrl };
