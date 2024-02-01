import React, { useContext, useState, useEffect } from "react";
import { Card, Image } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import Container from "react-bootstrap/Container";
import { updateComment, createComment, deleteComment } from "..";
import { CommentContext } from "../../../contexts/CommentContext";

const Comment = ({
  commentkey,
  parent,
  author,
  avatar,
  message,
  datetime,
  rating,
  replies,
  isAuthor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isRepling, setIsRepling] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [editedMessage, setEditedMessage] = useState(message);
  const [editedRating, setEditedRating] = useState(rating);
  const comments = useContext(CommentContext);
  const [serverError, setServerError] = useState("");
  const [needReload, setNeedReload] = useState(false);

  useEffect(() => {
    if (needReload) {
      window.location.reload();
    }
  }, [needReload]);

  function reloadSetter(reload) {
    setNeedReload(reload);
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleReply = (event) => {
    setIsEditing(true);
    setIsRepling(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    updateComment({
      id: commentkey,
      rate: editedRating,
      content: editedMessage,
      isUser: comments.isUser,
    });
  };

  const handleSave2 = () => {
    setIsEditing(false);
    setIsRepling(false);
    createComment({
      targetId: comments.targetId,
      rating: editedRating,
      content: replyMessage,
      parent: commentkey,
      isUser: comments.isUser,
      errorSetter: errorSetter,
      reloadSetter: reloadSetter,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsRepling(false);
    setEditedMessage(message);
    setEditedRating(rating ? rating : 0);
    setServerError("");
  };

  const handleChange = (event) => {
    setEditedMessage(event.target.value);
  };

  const handleChange2 = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleRating = (rate) => {
    setEditedRating(rate);
  };

  const handleDelete = () => {
    deleteComment({
      id: commentkey,
    });
    window.location.reload();
  };

  function errorSetter(error) {
    setServerError(error);
  }

  return (
    <Container className="comment">
      <Card>
        <Container>
          <div className="avatar">
            <Image
              src={avatar}
              roundedCircle
              alt={`${author}'s avatar`}
              className="me-3"
              style={{ width: "32px", height: "32px" }}
            />
          </div>
          {isEditing ? (
            <></>
          ) : (
            <>
              {!parent && (
                <Rating readonly={true} initialValue={editedRating} size={20} />
              )}
            </>
          )}
          <div className="author">
            {"From: " + (author ? author : "anonymous")}{" "}
          </div>
          <div className="metadata">
            <span className="date">{"Time: " + datetime}</span>
          </div>
        </Container>

        <hr className="mt-0" />
        <div className="content">
          {isEditing ? (
            <div className="edit-mode">
              {!parent && !isRepling && (
                <Rating
                  onClick={handleRating}
                  initialValue={editedRating}
                  size={20}
                />
              )}
              <textarea
                className="edit-textarea"
                style={{ width: "100%" }}
                value={isRepling ? replyMessage : editedMessage}
                onChange={isRepling ? handleChange2 : handleChange}
              />
              <div className="edit-buttons ">
                <button
                  className="save-button btn btn-outline-success"
                  onClick={isRepling ? handleSave2 : handleSave}
                >
                  Save
                </button>
                <button
                  className="cancel-button btn btn-outline-danger"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <Container className="text">
              <p>{editedMessage} </p>
              {!isAuthor && (
                <button
                  className="edit-button btn btn-outline-primary"
                  style={{ float: "right" }}
                  onClick={handleReply}
                >
                  Reply
                </button>
              )}
              {isAuthor && (
                <>
                  <button
                    className="edit-button btn btn-outline-primary "
                    style={{ float: "right" }}
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className="edit-button btn btn-outline-danger "
                    style={{ float: "right" }}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              )}
              <p className="error">{serverError}</p>
            </Container>
          )}
        </div>
      </Card>
      {replies && (
        <ul className="ml-3">
          {replies.map((child) => (
            <Comment
              key={child.id}
              parent={child.parent}
              commentkey={child.id}
              author={child.authorName}
              avatar={child.avatar ? child.avatar : comments.defaultAvatar}
              message={child.content}
              datetime={new Date(child.timestamp).toLocaleString()}
              rating={child.rating}
              replies={child.replies}
              isAuthor={child.author.toString() === comments.userid}
            />
          ))}
        </ul>
      )}
    </Container>
  );
};

export default Comment;
