import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { Rating } from "react-simple-star-rating";

function IntroCard(props) {
  return (
    <Card className="mb-4 vh-50">
      <div className="card-body text-center">
        <img src={props.image} className="avatar" alt="avatar" />
        <h3 className="my-3">
          {props.firstname} {props.lastname}
        </h3>
        <Rating readonly="true" initialValue={props.rating} size={20} />
        <div className="div review">({props.ratingnum} ratings)</div>
        <h4 className="my-2">About Me:</h4>
        <p className="text-muted mb-5">{props.description}</p>
      </div>
    </Card>
  );
}

IntroCard.propTypes = {
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default IntroCard;
