import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import GymInfo from './components/GymInfo';
import Profile from './components/Profile';
import Workout from './components/Workout';
import OfferInfo from './components/OfferInfo';
import Header from './components/Header';
import Payment from "./components/Payment";
import Map from "./components/Map";

const routes = [
  { path: '/register', element: <Registration /> },
  { path: '/login', element: <Login /> },
  { path: '/', element: (<><Header /> <Home /> </>), private: true },
  { path: '/gym/:gymId', element: (<><Header /> <GymInfo /> </>) },
  { path: '/gym/:gymId/:offerId', element: (<><Header /> < OfferInfo /></>) },
  { path: '/profile', element: (<><Header /><Profile /></>), private: true },
  { path: "/map", element: (<><Header /><Map /> </>), private: true },
  { path: '/workout/:workoutId', element: <Workout />, private: true },
  { path: "/pay", element: <Payment />, private: true },
];

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.private ? <PrivateRoute>{route.element}</PrivateRoute> : route.element} />
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
