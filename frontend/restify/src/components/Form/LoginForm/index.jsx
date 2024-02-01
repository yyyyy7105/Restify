import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "..";
import { APIContext } from "../../../contexts/APIContext";

function LoginForm() {
  const user = useContext(APIContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setserverError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const loginOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    };

    fetch("http://localhost:8000/accounts/login/", loginOptions)
      .then((response) => {
        if (response.status === 200) {
          setserverError("");
          return response.json();
        } else if (response.status === 500) {
          setserverError("Something went wrong");
        } else {
          setserverError("Please enter correct credentials");
        }
      })
      .then((data) => {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("userid", data.userid);
      })
      .then(() => {
        return fetch(
          "http://localhost:8000/accounts/" +
            localStorage.getItem("userid") +
            "/profile/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("access"),
            },
          }
        );
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        user.setFullName(data.last_name + " " + data.first_name);
        localStorage.setItem(
          "username",
          data.last_name + " " + data.first_name
        );
        setserverError("");
        navigate(
          user.currentURL.length == 0
            ? "/accounts/profile/" + localStorage.getItem("userid")
            : user.currentURL[0]
        );
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    validateEmail(email, setEmailError);
    validatePassword(password, setPasswordError);
  }, [email, password]);

  return (
    <main>
      <div className="login">
        <h1 className="text-center">Welcome to Restify</h1>
        <form onSubmit={handleSubmit} className="needs-validation">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="error">{emailError}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="error">{passwordError}</div>
          </div>
          <div className="form-group form-check">
            <input className="form-check-input" type="checkbox" id="check" />
            <label className="form-check-label" htmlFor="check">
              Remeber me
            </label>
          </div>
          <div>
            {" "}
            <Link to="/accounts/signup/">
              Don't have an account? Signup here!
            </Link>
          </div>
          <input
            className="submit btn btn-outline-success w-100"
            type="submit"
            value="SIGN IN"
          />
          <p className="error">{serverError}</p>
        </form>
      </div>
    </main>
  );
}

export default LoginForm;
