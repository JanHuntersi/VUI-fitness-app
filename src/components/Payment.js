import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [gym, setGym] = useState(null);
  const [offer, setOffer] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Access individual query parameters
  const gymId = searchParams.get("gymId");
  const offerId = searchParams.get("offerId");
  const dateStr = searchParams.get("date");

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

        // Convert date string to Date object
        const parsedDate = new Date(dateStr);

        // Calculate start and end dates based on offer type
        if (foundOffer.name === "Daily Pass") {
          // Add 1 day to the date
          parsedDate.setDate(parsedDate.getDate() + 1);
          setStartDate(new Date(dateStr));
          setEndDate(parsedDate);
        } else if (foundOffer.name === "Basic Annual Membership") {
          // Add 1 year to the date
          parsedDate.setFullYear(parsedDate.getFullYear() + 1);
          setStartDate(new Date(dateStr));
          setEndDate(parsedDate);
        } else if (foundOffer.name === "All in Monthly Membership") {
          // Add 1 month to the date
          parsedDate.setMonth(parsedDate.getMonth() + 1);
          setStartDate(new Date(dateStr));
          setEndDate(parsedDate);
        }
      });
  }, [gymId, offerId, dateStr]);

  if (!gym || !offer || !startDate || !endDate) return <div>Loading...</div>;

  const handlePayment = () => {
    if (cardNumber && cardName && expiryDate && cvv) {
      // Mock success
      setPaymentSuccess(true);
  
      // Find the user by email in local storage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((userItem) => {
        if (user.email === userItem.email) {
          // Check if the user already has a "boughtMemberships" array, and if not, create one
          if (!userItem.boughtMemberships) {
            userItem.boughtMemberships = [];
          }
  
          // Add an object to the "boughtMemberships" array
          userItem.boughtMemberships.push({
            gymId: gym.id,
            offerName: offer.name,
            startDate: startDate,
            endDate: endDate,
          });
        }
        return userItem;
      });
  
      // Update the local storage with the updated user data
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      navigate("/profile")
    }
  };

  return (
    <div className="bg-white max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold">{gym.name}</h2>
      <div className="text-2xl">{offer.name}</div>
      <br></br>
      <div className="text-lg">{offer.message}</div>

      <div className="mt-4">
        <div className="text-lg text-gray-600">
          Offer Expires: {offer.expiryDate}
        </div>
        <div className="text-lg text-gray-600">
          Price: {offer.price} EUR
        </div>
        <div className="text-lg text-gray-600">
          Start Date: {startDate.toDateString()}
        </div>
        <div className="text-lg text-gray-600">
          End Date: {endDate.toDateString()}
        </div>
      </div>

      {offer.price > 0 && (
        <div className="mt-4">
          <h3 className="text-2xl font-bold">Payment Information</h3>
          <div className="mt-4">
            <label className="text-lg block mb-2">Card Number:</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="p-2 border border-gray-300 rounded w-full"
              required // Add required attribute
            />
          </div>
          <div className="mt-4">
            <label className="text-lg block mb-2">Cardholder Name:</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="p-2 border border-gray-300 rounded w-full"
              required // Add required attribute
            />
          </div>
          <div className="mt-4">
            <label className="text-lg block mb-2">Expiry Date:</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="p-2 border border-gray-300 rounded w-full"
              required // Add required attribute
            />
          </div>
          <div className="mt-4">
            <label className="text-lg block mb-2">CVV:</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="p-2 border border-gray-300 rounded w-full"
              required // Add required attribute
            />
          </div>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover-bg-blue-700"
            onClick={handlePayment}
          >
            Pay Now
          </button>
          {paymentSuccess && (
            <p className="text-green-600 mt-2">Payment Successful!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Payment;
