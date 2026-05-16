import NotificationCard from "./NotificationCard";
import { notifications } from "../../utils/mockNotifications";

const NotificationList = () => {
  return (
    <section className="notification-list">
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          data={item}
        />
      ))}
    </section>
  );
};

export default NotificationList;