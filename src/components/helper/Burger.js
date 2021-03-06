import { useState } from "react";
import cs from "classnames";
import { NavAbout, NavTravel } from "../helper/NavLinks";
import "../../stylesheets/Burger.scss";

const Burger = ({ className }) => {
  const [burgerDown, setBurgerDown] = useState(null);

  return (
    <>
      <div
        onClick={() => setBurgerDown((prevDown) => !prevDown)}
        className={cs(
          "burger-parent w-12 h-9 py-1.5 cursor-pointer rounded-md",
          className
        )}
      >
        <div className="text-center">
          <i className="fa-solid fa-bars fa-2xl"></i>
        </div>
        <div
          className={`burger w-28 bg-white text-lg text-right font-bold rounded ${
            burgerDown ? "burger-down" : ""
          } ${burgerDown === false ? "burger-down burger-up" : ""}`}
        >
          <NavAbout className="block rounded-t hover:bg-slate-900 hover:text-white px-4 py-2 border-b border-slate-200" />
          <NavTravel className="block rounded-b hover:bg-slate-900 hover:text-white px-4 py-2" />
        </div>
      </div>
    </>
  );
};

export default Burger;
