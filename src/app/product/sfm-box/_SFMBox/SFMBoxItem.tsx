import { Link } from "react-router-dom";

import "../Product/Product.css";
import SFMBoxInterface from "./SFMBoxInterface";

type props = {
  box: SFMBoxInterface;
};

export default function SFMBoxItem({ box }: props) {
  return (
    <div className="col-6 col-md-4 col-lg-2 d-flex align-items-stretch p-1">
      <div className="card">
        <span className="card-shelf-text text-muted">
          0.1.{box.boxID.substr(-2, 2)}
        </span>
        <div className="img-container p-3">
          <Link to={`/SFMBoxes/byId/${box.boxID}`}>
            <img src={box.catchProv.img} alt="fish" className="card-img-top" />
          </Link>
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-6">Box ID:</div>
            <div className="col-6"> {box.boxID}</div>
            <div className="col-6">Date | Time:</div>
            {box.catchProv && (
              <div className="col-6">
                {box.catchProv.time.split(" ")[0].substr(5, 9)} |{" "}
                {box.catchProv.time.split(" ")[1].substr(0, 5)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
