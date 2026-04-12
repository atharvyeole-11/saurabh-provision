'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, Phone } from 'lucide-react';

export default function StoreStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilClose, setTimeUntilClose] = useState('');
  const [timeUntilOpen, setTimeUntilOpen] = useState('');

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay();
      
      setCurrentTime(now);
      
      // Store is open 7AM-11PM (7:00 - 23:00) Monday-Sunday
      const openHour = 7;
      const closeHour = 23;
      
      let currentlyOpen = false;
      let timeRemaining = '';
      
      if (currentHour >= openHour && currentHour < closeHour) {
        currentlyOpen = true;
        // Calculate time until close
        const minutesUntilClose = (closeHour - currentHour) * 60 - currentMinute;
        const hours = Math.floor(minutesUntilClose / 60);
        const minutes = minutesUntilClose % 60;
        timeRemaining = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        setTimeUntilClose(`Closes in ${timeRemaining}`);
        setTimeUntilOpen('');
      } else {
        currentlyOpen = false;
        // Calculate time until open
        let hoursUntilOpen = 0;
        let minutesUntilOpen = 0;
        
        if (currentHour >= closeHour) {
          // After closing time, opens next day
          hoursUntilOpen = (24 - currentHour) + openHour;
          minutesUntilOpen = -currentMinute;
        } else {
          // Before opening time
          hoursUntilOpen = openHour - currentHour;
          minutesUntilOpen = -currentMinute;
        }
        
        const totalMinutes = hoursUntilOpen * 60 + minutesUntilOpen;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        setTimeUntilOpen(`Opens in ${timeString}`);
        setTimeUntilClose('');
      }
      
      setIsOpen(currentlyOpen);
    };

    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000); // Update every minute

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
      return 'Opens tomorrow at 7:00 AM';
    } else if (currentHour < 7) {
      return 'Opens today at 7:00 AM';
    } else {
      return 'Opens tomorrow at 7:00 AM';
    }
  };

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isOpen 
        ? 'bg-green-100 text-green-800 border border-green-200 shadow-sm' 
        : 'bg-red-100 text-red-800 border border-red-200 shadow-sm'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          isOpen ? 'bg-green-600' : 'bg-red-600'
        }`} />
        {isOpen ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Open Now</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Closed</span>
          </>
        )}
        <Clock className="w-4 h-4" />
        <span className="font-mono">{formatTime(currentTime)}</span>
      </div>
      
      {/* Time indicator */}
      <div className="ml-2 text-xs opacity-75 border-l border-current pl-2">
        {isOpen ? (
          <span className="text-green-700">{timeUntilClose}</span>
        ) : (
          <span className="text-red-700">{timeUntilOpen || getNextOpenTime()}</span>
        )}
      </div>
    </div>
  );
}
