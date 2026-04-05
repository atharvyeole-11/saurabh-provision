'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function StoreStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      
      setCurrentTime(now);
      
      if (currentDay >= 0 && currentDay <= 6) {
        if (currentHour >= 7 && currentHour < 23) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else {
        setIsOpen(false);
      }
    };

    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNextOpenTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 23) {
      return 'Tomorrow at 7:00 AM';
    } else if (currentHour < 7) {
      return 'Today at 7:00 AM';
    } else {
      return 'Tomorrow at 7:00 AM';
    }
  };

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
      isOpen 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center space-x-2">
        {isOpen ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Store Open</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            <span>Store Closed</span>
          </>
        )}
        <Clock className="w-4 h-4" />
        <span>{formatTime(currentTime)}</span>
      </div>
      
      {!isOpen && (
        <div className="ml-2 text-xs opacity-75">
          Opens {getNextOpenTime()}
        </div>
      )}
    </div>
  );
}
