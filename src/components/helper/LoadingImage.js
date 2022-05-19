import { useState } from "react";
import cs from "classnames";
import PropTypes from "prop-types";
import "../../stylesheets/spinner.scss";

const LoadingImage = ({
  currentImage,
  classNames,
  alt,
  isActive,
  openModal,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div
        className={cs("loader-spinner-container", classNames.spinnerContainer)}
        style={{ display: loading ? "" : "none" }}
      >
        <svg className="loader-spinner" viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          ></circle>
        </svg>
      </div>

      <img
        className={cs(classNames.img)}
        src={process.env.PUBLIC_URL + currentImage}
        onLoad={() => setLoading(false)}
        style={{ display: loading ? "none" : "" }}
        alt={alt}
        onClick={() => {
          if (isActive) {
            openModal(process.env.PUBLIC_URL + currentImage);
          }
        }}
      />
    </>
  );
};

LoadingImage.propTypes = {
  currentImage: PropTypes.string.isRequired,
  classNames: PropTypes.shape({}),
  alt: PropTypes.string,
  isActive: PropTypes.bool,
};

LoadingImage.defaultProps = {
  classNames: {},
};

export default LoadingImage;
