import L from "leaflet";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import Supercluster from "supercluster";
import iconMap from "../utils/iconMap";
import { calcRating } from "../utils/rating";
import "../stylesheets/supercluster.scss";
import "../stylesheets/map.scss";

const icons = {};
const clusterIcon = (count) => {
  if (!icons[count]) {
    let size = "LargeXL";

    if (count < 10) {
      size = "Small";
    } else if (count >= 10 && count < 100) {
      size = "Medium";
    } else if (count >= 100 && count < 500) {
      size = "Large";
    }
    const options = {
      cluster: `markerCluster${size}`,
      circle1: `markerCluster${size}DivOne`,
      circle2: `markerCluster${size}DivTwo`,
      circle3: `markerCluster${size}DivThree`,
      circle4: `markerCluster${size}DivFour`,
      label: `markerCluster${size}Label`,
    };

    const clusterColor = "rgb(252, 75, 81)".slice(0, -1);
    const circleStyle1 = `background-color: ${clusterColor}, 0.05)`;
    const circleStyle2 = `background-color: ${clusterColor}, 0.15)`;
    const circleStyle3 = `background-color: ${clusterColor}, 0.25)`;
    const circleStyle4 = `background-color: ${clusterColor}, 0.65)`;

    return L.divIcon({
      html: `<div style="${circleStyle1}" class="${options.circle1}">
        <div style="${circleStyle2}" class="${options.circle2}">
          <div style="${circleStyle3}" class="${options.circle3}">
            <div style="${circleStyle4}" class="${options.circle4}">
              <span class="${options.label}">${count}</span>
            </div>
          </div>
        </div>
      </div>`,
      className: `${options.cluster}`,
    });
  }
  return icons[count];
};

const Map = ({ onMarkerClick }) => {
  const [currentMarker, setCurrentMarker] = useState({});
  const [markers, setMarkers] = useState([]);
  const [index, setIndex] = useState(null);
  const [bounds, setBounds] = useState([]);

  const loadData = async () => {
    const { markers } = await import("../data/markers.json");
    const index = new Supercluster({
      log: true,
      radius: 60,
      extent: 256,
      maxZoom: 17,
    }).load(markers);

    // [westLng, southLat, eastLng, northLat]
    const initialBounds = bounds;
    const initialZoom = 12;
    const points = index.getClusters(initialBounds, initialZoom);
    setIndex(index);
    setMarkers(points);
  };

  useEffect(() => {
    if (bounds.length) {
      loadData();
    }
  }, [bounds]);

  function SetInitialBounds({ updateBounds }) {
    const map = useMap();

    useEffect(() => {
      const bounds = map.getBounds();
      updateBounds([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]);
    }, []);

    return null;
  }

  function RecenterButton({ currentMarker }) {
    const map = useMap();

    const recenter = () => {
      if (currentMarker?.geometry) {
        const [longitude, latitude] = currentMarker.geometry.coordinates;
        const zoom = map.getZoom();
        map.setView([latitude, longitude], zoom);
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

  function MyComponent() {
    const map = useMapEvents({
      moveend: () => {
        if (index) {
          const bounds = map.getBounds();
          setMarkers(
            index.getClusters(
              [
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth(),
              ],
              map.getZoom()
            )
          );
        }
      },
    });
    return null;
  }

  function Markers({ markers }) {
    const maphook = useMap();
    return markers.map((marker) => {
      const [longitude, latitude] = marker.geometry.coordinates;

      //we have a cluster to render
      if (marker.properties.cluster_id) {
        return (
          <Marker
            key={marker.id}
            position={[latitude, longitude]}
            icon={clusterIcon(marker.properties.point_count)}
            eventHandlers={{
              click: () => {
                const expansionZoom = index.getClusterExpansionZoom(marker.id);
                maphook.setView([latitude, longitude], expansionZoom);
              },
            }}
          />
        );
      }

      // we have a single point to render
      return (
        <Marker
          key={`marker-${marker.properties.id}`}
          position={[latitude, longitude]}
          icon={iconMap[marker.properties.type[0]]}
          eventHandlers={{
            click: () => {
              onMarkerClick(marker);
              setCurrentMarker(marker);
            },
          }}
        >
          <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
            <div className="tooltip-body">
              <div className="text-center">{marker.properties.name}</div>
              <div className="tooltip-ratings">
                <>
                  <i data-star={calcRating(marker.properties.rating)}></i>
                  <span className="ml-1 mr-1">
                    ({calcRating(marker.properties.rating)})
                  </span>
                  <span className="mr-1">&#x2022;</span>
                </>
                {[...Array(marker.properties.price)].map((e, index) => (
                  <i key={index} className="fa-solid fa-dollar-sign"></i>
                ))}
              </div>
            </div>
          </Tooltip>
        </Marker>
      );
    });
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
      <SetInitialBounds
        updateBounds={(boundsArr) => {
          if (bounds.length === 0) {
            setBounds(boundsArr);
          }
        }}
      />
      <RecenterButton currentMarker={currentMarker} />
      <MyComponent />
      <Markers markers={markers} />
    </MapContainer>
  );
};

export default Map;
