"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getChatRooms } from "../lib/utils/fetchChatRooms";
import { RoomData } from "../types/type";
import ChatRoomCreation from "./chatRoomCreation";
import RoomSelection from "./roomSelection";
import ChatMessages from "../chatMessages/chatMessages";
import { User } from "firebase/auth";
import "./../../../public/style/chatList/chatList.css";
import UserChatRooms from "../userchatRooms/userChatRooms";
import { userProps } from "../types/type";
import Signout from "../authForm/signout";
const ChatRoomList = ({ user, setUser }: userProps) => {
  const [chatRoom, setChatRoom] = useState<RoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [userChatRooms, setUserChatRooms] = useState<RoomData[]>([]);

  // const [user, setUser] = useState<User | null>(null);
  console.log("ouruser", user);
  console.log("selectedRoom", selectedRoom);

  const fetchChatRooms = async () => {
    try {
      const chatRoomsData: RoomData[] = (await getChatRooms()) || [];
      console.log("newRoom", chatRoomsData);
      setChatRoom(chatRoomsData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching chat rooms", error);
    }
  };
  useEffect(() => {
    fetchChatRooms();
    console.log("chatRoom", chatRoom);
    const storedRoom = localStorage.getItem("selectedRoom");
    if (storedRoom) {
      setSelectedRoom(JSON.parse(storedRoom));
    }
  }, []);

  return (
    <div className="list-container">
      {/* <Signout /> */}
      <ChatRoomCreation chatRoom={chatRoom} setChatRoom={setChatRoom} />
      <h2>Chat Rooms</h2>
      {chatRoom.map((room) => (
        <div key={room.id}>
          <RoomSelection
            Room={room}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            setUser={setUser}
            user={user}
            setChatRoom={setChatRoom}
            setUserChatRooms={setUserChatRooms}
          />
        </div>
      ))}
      <UserChatRooms
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        user={user}
        userChatRooms={userChatRooms}
        setUserChatRooms={setUserChatRooms}
      />
      <ChatMessages
        selectedRoom={selectedRoom}
        user={user}
        setSelectedRoom={setSelectedRoom}
      />
    </div>
  );
};

export default ChatRoomList;
