import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import GymInfoCard from "./GymInfoCard";

const now = new Date();
const currentHour = now.getHours();
const day = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

export function checkIfOpen(openingTimes) {
  const openingTime = openingTimes[day].split(" - ")[0];
  const closingTime = openingTimes[day].split(" - ")[1];
  const [openingHour] = openingTime.split(":");
  const [closingHour] = closingTime.split(":");
  return currentHour >= openingHour && currentHour < closingHour;
}

function HomeAlternative() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [gyms, setGyms] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("./gyms.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setGyms(data));
  }, []);

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(filter.toLowerCase())
  );

  const noMatchingGyms = filter !== "" && filteredGyms.length === 0;

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Fitness App 2</h2>
        <input
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 mb-4 rounded w-full"
        ></input>
        {noMatchingGyms && (
          <div className="text-red-500 mb-4 font-semibold text-center">
            No gyms match your filter.
          </div>
        )}
        {filteredGyms.map((gym) => {
          return (
            <Link to={`/gymAlternative/${gym.id}`} key={gym.id}>
              <GymInfoCard
                name={gym.name}
                location={gym.location}
                isOpen={checkIfOpen(gym.openingTimes)}
              />
            </Link>
          );
        })}
        <button
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-2"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default HomeAlternative;
