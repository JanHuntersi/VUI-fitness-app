import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet';
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Map() {

    const navigate = useNavigate();
    const [gym, setGym] = useState(null);

    useEffect(() => {
        fetch("/gyms.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setGym(data);
            });
    }, []);
    return (
        <>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "calc(100vh - 4rem)" }}
            >
                <TileLayer
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    gym && (gym.map((el) => {
                        return (
                            <Marker position={el.latLong} icon={new Icon({ iconUrl: markerIconPng, iconSize: [22, 35], iconAnchor: [12, 41] })} >
                                <Popup>
                                    <a onClick={() => {
                                        navigate(`/gym/${el.id}`);
                                    }}

                                    >{el.name}</a>                                </Popup>
                            </Marker>

                        )
                    }))
                }

            </MapContainer>
        </>
    );
}
