import {
  MapContainer,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { hangouts } from "../../utils/mockData";

import HangoutMarker from "./HangoutMarker";

const bangaloreCoords: [number, number] = [
  12.9716,
  77.5946,
];

const HangMap = () => {

  const publicHangouts = hangouts.filter(
  (item) =>
    !item.isPrivate &&
    typeof item.location.lat === "number" &&
    typeof item.location.lng === "number"
);

  return (
    <MapContainer
      center={bangaloreCoords}
      zoom={12}
      scrollWheelZoom={true}
      className="hang-map-container"
    >

      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {publicHangouts.map((item) => (
        <HangoutMarker
          key={item.id}
          hangout={item}
        />
      ))}

    </MapContainer>
  );
};

export default HangMap;