import React, { useState, useRef, useEffect } from 'react';
import { IoIosSend } from 'react-icons/io';
import { IoChatboxSharp } from "react-icons/io5";
import { IoMenuSharp } from "react-icons/io5";
import { IoMoonSharp } from "react-icons/io5";
import { IoSunnySharp } from "react-icons/io5";
import axios from 'axios';
import { marked } from 'marked';
import chatbot from './Images/chatbot.gif';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showHiMessage, setShowHiMessage] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '') return;

        setShowHiMessage(false);

        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://65.2.164.223:4000/generate', { prompt: input });
            const botResponse = { text: response.data.response, sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, botResponse]);
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            const errorMessage = { text: 'Sorry, there was an error. Please try again later.', sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const renderMessage = (message) => {
        if (message.sender === 'bot') {
            const html = marked(message.text);
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return message.text;
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleDarkMode = () => {
        setDarkMode(true);
        setSidebarOpen(false)
    };

    const toggleLightMode = () => {
        setDarkMode(false);
        setSidebarOpen(false)
    };

    const clearChat = () => {
        setMessages([]);
        setShowHiMessage(true);
        setSidebarOpen(false)
    };

    return (
        <div className={`flex items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            {showHiMessage && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   p-4 z-50">
                    <img src={chatbot}
                        className="text-2xl w-48 h-48"
                    />
                </div>
            )}

            <div className={`fixed top-0 left-0 h-full w-16 shadow-lg z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>
                <div className='top-0'>
                    <IoMenuSharp className="text-2xl m-4 cursor-pointer hover:text-gray-900" onClick={toggleSidebar} />
                </div>
                <div className="flex flex-col items-center justify-center h-full mt-44">
                    {darkMode ? (
                        <IoSunnySharp className="text-xl m-4 cursor-pointer hover:text-gray-900" onClick={toggleLightMode} title='mode' />
                    ) : (
                        <IoMoonSharp className="text-xl m-4 cursor-pointer hover:text-gray-900" onClick={toggleDarkMode} title='mode' />
                    )}
                    <IoChatboxSharp
                        className="text-xl m-4 cursor-pointer hover:text-gray-900"
                        onClick={clearChat}
                        title="New Chat"
                    />
                </div>
            </div>

            <div className="flex flex-col w-full max-w-3xl rounded-lg h-full">
                {!sidebarOpen && (
                    <div className={`fixed top-0 left-0 z-50 ${sidebarOpen ? 'ml-16' : 'ml-4'}`}>
                        <button className="text-2xl focus:outline-none m-4" onClick={toggleSidebar}>
                            <IoMenuSharp />
                        </button>
                    </div>
                    
                )}

                <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                    {messages.map((message, index) => (
                        <div key={index} className={`my-2 p-2 rounded-lg flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg p-4 mb-6 max-w-[75%] break-words ${message.sender === 'user' ? (darkMode ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white') : darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
                                {renderMessage(message)}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="my-2 p-2 rounded-lg flex justify-start">
                            <div className={`rounded-lg p-4 mb-6 max-w-[75%] break-words ${darkMode ? 'text-white' : ' text-black'}`}>
                                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                </svg>
                                Loading...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>

                <div className='flex flex-row'>
                    <div className={`p-5 flex items-center w-full lg:w-[60%] fixed bottom-0 ${darkMode ? 'text-white' : 'text-black'}`}>
                        <div className={`relative flex-grow border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'bg-white'} rounded-lg p-3 pr-12`}>
                            <input
                                type="text"
                                className={`w-full h-full outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <IoIosSend
                                    className={`text-3xl cursor-pointer ${darkMode ? 'text-white' : 'text-blue-500'}`}
                                    onClick={handleSend}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
