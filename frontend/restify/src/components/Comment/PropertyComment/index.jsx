import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Comment from "../CommentBasic";
import Container from "react-bootstrap/Container";
import { Card } from "react-bootstrap";
import NewComment from "../NewComment";
import { CommentContext } from "../../../contexts/CommentContext";

function PropertyComments(props) {
  const comments = useContext(CommentContext);
  const [hasNext, setHashNext] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!hasNext) {
      setServerError("All comments are loaded");
    } else {
      setServerError("");
    }
  }, [hasNext]);

  const fetchData = async () => {
    if (!localStorage.getItem("userid")) {
      setServerError("Please login to view comments");
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await fetch(
      `http://localhost:8000/comment/list/property/${comments.targetId}?page=${page}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
      }
    );
    const newJson = await response.json();
    setHashNext(newJson.next);
    const newData = newJson.results;
    setData([...data, ...newData]);
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, loading]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 10 >= document.body.scrollHeight &&
      !loading
    ) {
      if (hasNext) {
        fetchData();
      }
    }
  };

  return (
    <Container
      className="row d-flex justify-content-center mb-5"
      id="comment"
      style={{ width: "70vw" }}
    >
      <Card className="p-4">
        <Card.Title>
          <h2>Comments</h2>
        </Card.Title>
        {props.host.toString() !== comments.userid && (
          <>
            <br />
            <Card.Subtitle className="mt-2">
              <h5 className="mb-0">Create my comment:</h5>
            </Card.Subtitle>
            <Card.Body>
              <NewComment
                targetId={comments.targetId}
                parent={0}
                isUser={false}
              />
            </Card.Body>
          </>
        )}
        <br />
        <Card.Subtitle className="mt-2">
          <h5 className="mb-0">Recent comments:</h5>
        </Card.Subtitle>
        <Card.Body>
          {data.map((item) => (
            <Comment
              key={item.id}
              commentkey={item.id}
              parent={item.parent}
              author={item.authorName}
              avatar={item.avatar ? item.avatar : comments.defaultAvatar}
              message={item.content}
              datetime={new Date(item.timestamp).toLocaleString()}
              rating={item.rating}
              replies={item.replies ? item.replies : []}
              isAuthor={item.author.toString() === comments.userid}
            />
          ))}
          <p className="error">{serverError}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PropertyComments;
