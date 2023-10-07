"use client";
import React from "react";
import { RoomData } from "../types/type";
import {
  Query,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/Firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../lib/Firebase/firebase";
import { User, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import "./../../../public/style/chatList/chatList.css";

type RoomProps = {
  user: User | null;
  setUser: (message: User) => void;
  selectedRoom: RoomData | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomData | null>>;
  Room: RoomData;
  setChatRoom: React.Dispatch<React.SetStateAction<RoomData[]>>;
  setUserChatRooms: React.Dispatch<React.SetStateAction<RoomData[]>>;
};

const RoomSelection = ({
  Room,
  user,
  selectedRoom,
  setSelectedRoom,
  setUser,
  setChatRoom,
  setUserChatRooms,
}: RoomProps) => {
  const [isMember, setIsMember] = useState<boolean>(false);
  console.log("Room", Room);
  // const auth = getAuth(app);
  // const [user, loading] = useAuthState(auth);
  // console.log("user", user);
  // if (user) {
  //   setUser(user);
  // }

  // const storedUserData = localStorage.getItem("userData");
  // const user = storedUserData ? JSON.parse(storedUserData) : null;
  // user ? setUser(user) : null;
  useEffect(() => {
    const checkMembership = async () => {
      try {
        if (user && Room.id) {
          const chatRoomRef = doc(db, "chatRooms", Room.id);
          const chatRoomDoc = await getDoc(chatRoomRef);

          if (chatRoomDoc.exists()) {
            const members = chatRoomDoc.data()?.members || [];
            setIsMember(members.includes(user.uid));
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error checking membership:", error.message);
        }
      }
    };
    checkMembership();
  }, [Room.id]);

  const isCreator = user && Room.creatorUid == user.uid;

  const joinChatRoom = async (Room: RoomData) => {
    try {
      if (!user) {
        console.log("User not authenticated.");
        return;
      }

      if (!Room.id) {
        console.log("Room ID is missing.");
        return;
      }

      //get the chatroom document
      setSelectedRoom(Room);
      localStorage.setItem("selectedRoom", JSON.stringify(Room));
      const chatRoomRef = doc(db, "chatRooms", Room.id);
      const chatRoomDoc = await getDoc(chatRoomRef);
      console.log("chatRoomDoc", chatRoomDoc);

      if (!chatRoomDoc.exists()) {
        console.log("Chat room does not exist.");
        return;
      }

      const updatedMembers = arrayUnion(user.uid);
      await updateDoc(chatRoomRef, { members: updatedMembers });
      alert("successfully joined the chatRoom");
      setUserChatRooms((prevChatRooms) => [...prevChatRooms, Room]);
      setIsMember(true);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error fetching chat room", error.message);
      }
    }
  };

  const leaveChatRoom = async (Room: RoomData) => {
    // Leave the chat room logic...
    try {
      if (user && Room.id) {
        const chatRoomRef = doc(db, "chatRooms", Room.id);
        const chatRoomDoc = await getDoc(chatRoomRef);
        console.log("leavechatroomdoc", chatRoomDoc);

        if (!chatRoomDoc.exists()) {
          console.log("Chat room does not exist.");
          return;
        }
        if (chatRoomDoc.exists()) {
          const members = chatRoomDoc.data()?.members || [];
          const updatedMembers = members.filter(
            (memberId: string) => memberId !== user.uid
          );

          await updateDoc(chatRoomRef, { members: updatedMembers });
          alert("Successfully left the chat room");
          setIsMember(false);
        }
      }
    } catch (error) {
      console.log("Error leaving chatRoom", error);
    }
    // Clear the selected room state and local storage
    setSelectedRoom(null);
    localStorage.removeItem("selectedRoom");
  };

  const deleteChatRoom = async (Room: RoomData) => {
    try {
      if (!Room) {
        console.log("Room does not exist");
        return;
      }
      if (user && Room.id) {
        //fetch the chatroom
        const chatRoomRef = doc(db, "chatRooms", Room.id);
        const chatRoomDoc = await getDoc(chatRoomRef);
        console.log("chatRoomDoc", chatRoomDoc);
        if (!chatRoomDoc) {
          console.log("selected room does not exiist");
          return;
        }
        //check if user is the creator of the chatroom
        const creatorUid = chatRoomDoc.data()?.creatorUid;
        console.log("creatorUid", creatorUid);
        if (creatorUid == user.uid) {
          //user is the creator allow deletion
          await deleteDoc(chatRoomRef);
          setChatRoom((prevChatRooms) =>
            prevChatRooms.filter((room) => room.id != Room.id)
          );
          setSelectedRoom(null);
          console.log("selectedrroooom", selectedRoom);
          localStorage.removeItem("selectedRoom");
        } else {
          console.log(
            "You are not the creator of this chat room. Deletion not allowed."
          );
        }
      }
    } catch (error) {
      console.log("Error deleting the chatroom", error);
    }
  };

  return (
    <div className="chat-room-item">
      <span className="room-name">{Room.name}</span>
      {!isMember ? (
        <button className="join-button" onClick={() => joinChatRoom(Room)}>
          Join
        </button>
      ) : (
        <div>
          <button className="leave-button" onClick={() => leaveChatRoom(Room)}>
            Leave
          </button>
          {isCreator && (
            <button
              className="delete-button"
              onClick={() => deleteChatRoom(Room)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomSelection;
