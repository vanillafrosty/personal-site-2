import L from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet/hooks";
import useSwr from "swr";
import useSupercluster from "use-supercluster";
import { usePrevious } from "./helper/usePrev";
import iconMap from "../utils/iconMap";
import "../stylesheets/supercluster.scss";
import "../stylesheets/map.scss";

const fetcherImport = () =>
  import("../data/markers.json").then((response) => response);

const icons = {};
const fetchIcon2 = (count) => {
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
  const [bounds, setBounds] = useState([
    -117.41981506347658, 32.682730243559504, -116.84131622314455,
    32.8432505241666,
  ]);
  const [zoom, setZoom] = useState(12);
  const [currentMarker, setCurrentMarker] = useState({});
  const [recenter, setRecenter] = useState(null);
  const [center, setCenter] = useState([
    32.76301228860241, -117.13063799019834,
  ]);

  function GetZoom({ currentMarker, recenter }) {
    const prevRecenter = usePrevious(recenter);
    const map = useMap();
    console.log("currentmarker", currentMarker.geometry);
    console.log("recenter", recenter);
    console.log("prev", prevRecenter);
    if (
      currentMarker.geometry?.coordinates &&
      recenter !== null &&
      prevRecenter !== recenter
    ) {
      const zoom = map.getZoom();
      map.setView([
        currentMarker.geometry.coordinates[0],
        currentMarker.geometry.coordinates[1],
      ]);
    }

    return null;
  }

  function MyComponent() {
    const map = useMapEvents({
      moveend: () => {
        setBounds([
          map.getBounds().getSouthWest().lng,
          map.getBounds().getSouthWest().lat,
          map.getBounds().getNorthEast().lng,
          map.getBounds().getNorthEast().lat,
        ]);
        setZoom(map.getZoom());
      },
    });
    return null;
  }

  const { data, error } = useSwr("../data/markers.json", fetcherImport);
  const markers = data?.markers && !error ? data?.markers : [];
  const points = markers.map((marker) => ({
    ...marker,
    type: "Feature",
    properties: {
      cluster: false,
      markerId: marker.id,
      category: marker.markerType,
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(marker.location.longitude),
        parseFloat(marker.location.latitude),
      ],
    },
  }));
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 17 },
  });

  function Markers({ clusters }) {
    const maphook = useMap();
    return clusters.map((cluster) => {
      // every cluster point has coordinates
      const [longitude, latitude] = cluster.geometry.coordinates;
      // the point may be either a cluster or a crime point
      const { cluster: isCluster, point_count: pointCount } =
        cluster.properties;

      // we have a cluster to render
      // if (isCluster) {
      //   return (
      //     <Marker
      //       key={`cluster-${cluster.id}`}
      //       position={[latitude, longitude]}
      //       icon={fetchIcon2(pointCount)}
      //       eventHandlers={{
      //         click: () => {
      //           const expansionZoom = Math.min(
      //             supercluster.getClusterExpansionZoom(cluster.id),
      //             17
      //           );
      //           maphook.setView([latitude, longitude], expansionZoom, {
      //             animate: true,
      //           });
      //         },
      //       }}
      //     />
      //   );
      // }

      // we have a single point to render
      if (!isCluster) {
        return (
          <Marker
            key={`crime-${cluster.properties.crimeId}`}
            position={[latitude, longitude]}
            icon={iconMap[cluster.markerType[0]]}
            eventHandlers={{
              click: () => {
                onMarkerClick(cluster);
                setCurrentMarker(cluster);
              },
            }}
          >
            {/* <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
            {cluster.name}
          </Tooltip> */}
          </Marker>
        );
      }
    });
  }

  return (
    <MapContainer
      className="z-10 h-screen"
      center={center}
      zoom={12}
      scrollWheelZoom={true}
    >
      <GetZoom currentMarker={currentMarker} recenter={recenter} />
      {/* <MyComponent /> */}

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <div
        onClick={() => setRecenter((prevRecenter) => !prevRecenter)}
        className="marker-floater bg-zinc-50 drop-shadow-md rounded-md"
        title="Snap to current marker"
      >
        <i className="fa-solid fa-location-dot fa-lg px-2 py-4"></i>
      </div>
      {/* <Markers clusters={clusters} />
       */}
      <Marker
        eventHandlers={{
          click: () => {
            setCurrentMarker({ geometry: { coordinates: [49.8397, 24.0297] } });
          },
        }}
        position={[49.8397, 24.0297]}
      />
      <Marker
        eventHandlers={{
          click: () => {
            setCurrentMarker({ geometry: { coordinates: [52.2297, 21.0122] } });
          },
        }}
        position={[52.2297, 21.0122]}
      />
      <Marker
        eventHandlers={{
          click: () => {
            setCurrentMarker({ geometry: { coordinates: [51.5074, -0.0901] } });
          },
        }}
        position={[51.5074, -0.0901]}
      />
    </MapContainer>
  );
};

export default Map;
