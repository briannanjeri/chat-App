"use client";
import React from "react";
import { db } from "../lib/Firebase/firebase";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Unsubscribe } from "firebase/firestore"; // Import Unsubscribe type
import { where, query, onSnapshot, orderBy } from "firebase/firestore";
import "./../../../public/style/chatMessages/chatMessages.css";

import { ChatMessagesProps, messageDataProps } from "../types/type";

const ChatMessages = ({
  selectedRoom,
  setSelectedRoom,
  user,
}: ChatMessagesProps) => {
  const [messages, setMessages] = useState<messageDataProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  let unsubscribe: Unsubscribe | undefined;

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (!selectedRoom) {
          console.log("selected room does not exist");
          return;
        }

        const messageDocRef = collection(db, "messages");
        const q = query(
          messageDocRef,
          where("room_id", "==", selectedRoom.id),
          orderBy("timeStamp")
        );

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const messageData: messageDataProps[] = [];
          querySnapshot.forEach((doc) => {
            messageData.push({ id: doc.id, ...doc.data() } as messageDataProps);
          });
          setMessages(messageData);
        });
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error fetching messages:", error);
        }
      }
    };

    fetchChatMessages();
    // Cleanup the listener when the component unmounts or when selectedRoom changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedRoom]);

  const handleSendMessage = async () => {
    try {
      if (!selectedRoom) {
        console.log("selected room and user does not exist");
        return;
      }
      if (!user) {
        console.log("user does not exist");
        return;
      }
      if (newMessage.trim() != "") {
        const messageRef = collection(db, "messages");

        const message = {
          room_id: selectedRoom.id,
          sender: user?.displayName,
          text: newMessage,
          timeStamp: new Date(),
        };

        await addDoc(messageRef, message);
        //clear the input field after sending
        setNewMessage("");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error sending message:", error.message);
      }
    }
  };

  return (
    <div className="message-container">
      <div className="chat-room-name">
        {selectedRoom && <h2>Chat Room: {selectedRoom.name}</h2>}
        {/* Message Input Field */}

        <div className="message-list">
          {messages
            .slice()
            .reverse()
            .map((message) => (
              <div className="message-item" key={message.id}>
                <strong>{message.sender}</strong>: {message.text}
              </div>
            ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          {/* Send Button */}
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
