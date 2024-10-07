import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { checkIfOpen } from "./Home";
import {
  ClockIcon,
  CurrencyEuroIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for styling

function OfferInfo() {
  const { gymId, offerId } = useParams();
  const [gym, setGym] = useState(null);
  const [offer, setOffer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);



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

    fetch("/offers.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data = data.offers;
        const foundOffer = data.find((g) => g.name === offerId);

        setOffer(foundOffer);
      });
  }, [gymId, offerId]);

  if (!gym || !offer) return <div>Loading...</div>;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-white max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold">{gym.name}</h2>
      <div className="text-2xl">{offer.name}</div>
      <div className="text-xl">{offer.description}</div>
      <br></br>
      <div className="text-lg">{offer.message}</div>

      <div className="mt-4 flex items-center">
        <div className="flex-1">
          <p className="text-lg text-gray-600">
            <ClockIcon className="h-6 w-6 inline-block mr-2" />
            Offer Expires: {offer.expiryDate}
          </p>
          <p className="text-lg text-gray-600">
            <CurrencyEuroIcon className="h-6 w-6 inline-block mr-2" />
            Price: {offer.price} EUR
          </p>
        </div>
      </div>

      {offer.select_type === "date" && (
        <div className="mt-4">
          <label className="text-lg block mb-2">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd" // Customize the date format
          />
        </div>
      )}

      {(offer.price > 0 && selectedDate) && (
        <div className="mt-4">
        <Link to={`/pay?offerId=${offerId}&gymId=${gymId}&date=${selectedDate}`}>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
            Buy Now
          </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default OfferInfo;
