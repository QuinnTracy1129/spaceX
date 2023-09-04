import React, { useEffect, useState } from "react";
import ImagePreset from "./assets/image-preset.png";

export default function ListItem({ launch = {}, index, hasLoaded }) {
  const [isLoading, setIsLoading] = useState(true);

  const { flight_number = "", links = {}, name, details } = launch;

  useEffect(() => {
    if (hasLoaded) {
      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    }
  }, [hasLoaded]);

  return (
    <li
      data-index={index}
      className="list-group-item d-flex align-items-center"
    >
      {isLoading ? (
        <span className="fa fa-2x fa-spinner fa-spin mx-auto" />
      ) : (
        <>
          <img
            src={links?.patch?.small || ImagePreset}
            className="mx-3"
            width={50}
            height={50}
          />
          <div>
            <h6 className="my-2">
              {flight_number}:
              <span className={`${flight_number && "ms-1"}`}>{name}</span>
            </h6>
            <p>{details}</p>
          </div>
        </>
      )}
    </li>
  );
}
