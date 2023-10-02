import { db } from "../Firebase/firebase";
import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { RoomData } from "@/components/types/type";
import { messageDataProps } from "@/components/types/type";

export async function getMessages(
  selectedRoom: RoomData,
  setMessages: React.Dispatch<React.SetStateAction<messageDataProps[]>>
) {
  try {
    if (!selectedRoom) {
      console.log("selected room does not exist");
      return;
    }
    const messageDocRef = collection(db, "messages");
    const q = query(
      messageDocRef,
      where("room_id", "==", selectedRoom.id)
      // orderBy("timeStamp")
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const messageData: messageDataProps[] = [];
      console.log("messageData", messageData);
      QuerySnapshot.forEach((doc) => {
        messageData.push({ id: doc.id, ...doc.data() } as messageDataProps);
      });
      setMessages(messageData);
    });
    return unsubscribe;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error sending message:", error);
    }
  }
}
