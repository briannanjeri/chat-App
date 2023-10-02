"use client";
import React from "react";
import { useState, useEffect } from "react";
import { db } from "../lib/Firebase/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ChatRoomProps } from "../types/type";

import "./../../../public/style/chatroom/ChatRoomCreation.css";

import ChatRoomList from "./chatRoomList";

const ChatRoomCreation = ({ chatRoom, setChatRoom }: ChatRoomProps) => {
  const [roomName, setRoomName] = useState("");

  console.log("roomname", roomName);

  const handleCreateRoom = async () => {
    try {
      if (roomName.trim() !== "") {
        //check if the roomName exists in the chatRooms collection
        const chatRoomsRef = collection(db, "chatRooms");
        const querySnapshot = await getDocs(
          query(chatRoomsRef, where("name", "==", roomName))
        );

        if (querySnapshot.empty) {
          //chat room don't exist create newchatroom
          const newChatRoom = {
            name: roomName,
            members: [], // Initially empty member list
          };

          await addDoc(chatRoomsRef, newChatRoom);
          console.log("Chat room added with ID: ", chatRoomsRef.id);
          if (setChatRoom) {
            setChatRoom([...chatRoom, newChatRoom]);
            setRoomName("");
          }
        }
      }
    } catch (error) {
      console.error("Error adding chat room: ", error);
    }
  };
  return (
    <div className="container">
      <h2>create new chat Room</h2>
      <div>
        <input
          className="Enter room name"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        ></input>
      </div>

      <button onClick={handleCreateRoom}>create</button>
    </div>
  );
};

export default ChatRoomCreation;
