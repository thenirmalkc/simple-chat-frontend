const rootApiUrl = 'https://demo-simple-chat-backend.herokuapp.com';
const socketUrl = 'wss://demo-simple-chat-backend.herokuapp.com';

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
