import { useContext, useEffect, useState } from "react";
import { useFormContext } from "../../../contexts/FormContext";
import "../LoginForm/style.css";
import {
  validateEmail,
  validatePassword1,
  validatePassword2,
  validatePhone,
  validateUpdate,
} from "..";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../contexts/ProfileContext";

function UpdateForm() {
  const user = useContext(ProfileContext);
  const navigate = useNavigate();
  const updateForm = useFormContext();
  const userid = localStorage.getItem("userid");
  const [avatarFile, setAvatarFile] = useState();
  const [serverError, setserverError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/accounts/` + userid + "/profile/", {
      method: "GET",
      headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
    })
      .then((response) => response.json())
      .then((data) => {
        updateForm.setFirstName(data.first_name);
        updateForm.setLastName(data.last_name);
        updateForm.setEmail(data.email);
        updateForm.setPhone(data.phone_number);
        updateForm.setSelfIntro(data.self_intro);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    validateEmail(updateForm.email, updateForm.setEmailError);
    validatePhone(updateForm.phone, updateForm.setPhoneError);
    validatePassword1(updateForm.password1, updateForm.setPassword1Error);
    validatePassword2(
      updateForm.password1,
      updateForm.password2,
      updateForm.setPassword2Error
    );
  }, [
    updateForm.email,
    updateForm.password1,
    updateForm.password2,
    updateForm.phone,
    updateForm.setEmailError,
    updateForm.setPhoneError,
    updateForm.setPassword1Error,
    updateForm.setPassword2Error,
  ]);

  function handleUpdate(event) {
    event.preventDefault();
    var validated = validateUpdate(
      updateForm.email,
      updateForm.setEmailError,
      updateForm.password1,
      updateForm.setPassword1Error,
      updateForm.password2,
      updateForm.setPassword2Error,
      updateForm.phone,
      updateForm.setPhoneError
    );

    var data = new FormData();
    if (user.email !== updateForm.email) data.append("email", updateForm.email);
    if (user.phone !== updateForm.phone)
      data.append("phone_number", updateForm.phone);
    if (updateForm.password1) {
      data.append("password1", updateForm.password1);
      data.append("password2", updateForm.password2);
    }
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }
    data.append("first_name", updateForm.firstName);
    data.append("last_name", updateForm.lastName);
    data.append("self_intro", updateForm.selfIntro);

    if (validated) {
      fetch(`${process.env.REACT_APP_API_URL}/accounts/profile/update/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
        body: data,
      })
        .then((response) => {
          if (response.status === 200) {
            setserverError("");
            localStorage.setItem(
              "username",
              updateForm.lastName + " " + updateForm.firstName
            );
            navigate("/accounts/profile/" + localStorage.getItem("userid"));
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
      <div className="signup overflow-scroll">
        <h1 className="text-center">Please update your profile</h1>
        <form method="GET" onSubmit={handleUpdate} action="profile_owner.html">
          <div className="form-group">
            <label htmlFor="first" className="form-label">
              First Name
            </label>
            <input
              className="form-control"
              type="texarea"
              name="first"
              id="first"
              value={updateForm.firstName}
              onChange={(e) => updateForm.setFirstName(e.target.value)}
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
              value={updateForm.lastName}
              onChange={(e) => updateForm.setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="email"
              value={updateForm.email}
              onChange={(e) => updateForm.setEmail(e.target.value)}
            />
            <div className="error">{updateForm.emailError}</div>
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              className="form-control"
              type="phone"
              name="phone"
              id="phone"
              value={updateForm.phone}
              onChange={(e) => updateForm.setPhone(e.target.value)}
            />
            <div className="error">{updateForm.phoneError}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password1" className="form-label">
              New Password
            </label>
            <input
              className="form-control"
              type="textarea"
              name="password1"
              id="password1"
              value={updateForm.password1}
              onChange={(e) => updateForm.setPassword1(e.target.value)}
            />
            <div className="error">{updateForm.password1Error}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password2" className="form-label">
              Confirm Password
            </label>
            <input
              className="form-control"
              type="textarea"
              name="password2"
              id="password2"
              value={updateForm.password2}
              onChange={(e) => updateForm.setPassword2(e.target.value)}
            />
            <div className="error">{updateForm.password2Error}</div>
          </div>
          <div className="form-group">
            <label htmlFor="selfIntro" className="form-label">
              Self Intro
            </label>
            <input
              className="form-control"
              type="textarea"
              name="selfIntro"
              id="selfIntro"
              value={updateForm.selfIntro}
              onChange={(e) => updateForm.setSelfIntro(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar" className="form-label">
              Upload file for your avatar
            </label>
            <input
              className="form-control"
              type="file"
              name="avatar"
              id="avatar"
              value={updateForm.avatar ? updateForm.avatar : ""}
              onChange={(e) => {
                updateForm.setAvatar(e.target.value);
                setAvatarFile(e.target.files[0]);
              }}
            />
          </div>
          <input
            className="btn btn-outline-success w-100"
            type="submit"
            value="UPDATE PROFILE"
          />
          <p className="error">{serverError}</p>
        </form>
      </div>
    </main>
  );
}

export default UpdateForm;
