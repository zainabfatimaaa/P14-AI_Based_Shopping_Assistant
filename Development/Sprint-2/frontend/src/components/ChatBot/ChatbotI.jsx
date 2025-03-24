import React, { useState } from "react";
import "./Chatbot.css"; // Import the CSS for styling

const ChatbotI = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (userInput.trim() === "") return;

        // Add user message to the chat
        setMessages([...messages, { sender: "user", text: userInput }]);
        setUserInput(""); // Clear input field

        // Show typing indicator
        setIsBotTyping(true);

        // Send user message to the backend
        try {
            const response = await fetch("http://127.0.0.1:8000/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });

            const data = await response.json();
            const ids = data.ids;
            console.log(ids);

            const generateImagePaths = async (ids) => {
                try {
                    const response = await fetch('http://localhost:10000/api/fetchproductimages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ids })  // Send the IDs as the request body
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch images');
                    }

                    const result = await response.json();
                    console.log(result);
                    return result.images; 
                } catch (error) {
                    console.error('Error fetching product images:', error);
                    return [];
                }
            };

            let images = []
            images = await generateImagePaths(ids);

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: data.response, images},
            ]);

            // Hide typing indicator
            setIsBotTyping(false);
        } catch (error) {
            setIsBotTyping(false);
            console.error("Error:", error);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-window">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <div className="message-text">{message.text}</div>
                        {message.images && message.images.length > 0 && (
                            <div className="images-container">
                                {message.images.map((imageUrls, imgIndex) => (
                                    <div key={imgIndex} className="image-set">
                                        {imageUrls.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt="Product"
                                                className="message-image"
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
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
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatbotI;
