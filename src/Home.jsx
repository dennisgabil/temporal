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
  const [filters, setFilters] = useState({
    name: "",
    product: "",
    customer_status: "",
    payment_status: "",
  });

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

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filteredData = enrichedData?.filter((item) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
    return (
      (!filters.name || fullName.includes(filters.name.toLowerCase())) &&
      (!filters.product || item.product === filters.product) &&
      (!filters.customer_status || item.customer_status === filters.customer_status) &&
      (!filters.payment_status || item.payment_status === filters.payment_status)
    );
  });

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
          <>
            <div className="filter-bar">
              <input
                className="filter-input"
                type="text"
                placeholder="Search by name…"
                value={filters.name}
                onChange={(e) => setFilter("name", e.target.value)}
              />
              <select
                className="filter-select"
                value={filters.product}
                onChange={(e) => setFilter("product", e.target.value)}
              >
                <option value="">All Products</option>
                {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                className="filter-select"
                value={filters.customer_status}
                onChange={(e) => setFilter("customer_status", e.target.value)}
              >
                <option value="">All Customer Status</option>
                <option value="Found">Found</option>
                <option value="Not Found">Not Found</option>
              </select>
              <select
                className="filter-select"
                value={filters.payment_status}
                onChange={(e) => setFilter("payment_status", e.target.value)}
              >
                <option value="">All Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
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
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="td-empty">No records match the selected filters.</td>
                    </tr>
                  ) : (
                    filteredData.map((item, idx) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
