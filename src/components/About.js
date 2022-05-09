import dwuPic from "../assets/images/dwu-san-diego.jpg";
import issue1 from "../assets/images/known-issues-1.png";

const AboutPage = () => {
  return (
    <div className="mt-8 mb-8 mx-auto max-w-128 flex flex-col items-center border border-solid rounded-sm bg-white">
      <img
        src={dwuPic}
        className="w-1/2 md:w-96 lg:w-96 2xl:w-104 rounded-lg mt-8"
        alt="Me"
      />
      <div className="text-justify mx-8">
        <div className="mt-8 mb-8">Welcome - my name is David.</div>
        <div className="mt-8 mb-8">
          On this site you can find reviews of places I've eaten at, mostly from
          2022 onward, when this site was created.
        </div>
        <div className="mt-8 mb-8">
          <div className="border rounded mb-2 border-orange-400"></div>
          <div className="mb-2 font-bold">
            Some map markers may appear to be off if a business has moved
            locations. The marker is more recent, so it's right.
          </div>
          <div className="border rounded mt-2 mb-4 border-orange-400"></div>
          <img
            src={issue1}
            className="mx-auto w-11/12 rounded-lg"
            alt="Known issue with map markers"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
