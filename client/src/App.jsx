import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateService from "./pages/CreateService";
import MyRequests from "./pages/MyRequests";
import MyServices from "./pages/MyServices";
import ProviderRequests from "./pages/ProviderRequests";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route
  path="/create-service"
  element={<CreateService />}
/>
<Route
  path="/dashboard/requests"
  element={<MyRequests />}
/>

<Route
  path="/dashboard/services"
  element={<MyServices />}
/>
<Route path="/dashboard/provider-requests" element={<ProviderRequests />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
