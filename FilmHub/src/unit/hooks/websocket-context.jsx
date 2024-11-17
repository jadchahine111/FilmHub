import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
  } from "react"
  
  const WS_URL = "ws://localhost:5000" // WebSocket URL
  
  const WebSocketContext = createContext(null)
  
  export const WebSocketProvider = ({ children }) => {
    const [lastMessage, setLastMessage] = useState(null)
    const ws = useRef(null)
  
    useEffect(() => {
      ws.current = new WebSocket(WS_URL)
  
      ws.current.onopen = () => {
        console.log("WebSocket connection established")
      }
  
      ws.current.onmessage = event => {
        const message = JSON.parse(event.data)
        setLastMessage(message)
      }
  
      ws.current.onerror = error => {
        console.error("WebSocket error:", error)
      }
  
      ws.current.onclose = () => {
        console.log("WebSocket connection closed")
      }
  
      return () => {
        if (ws.current) {
          ws.current.close()
        }
      }
    }, [])
  
    const sendMessage = message => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message))
      } else {
        console.error("WebSocket is not connected")
      }
    }
  
    return (
      <WebSocketContext.Provider value={{ lastMessage, sendMessage }}>
        {children}
      </WebSocketContext.Provider>
    )
  }
  
  export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (!context) {
      throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context
  }
  