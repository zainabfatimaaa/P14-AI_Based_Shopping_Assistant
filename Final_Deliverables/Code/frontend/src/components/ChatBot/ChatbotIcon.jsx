import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import ChatbotProfessional from "./ChatbotI";
import "./ChatbotIcon.css";

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating chatbot icon */}
      <button 
        className={`chatbot-floating-icon ${isOpen ? 'hidden' : ''}`} 
        onClick={toggleChatbot}
        aria-label="Open fashion assistant chatbot"
      >
        <FaRobot />
      </button>

      {/* Slide-out chatbot panel */}
      <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
        <button 
          className="close-button" 
          onClick={toggleChatbot}
          aria-label="Close chatbot"
        >
          <FaTimes />
        </button>
        <ChatbotProfessional />
      </div>
    </>
  );
};

export default ChatbotIcon;