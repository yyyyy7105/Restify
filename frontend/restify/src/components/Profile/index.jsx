import "./yanbin.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import IntroCard from "./IntroCard";
import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ProfileContext } from "../../contexts/ProfileContext";
import OwnerCard from "./OwnerCard";
import VisitorCard from "./VisitorCard";
import UserComments from "../Comment/UserComments";
import { useNavigate } from "react-router-dom";
import {
  CommentContext,
  useCommentContext,
} from "../../contexts/CommentContext";
function Profile() {
  const user = useContext(ProfileContext);
  const comments = useContext(CommentContext);
  const { targetId } = useParams();
  const navigate = useNavigate();
  const isOwner = targetId === localStorage.getItem("userid");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/accounts/` + targetId + "/profile/", {
      method: "GET",
      headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 403) {
          return { error: "You are not allowed to view this page." };
        } else if (response.status === 404) {
          return { error: "The user does not exists" };
        }
        return { error: "Something went wrong in the server side." };
      })
      .then((data) => {
        if (!data.id) {
          navigate("/error/" + data.error);
        }
        user.setFirstName(data.first_name);
        user.setLastName(data.last_name);
        user.setEmail(data.email);
        user.setPhone(data.phone_number);
        user.setSelfIntro(data.self_intro);
        user.setRating(data.rating);
        user.setRatingNum(data.rating_num);
        user.setAvatar(data.avatar);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Container className="py-5 profile">
      <Row>
        <Col lg={4}>
          <IntroCard
            isOwner={isOwner}
            image={user.avatar ? user.avatar : comments.defaultAvatar}
            description={user.selfIntro}
            firstname={user.firstName}
            rating={user.rating}
            ratingnum={user.ratingNum}
            lastname={user.lastName}
          />
        </Col>
        <Col lg={8}>
          {isOwner ? (
            <OwnerCard
              isOwner={isOwner}
              firstname={user.firstName}
              lastname={user.lastName}
              phone={user.phone}
              email={user.email}
            />
          ) : (
            <VisitorCard
              isOwner={isOwner}
              firstname={user.firstName}
              lastname={user.lastName}
              phone={user.phone}
              email={user.email}
            />
          )}
          <CommentContext.Provider
            value={useCommentContext({ targetId, isUser: true })}
          >
            <UserComments />
          </CommentContext.Provider>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
