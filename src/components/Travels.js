import { useState, useEffect } from "react";
import Map from "./Map";
import cs from "classnames";
import { calcRating } from "../utils/rating";
import Burger from "./helper/Burger";
import Carousel from "./helper/Carousel";
import useWindowDimensions from "../utils/windowResize";
import "../stylesheets/stars.scss";
import "../stylesheets/Travels.scss";

const makeAddress = (options) => {
  if (!options.address) {
    return "";
  }
  const keys = ["address", "city", "state", "zipCode", "country"];
  return keys.reduce((prev, curr, i) => {
    if (i && options[curr]) {
      return prev + ", " + options[curr];
    }
    return prev;
  }, options.address);
};

const TravelsPage = () => {
  const [clicked, setClicked] = useState(null);
  const [info, setInfo] = useState({
    properties: {},
    geometry: { coordinates: [] },
  });
  const [images, setImages] = useState({});
  const { width } = useWindowDimensions();
  const [currentImages, setCurrentImages] = useState({});
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const loadImages = async () => {
    const data = await import("../data/images");
    setImages(data.data);
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (images[info.properties.id]) {
      setCurrentImages(images[info.properties.id]);
      setAddress(makeAddress(info.properties));
    }
  }, [info, images]);

  useEffect(() => {
    if (!copied) {
      setCopied(true);
    }
  }, [copied]);

  const onMarkerClick = (data) => {
    setInfo(data);
  };

  return (
    <div className="overflow-hidden map-container">
      <Map onMarkerClick={onMarkerClick} />
      <div className="menu-floater bg-zinc-50 rounded-md py-1 pr-1 pl-2.5">
        <div className="flex font-bold text-3xl items-center">
          <div className="mr-1">Woo Food</div>
        </div>
        <Burger />
      </div>
      <div
        onClick={() => {
          setClicked(true);
        }}
        className={cs(
          "overlay-min",
          "mb-14 micro:mb-16 cursor-pointer rounded-md text-xl font-bold hover:bg-slate-900 hover:text-white",
          {
            "z-hidden": !clicked,
            "z-regular": info.properties.name,
          }
        )}
        style={{
          marginLeft: (width - 512) / 2,
          marginRight: (width - 512) / 2,
        }}
      >
        <div className="my-4 mx-6 text-center title-ellipsis">
          {info.properties.name}
        </div>
      </div>
      <div
        className={`overlay-max overflow-y-auto rounded ${
          clicked ? "overlay-max-extended" : ""
        }`}
      >
        <div
          onClick={() => {
            setClicked(false);
          }}
          className="cursor-pointer rounded text-center"
        >
          <div className="w-12 mx-auto bg-slate-400 text-white rounded-b-md">
            <i className="fa-solid fa-angles-down mt-1.5"></i>
          </div>
        </div>
        <div className="my-4 mx-6 text-center text-xl font-bold title-wrap">
          {info.properties.name}
        </div>
        <div className="text-center text-base">
          {address}
          {"  "}
          <i
            title="Copy to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(address);
              setCopied((prevCopied) => !prevCopied);
            }}
            className="cursor-pointer p-1.5 fa-regular fa-copy clipboard-icon"
          >
            <div
              className={cs("bubble bubble-bottom-left", {
                "bubble-fadein": copied,
              })}
            >
              Copied!
            </div>
          </i>
        </div>
        <div className="mt-1 text-center flex justify-center">
          {info.properties.rating && (
            <>
              <i data-star={calcRating(info.properties.rating)}></i>
              <span className="ml-1 mr-1">
                ({calcRating(info.properties.rating)})
              </span>
              <span className="mr-1">&#x2022;</span>
            </>
          )}
          <div>
            {[...Array(info.properties.price)].map((e, index) => (
              <i key={index} className="fa-solid fa-dollar-sign"></i>
            ))}
          </div>
        </div>
        <Carousel currentImages={currentImages} />
        <div className="w-9/12 md:w-144 mt-12 mx-auto text-justify">
          {info.properties.logline}
        </div>
      </div>
    </div>
  );
};

export default TravelsPage;
