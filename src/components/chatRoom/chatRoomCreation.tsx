"use client";
import React from "react";
import { useState, useEffect } from "react";
import { db, app } from "../lib/Firebase/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ChatRoomProps } from "../types/type";
import { getAuth } from "firebase/auth";

import "./../../../public/style/chatroom/ChatRoomCreation.css";

import ChatRoomList from "./chatRoomList";

const ChatRoomCreation = ({ chatRoom, setChatRoom }: ChatRoomProps) => {
  const [roomName, setRoomName] = useState("");

  const auth = getAuth(app);

  console.log("roomname", roomName);

  const handleCreateRoom = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("User not authenticated.");
        return;
      }
      if (roomName.trim() !== "") {
        //check if the roomName exists in the chatRooms collection
        const chatRoomsRef = collection(db, "chatRooms");
        console.log("chatroomsRef", chatRoomsRef);
        const querySnapshot = await getDocs(
          query(chatRoomsRef, where("name", "==", roomName))
        );

        if (querySnapshot.empty) {
          //chat room don't exist create newchatroom
          const newChatRoom = {
            name: roomName,
            members: [], // Initially empty member list
            creatorUid: currentUser.uid,
          };

          const docRef = await addDoc(chatRoomsRef, newChatRoom);
          console.log("docref", docRef);

          console.log("Chat room added with ID: ", docRef.id);
          if (setChatRoom) {
            setChatRoom([...chatRoom, { ...newChatRoom, id: docRef.id }]);
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
