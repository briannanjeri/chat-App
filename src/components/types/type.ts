import { User } from "firebase/auth";
export interface RoomData {
  id?: string;
  name: string;
  members: string[];
}

export interface ChatRoomProps {
  chatRoom: RoomData[];
  setChatRoom?: (message: RoomData[]) => void;
}

export interface messageDataProps {
  id?: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export type ChatMessagesProps = {
  id?: string;
  selectedRoom: RoomData | null;
  setSelectedRoom: (message: RoomData) => void;
  user?: User | null | undefined;
};

export interface userProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
