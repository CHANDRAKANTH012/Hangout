// const notification = {
//   type: string, // im not sure about this
//   user_id: string,
//   host_id: string,
//   status: string,
//   hangout_id: string,
//   message: string,
//   read: boolean,
// };

// user simulation of join functionality

//first case - user sends a join request to the host

const notifications = [
  {
    id: "1",
    type: "join",
    user_id: "chandru",
    host_id: "mohith",
    hangout_id: "hangout1",
    status: "pending",
    message: "i want to join your hangout",
    read: false,
  },
  {
    id: "2",
    type: "join",
    user_id: "suraj",
    host_id: "naveen",
    hangout_id: "hangout5",
    status: "pending",
    message: "i want to join your hangout",
    read: false,
  },
  {
    id: "3",
    type: "join",
    user_id: "vignesh",
    host_id: "chandru",
    hangout_id: "hangout2",
    status: "pending",
    message: "i want to join your hangout",
    read: false,
  },
  {
    id: "4",
    type: "join",
    user_id: "divya",
    host_id: "chandru",
    hangout_id: "hangout2",
    status: "pending",
    message: "i want to join your hangout",
    read: false,
  },
  {
    id: "5",
    type: "join",
    user_id: "chandana",
    host_id: "chandru",
    hangout_id: "hangout2",
    status: "pending",
    message: "i want to join your hangout",
    read: false,
  },
];

// lets say user refreshed the page and now we have to get the data

const currentUser = "chandru";

const currentUserNotifications = notifications.filter(
  (noti) => noti.user_id === currentUser || noti.host_id === currentUser,
);

// console.log(currentUserNotifications);

// ALL Tab
if (currentUserNotifications) {
  // show the notification AND details to the user
  // console.log("all tab notifications", currentUserNotifications);
}

//requests tab - we will consider the user to be the host and show the join requests of people to him
const requestsTabNotifications = currentUserNotifications.filter(
  (noti) => noti.host_id === currentUser && noti.type === "join",
);

if (requestsTabNotifications) {
  // show the notification AND details to the user who is host now , in request tab
  // console.log("requests tab notifications", requestsTabNotifications);
}

// updates tab - we will display the notifications where the user is the participant and the statuses of his join requests are accepted or rejected

const updatesTabNotifications = currentUserNotifications.filter(
  (noti) =>
    noti.user_id === currentUser &&
    noti.type === "join" &&
    (noti.status === "accepted" || noti.status === "rejected"),
);

if (updatesTabNotifications) {
  // show the notification AND details to the user who is a participant and has updates
  // console.log("updates tab notifications", updatesTabNotifications);
}

// now lets have a case where the host accepts the join request of a user

const handleJoinRequestAccept = (notificationId, action) => {
  const notificationIndex = notifications.findIndex(
    (noti) => noti.id === notificationId,
  );

  notifications[notificationIndex].status = action; // accepted or rejected
};

handleJoinRequestAccept("3", "accepted");
handleJoinRequestAccept("4", "rejected");
console.log("updated notifications", notifications);

/*
i have the final Ui ready but before building that lets build the basic version of our entire backend first , so i have created a server dir in root inside which i have created folders and a server.js file 

i want you to build the backend for me , will use Node.js and express and mongodb + cloudinary 
i have saved the mongo url cloudinary keys and stuff in .env file 
So i want you to diversify the code into a professional environment like actual production standards so you can create or modify folders to match that


so i have some apis right now to build and connect to the frontend first

*/
