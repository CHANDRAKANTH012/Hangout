import { formatTime } from "../../utils/formatTime";

const HangoutHero = ({ hangout }: any) => {

  return (
    <section className="hangout-hero glass">

      <div className="hangout-hero-top">

        <div>
          <span className={`hangout-status ${hangout.status}`}>
            {hangout.status}
          </span>

          <h1>{hangout.title}</h1>

          <p>{hangout.description}</p>
        </div>

        <span className="hangout-vibe">
          {hangout.vibe}
        </span>

      </div>

      <div className="hangout-meta-grid">

        <div className="meta-card">
          <span>📍 Location</span>
          <h4>{hangout.location.name}</h4>
        </div>

        <div className="meta-card">
          <span>⏰ Starts</span>
          <h4>
            {formatTime(hangout.startTime)}
          </h4>
        </div>

        <div className="meta-card">
          <span>👥 Participants</span>
          <h4>
            {hangout.participants}/
            {hangout.maxParticipants}
          </h4>
        </div>

      </div>

      <div className="hangout-host-card">

        <img
          src={hangout.host.avatar}
          alt={hangout.host.name}
        />

        <div>
          <span>Hosted by</span>
          <h4>{hangout.host.name}</h4>
        </div>

      </div>

    </section>
  );
};

export default HangoutHero;