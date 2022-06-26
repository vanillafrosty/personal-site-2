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
import { connect } from "react-redux";
import Supercluster from "supercluster";
import iconMap from "../utils/iconMap";
import { calcRating } from "../utils/rating";
import isEqual from "lodash/isEqual";
import Filters from "./Filters";
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

const noFilters = (obj) => {
  for (let key in obj) {
    if (obj[key]) {
      return false;
    }
  }
  return true;
};

const filterMarkers = (markers, venues, prices, rating) => {
  const out = [];
  for (let i = 0; i < markers.length; i++) {
    const current = markers[i];
    const properties = current.properties;
    if (
      (noFilters(venues) || venues[properties.type.toLowerCase() + "s"]) &&
      (noFilters(prices) || prices[properties.price]) &&
      properties.overallRating >= rating
    ) {
      out.push(current);
    }
  }
  return out;
};

const updateRating = (markers) => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].properties.overallRating = calcRating(
      markers[i].properties.rating
    );
  }
};

const Map = ({ onMarkerClick, venueFilter, priceFilter, ratingFilter }) => {
  const [markers, setMarkers] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [currentMarker, setCurrentMarker] = useState({});
  const [index, setIndex] = useState(null);
  const [bounds, setBounds] = useState([]);
  const [currentBounds, setCurrentBounds] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(12);
  const [currentCenter, setCurrentCenter] = useState([
    40.708508696464165, -73.97182314162123,
  ]);

  useEffect(() => {
    if (allMarkers.length && currentBounds.length) {
      const filteredMarkers = filterMarkers(
        allMarkers,
        venueFilter,
        priceFilter,
        ratingFilter
      );

      const index = new Supercluster({
        log: true,
        radius: 60,
        extent: 256,
        maxZoom: 17,
      }).load(filteredMarkers);

      const points = index.getClusters(currentBounds, currentZoom);

      setIndex(index);
      setMarkers(points);
    }
  }, [venueFilter, priceFilter, ratingFilter]);

  const loadData = async () => {
    const { markers } = await import("../data/markers.json");
    updateRating(markers);
    setAllMarkers(markers);
    const filteredMarkers = filterMarkers(
      markers,
      venueFilter,
      priceFilter,
      ratingFilter
    );
    const index = new Supercluster({
      log: true,
      radius: 60,
      extent: 256,
      maxZoom: 17,
    }).load(filteredMarkers);

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

  function SetInitialBounds({ updateBounds, updateCurrentBounds }) {
    const map = useMap();

    useEffect(() => {
      const bounds = map.getBounds();
      updateBounds([
        bounds.getWest() - 0.028,
        bounds.getSouth() - 0.02,
        bounds.getEast() + 0.028,
        bounds.getNorth() + 0.02,
      ]);
      updateCurrentBounds([
        bounds.getWest() - 0.028,
        bounds.getSouth() - 0.02,
        bounds.getEast() + 0.028,
        bounds.getNorth() + 0.02,
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
          className="marker-floater floater-recenter bg-zinc-50 drop-shadow-md rounded-md"
          title="Snap to last opened marker"
        >
          <i className="fa-solid fa-location-dot"></i>
        </div>
      )) ||
      null
    );
  }

  function MoveListener() {
    const map = useMapEvents({
      moveend: () => {
        if (index) {
          const bounds = map.getBounds();
          //increase bounds below by scalar amount so that on very zoomed in maps,
          //the markers are not redrawn when one or two restaurants get clipped off from slight movement
          const newPointers = index.getClusters(
            [
              bounds.getWest() - 0.028,
              bounds.getSouth() - 0.02,
              bounds.getEast() + 0.028,
              bounds.getNorth() + 0.02,
            ],
            map.getZoom()
          );
          if (!isEqual(newPointers, markers)) {
            setMarkers(newPointers);
            const center = map.getCenter();
            setCurrentCenter([center.lat, center.long]);
            const zoom = map.getZoom();
            setCurrentZoom(zoom);
            setCurrentBounds([
              bounds.getWest() - 0.028,
              bounds.getSouth() - 0.02,
              bounds.getEast() + 0.028,
              bounds.getNorth() + 0.02,
            ]);
          }
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
          icon={iconMap[marker.properties.type]}
          eventHandlers={{
            click: () => {
              onMarkerClick(marker);
              setCurrentMarker(marker);
            },
          }}
        >
          <Tooltip
            direction="bottom"
            offset={[0, 0]}
            opacity={1}
            permanent
            interactive
          >
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
    <>
      <MapContainer
        className="z-10 h-screen"
        center={currentCenter}
        zoom={currentZoom}
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
          updateCurrentBounds={(boundsArr) => {
            if (currentBounds.length === 0) {
              setCurrentBounds(boundsArr);
            }
          }}
        />
        <RecenterButton currentMarker={currentMarker} />
        <MoveListener />
        <Markers markers={markers} />
      </MapContainer>
      <Filters />
    </>
  );
};

const mapStateToProps = (state) => {
  const { venue, price, rating } = state.filters;
  return {
    venueFilter: venue,
    priceFilter: price,
    ratingFilter: rating,
  };
};

export default connect(mapStateToProps)(Map);
