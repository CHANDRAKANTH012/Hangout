import "./Notifications.css";
import NotificationList from "./NotificationList";

const NotificationsPage = () => {
  return (
    <section className="notifications-page">
      <div className="container">

        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>
              Manage requests, updates and hangout activity
            </p>
          </div>
        </div>

        <NotificationList />

      </div>
    </section>
  );
};

export default NotificationsPage;