import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { APIContext } from "../../contexts/APIContext";

function LogOut() {
  const navigate = useNavigate();
  const user = useContext(APIContext);
  function handleLogout(event) {
    event.preventDefault();
    user.setFullName(null);
    localStorage.clear();

    navigate("/home");
  }
  return (
    <button onClick={handleLogout} className="submit btn btn-outline-danger">
      Logout
    </button>
  );
}
export default LogOut;
