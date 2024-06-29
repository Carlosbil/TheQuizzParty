import React, { useState, useEffect } from 'react';
import { socket } from '../../enpoints';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg bg-white">
      <div className="h-64 overflow-y-auto mb-4 p-2 border-b">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-blue-100 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-lg focus:outline-none"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
