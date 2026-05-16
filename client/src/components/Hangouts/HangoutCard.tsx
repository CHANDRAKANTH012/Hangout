import { useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";

const HangoutCard = ({ data }: any) => {
  const navigate = useNavigate();

  const isFull = data.participants >= data.maxParticipants;

  return (
    <div className="hangout-card glass">

      {/* TOP */}
      <div className="hangout-card-top">
        <div className="hangout-card-title">
          <h3>{data.title}</h3>
          <span className={`status ${data.status}`}>
            {isFull ? "Full" : "Active"}
          </span>
        </div>

        <span className="vibe">{data.vibe}</span>
      </div>

      {/* DESC */}
      <p className="hangout-desc">{data.description}</p>

      {/* META */}
      <div className="hangout-meta">
        <span>📍 {data.location.name} • {data.location.distance}km</span>
        <span>⏰ {formatTime(data.startTime)}</span>
      </div>

      {/* HOST */}
      <div className="hangout-host">
        <img src={data.host.avatar} alt="" />
        <span>Hosted by {data.host.name}</span>
      </div>

      {/* PARTICIPANTS */}
      <div className="hangout-participants">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(data.participants / data.maxParticipants) * 100}%`,
            }}
          />
        </div>
        <span>
          {data.participants}/{data.maxParticipants} joined
        </span>
      </div>

      {/* ACTIONS */}
      <div className="hangout-actions">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/hangout/${data.id}`)}
        >
          View
        </button>

        <button
          className="btn btn-primary"
          disabled={isFull}
        >
          {data.isPrivate ? "Request" : isFull ? "Full" : "Join"}
        </button>
      </div>

    </div>
  );
};

export default HangoutCard;