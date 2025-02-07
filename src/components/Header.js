import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">GymTracker</span>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto px-5">
                <div className="text-sm lg:flex-grow">

                </div>
                <div>
                    <div className="text-sm lg:flex-grow">
                        <a
                            onClick={() => {
                                navigate("/");
                            }}
                            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            Gyms
                        </a>
                        <a
                            onClick={() => {
                                navigate("/homeAlternative");
                            }}
                            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            Gyms2
                        </a>

                        <a onClick={() => {
                            navigate("/profile");
                        }} className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            Profile
                        </a>
                        <a onClick={() => {
                            navigate("/profileAlternative");
                        }} className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            Profile2
                        </a>
                        <a
                            onClick={() => {
                                navigate("/map");
                            }} className="block mt-4  lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                            Map
                        </a>
                        <a onClick={() => {
                            logout();
                            navigate("/login");
                        }} className="block mt-4 ml-3 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
