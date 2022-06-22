import { io } from 'socket.io-client';
import { socketUrl } from '@constants/url';

const socket = io(socketUrl);

export default socket;
