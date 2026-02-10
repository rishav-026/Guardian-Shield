import { useEffect, useRef, useState } from 'react'
import { connectSocket } from '../utils/websocket'

export const useWebSocket = (event, handler) => {
  const socketRef = useRef()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = connectSocket()
    socketRef.current = socket

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    if (event && handler) socket.on(event, handler)

    if (!socket.connected) socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      if (event && handler) socket.off(event, handler)
    }
  }, [event, handler])

  return { socket: socketRef.current, connected }
}
