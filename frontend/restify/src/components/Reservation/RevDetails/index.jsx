import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import './revDetails_style.css';

const ReservationDetails = () => {
  const { reservation_id } = useParams();

  const [reservationDetails, setReservationDetails] = useState([]);

  const [status, setStatus] = useState("");
  const [userType, setUserType] = useState("");

  // const { currentUserId} = useContext(APIContext);
  const currentUserId = localStorage.getItem('userid');
  let navigate = useNavigate();

  // fetch: set detail if status changes
  // useEffect(() => {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ` + localStorage.getItem('access'),
  //     }
  //   };

  //   fetch(`http://localhost:8000/revs/detail/${currentUserId}/${reservation_id}/`, requestOptions)
  //     .then(response => response.json())
  //     .then(json => {
  //       setReservationDetails(json.results[0]);
  //       setUserType(parseInt(json.results[0].host_id) === parseInt(currentUserId) ? "host" : "guest");
  //       setStatus(json.results[0].status);
  //     });
  // }, [status, userType])
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ` + localStorage.getItem('access'),
      }
    };

    fetch(`http://localhost:8000/revs/detail/${currentUserId}/${reservation_id}/`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 404) {
          // should not occur, since id is get from list page so must be valid
          throw new Error("Reservation Not Found");
        }
        else {
          // should be no other failed case
          throw new Error("Request failed with status " + response.status);
        }
      }).then(json => {
        setReservationDetails(json.results[0]);
        setUserType(parseInt(json.results[0].host_id) === parseInt(currentUserId) ? "host" : "guest");
        setStatus(json.results[0].status);
      }).catch(error => {
        if (error.message === "Unauthorized") {
          // Navigate to login page
          navigate('/accounts/login')
        }
        else if (error.message === "Reservation Not Found") {
          alert(`Reservation ${reservation_id} Not Found`);
        }
        else {
          // Add request error message to page
          alert(`Unknown error`);
          console.error(error);
        }
      })
  }, [status, userType])

  const [loading, setLoading] = useState(false);

  const handleClick = async (action) => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ` + localStorage.getItem('access'),
      }
    };

    setLoading(true);
    const url = `http://localhost:8000/revs/action/${reservation_id}/${action}/`;
    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setStatus(data.status);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // return <>
  //   <div classNameName="cards">
  //     <div>



  //   </div>

  // </div>
  //   <h3>Reservation: {reservation_id}</h3>
  //   <h3>Reservation Detail</h3>
  //   <div>
  //     <p></p>
  //     <p>Property ID: {reservationDetails.property_id}</p>
  //     <p>Host: {reservationDetails.host_email}</p>
  //     <p>Guest: {reservationDetails.guest_email}</p>
  //     <p>Price: {reservationDetails.price}</p>
  //     <p>Start Date{reservationDetails.start_date}</p>
  //     <p>End Date{reservationDetails.end_date}</p>
  //     <p>Status: {status}</p>
  //     <p>Last Updating Status Time Stamp: {reservationDetails.last_statusUpdate_date}</p>
  //   </div>

  //   <h3>Reservation Actions</h3>
  //   <div>
  //     <>status:{status}, </>
  //     <>userType:{userType}</>
  //     <div>
  //       {
  //         status === "pending" && userType === "host"
  //           ? <button type="button" classNameName="btn btn-danger" onClick={() => handleClick("deny_reservation_request")} disabled={loading}>
  //             Deny Reservation
  //           </button>
  //           : <></>
  //       }
  //     </div>

  //     <div>
  //       {
  //         status === "pending" && userType === "host"
  //           ? <button type="button" classNameName="btn btn-success" onClick={() => handleClick("approve_reservation_request")} disabled={loading}>
  //             Approve Reservation
  //           </button>
  //           : <></>
  //       }
  //     </div>

  //     <div>
  //       {
  //         status === "approved" && userType === "host"
  //           ? <button type="button" classNameName="btn btn-danger" onClick={() => handleClick("terminate")} disabled={loading}>
  //             Terminate
  //           </button>
  //           : <></>
  //       }
  //     </div>

  //     <div>
  //       {
  //         status === "approved" && userType === "guest"
  //           ? <button type="button" classNameName="btn btn-primary" onClick={() => handleClick("request_cancel_reservation")} disabled={loading}>
  //             Request Cancel
  //           </button>
  //           : <></>
  //       }
  //     </div>

  //     <div>
  //       {
  //         status === "pending(cancel request)" && userType === "host"
  //           ? <button type="button" classNameName="btn btn-danger" onClick={() => handleClick("deny_cancel_request")} disabled={loading}>
  //             Deny Cancel
  //           </button>
  //           : <></>
  //       }
  //     </div>

  //     <div>
  //       {
  //         status === "pending(cancel request)" && userType === "host"
  //           ? <button type="button" classNameName="btn btn-danger" onClick={() => handleClick("approve_cancel_request")} disabled={loading}>
  //             Approve Cancel
  //           </button>
  //           : <></>
  //       }
  //     </div>



  //   </div>
  // </>
  // TODO: link to property, host, guest
  return <main id="main1">

    <div className="cards">

      <div id="card1" className="card">
        <div className="card-header">
          <h5>Reservation Details</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <span className="card-text-label">Reservation ID:</span>
            <span id="reservation-status">{reservation_id}</span>
          </p>
          <p className="card-text">
            <span className="card-text-label">Status:</span>
            <span id="reservation-status">{status}</span>
          </p>
          <p className="card-text">
            <span className="card-text-label">Last Updating Status Time Stamp: </span>
            <span id="reservation-status">{reservationDetails.last_statusUpdate_date}</span>
          </p>
          <p className="card-text">
            <span className="card-text-label">Start Date: </span>
            <span>{reservationDetails.start_date}</span>
          </p>
          <p className="card-text">
            <span className="card-text-label">End Date: </span>
            <span>{reservationDetails.end_date}</span>
          </p>
          <p className="card-text">
            <span className="card-text-label">Reservation Price:</span>
            <span>{reservationDetails.price}</span>
          </p>
          <p className="crad-text">
            <span className="card-text-label">Host:</span>
            {/* <a href="../account/profile_other.html" className="card-link">Maggie Marsh</a> */}
            <span>{reservationDetails.host_email}</span>
          </p>
          <p className="crad-text">
            <span className="card-text-label">Renter:</span>
            {/* <a href="../account/profile_other.html" className="card-link">Yanbin Huang</a> */}
            <span>{reservationDetails.guest_email}</span>
          </p>
          <p className="crad-text">
            {/* <a href="../index_listing/listing_b1.html" className="card-link">View Listing</a> */}
            <span className="card-text-label">Property: </span>
            {/* <span>{reservationDetails.property_id}</span> */}
            <span><Link to={`/property/${reservationDetails.property_id}/detail`}>{reservationDetails.property_id}</Link></span>
          </p>
        </div>
      </div>
      <div id="card2" className="card">
        <div className="card-header">
          <h5>Reservation Action</h5>
        </div>
        <div className="card-body">

          <p className="card-text">
            <span className="card-text-label">Current Status: </span>
            <span id="reservation-status">{status}</span>
          </p>
          <p className="card-text">
            <span className="card-text-label">Current userType: </span>
            <span id="reservation-status">{userType}</span>
          </p>
          <div>
            {
              status === "pending" && userType === "host"
                ? <button type="button" className="btn btn-outline-danger" onClick={() => handleClick("deny_reservation_request")} disabled={loading}>
                  Deny Reservation
                </button>
                : <></>
            }
          </div>

          <div>
            {
              status === "pending" && userType === "host"
                ? <button type="button" className="btn btn-outline-success" onClick={() => handleClick("approve_reservation_request")} disabled={loading}>
                  Approve Reservation
                </button>
                : <></>
            }
          </div>

          <div>
            {
              status === "approved" && userType === "host"
                ? <button type="button" className="btn btn-outline-danger" onClick={() => handleClick("terminate")} disabled={loading}>
                  Terminate
                </button>
                : <></>
            }
          </div>

          <div>
            {
              status === "approved" && userType === "guest"
                ? <button type="button" className="btn btn-outline-primary" onClick={() => handleClick("request_cancel_reservation")} disabled={loading}>
                  Request Cancel
                </button>
                : <></>
            }
          </div>

          <div>
            {
              status === "pending(cancel request)" && userType === "host"
                ? <button type="button" className="btn btn-outline-danger" onClick={() => handleClick("deny_cancel_request")} disabled={loading}>
                  Deny Cancel
                </button>
                : <></>
            }
          </div>

          <div>
            {
              status === "pending(cancel request)" && userType === "host"
                ? <button type="button" className="btn btn-outline-danger" onClick={() => handleClick("approve_cancel_request")} disabled={loading}>
                  Approve Cancel
                </button>
                : <></>
            }
          </div>

        </div>

      </div>
      <div id="link">
        <Link to={`/home`}>Back to Home Page</Link>
      </div>
    </div>
  </main>
}

export default ReservationDetails
