import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import iconMap from "../utils/iconMap";
import "../stylesheets/map.scss";

const Map = ({ onMarkerClick }) => {
  const [markers, setMarkers] = useState([]);
  const [currentMarker, setCurrentMarker] = useState({});

  const loadData = async () => {
    const { markers } = await import("../data/markers.json");
    setMarkers(markers);
  };

  useEffect(() => {
    loadData();
  }, []);

  function RecenterButton({ currentMarker }) {
    const map = useMap();

    const recenter = () => {
      if (currentMarker?.geometry) {
        const zoom = map.getZoom();
        map.setView(currentMarker.geometry.coordinates, zoom);
      }
    };

    return (
      (currentMarker?.geometry && (
        <div
          onClick={recenter}
          className="marker-floater bg-zinc-50 drop-shadow-md rounded-md"
          title="Snap to current marker"
        >
          <i className="fa-solid fa-location-dot px-2 py-4"></i>
        </div>
      )) ||
      null
    );
  }

  return (
    <MapContainer
      className="z-10 h-screen"
      center={[32.76301228860241, -117.13063799019834]}
      zoom={12}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterButton currentMarker={currentMarker} />
      {markers.map((el) => (
        <Marker
          key={el.id}
          position={el.geometry.coordinates}
          icon={iconMap[el.type[0]]}
          eventHandlers={{
            click: () => {
              onMarkerClick(el);
              setCurrentMarker(el);
            },
          }}
          style={{
            backgroundPosition: "0 0",
          }}
        >
          <Popup>{el.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
