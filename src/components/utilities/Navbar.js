import { Link } from "react-router-dom";

import "../../css/utilities/utilities.css";
import "../../css/utilities/navbar.css";

const Navbar = ({ login }) => {
  return (
    <div id="navbar" className="navbar">
      <h1 className="logo">
        <span className="text-white">
          <i class="fa-solid fa-taxi logo-color"></i> Friendy Cabs
        </span>
      </h1>

      <nav>
        <ul>
          <li>
            <Link className="route-link" to="/">
              Home
            </Link>
          </li>
          {login ? (
            <></>
          ) : (
            <>
              <li>
                <Link className="route-link" to="/#about">
                  About
                </Link>
              </li>
              <li>
                <Link className="route-link" to="/contact">
                  Contact
                </Link>
              </li>
            </>
          )}
          <li>
            <Link className="route-link" to="/register">
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
