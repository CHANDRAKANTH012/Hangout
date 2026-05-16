import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { currentUser } from "../../utils/mockCurrentUser";

const ParticipationCard = ({ hangout }: any) => {

  const navigate = useNavigate();

  const [requestPending, setRequestPending] =
    useState<boolean>(false);

  const isHost =
    currentUser.id === hangout.host.id;

  const isFull =
    hangout.participants >=
    hangout.maxParticipants;
    
  const alreadyJoined = false;

  return (
    <section className="participation-card glass">

      <h3>Participation</h3>

      <div className="participation-progress">

        <div className="participation-bar">
          <div
            className="participation-fill"
            style={{
              width: `${
                (hangout.participants /
                  hangout.maxParticipants) *
                100
              }%`,
            }}
          />
        </div>

        <span>
          {hangout.participants}/
          {hangout.maxParticipants} joined
        </span>

      </div>

      {/* HOST */}
      {isHost && (
        <div className="participation-actions">

          <button className="btn btn-primary">
            Edit Hangout
          </button>

          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate("/notifications")
            }
          >
            Manage Requests
          </button>

        </div>
      )}

      {/* PUBLIC */}
      {!isHost &&
        !hangout.approvalRequired &&
        !alreadyJoined &&
        !isFull && (
          <button className="btn btn-primary participation-btn">
            Join Instantly
          </button>
        )}

      {/* PRIVATE */}
      {!isHost &&
        hangout.approvalRequired &&
        !alreadyJoined &&
        !requestPending && (
          <button
            className="btn btn-primary participation-btn"
            onClick={() =>
              setRequestPending(true)
            }
          >
            Request to Join
          </button>
        )}

      {/* PENDING */}
      {requestPending && (
        <button
          className="participation-pending"
          disabled
        >
          Request Pending
        </button>
      )}

      {/* JOINED */}
      {alreadyJoined && (
        <div className="joined-state">

          <span>
            ✅ You're attending
          </span>

          <button className="leave-btn">
            Leave Hangout
          </button>

        </div>
      )}

      {/* FULL */}
      {isFull && (
        <div className="hangout-full">
          This hangout is full.
        </div>
      )}

    </section>
  );
};

export default ParticipationCard;