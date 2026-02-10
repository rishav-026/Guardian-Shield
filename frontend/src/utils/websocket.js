import { io } from 'socket.io-client'

let socket

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:8000', {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

export const connectSocket = () => {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}

export const disconnectSocket = () => {
  const s = getSocket()
  if (s.connected) s.disconnect()
}
