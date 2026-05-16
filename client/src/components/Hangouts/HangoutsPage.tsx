import "./Hangouts.css";
import HangoutList from "./HangoutList";
import { useNavigate } from "react-router-dom";

const HangoutsPage = () => {
  const navigate = useNavigate();

  return (
    <section className="hangouts-page">
      
      <div className="container">

        {/* HEADER */}
        <div className="hangouts-header">
          <div>
            <h1>Active Hangouts</h1>
            <p>Discover what's happening around you right now and explore new connections</p>
          </div>

          <button
            className="btn btn-primary hangouts-create-btn"
            id="hangouts-create-btn"
            onClick={() => navigate("/create")}
          >
            + Create Hangout
          </button>
        </div>

        {/* LIST */}
        <HangoutList />

      </div>

    </section>
  );
};

export default HangoutsPage;