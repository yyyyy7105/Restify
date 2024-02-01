import { useContext, useEffect, useState, } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import './NtfDetails_style.css';
const NotificationDetails = () => {

  const { notification_id } = useParams();
  // const { currentUserId } = useContext(APIContext);
  const currentUserId = localStorage.getItem('userid');

  const [notificationDetails, setNotificationDetails] = useState([]);
  const [hasErr, setHasErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  let navigate = useNavigate();

  useEffect(
    () => {
      const requestOptions = {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          // 'X-CSRFToken': 'your_csrf_token_here',
          'Authorization': `Bearer ` + localStorage.getItem('access'),
        }
      };
      fetch(`http://localhost:8000/notifications/${currentUserId}/${notification_id}/details/`, requestOptions)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 401) {
            throw new Error("Unauthorized");
          } else if (response.status === 404) {
            // should not occur, since id is get from list page so must be valid
            throw new Error("Notification Not Found");
          }
          else {
            // should be no other failed case
            throw new Error("Request failed with status " + response.status);
          }
        })
        .then(json => {
          setNotificationDetails(json.results[0]);
        })
        .catch(error => {
          if (error.message === "Unauthorized") {
            // Navigate to login page
            navigate('/accounts/login')
          }
          else if (error.message === "Notification Not Found") {
            alert(`Notification ${notification_id} Not Found`);
          }
          else {
            alert(`Unknown error`);
            console.error(error);
          }
        });
    },

    [currentUserId, notification_id]
  )



  return (
    <>
      <main>
        <div id="ntf_cards" className="cards">
          <div id="card1" className="card">
            <div className="card-header">
              <h5>{notificationDetails.summary}</h5>
            </div>
            <div className="card-body">
              <p>
                {
                  // notificationDetails.summary.includes(":")
                  // ? <Link to={`/property/${notificationDetails.summary.split(":").parts[1]}/detail`}>Property: {notificationDetails.summary.split(":").parts[1]}</Link>
                  // :<></>
                  notificationDetails.summary && notificationDetails.summary.includes(":")
                ? <Link to={`/property/${notificationDetails.summary.split(":")[1]}/detail`}>Property: {notificationDetails.summary.split(":")[1]}</Link>
                :<></>
                }
              </p>
              <p>Recipient Email: {notificationDetails.recipient_email}</p>
              <p>Guest Email: {notificationDetails.guest_email}</p>
              <p>Host Email: {notificationDetails.host_email}</p>
              <p>Reservation ID: {notificationDetails.rev_id}</p>
              <p>If Read: {notificationDetails?.if_read?.toString()}</p>
              <p>Sent Time: {notificationDetails.create_date}</p>
            </div>

          </div>
        </div>
        <div id="link">
          <Link to={`/home`}>Back to Home Page</Link>
        </div>
      </main>

    </>


  );

}

export default NotificationDetails