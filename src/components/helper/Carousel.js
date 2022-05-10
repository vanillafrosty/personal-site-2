import { useState, useEffect } from "react";
import cs from "classnames";
import "../../stylesheets/carousel.scss";

const Carousel = ({ currentImages }) => {
  const currentImagesKeys = Object.keys(currentImages);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setActiveCard(0);
  }, [currentImages]);

  const clickLeft = () => {
    if (currentImagesKeys.length) {
      setActiveCard((prevActive) => {
        if (prevActive === 0) {
          return currentImagesKeys.length - 1;
        } else {
          return prevActive - 1;
        }
      });
    }
  };

  const clickRight = () => {
    if (currentImagesKeys.length) {
      setActiveCard(
        (prevActive) => (prevActive + 1) % currentImagesKeys.length
      );
    }
  };

  return (
    <div className="carousel w-10/12">
      <div
        onClick={clickLeft}
        className="left-arrow cursor-pointer lg:ml-20 xl:ml-36 2xl:ml-20p"
      >
        <i className="fa-solid fa-chevron-left p-3 bg-slate-400 text-white rounded-md"></i>
      </div>
      <div
        onClick={clickRight}
        className="right-arrow cursor-pointer lg:mr-20 xl:mr-36 2xl:mr-20p"
      >
        <i className="fa-solid fa-chevron-right p-3 bg-slate-400 text-white rounded-md"></i>
      </div>
      {currentImagesKeys.map((el, i) => (
        <div
          key={el}
          onClick={() => setActiveCard(i)}
          className={cs("carousel-card w-5/12 lg:w-35p xl:w-1/3 2xl:w-30p", {
            "card-active": i === activeCard,
            "card-inactive-left":
              (i + 1) % currentImagesKeys.length === activeCard,
            "card-inactive-right":
              activeCard === currentImagesKeys.length - 1
                ? i === 0
                : i - 1 === activeCard,
          })}
        >
          <img src={currentImages[el]} />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
