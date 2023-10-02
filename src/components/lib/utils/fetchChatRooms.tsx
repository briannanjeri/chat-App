import { db } from "../Firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { RoomData } from "@/components/types/type";

export async function getChatRooms() {
  try {
    const querySnapshot = await getDocs(collection(db, "chatRooms"));
    console.log("querySnapshot", querySnapshot);
    const rooms: RoomData[] = [];
    if (querySnapshot) {
      querySnapshot.docs.forEach(
        (doc) => rooms.push({ id: doc.id, ...doc.data() } as RoomData),
        console.log("rooms", rooms)
      );
    }
    return rooms;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error", error.message);
    }
  }
}
