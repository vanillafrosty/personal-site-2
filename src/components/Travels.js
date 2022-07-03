import { useState, useEffect } from "react";
import Map from "./Map";
import cs from "classnames";
import { calcRating } from "../utils/rating";
import Burger from "./helper/Burger";
import Carousel from "./helper/Carousel";
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
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalImgPath, setModalImgPath] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  useEffect(() => {
    if (info.properties.id) {
      setAddress(makeAddress(info.properties));
      setImageDescription("");
    }
  }, [info]);

  useEffect(() => {
    if (copied !== null && !copied) {
      setCopied(true);
    }
  }, [copied]);

  const onMarkerClick = (data) => {
    setInfo(data);
    setClicked(true);
  };

  const openModal = (imgPath) => {
    setModal(true);
    setModalImgPath(imgPath);
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
        className="modal-container"
        style={{ display: modal && modalImgPath ? "" : "none" }}
        onClick={() => setModal(false)}
      >
        <img src={process.env.PUBLIC_URL + modalImgPath} />
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
        <div className="my-4 mx-6 text-center font-bold title-wrap">
          {info.properties.name}
        </div>
        <div className="address-container">
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
        <div className="ratings-container mt-1 flex justify-center">
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
        <Carousel
          markerId={info.properties.id}
          openModal={openModal}
          setImageDescription={setImageDescription}
        />
        <div className="image-description text-center italic mt-2 mb-2 w-11/12 mx-auto">
          {imageDescription}
        </div>
        <div className="description-container w-9/12 md:w-144 mt-8 mb-12 mx-auto text-justify">
          {info.properties.description || info.properties.logline}
        </div>
      </div>
    </div>
  );
};

export default TravelsPage;
