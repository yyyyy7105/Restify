export const updateComment = (props) => {
  var data = new FormData();
  console.log(props.id, props.rate, props.content);
  data.append("rating", props.rate);
  data.append("content", props.content);
  console.log("update is called");
  fetch(
    "http://localhost:8000/comment/update/" +
      props.id +
      "/" +
      (props.isUser ? "1/" : "0/"),
    {
      method: "PUT",
      headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
      body: data,
    }
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const createComment = (props) => {
  var data = new FormData();
  if (props.rating) {
    data.append("rating", props.rating);
  }

  data.append("content", props.content);
  fetch(
    "http://localhost:8000/comment/create/" +
      (props.isUser ? "myuser" : "property") +
      "/" +
      props.targetId +
      "/" +
      props.parent +
      "/",
    {
      method: "POST",
      headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
      body: data,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (!data.id) {
        if (data.non_field_errors) {
          props.errorSetter(data.non_field_errors[0]);
        } else {
          props.errorSetter(
            "Submission failed. Check the size of the data or if you have the right to write comment"
          );
        }
        props.reloadSetter(false);
      } else {
        props.reloadSetter(true);
      }
    })
    .catch((error) => console.log(error));
};

export const deleteComment = (props) => {
  fetch("http://localhost:8000/comment/delete/" + props.id + "/", {
    method: "DELETE",
    headers: { Authorization: `Bearer ` + localStorage.getItem("access") },
  })
    .then((response) => {
      if (response.status === 204) {
        console.log("Successfully Deleted");
      }
    })
    .catch((error) => console.log(error));
};
