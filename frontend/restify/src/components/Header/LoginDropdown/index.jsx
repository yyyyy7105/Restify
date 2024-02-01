import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";
import LogOut from "../../Logout";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

function LoginDropdown() {
  const user = useContext(APIContext);
  if (localStorage.getItem("userid") | user.fullName) {
    return (
      <ul className="navbar-nav">
        <li className="nav-item dropdown">
          <NavDropdown
            title={localStorage.getItem("username")}
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item
              href={"/accounts/profile/" + localStorage.getItem("userid")}
            >
              MyProfile
            </NavDropdown.Item>
            <NavDropdown.Item href={"/home"}>
              Home Page(My Reservations & Notifications)
            </NavDropdown.Item>
            <NavDropdown.Item
              href={`/property/user/${localStorage.getItem("userid")}`}
            >
              View my listings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <LogOut />
            </NavDropdown.Item>
          </NavDropdown>
        </li>
      </ul>
    );
  }
  return (
    <ul className="navbar-nav">
      <li className="nav-item dropdown">
        <Link className="nav-link big" to="/accounts/login" role="button">
          Please Login
        </Link>
      </li>
    </ul>
  );
}

export default LoginDropdown;
