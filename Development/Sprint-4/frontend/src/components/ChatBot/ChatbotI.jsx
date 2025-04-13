import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { FaArrowUp } from "react-icons/fa";

const ChatbotI = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatWindowRef = useRef(null);

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (userInput.trim() === "") return;

        setMessages([...messages, { sender: "user", text: userInput }]);
        setUserInput("");
        setIsBotTyping(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/chatbot", {
            // const response = await fetch("https://chatbotbackend-lzah.onrender.com/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });

            const data = await response.json();
            const ids = data.ids;

            const generateImagePaths = async (ids) => {
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

            let images = await generateImagePaths(ids);

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: data.response, images },
            ]);

            setIsBotTyping(false);
        } catch (error) {
            setIsBotTyping(false);
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatbot-container">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <div className="message-text">{message.text}</div>
                        {message.images &&
                            message.images.flat().map((image, imgIndex) => (
                                <img
                                    key={imgIndex}
                                    src={image}
                                    alt="Product"
                                    className="message-image"
                                />
                            ))}
                    </div>
                ))}
                {isBotTyping && (
                    <div className="chat-message bot typing-indicator">
                        <div className="typing">Typing...</div>
                    </div>
                )}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInput}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage} className="send-button">
                    <FaArrowUp />
                </button>
            </div>
        </div>
    );
};

export default ChatbotI;
