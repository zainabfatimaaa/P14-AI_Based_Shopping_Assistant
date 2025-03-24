import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChatbotIcon.css";

const ChatbotIcon = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate("/chatbot"); // Redirect to the chatbot route
  };

  return (
    <div className="chatbot-icon" onClick={handleChatbotClick}>
      <img
        src="./chatbot.png"
        alt="Chatbot Icon"
        className="chatbot-icon-image"
      />
    </div>
  );
};

export default ChatbotIcon;
