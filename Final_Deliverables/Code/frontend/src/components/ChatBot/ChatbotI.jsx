import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

// Import the updated CSS
import "./Chatbot.css";

const ChatbotProfessional = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  // Handle user input changes
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Handle sending messages and Enter key press
  const handleSendMessage = async () => {
    if (userInput.trim() === "" || isLoading) return;

    setIsLoading(true);
    setMessages([...messages, { sender: "user", text: userInput }]);
    setUserInput("");
    setIsBotTyping(true);

    try {
      // Try local development server first, fall back to production
      // const baseUrl = process.env.NODE_ENV === 'development' 
      //   ? "http://localhost:8000" 
      //   : "https://chatbotbackend-lzah.onrender.com";
      
      const baseUrl = "http://localhost:8000";
      
      const response = await fetch(`${baseUrl}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const ids = data.ids || [];

      let images = [];
      if (ids.length > 0) {
        images = await fetchProductImages(ids);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.response, images },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          sender: "bot", 
          text: "I'm sorry, I couldn't process your request right now. Please try again later." 
        },
      ]);
    } finally {
      setIsBotTyping(false);
      setIsLoading(false);
      // Focus input after sending
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fetch product images helper function
  const fetchProductImages = async (ids) => {
    try {
      const response = await fetch("https://sproj-p14-code.onrender.com/api/fetchproductimages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error("Failed to fetch images");

      const result = await response.json();
      return result.images;
    } catch (error) {
      console.error("Error fetching product images:", error);
      return [];
    }
  };

  // Welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hello! I'm your fashion assistant. How can I help you with your style today?",
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <FaRobot className="chatbot-icon" />
        <h2>Fashion Assistant</h2>
      </div>

      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === "user" ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              {message.images && message.images.length > 0 && (
                <div className="message-gallery">
                  {message.images.flat().map((image, imgIndex) => (
                    <div className="image-container" key={imgIndex}>
                      <img
                        src={image}
                        alt="Product recommendation"
                        className="message-image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isBotTyping && (
          <div className="chat-message bot">
            <div className="message-avatar">
              <FaRobot />
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={handleKeyPress}
          placeholder="Ask about fashion advice..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          className={`send-button ${isLoading || userInput.trim() === "" ? 'disabled' : ''}`}
          disabled={isLoading || userInput.trim() === ""}
        >
          {isLoading ? "..." : <IoMdSend />}
        </button>
      </div>
    </div>
  );
};

export default ChatbotProfessional;