import { useState } from "react";
import Map from "./Map";
import cs from "classnames";
import "../stylesheets/Travels.scss";
import useWindowDimensions from "../utils/windowResize";
import Burger from "./helper/Burger";

const TravelsPage = () => {
  const [clicked, setClicked] = useState(null);
  const [info, setInfo] = useState({});
  const { width } = useWindowDimensions();

  return (
    <div className="overflow-hidden map-container">
      <Map onMarkerClick={(data) => setInfo(data)} />
      <div className="map-floater bg-zinc-50 drop-shadow-xl rounded-md py-1 pr-1 pl-2.5 mx-auto">
        <div className="flex font-bold text-3xl items-center">
          <div className="mr-1">DWU Reviews</div>
        </div>
        <Burger />
      </div>
      <div
        onClick={() => {
          setClicked(true);
        }}
        className={cs(
          "overlay-min",
          "drop-shadow-2xl cursor-pointer rounded-md mb-10 text-xl font-bold hover:bg-slate-900 hover:text-white",
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
        className={`overlay-max overflow-y-scroll rounded ${
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
        <div className="w-9/12 mx-auto text-justify">{info.description}</div>
      </div>
    </div>
  );
};

export default TravelsPage;
