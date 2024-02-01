import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchContext, useSearchContext } from "../../contexts/SearchContext";
import Search from "../../components/Property/Search";
import PropertyList from "../../components/Property/PropertyList";

function MyProperties() {
  const { user_id } = useParams();
  const [hostInfo, setHostInfo] = useState({ id: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/accounts/${user_id}/profile/`, {
      headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // console.log(data);
            setHostInfo({ ...data });
            // console.log(hostInfo);
            setLoading(false);
          });
        } else if (response.status === 403) {
          return { error: "You are not allowed to view this page." };
        } else if (response.status === 404) {
          return { error: "The user does not exists" };
        }
        return { error: "Something went wrong in the server side." };
      })
      .then((data) => {
        if (data.error) {
          navigate("/error/" + data.error);
        }
      })
      .catch((error) => console.log(error.message));
  }, []);

  // if (!loading) {console.log(hostInfo)}

  return (
    <>
      <SearchContext.Provider value={useSearchContext()}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Search host={hostInfo} />
            <PropertyList host={hostInfo} />
          </>
        )}
      </SearchContext.Provider>
    </>
  );
}

export default MyProperties;
