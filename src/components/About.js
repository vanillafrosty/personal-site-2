import dwuPic from "../assets/images/dwu-san-diego.jpg";
import LoadingImage from "./helper/LoadingImage";
import "../stylesheets/About.scss";

const AboutPage = () => {
  return (
    <div className="about-container mt-10 mx-auto max-w-128 flex flex-col items-center border border-solid rounded-sm bg-white">
      <div className="w-1/2 md:w-96 lg:w-96 2xl:w-104 mt-10">
        <LoadingImage
          currentImage={dwuPic}
          alt="Me"
          classNames={{ img: "w-full rounded-lg" }}
        />
      </div>
      <div className="text-justify mx-8">
        <div className="mt-8 mb-8">Welcome! My name is David.</div>
        <div className="mt-8 mb-8">
          On this site you can find reviews of places I've eaten at, mostly from
          2022 onward, when this site was created.
        </div>
        <div className="mt-8 mb-4">
          I coded this site from scratch, and at the moment it's constantly
          updated and maintained. You can support me below with a donation to
          help me maintain and improve the site, as well as find more time to
          explore and review food.
        </div>
        <div className="text-center mb-10">
          <a
            className="block w-11/12 mt-5 mx-auto bg-red-400 p-3 rounded text-white text-lg font-bold"
            href="https://ko-fi.com/woofood"
          >
            Donate
          </a>
        </div>
        {/* <div className="mt-8 mb-10">
          <div className="border rounded mb-2 border-orange-400"></div>
          <div className="mb-2 font-bold">
            Some map markers may appear to be off if a business has moved
            locations. The marker is more accurate.
          </div>
          <div className="border rounded mt-2 mb-4 border-orange-400"></div>
          <img
            src={issue1}
            className="mx-auto w-11/12 rounded-lg"
            alt="Known issue with map markers"
          />
        </div> */}
      </div>
    </div>
  );
};

export default AboutPage;
