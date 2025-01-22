import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const useWebSocket = (maxReconnectAttempts = 5, reconnectDelay = 3000) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [connectedUsers, setConnectedUsers] = useState(0);
  const reconnectTimeoutRef = useRef(null);
  const wsRef = useRef(null);
  const isConnectingRef = useRef(false);
  const wsInstanceId = useRef(crypto.randomUUID());
  const reconnectAttemptsRef = useRef(0);

  const handleWebSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (!data.type) return;
      
      switch (data.type) {
        case 'userCount':
          setConnectedUsers(data.count);
          break;

        case 'notification':
          if (data.message) {
            toast[data.notificationType || 'info'](data.message);
          }
          if (data.userCount !== undefined) {
            setConnectedUsers(data.userCount);
          }
          break;

        case 'error':
          toast.error(data.message);
          break;

        default:
          console.log(`Unhandled message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Error processing message from server');
    }
  };

  const connectWebSocket = () => {
    if (isConnectingRef.current || 
        (wsRef.current && 
         (wsRef.current.readyState === WebSocket.CONNECTING || 
          wsRef.current.readyState === WebSocket.OPEN))) {
      return;
    }

    isConnectingRef.current = true;
    
    const wsURL = `${process.env.REACT_APP_WEBSOCKET_URL}?instanceId=${wsInstanceId.current}`;
    if (!wsURL) {
      toast.error("WebSocket URL is not defined");
      isConnectingRef.current = false;
      return;
    }

    try {
      const ws = new WebSocket(wsURL);
      wsRef.current = ws;

      ws.onopen = () => {
        toast.success("Connected to server");
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        setSocket(ws);
        isConnectingRef.current = false;
        
        ws.send(JSON.stringify({
          type: 'userConnection',
          action: 'connect',
          instanceId: wsInstanceId.current
        }));
      };

      ws.onclose = (event) => {
        setConnectionStatus('disconnected');
        setConnectedUsers(0);
        setSocket(null);
        wsRef.current = null;
        isConnectingRef.current = false;
        
        if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          toast.warning(`Connection lost. Reconnecting... (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket();
          }, reconnectDelay * (reconnectAttemptsRef.current + 1));
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          toast.error("Failed to reconnect. Please refresh the page.");
        }
      };

      ws.onerror = (error) => {
        toast.error("Connection error. Please try again later.");
        setConnectionStatus('error');
        isConnectingRef.current = false;
      };

      ws.onmessage = handleWebSocketMessage;
    } catch (error) {
      toast.error("Failed to create WebSocket connection");
      isConnectingRef.current = false;
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    connectWebSocket();

    const handleBeforeUnload = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'userConnection',
          action: 'disconnect',
          instanceId: wsInstanceId.current
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      isConnectingRef.current = false;
      
      if (wsRef.current) {
        const ws = wsRef.current;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'userConnection',
            action: 'disconnect',
            instanceId: wsInstanceId.current
          }));
          ws.close();
        }
        wsRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return { socket, connectionStatus, connectedUsers };
};

export default useWebSocket;