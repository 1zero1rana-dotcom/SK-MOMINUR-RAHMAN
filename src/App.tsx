import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="course/:id/pay" element={<Payment />} />
          <Route path="about" element={<About />} />
          <Route path="community" element={<div className="py-24 text-center text-4xl font-black">Community Page (Coming Soon)</div>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
