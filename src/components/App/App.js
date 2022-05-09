import "../../stylesheets/App.scss";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Travels";
import About from "../About";
import Burger from "../helper/Burger";
import { NavAbout, NavTravel } from "../helper/NavLinks";

const App = () => {
  const location = useLocation();
  const [page, setPage] = useState(location.pathname);

  useEffect(() => {
    setPage(location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={`font-sans h-screen text-black ${
        page === "/" ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={`h-17 flex sticky top-0 justify-between p-4 bg-red-50 drop-shadow-md ${
          page === "/" ? "hidden" : ""
        }`}
      >
        <div className="flex font-bold text-3xl items-center">
          <div>Woo Food</div>
        </div>
        <Burger className="tiny:hidden" />
        <div className="hidden tiny:flex text-lg font-bold items-center">
          <NavAbout
            className={
              page === "/about"
                ? "shadow-lower mr-4"
                : "mr-4 hover:shadow-lower"
            }
          />
          <NavTravel
            className={
              page === "/" ? "shadow-lower mr-4" : "mr-4 hover:shadow-lower"
            }
          />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
