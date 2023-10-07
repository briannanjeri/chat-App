import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/Firebase/firebase";
import { RoomData } from "../types/type";
import "./../../../public/style/userChatRooms/userChatRooms.css";

type UserChatRoomsProps = {
  userChatRooms: RoomData[];
  setUserChatRooms: React.Dispatch<React.SetStateAction<RoomData[]>>;
  user: User | null;
  selectedRoom: RoomData | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomData | null>>;
};

const UserChatRooms = ({
  user,
  selectedRoom,
  setSelectedRoom,
  userChatRooms,
  setUserChatRooms,
}: UserChatRoomsProps) => {
  console.log("userChatRooms", userChatRooms);
  useEffect(() => {
    if (!user) {
      console.log("user dont exist");
      return;
    }

    const fetchUserChatRooms = async () => {
      try {
        const chatRoomRef = collection(db, "chatRooms");
        const userChatRoomQuery = query(
          chatRoomRef,
          where("members", "array-contains", user.uid)
        );
        const userChatRoomsSnapshot = await getDocs(userChatRoomQuery);

        if (userChatRoomsSnapshot.empty) {
          console.log("user chat room dont exist");
          return;
        }
        const chatRoomsData: RoomData[] = [];
        userChatRoomsSnapshot.forEach((doc) => {
          chatRoomsData.push({ id: doc.id, ...doc.data() } as RoomData);
        });

        setUserChatRooms(chatRoomsData);
      } catch (error) {
        console.log("error fetching users chat room", error);
      }
    };

    fetchUserChatRooms();
  }, [user]);

  const switchChatRoom = (room: RoomData) => {
    setSelectedRoom(room);
    localStorage.setItem("selectedRoom", JSON.stringify(room));
  };

  return (
    <div className="user-chat-rooms">
      <h2>Your Chat Rooms</h2>
      <ul>
        {userChatRooms.map((room) => (
          <li key={room.id}>
            <button
              onClick={() => switchChatRoom(room)}
              className={room.id === selectedRoom?.id ? "active" : ""}
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserChatRooms;
