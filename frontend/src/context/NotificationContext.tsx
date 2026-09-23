import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { WS_URL } from '../services/api';

interface NotificationContextType {
  totalUnread: number;
  clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType>({ totalUnread: 0, clearUnread: () => {} });

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalUnread, setTotalUnread] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const clearUnread = () => setTotalUnread(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connect = () => {
      const ws = new WebSocket(WS_URL + '/notifications/ws?token=' + token);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_MESSAGE' && data.match_id) {
            const currentPath = window.location.pathname;
            if (!currentPath.includes(data.match_id)) {
              setTotalUnread(prev => prev + 1);
            }
          }
        } catch {}
      };
      ws.onclose = () => setTimeout(connect, 5000);
      ws.onerror = () => ws.close();
      wsRef.current = ws;
    };

    connect();
    return () => { wsRef.current?.close(); };
  }, []);

  return (
    <NotificationContext.Provider value={{ totalUnread, clearUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
