import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import iconMap from "../utils/iconMap";

const Map = ({ onMarkerClick, recenterPos }) => {
  const [markers, setMarkers] = useState([]);

  const loadData = async () => {
    const { markers } = await import("../data/markers.json");
    setMarkers(markers);
  };

  useEffect(() => {
    loadData();
  }, []);

  function GetZoom({ recenterPos }) {
    const map = useMap();

    if (recenterPos.lat && recenterPos.long) {
      const zoom = map.getZoom();
      map.setView([recenterPos.lat, recenterPos.long], zoom);
    }

    return null;
  }

  return (
    <MapContainer
      className="z-10 h-screen"
      center={[32.76301228860241, -117.13063799019834]}
      zoom={12}
      scrollWheelZoom={true}
    >
      <GetZoom recenterPos={recenterPos} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((el) => (
        <Marker
          key={el.id}
          position={el.geometry.coordinates}
          icon={iconMap[el.type[0]]}
          eventHandlers={{
            click: () => {
              onMarkerClick(el);
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
