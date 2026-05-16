import "./Map.css";
import HangMap from "./HangMap";

const MapPageComponent = () => {
  return (
    <section className="map-page">
      
      <div className="map-page-container">
      <div className="map-overlay-top glass">

        <div>
          <h1>Live Hangouts</h1>
          <p>
            Discover what's happening around you
          </p>
        </div>

      </div>

      <HangMap />
      </div>

    </section>
  );
};

export default MapPageComponent;