import { useState, useContext } from "react";
import { BsSearch } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { SearchContext } from "../../../contexts/SearchContext";
import PropertyCreateForm from "../PropertyCreateForm";
import "./style.css";

const SearchBar = () => {
  const { setSearch } = useContext(SearchContext);
  // const reqUrl = `http://127.0.0.1:8000/property/index/?search=${search}&num_guest=${numGuest}&amenity=${amenity}&ordering=${ordering}`;
  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch(document.getElementById("search-bar-input").value);
  };

  return (
    <form
      className="input-group justify-content-center"
      onSubmit={handleSubmit}
    >
      <div className="form-outline search-bar">
        <input
          type="search"
          id="search-bar-input"
          className="form-control form-control-lg"
          placeholder="Canada"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-lg shadow"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BsSearch />
      </button>
    </form>
  );
};

const ModalForm = () => {
  const searchContext = useContext(SearchContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    searchContext.setSearch(document.getElementById("search-bar-input").value);
    searchContext.setNumGuest(document.getElementById("num-guest").value);
    searchContext.setAmenity(document.getElementById("amenity").value);
    searchContext.setMaxPrice(document.getElementById("max-price").value);
    const ratingOrder = document.getElementById("rating-order").value;
    const ratingNumOrder = document.getElementById("rating-num-order").value;
    searchContext.setOrdering(
      ratingOrder.length && ratingNumOrder.length
        ? ratingOrder + "," + ratingNumOrder
        : ratingOrder + ratingNumOrder
    );
  };

  return (
    <form id="filter-form" method="GET" onSubmit={handleSubmit}>
      <div className="form-floating mb-3">
        <input
          type="number"
          min="0"
          className="form-control"
          id="num-guest"
          defaultValue={
            searchContext.numGuest === 0 ? "" : searchContext.numGuest || ""
          }
          placeholder="0"
        />
        <label htmlFor="number-guests">Number of Guest</label>
      </div>

      <div className="form-floating mb-3">
        <input
          className="form-control"
          id="amenity"
          defaultValue={searchContext.amenity}
          placeholder="kitchen"
        />
        <label htmlFor="amenity">Amenities</label>
      </div>
      <div className="form-floating">
        <input
          type="number"
          min="0"
          className="form-control"
          id="max-price"
          defaultValue={
            searchContext.maxPrice === 0 ? "" : searchContext.maxPrice || ""
          }
          placeholder="1"
        />
        <label htmlFor="max-price">Maximum Price</label>
      </div>
      <select
        id="rating-order"
        className="form-select mt-3"
        aria-label="listing select"
        defaultValue={""}
      >
        <option value="">Order of Rating (---)</option>
        <option value="rating">Ratings (low to high)</option>
        <option value="-rating">Ratings (high to low)</option>
      </select>
      <select
        id="rating-num-order"
        className="form-select mt-3"
        aria-label="listing select"
        defaultValue={""}
      >
        <option value="">Order of Rating Numbers (---)</option>
        <option value="rating_num">Rating Numbers (low to high)</option>
        <option value="-rating_num">Rating Numbers (high to low)</option>
      </select>
    </form>
  );
};

function Search({ host }) {
  // console.log(host)
  const searchContext = useContext(SearchContext);
  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const handleShow = (showModel) => () => setShow(showModel);

  const handleShowCreate = (showCreateProp) => () =>
    setShowCreate(showCreateProp);

  const handleClearFilter = () => {
    searchContext.setSearch("");
    searchContext.setNumGuest(0);
    searchContext.setAmenity("");
    searchContext.setOrdering("");
    searchContext.setMaxPrice("");
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <div className="row">
          <SearchBar />
        </div>
        <button
          type="button"
          className="btn btn-outline-primary btn-lg shadow ms-4"
          onClick={handleShow(true)}
        >
          Filter
        </button>
        {host.id > 0 ? (
          <>
            <button
              type="button"
              className="btn btn-outline-success btn-lg shadow ms-4 text-center"
              onClick={handleShowCreate(true)}
            >
              Add New
            </button>
            <Modal show={showCreate} onHide={handleShowCreate(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create new property</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <PropertyCreateForm
                  host={host}
                  show={showCreate}
                  setShow={setShowCreate}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="reset"
                  form="create-prop"
                  variant="outline-primary"
                >
                  Reset Fields
                </Button>
                <Button
                  type="submit"
                  form="create-prop"
                  variant="outline-success"
                >
                  Create Property
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <></>
        )}
      </div>
      <Modal show={show} onHide={handleShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Advanced Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalForm></ModalForm>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="reset"
            form="filter-form"
            variant="outline-primary"
            onClick={handleClearFilter}
          >
            Clear Filters
          </Button>
          <Button
            type="submit"
            form="filter-form"
            variant="outline-success"
            onClick={handleShow(false)}
          >
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <PropertyEditModal /> */}
    </>
  );
}

export default Search;
