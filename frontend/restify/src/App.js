import logo from "./logo.svg";
import "./App.css";
import { useAPIContext, APIContext } from "./contexts/APIContext";
import { useProfileContext, ProfileContext } from "./contexts/ProfileContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Notifications from "./components/Notification/NtfList";
import NotificationDetails from "./components/Notification/NtfDetails";
import ReservationDetails from "./components/Reservation/RevDetails";
import Layout from "./Layouts/layout";
import LoginForm from "./components/Form/LoginForm";
import Signupform from "./components/Form/SignupForm";
import RevList from "./components/Reservation/RevListHost";
import HomePage from "./pages/HomePage";

import {
  PropertyDetailContext,
  usePropertyDetailContext,
} from "./contexts/PropertyDetailContext";
import Home from "./pages/Home";
import PropertyPage from "./pages/PropertyPage";
import MyProperties from "./pages/MyProperties";
import Profile from "./components/Profile";
import UpdateForm from "./components/Form/UpdateForm";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <APIContext.Provider value={useAPIContext()}>
              <Layout />
            </APIContext.Provider>
          }
        >
          <Route index element={<Home />} />
          <Route path="error/:errorMessage" element={<ErrorPage />} />
          <Route path="home" element={<HomePage />} />
          <Route
            path="notification/:notification_id/details"
            element={<NotificationDetails />}
          />
          <Route
            path="reservation/:reservation_id/details"
            element={<ReservationDetails />}
          />
        </Route>
        <Route
          path="accounts/"
          element={
            <APIContext.Provider value={useAPIContext()}>
              <ProfileContext.Provider value={useProfileContext()}>
                <Layout />
              </ProfileContext.Provider>
            </APIContext.Provider>
          }
        >
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<Signupform />} />
          <Route path="profile/update" element={<UpdateForm />} />
          <Route path="profile/:targetId" element={<Profile />} />
        </Route>
        <Route path="property/" element={<Layout />}>
          <Route path="index" element={<Home />} />
          <Route
            path=":prop_id/detail"
            element={
              <PropertyDetailContext.Provider
                value={usePropertyDetailContext()}
              >
                <PropertyPage />
              </PropertyDetailContext.Provider>
            }
          />
          <Route
            path="user/:user_id"
            element={
              <PropertyDetailContext.Provider
                value={usePropertyDetailContext()}
              >
                <MyProperties />
              </PropertyDetailContext.Provider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
