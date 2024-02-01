import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import { Rating } from "react-simple-star-rating";
import { PropertyDetailContext } from "../../../contexts/PropertyDetailContext";
import PropertyEditModal from "../PropertyEditModal";
import "./style.css";
import PropertyComments from "../../Comment/PropertyComment";
import {
  useCommentContext,
  CommentContext,
} from "../../../contexts/CommentContext";

const validateRevTime = (price) => {
  const startDate = new Date($("#start-date").val());
  const endDate = new Date($("#end-date").val());
  const timeDiff = endDate.getTime() - startDate.getTime();
  if (timeDiff < 0) {
    $("#rev-time-error").text(
      "Error: Start date cannot be later than end date"
    );
    $("#total-price").text("");
    return false;
  } else {
    $("#rev-time-error").text("");
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    $("#total-price").text(`Price is $${price * diffDays}`);
    return true;
  }
};

function RevCreationForm() {
  const { prop } = useContext(PropertyDetailContext);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateRevTime(prop.price)) return;

    const formData = new FormData();
    formData.append(
      "start_date",
      event.target.elements["start-date"].value + "T12:00:00Z"
    );
    formData.append(
      "end_date",
      event.target.elements["end-date"].value + "T12:00:00Z"
    );

    fetch(`http://127.0.0.1:8000/revs/create/${prop.id}/`, {
      method: "POST",
      headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          $("#rev-time-error").text("");
          response
            .json()
            .then((data) => navigate(`/reservation/${data.pk}/details`));
        } else {
          response
            .json()
            .then((data) => $("#rev-time-error").text("Error: " + data.error));
        }
      })
      .catch((error) => console.log("Error: " + error.message));
  };

  const currentUserId = parseInt(localStorage.getItem("userid"));
  var disableRev = "";
  // console.log(currentUserId)
  if (!currentUserId) {
    disableRev = "disabled";
  }

  return (
    <>
      <div className="col-3">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="form-floating pt-3">
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              className="form-control"
              type="date"
              required
              onChange={() => validateRevTime(prop.price)}
              disabled={disableRev}
            />
          </div>
          <div className="form-floating pt-3">
            <label htmlFor="end-date">End Date</label>
            <input
              id="end-date"
              className="form-control"
              type="date"
              required
              onChange={() => validateRevTime(prop.price)}
              disabled={disableRev}
            />
          </div>
          <b id="rev-time-error" className="mt-3" style={{ color: "red" }}>
            {currentUserId ? (
              <></>
            ) : (
              "Please login first before making a reservation!"
            )}
          </b>
          <p id="total-price" className="mt-3"></p>
          <button
            type="submit"
            className="btn btn-outline-primary w-20"
            disabled={disableRev}
          >
            Make Reservation
          </button>
        </form>
      </div>
    </>
  );
}

function PropertyDetail() {
  const currentUserId = parseInt(localStorage.getItem("userid"));
  const [defaultAvatar, setDefaultAvatar] = useState(
    "https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67"
  );
  const { prop } = useContext(PropertyDetailContext);

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-6">
            <div className="card-body">
              <div className="d-flex">
                <div className="d-inline me-5">
                  <h3 className="card-text mb-0">{prop.name}</h3>
                </div>
                <Link to={`/accounts/profile/${prop.host}`}>
                  <img
                    src={
                      prop.host_avatar === null
                        ? defaultAvatar
                        : prop.host_avatar
                    }
                    className="property-host-avatar"
                    alt=""
                  />
                </Link>
              </div>

              <p>{`${prop.city}, ${prop.province}, ${prop.country}`}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <a href="#comment" className="text-decoration-none me-2 mb-3">
                  <div>
                    <Rating initialValue={prop.rating} size="19px" readonly />
                  </div>
                </a>
                <h6>{prop.rating}</h6>
              </div>

              {currentUserId === prop.host ? <PropertyEditModal /> : <></>}
              <h5 id="num-guests">Amenities: {prop.amenity}</h5>
              <p id="num-guests">{prop.capacity} guests</p>
              <p id="price-per-day" className="card-text">
                Price: ${prop.price} per day
              </p>
              <p id="host-email" className="card-text">
                Email: <Link to={`mailto:${prop.email}`}>{prop.email}</Link>
              </p>
              <p id="host-tel" className="card-text">
                Phone Number:{" "}
                <Link to={`tel:${prop.phone_number}`}>{prop.phone_number}</Link>
              </p>
            </div>
          </div>

          {currentUserId !== prop.host ? <RevCreationForm /> : <></>}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <CommentContext.Provider
          value={useCommentContext({ targetId: prop.id, isUser: false })}
        >
          <PropertyComments host={prop.host} />
        </CommentContext.Provider>
      </div>
    </>
  );
}

export default PropertyDetail;
