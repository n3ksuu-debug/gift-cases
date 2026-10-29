import { io } from 'socket.io-client';

// Используем переменную окружения Vercel.
// Если её нет (локальная разработка), используем localhost.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const socket = io(SERVER_URL, { autoConnect: false });