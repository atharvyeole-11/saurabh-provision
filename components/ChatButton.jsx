'use client';
import { useState } from 'react';
import { MessageCircle, X, Send, Phone, Clock, ShoppingBag } from 'lucide-react';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const quickReplies = [
    { text: "Check product availability", icon: <ShoppingBag className="w-4 h-4" /> },
    { text: "Store timings", icon: <Clock className="w-4 h-4" /> },
    { text: "Call store", icon: <Phone className="w-4 h-4" /> },
    { text: "Place order", icon: <MessageCircle className="w-4 h-4" /> }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const whatsappUrl = `https://wa.me/919766689821?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setIsOpen(false);
      setShowQuickReplies(true);
    }
  };

  const handleQuickReply = (reply) => {
    if (reply === "Call store") {
      window.open("tel:9766689821", "_blank");
      setIsOpen(false);
    } else {
      setMessage(reply);
      setShowQuickReplies(false);
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
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 group animate-pulse"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Chat with Owner
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Saurabh Provision</h3>
                <p className="text-sm opacity-90 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Usually replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Chat Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Welcome Message */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                Hello! Welcome to Saurabh Provision! I'm here to help you with your grocery needs. How can I assist you today? 
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Store Hours: 7:00 AM - 11:00 PM
              </p>
            </div>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Quick replies:</p>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.text)}
                    className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-3 text-sm"
                  >
                    {reply.icon}
                    <span>{reply.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Store Info Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Contact Info</p>
                  <p className="text-sm text-green-700">9766689821</p>
                  <p className="text-xs text-green-600 mt-1">
                    Call us directly for urgent orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Powered by WhatsApp · 9766689821
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Indicator */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
