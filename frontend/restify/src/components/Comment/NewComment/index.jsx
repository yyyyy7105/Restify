import React, { useEffect, useState } from "react";
import { createComment } from "../";
import { Rating } from "react-simple-star-rating";
import { Container } from "react-bootstrap";

function NewComment(props) {
  const [content, setContent] = useState("Enter your comment here");
  const [rating, setRating] = useState();
  const [serverError, setServerError] = useState("");
  const [needReload, setNeedReload] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    createComment({ ...props, rating, content, errorSetter, reloadSetter });
  };

  useEffect(() => {
    if (needReload) {
      window.location.reload();
    }
  }, [needReload, serverError]);

  function errorSetter(error) {
    setServerError(error);
  }

  function reloadSetter(reload) {
    setNeedReload(reload);
  }

  const handleCancel = (event) => {
    event.preventDefault();
    setRating(null);
    setContent("Enter your comment here");
    setServerError("");
  };

  const handleRating = (rating) => {
    setRating(rating);
  };

  return (
    <Container className="edit-mode d-flex flex-column">
      <Rating
        onClick={handleRating}
        initialValue={rating}
        size={20}
        className="mb-3"
        readonly={!localStorage.getItem("userid")}
      />
      <textarea
        className="form-control edit-textarea mb-3"
        style={{ width: "90%" }}
        placeholder={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        disabled={!localStorage.getItem("userid")}
      />

      <div className="edit-buttons">
        <button
          className="save-button btn btn-outline-success"
          onClick={handleSubmit}
          disabled={!localStorage.getItem("userid")}
        >
          Save
        </button>
        <button
          className="cancel-button btn btn-outline-danger"
          onClick={handleCancel}
          disabled={!localStorage.getItem("userid")}
        >
          Cancel
        </button>
      </div>
      {serverError && <p className="error">{serverError}</p>}
    </Container>
  );
}

export default NewComment;
