import React, { createContext, useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { WS_URL } from '../services/api';

interface NotificationContextType {}

const NotificationContext = createContext<NotificationContextType>({});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuth();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !user) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    // Connect to global notifications websocket
    const connect = () => {
      // Use ws:// or wss:// depending on protocol
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${WS_URL}/notifications/ws?token=${token}`;
      
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("Connected to global notifications");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'NEW_MATCH') {
            toast(data.message, {
              duration: 5000,
              icon: '🎉',
              style: {
                background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                color: '#fff',
                fontWeight: 'bold',
              },
            });
          } 
          else if (data.type === 'NEW_MESSAGE') {
            toast(data.message, {
              duration: 4000,
              icon: '💬',
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            });
          }
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      };

      socket.onclose = (event) => {
        console.log("Notification websocket closed. Reconnecting in 5s...");
        setTimeout(() => {
          if (ws.current === socket) {
             connect();
          }
        }, 5000);
      };

      ws.current = socket;
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [token, user]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
