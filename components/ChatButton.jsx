'use client';
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      const whatsappUrl = `https://wa.me/919766689821?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Saurabh Provision</h3>
              <p className="text-sm opacity-90">We typically reply in minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                Hello! 👋 Welcome to Saurabh Provision. How can we help you today?
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Powered by WhatsApp • 9766689821
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Chat with us on WhatsApp
            </span>
          </>
        )}
      </button>
    </>
  );
}
