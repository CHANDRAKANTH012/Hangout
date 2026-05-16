import type { Hangout } from "./mockData";

export type Notification = {
  id: string;

  type: "join_request" | "alert";

  status:
    | "pending"
    | "accepted"
    | "rejected";

  sender: {
    id: string;
    name: string;
    avatar: string;
  };

  receiver: {
    id: string;
    name: string;
    avatar: string;
  };

  hangout: Pick<
    Hangout,
    | "id"
    | "title"
    | "vibe"
    | "location"
    | "startTime"
  >;

  message?: string;

  createdAt: string;
};


