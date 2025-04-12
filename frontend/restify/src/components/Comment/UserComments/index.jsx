import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Comment from "../CommentBasic";
import Container from "react-bootstrap/Container";
import { Card } from "react-bootstrap";
import NewComment from "../NewComment";
import { CommentContext } from "../../../contexts/CommentContext";

function UserComments() {
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
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}:8000/comment/list/user/${comments.targetId}?page=${page}`,
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
    <Container>
      <Card>
        <Card.Title>Comment Section: </Card.Title>
        {comments.targetId !== comments.userid && (
          <>
            <br />
            <Card.Subtitle>Create new comment:</Card.Subtitle>
            <Card.Body>
              <NewComment
                targetId={comments.targetId}
                parent={0}
                isUser={true}
              />
            </Card.Body>
          </>
        )}
        <br />
        <Card.Subtitle>Recent comments:</Card.Subtitle>
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
          <p>{serverError}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserComments;
