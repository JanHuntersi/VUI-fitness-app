import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { checkIfOpen } from "./Home";
import {
  ClockIcon,
  CurrencyEuroIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

function GymInfo() {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [hoveredOffer, setHoveredOffer] = useState(null);

  useEffect(() => {
    fetch("/gyms.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const foundGym = data.find((g) => g.id === gymId);
        setGym(foundGym);
      });
  }, [gymId]);

  if (!gym) return <div>Loading...</div>;

  const handleOfferHover = (offer) => {
    setHoveredOffer(offer);
  };

  const handleOfferLeave = () => {
    setHoveredOffer(null);
  };

  return (
    <div className="bg-white max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold">{gym.name}</h2>
      <div className="flex mt-2 gap-2">
        <MapPinIcon className="h-6 w-6" aria-hidden="true" />
        <p className="font-semibold">{gym.location}</p>
      </div>
      <div className="pt-4 flex gap-2 font-medium">
        <span>Status: </span>
        <p className={`${checkIfOpen ? "text-green-500" : "text-red-500"}`}>
          {checkIfOpen ? "Open Now" : "Closed Now"}
        </p>
      </div>
      <div className="flex mt-4 pb-2 gap-2">
        <ClockIcon className="h-6 w-6" aria-hidden="true" />
        <p className="font-semibold">Opening Times:</p>
      </div>
      <div className="pl-4 w-1/2">
        {Object.entries(gym.openingTimes).map(([day, time]) => (
          <div key={day} className="flex justify-between">
            <p>{day.charAt(0).toUpperCase() + day.slice(1)}:</p>
            <p>{time}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-4 pb-2 gap-2">
        <TrophyIcon className="h-6 w-6" aria-hidden="true" />
        <p className="font-semibold">Equipment:</p>
      </div>
      <ul className="pl-8 list-disc">
        {gym.equipment.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="flex mt-4 pb-2 gap-2">
        <CurrencyEuroIcon className="h-6 w-6" aria-hidden="true" />
        <p className="font-semibold">Offers:</p>
      </div>
      <ul className="pl-8 list-disc">
        {gym.offers.map((offer) => (
          <Link to={offer} key={offer}>
            <li
              className={`p-2 rounded-lg cursor-pointer relative hover:bg-gray-100`}
              onMouseEnter={() => handleOfferHover(offer)}
              onMouseLeave={handleOfferLeave}
            >
              <span>{offer}</span>
              {hoveredOffer === offer && (
                <CurrencyEuroIcon className="h-5 w-5 absolute top-1/2 transform -translate-y-1/2 right-4 opacity-75" />
              )}
            </li>
          </Link>
        ))}
      </ul>
      <div className="flex mt-4 pb-2 gap-2">
        <ArrowTrendingDownIcon className="h-6 w-6" aria-hidden="true" />
        <p className="font-semibold">Discounts:</p>
      </div>
      <ul className="pl-8 list-disc">
        {Object.entries(gym.discounts).map(([type, discount]) => (
          <li key={type}>{`${type}: ${discount}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default GymInfo;
