import "./HangoutDetails.css";

import { useParams } from "react-router-dom";

import { hangouts } from "../../utils/mockData";

import HangoutHero from "./HangoutHero";
import ParticipationCard from "./ParticipationCard";
import ParticipantsList from "./ParticipantsList";

const HangoutDetailsPage = () => {

  const { id } = useParams();

  const hangout = hangouts.find(
    (item) => item.id === id
  );

  if (!hangout) {
    return (
      <section className="hangout-details-page">
        <div className="container">
          <h1>Hangout not found.</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="hangout-details-page">

      <div className="container">

        <div className="hangout-details-layout">

          {/* LEFT */}
          <div className="hangout-details-left">

            <HangoutHero hangout={hangout} />

            <ParticipantsList hangout={hangout} />

          </div>

          {/* RIGHT */}
          <div className="hangout-details-right">

            <ParticipationCard hangout={hangout} />

          </div>

        </div>

      </div>

    </section>
  );
};

export default HangoutDetailsPage;