import { useState, useEffect } from "react";
import "./Home.css";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setUsers } from "./redux/actions/users";
import { setActivePage } from "./redux/actions/active";

const PRODUCTS = ["Personal Loan", "Home Loan", "Credit Card Loan"];

function getRandomCustomerStatus() {
  const statuses = ["Found", "Not Found"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomPaymentStatus() {
  const statuses = ["Paid", "Unpaid"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomProduct() {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}

const BADGE_CLASS = {
  Found:       "badge badge-found",
  "Not Found": "badge badge-not-found",
  Paid:        "badge badge-paid",
  Unpaid:      "badge badge-unpaid",
};

const Badge = ({ value }) => (
  <span className={BADGE_CLASS[value] ?? "badge"}>{value}</span>
);

function App() {
  const dispatch = useDispatch();

  const [fileDetails, setFileDetails] = useState(null);
  const [enrichedData, setEnrichedData] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    fetch("/sample_record_100.json")
      .then((res) => res.json())
      .then((data) =>
        setEnrichedData(
          data.map((item) => ({
            ...item,
            customer_status: getRandomCustomerStatus(),
            payment_status:  getRandomPaymentStatus(),
            product:         getRandomProduct(),
          }))
        )
      )
      .catch((err) => console.error("Failed to load sample data:", err));
  }, []);

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
        // setEnrichedData(data?.enriched_data);
        setEnrichedData(
          data.map((item) => ({
            ...item,
            customer_status: getRandomCustomerStatus(),
            payment_status:  getRandomPaymentStatus(),
            product:         getRandomProduct(),
          }))
        )
        dispatch(setUsers(data?.enriched_data));
        toast.success(data.message);
      })
      .catch((error) => console.error("Error:", error));

    setSubmitClicked(true);
  };

  const toHoldAmount = () => {
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
              <Link to="/results" onClick={toHoldAmount}>Proceed</Link>
            </button>
          )}
        </div>
        <ToastContainer type="success" theme="light" autoClose={3000} />
        <br />
        {enrichedData && (
          <div className="table-wrapper">
            <table className="data-table" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  {["#", "Name", "Address", "Birth Date", "Hold Amount", "Product", "Customer Status", "Payment Status"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrichedData.map((item, idx) => (
                  <tr key={item.cif_code}>
                    <td className="td-index">{idx + 1}</td>
                    <td className="td-name">{item?.first_name} {item?.last_name}</td>
                    <td className="td-address">{item?.address}</td>
                    <td className="td-date">{moment(item?.dob).format("DD MMM, YYYY")}</td>
                    <td className="td-amount">$ {item?.hold_amount?.toLocaleString()}</td>
                    <td className="td-product">{item?.product}</td>
                    <td><Badge value={item?.customer_status} /></td>
                    <td><Badge value={item?.payment_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
