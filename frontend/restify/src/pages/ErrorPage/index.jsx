import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

function ErrorPage() {
  const { errorMessage } = useParams();
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="text-center error">
        <h1>{errorMessage}</h1>
      </div>
    </Container>
  );
}

export default ErrorPage;
