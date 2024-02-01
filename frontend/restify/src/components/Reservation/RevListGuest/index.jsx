import $ from 'jquery'
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from 'datatables.net-dt';
import './revListGuest_style.css';

function RevListGuest() {
  const currentUserId = localStorage.getItem('userid');
  const [revsAsGuest, setRevsAsGuest] = useState([]);

  const [query, setQuery] = useState({ selectedStatus: "", page: 1 })
  // const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [selectedStatus, setSelectedStatus] = useState('');
  let navigate = useNavigate();
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ` + localStorage.getItem('access'),
    }
  };

  useEffect(() => {
    // const rev_guest_dt = new DataTable("#rev_guest_dt", {
    //     responsive: true,
    //     columns:[{title:"Status"}, {title:'property_id'}, {title:'host_email'}, {title:'guest_email'}, 
    //     {title:'status'},{title:'price'}, {title:'start_date'}, {title:'end_date'}, {title:'last_statusUpdate_date'}, 
    //     {title:'host_id'}],
    //     data:revsAsGuest,
    //   });
    let url = "";
    switch (query.selectedStatus) {
      case "":
        url = `http://localhost:8000/revs/list/${currentUserId}/?user_type=guest&page=${query.page}`;
        break;

      default:
        url = `http://localhost:8000/revs/list/${currentUserId}/?status=${query.selectedStatus}&user_type=guest&page=${query.page}`;
        break;
    }
    fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else {
          // should be no other failed case, 403: id not match
          throw new Error("Request failed with status " + response.status);
        }
      })
      .then(json => {
        setRevsAsGuest(json.results);
        setTotalPages(json.count)
      })
      .catch(error => {
        if (error.message === "Unauthorized") {
          // Navigate to login page
          navigate('/accounts/login')
        } else {
          // Add request error message to page
          alert(`Unknown error`);
          console.error(error);
        }
      });

    // return () => {
    //     rev_guest_dt.destroy();
    //   };
  }, [query])



  return (
    <>

      <div id="card1" className="card">

        <div className="card-header">
          <h5>Manage Reservations (as Guest)</h5>
        </div>
        <div className="card-body">
          {/* <label>
                Search Reservation Status:
                <input value={query.search} onChange={event => setQuery({
                  search: event.target.value,
                  page: 1
                })} />
              </label> */}
          <label>
            <select value={query.selectedStatus} onChange={(e) => setQuery({ page: 1, selectedStatus: e.target.value })}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
              <option value="approved">approved</option>
              <option value="canceled">canceled</option>
              <option value="terminated">terminated</option>
              <option value="completed">completed</option>
              <option value="pending(cancel request)">pending(cancel request)</option>
              <option value="expired">expired</option>
            </select>
          </label>
        </div>
        <div className="card-body">
          <table id="rev_guest_dt" className="display" style={{ width: '100%' }}>
            <thead>
              <tr>

                <th>Reservation ID</th>
                <th>Reservation Status</th>
              </tr>
            </thead>
            <tbody>
              {revsAsGuest.map((r2) => (
                <tr key={r2.pk}>
                  <td>
                    <Link to={`/reservation/${r2.pk}/details`}>{r2.pk}</Link>
                  </td>
                  <td>{r2.status}</td>


                </tr>
              ))}
            </tbody>
          </table>
          <p></p>
          <p>
            {
              query.page > 1
                ? <button className="btn btn-outline-primary" onClick={() => setQuery({ ...query, page: query.page - 1 })}>Previous</button>
                : <></>
            }
            {
              query.page < totalPages
                ? <button className="btn btn-outline-primary" onClick={() => setQuery({ ...query, page: query.page + 1 })}>Next</button>
                : <></>
            }
          </p>
          <p>page#: {query.page} out of {totalPages}</p>
        </div>
      </div>
    </>
  );

}

export default RevListGuest;