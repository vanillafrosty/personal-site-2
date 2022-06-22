import { useState } from "react";
import cs from "classnames";

const FilterButton = () => {
  const [active, setActive] = useState(false);

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

  const venues = ["Bars", "Restaurants", "Marketplaces", "Cafes"];
  const prices = [1, 2, 3];
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
          "no-width": active,
          "can-click": active,
        })}
      ></i>
      <div className={cs("filters-container")}>
        <div
          className={cs("venue-filters", { "venue-filters-active": active })}
        >
          {venues.map((el) => (
            <div key={el}>{el}</div>
          ))}
        </div>
        <div
          className={cs("price-filters", { "price-filters-active": active })}
        >
          {prices.map((el) => (
            <div key={el}>
              {[...Array(el)].map((e, index) => (
                <i key={index} className="fa-solid fa-dollar-sign"></i>
              ))}
            </div>
          ))}
        </div>
        <div
          className={cs("rating-filter", { "rating-filter-active": active })}
        >
          <input type="range" min="1" max="50" defaultValue="25"></input>
        </div>
      </div>
    </div>
  );
};

export default FilterButton;
