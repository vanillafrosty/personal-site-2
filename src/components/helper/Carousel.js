import { useState, useEffect } from "react";
import cs from "classnames";
import LoadingImage from "./LoadingImage";
import "../../stylesheets/Carousel.scss";

const Carousel = ({ markerId, openModal }) => {
  const [allImages, setAllImages] = useState([]);
  const [allImageDescriptions, setAllImageDescriptions] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState([]);
  const [images, setImages] = useState([]);
  const [activeCard, setActiveCard] = useState(0);

  const loadData = async () => {
    const images = await import("../../data/images.json");
    setAllImages(images);
  };

  const loadDescriptions = async () => {
    const descriptions = await import("../../data/imageDescriptions.json");
    setAllImageDescriptions(descriptions);
  };

  useEffect(() => {
    loadData();
    loadDescriptions();
  }, []);

  useEffect(() => {
    setImages(allImages[markerId - 1]);
    setImageDescriptions(allImageDescriptions[markerId - 1]);
    setActiveCard(0);
  }, [markerId]);

  const clickLeft = () => {
    if (images.length) {
      setActiveCard((prevActive) => {
        if (prevActive === 0) {
          return images.length - 1;
        } else {
          return prevActive - 1;
        }
      });
    }
  };

  const clickRight = () => {
    if (images.length) {
      setActiveCard((prevActive) => (prevActive + 1) % images.length);
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
      {images &&
        images.map((el, i) => (
          <div
            key={el}
            onClick={() => setActiveCard(i)}
            className={cs("carousel-card w-5/12 lg:w-35p xl:w-1/3 2xl:w-30p", {
              "card-active": i === activeCard,
              "card-inactive-left": (i + 1) % images.length === activeCard,
              "card-inactive-right":
                activeCard === images.length - 1
                  ? i === 0
                  : i - 1 === activeCard,
            })}
          >
            <LoadingImage
              currentImage={el}
              isActive={i === activeCard}
              openModal={openModal}
            />
            <div className="text-center italic mt-2">
              {imageDescriptions.length && i === activeCard
                ? imageDescriptions[i]
                : null}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Carousel;
