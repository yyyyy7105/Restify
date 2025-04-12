import { useEffect, useState } from "react";
import { useFormContext } from "../../../contexts/FormContext";
import "../LoginForm/style.css";
import "../../../share_style.css";
import {
  validateEmail,
  validatePassword,
  validatePassword2,
  validatePhone,
  validateSignup,
} from "..";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    password1,
    setPassword1,
    password1Error,
    setPassword1Error,
    password2,
    setPassword2,
    password2Error,
    setPassword2Error,
    phone,
    setPhone,
    phoneError,
    setPhoneError,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    selfIntro,
    setSelfIntro,
    avatar,
    setAvatar,
  } = useFormContext();

  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState();
  const [serverError, setserverError] = useState("");

  useEffect(() => {
    validateEmail(email, setEmailError);
    validatePhone(phone, setPhoneError);
    validatePassword(password1, setPassword1Error);
    validatePassword2(password1, password2, setPassword2Error);
  }, [
    email,
    password1,
    password2,
    phone,
    setEmailError,
    setPhoneError,
    setPassword1Error,
    setPassword2Error,
  ]);

  function handleSubmit(event) {
    var validated = validateSignup(
      email,
      setEmailError,
      password1,
      setPassword1Error,
      password2,
      setPassword2Error,
      phone,
      setPhoneError
    );

    event.preventDefault();

    var data = new FormData();

    data.append("email", email);
    data.append("password1", password1);
    data.append("password2", password2);
    data.append("phone_number", phone);
    data.append("first_name", firstName);
    data.append("last_name", lastName);
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }
    data.append("self_intro", selfIntro);

    if (validated) {
      fetch("${process.env.REACT_APP_API_URL}:8000/accounts/register/", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          if (response.status === 201) {
            setserverError("");
            navigate("/accounts/login/");
            return response.json();
          } else if (response.status === 400) {
            setserverError("Email or phone already exists");
          } else {
            setserverError("Something went wrong");
          }
        })
        .catch((error) => console.error(error));
    } else {
      setserverError("Please fill in the form correctly");
    }
  }

  return (
    <main>
      <div className="signup">
        <h1 className="text-center">Welcome to Restify</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error">{emailError}</div>
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              className="form-control"
              type="texarea"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="error">{phoneError}</div>
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
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <div className="error">{password1Error}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password2" className="form-label">
              Confirm Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password2"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <div className="error">{password2Error}</div>
          </div>
          <div className="form-group">
            <label htmlFor="first" className="form-label">
              First Name
            </label>
            <input
              className="form-control"
              type="texarea"
              name="first"
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname" className="form-label">
              Last Name
            </label>
            <input
              className="form-control"
              type="texarea"
              name="lastname"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar" className="form-label">
              Avatar
            </label>
            <input
              className="form-control"
              type="file"
              name="avatar"
              id="avatar"
              value={avatar}
              onChange={(e) => {
                setAvatar(e.target.value);
                setAvatarFile(e.target.files[0]);
                console.log(avatarFile);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="self-intro" className="form-label">
              Self Intro
            </label>
            <input
              className="form-control"
              type="texarea"
              name="self-intro"
              id="self-intro"
              value={selfIntro}
              onChange={(e) => setSelfIntro(e.target.value)}
            />
          </div>
          <input
            className="btn btn-outline-success w-100"
            type="submit"
            value="SIGN UP"
          />
          <p className="error">{serverError}</p>
        </form>
      </div>
    </main>
  );
}

export default SignupForm;
