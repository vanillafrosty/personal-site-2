import { useState, useEffect } from "react";
import Map from "./Map";
import cs from "classnames";
import "../stylesheets/Travels.scss";
import Burger from "./helper/Burger";
import Carousel from "./helper/Carousel";
import useWindowDimensions from "../utils/windowResize";

const TravelsPage = () => {
  const [clicked, setClicked] = useState(null);
  const [info, setInfo] = useState({});
  const [images, setImages] = useState({});
  const { width } = useWindowDimensions();
  const [currentImages, setCurrentImages] = useState({});
  const [recenterPos, setRecenterPos] = useState({});

  const loadImages = async () => {
    const data = await import("../data/images");
    setImages(data.data);
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (images[info.id]) {
      setCurrentImages(images[info.id]);
    }
  }, [info.id, images]);

  const recenter = () => {
    if (info.id) {
      setRecenterPos({
        lat: info.geometry.coordinates[0],
        long: info.geometry.coordinates[1],
      });
    }
  };

  const onMarkerClick = (data) => {
    setInfo(data);
    setRecenterPos({});
  };

  return (
    <div className="overflow-hidden map-container">
      <Map onMarkerClick={onMarkerClick} recenterPos={recenterPos} />
      <div className="menu-floater bg-zinc-50 rounded-md py-1 pr-1 pl-2.5">
        <div className="flex font-bold text-3xl items-center">
          <div className="mr-1">Woo Food</div>
        </div>
        <Burger />
      </div>
      <div
        onClick={recenter}
        className="marker-floater bg-zinc-50 drop-shadow-md rounded-md"
        title="Snap to current marker"
      >
        <i className="fa-solid fa-location-dot fa-lg px-2 py-4"></i>
      </div>
      <div
        onClick={() => {
          setClicked(true);
          setRecenterPos({});
        }}
        className={cs(
          "overlay-min",
          "mb-14 micro:mb-16 cursor-pointer rounded-md text-xl font-bold hover:bg-slate-900 hover:text-white",
          {
            "z-hidden": !clicked,
            "z-regular": info.name,
          }
        )}
        style={{
          marginLeft: (width - 512) / 2,
          marginRight: (width - 512) / 2,
        }}
      >
        <div className="my-4 mx-6 text-center title-ellipsis">{info.name}</div>
      </div>
      <div
        className={`overlay-max overflow-y-auto rounded ${
          clicked ? "overlay-max-extended" : ""
        }`}
      >
        <div
          onClick={() => setClicked(false)}
          className="cursor-pointer rounded text-center"
        >
          <div className="w-12 mx-auto bg-slate-400 text-white rounded-b-md">
            <i className="fa-solid fa-angles-down mt-1.5"></i>
          </div>
        </div>
        <div className="my-4 mx-6 text-center text-xl font-bold title-wrap">
          {info.name}
        </div>
        <Carousel currentImages={currentImages} />
        <div className="w-9/12 md:w-144 mt-12 mx-auto text-justify">
          {info.logline}
        </div>
      </div>
    </div>
  );
};

export default TravelsPage;
