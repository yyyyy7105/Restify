import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { Link, useNavigate } from "react-router-dom";
import "./NtfList_style.css";
const Table = ({ notifications }) => {
  return (
    <>
      <div className="card-body">
        <table className="display" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>NotificationID</th>
              <th>Summary</th>
              <th>If read</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.pk}>
                <td>
                  <Link to={`/notification/${notification.pk}/details`}>
                    {notification.pk}
                  </Link>
                </td>
                <td>{notification.summary}</td>
                <td>{notification.if_read.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Notifications = () => {
  const currentUserId = localStorage.getItem("userid");
  const [notifications, setNotifications] = useState([]);
  const [showNotReadOnly, setshowNotReadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleCheckboxChange = (event) => {
    setshowNotReadOnly(event.target.checked);
  };

  // useEffect(() => {
  //     const requestOptions = {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ` + localStorage.getItem('access'),
  //       }
  //     };

  //     fetch(`http://localhost:8000/notifications/${currentUserId}/list/?showNotReadOnly=${showNotReadOnly.toString()}&page=${page}`, requestOptions)
  //       .then(response =>response.json())
  //       .then(json => {
  //         setNotifications(json.results);
  //         setTotalPages(json.count);
  //       });
  //   }, [page,currentUserId, showNotReadOnly]

  //   )
  let navigate = useNavigate();
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("access"),
      },
    };

    fetch(
      `http://localhost:8000/notifications/${currentUserId}/list/?showNotReadOnly=${showNotReadOnly.toString()}&page=${page}`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else {
          // should be no other failed case, 403: id not match
          throw new Error("Request failed with status " + response.status);
        }
      })
      .then((json) => {
        setNotifications(json.results);
        setTotalPages(json.count);
      })
      .catch((error) => {
        if (error.message === "Unauthorized") {
          // Navigate to login page
          navigate("/accounts/login");
        } else {
          // Add request error message to page
          alert(`Unknown error`);
          console.error(error);
        }
      });
  }, [page, currentUserId, showNotReadOnly]);

  return (
    <>
      <div id="card1" className="card">
        <div className="card-header">
          <h5>List of notifications for currentUserId: {currentUserId}</h5>
        </div>
        <label className="card-body">
          Show Unread Notifications Only
          <input
            type="checkbox"
            checked={showNotReadOnly}
            onChange={handleCheckboxChange}
          />
        </label>

        <Table notifications={notifications} ifRead={showNotReadOnly} />
        <p className="card-body">
          {page > 1 ? (
            <button className="btn btn-outline-primary" onClick={() => setPage(page - 1)}>Previous</button>
          ) : (
            <></>
          )}
          {page < totalPages ? (
            <button className="btn btn-outline-primary" onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <></>
          )}
          <p>
            page#: {page} out of {totalPages}
          </p>
        </p>
      </div>
    </>
  );
};

export default Notifications;
