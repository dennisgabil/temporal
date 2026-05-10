import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsers } from "./redux/actions/users";
import { setActivePage } from "./redux/actions/active";

function App() {
  const dispatch = useDispatch();

  const [fileDetails, setFileDetails] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleFileUpload = (e) => {
    setFileDetails(e.target.files);
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append("file", fileDetails[0]);

    fetch("http://localhost:8000/put-amount-on-hold", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setUsers(data?.enriched_data));
        toast.success(data.message);
      })
      .catch((error) => console.error("Error:", error));

    setSubmitClicked(true);
  };

  const toResults = () => {
    dispatch(setActivePage("Results"));
  };

  return (
    <div>
      <div className="home-wrapper">
        <input
          type="file"
          id="myFile"
          name="filename"
          accept=".csv, text/csv, application/vnd.ms-excel"
          onChange={handleFileUpload}
          className="file-input"
        />
        <br />
        <div className="button-container">
          {!submitClicked && (
            <button className="btn" onClick={uploadFile}>
              Submit
            </button>
          )}
          {submitClicked && (
            <button className="btn">
              <Link to="/results" onClick={toResults}>
                Proceed
              </Link>
            </button>
          )}
        </div>
        <ToastContainer type="success" theme="light" autoClose={3000} />
        <br />
      </div>
    </div>
  );
}

export default App;
