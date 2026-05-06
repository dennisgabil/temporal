import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setUsers } from "./redux/actions/users";
import { setActivePage } from "./redux/actions/active";

function App() {
  const dispatch = useDispatch();

  const [fileDetails, setFileDetails] = useState(null);
  const [enrichedData, setEnrichedData] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    // dispatch(setActivePageData('Hold Amount'));
  }, []);

  const handleFileUpload = (e) => {
    setFileDetails(e.target.files);
  };

  const uploadFile = () => {
    // console.log(fileDetails[0]);

    const formData = new FormData();
    formData.append("file", fileDetails[0]);

    fetch("http://localhost:8000/put-amount-on-hold", {
      method: "POST", // Specifies the HTTP method
      body: formData,
    })
      .then((response) => response.json()) // Parses response body as JSON
      .then((data) => {
        console.log(data?.message);
        setEnrichedData(data?.enriched_data);
        dispatch(setUsers(data?.enriched_data));
        toast.success(data.message);
      }) // Handles the result
      .catch((error) => console.error("Error:", error));

      setSubmitClicked(true);
    };

    const toHoldAmount = () => {
      dispatch(setActivePage("Results"));
    };

    return (
      <div>
        <div
          style={{
            width: "600px",
            height: "auto",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <input
            type="file"
            id="myFile"
            name="filename"
            accept=".csv, text/csv, application/vnd.ms-excel"
            onChange={handleFileUpload}
            style={{ display: "block", marginTop: "20px" }}
          />
          <br />
          <div className="button-container">
            {!submitClicked && (
              <button
                onClick={uploadFile}
                style={{
                  backgroundColor: "#fc0",
                  color: "#000",
                  padding: "6px 20px",
                  border: "0",
                  borderRadius: "8px",
                  cursor: 'pointer'
                }}
              >
                Submit
              </button>
              )}
            {submitClicked && (
              <button
                style={{
                  backgroundColor: "#fc0",
                  color: "#000",
                  padding: "6px 20px",
                  border: "0",
                  borderRadius: "8px",
                  cursor: 'pointer'
                }}
              >
                <Link to="/results" onClick={toHoldAmount}>
                Proceed
              </Link>
            </button>
            )}
          </div>
          <ToastContainer type="success" theme="light" autoClose={3000} />
          <br />
          {enrichedData && (
            <table
              border="1"
              cellPadding="5"
              style={{
                width: "97%",
                textAlign: "left",
                marginBottom: "20px",
                fontSize: "12px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Birth Date</th>
                </tr>
              </thead>
              <tbody>
                {enrichedData &&
                enrichedData.map((item) => (
                  <tr key={item.cif_code}>
                    <td>
                      {item?.first_name} {item?.last_name}
                    </td>
                    <td>{item?.address}</td>
                    <td>{moment(item?.dob).format("DD MMM, YYYY")}</td>
                  </tr>
                  ))}
              </tbody>
            </table>
            )}
        </div>
      </div>
      );
  }

  export default App;
