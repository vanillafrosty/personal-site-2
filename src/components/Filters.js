import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePrice,
  updateVenue,
  updateRating,
} from "../features/filters/filtersSlice";
import useDebounce from "./helper/useDebounce";
import cs from "classnames";
import "../stylesheets/Filters.scss";

const Filters = () => {
  const venues = useSelector((state) => state.filters.venue);
  const prices = useSelector((state) => state.filters.price);
  const rating = useSelector((state) => state.filters.rating);
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const [localRating, setLocalRating] = useState(rating);

  const debouncedRating = useDebounce(localRating, 400);

  useEffect(() => {
    dispatch(updateRating(debouncedRating));
  }, [debouncedRating]);

  const activeHandler = (e) => {
    e.stopPropagation();
    if (!active) {
      setActive((prevState) => !prevState);
    }
  };

  const inactiveHandler = () => {
    if (active) {
      setActive((prevState) => !prevState);
    }
  };

  const venueOptions = ["Bars", "Restaurants", "Marketplaces", "Cafes"];
  const priceOptions = [1, 2, 3, 4];
  return (
    <div
      onClick={activeHandler}
      className={cs(
        "marker-floater floater-filters bg-zinc-50 drop-shadow-md rounded-md",
        {
          "filters-active": active,
        }
      )}
      title="Filters"
    >
      <i
        onClick={inactiveHandler}
        className={cs("fa-solid fa-sliders", {
          "no-width": true,
          "can-click": active,
        })}
      ></i>
      <div className={cs("filters-container")}>
        <div
          className={cs("venue-filters", { "venue-filters-active": active })}
        >
          {venueOptions.map((el) => (
            <div
              key={el}
              className={venues[el.toLowerCase()] ? "active-filter" : ""}
              onClick={() => dispatch(updateVenue(el.toLowerCase()))}
            >
              {el}
            </div>
          ))}
        </div>
        <div
          className={cs("price-filters", { "price-filters-active": active })}
        >
          {priceOptions.map((el) => (
            <div
              key={el}
              className={prices[el] ? "active-filter" : ""}
              onClick={() => dispatch(updatePrice(el))}
            >
              {[...Array(el)].map((e, index) => (
                <i key={index} className="fa-solid fa-dollar-sign"></i>
              ))}
            </div>
          ))}
        </div>
        <div
          className={cs("rating-filter", { "rating-filter-active": active })}
        >
          <div>Rating: {localRating} +</div>
          <input
            className="slider"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={localRating}
            onChange={(e) => setLocalRating(e.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default Filters;
