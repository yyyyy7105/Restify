import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function VisitorCard(props) {

    return (
        <Card className="mb-4 vh-40" >
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-3">
                        <p className="mb-0">First Name</p>
                    </div>
                    <div className="col-sm-9">
                        <p className="text-muted mb-0">{props.firstname}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-sm-3">
                        <p className="mb-0">Last Name</p>
                    </div>
                    <div className="col-sm-9">
                        <p className="text-muted mb-0">{props.lastname}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-sm-3">
                        <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                        <p className="text-muted mb-0">{props.email}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-sm-3">
                        <p className="mb-0">Phone</p>
                    </div>
                    <div className="col-sm-9">
                        <p className="text-muted mb-0">{props.phone}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                </div>
            </div>
        </Card>
    );
}

VisitorCard.propTypes = {
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
};

export default VisitorCard;