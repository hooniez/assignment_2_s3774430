import "./App.css";
import Users from "./pages/Users/Users";
import NumUsersPerDayChart from "./fragments/NumUsersPerDayChart";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./fragments/Navbar";
import Footer from "./fragments/Footer";
import Posts from "./pages/Posts/Posts";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navbar></Navbar>
        <div className="container my-3 ">
          <Routes>
            <Route path="/" element={<NumUsersPerDayChart />} />
            <Route path="/users" element={<Users />} />
            <Route path="/posts" element={<Posts />} />
          </Routes>
        </div>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
