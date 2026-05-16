import {
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import { useNavigate } from "react-router-dom";

const customMarker = new L.DivIcon({
  className: "custom-marker",

  html: `
    <div class="marker-inner">
      🔥
    </div>
  `,

  iconSize: [40, 40],
});

const HangoutMarker = ({ hangout }: any) => {

  const navigate = useNavigate();

  const coords: [number, number] = [
    hangout.location.lat,
    hangout.location.lng,
  ];

  return (
    <Marker
      position={coords}
      icon={customMarker}
    >

      <Popup className="hangout-popup">

        <div className="popup-content">

          <span className="popup-vibe">
            {hangout.vibe}
          </span>

          <h3>{hangout.title}</h3>

          <p>{hangout.description}</p>

          <div className="popup-meta">
            👥 {hangout.participants}/
            {hangout.maxParticipants}
          </div>

          <button
            className="btn btn-primary popup-btn"
            onClick={() =>
              navigate(`/hangout/${hangout.id}`)
            }
          >
            View Details
          </button>

        </div>

      </Popup>

    </Marker>
  );
};

export default HangoutMarker;