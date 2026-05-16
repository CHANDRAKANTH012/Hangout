import { useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";

const NotificationCard = ({ data }: any) => {
  const navigate = useNavigate();

  const isPending = data.status === "pending";
  const isAccepted = data.status === "accepted";

  return (
    <div className="notification-card glass">

      {/* TOP */}
      <div className="notification-top">

        <div className="notification-user">
          <img
            src={data.sender.avatar}
            alt={data.sender.name}
          />

          <div>
            <h3>{data.sender.name}</h3>

            <p>
              wants to join{" "}
              <span>{data.hangout.title}</span>
            </p>
          </div>
        </div>

        <span className={`notification-status ${data.status}`}>
          {data.status}
        </span>

      </div>

      {/* MESSAGE */}
      {data.message && (
        <div className="notification-message">
          “{data.message}”
        </div>
      )}

      {/* META */}
      <div className="notification-meta">
        <span>
          📍 {data.hangout.location.name}
        </span>

        <span>
          ⏰ {formatTime(data.hangout.startTime)}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="notification-actions">

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(`/hangout/${data.hangout.id}`)
          }
        >
          View Hangout
        </button>

        {isPending && (
          <>
            <button className="btn-accept">
              Accept
            </button>

            <button className="btn-reject">
              Reject
            </button>
          </>
        )}

        {isAccepted && (
          <button className="btn-joined">
            Joined
          </button>
        )}

      </div>

    </div>
  );
};

export default NotificationCard;