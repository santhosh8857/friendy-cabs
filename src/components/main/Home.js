import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../utilities/Navbar";
// import About from "./About";

import "../../css/main/home.css";
import "../../css/utilities/form.css";
import About from "./About";

const Home = ({ login }) => {
  // return <>This is home page</>;
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    typeOfLogin: "",
  });

  const { email, password, typeOfLogin } = userData;

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    alert(`${email} ${password} ${typeOfLogin}`);
    setUserData({ ...userData, email: "", password: "" });
    e.preventDefault();
  };
  return (
    <>
      <header className="showcase-main">
        {login ? <Navbar login={login} /> : <Navbar />}

        {login ? (
          <div className="content">
            <form className="box" onSubmit={handleSubmit}>
              <div className="form-item">
                <label className="block">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label className="block">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="enter your password"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="check-box">
                <span>
                  <input
                    type="radio"
                    id="typeOfLogin"
                    name="typeOfLogin"
                    value="customer"
                    onChange={handleChange}
                  />
                  Customer
                </span>
                <span>
                  <input
                    type="radio"
                    id="typeOfLogin"
                    name="typeOfLogin"
                    value="driver"
                    onChange={handleChange}
                  />
                  Driver
                </span>
              </div>
              <div className="form-item">
                <button className="btn-link btn" type="submit">
                  Login &nbsp;<i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="content">
            <h1>
              <span>Enjoy</span> your ride
            </h1>
            <p>Need a cab? Grab one!</p>
            <Link to="/login" className="btn-link">
              Login &nbsp;<i class="fas fa-chevron-right"></i>
            </Link>
          </div>
        )}
      </header>
      <About />
    </>
  );
};

export default Home;
