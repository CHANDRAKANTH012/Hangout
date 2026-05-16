import avatar1 from "../../assets/avatar1.webp";
import avatar2 from "../../assets/avatar2.webp";


const ParticipantsList = ({ hangout }: any) => {

  const participants = [
    hangout.host,
    {
      name: "Ananya",
      avatar: avatar2,
    },
    {
      name: "Kiran",
      avatar: avatar1,
    },
  ];

  return (
    <section className="participants-section glass">

      <div className="participants-top">

        <h3>Participants</h3>

        <span>
          {hangout.participants}/
          {hangout.maxParticipants}
        </span>

      </div>

      <div className="participants-grid">

        {participants.map((item, index) => (
          <div
            key={index}
            className="participant-card"
          >

            <img
              src={item.avatar}
              alt={item.name}
            />

            <span>{item.name}</span>

          </div>
        ))}

      </div>

    </section>
  );
};

export default ParticipantsList;