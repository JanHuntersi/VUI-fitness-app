import { MapPinIcon } from "@heroicons/react/24/outline";

const GymInfoCard = ({ name, location, isOpen }) => {
  return (
    <div className="bg-slate-100 p-4 rounded shadow-md mb-4 hover:bg-slate-300">
      <h2 className="text-xl font-bold">{name}</h2>
      <div className="flex my-2 text-gray-600 gap-2">
        <MapPinIcon className="h-6 w-6" aria-hidden="true" />
        <p className="font-semibold">{location}</p>
      </div>
      <span className={`text-lg ${isOpen ? "text-green-500" : "text-red-500"}`}>
        {isOpen ? "Open Now" : "Closed Now"}
      </span>
    </div>
  );
};

export default GymInfoCard;
