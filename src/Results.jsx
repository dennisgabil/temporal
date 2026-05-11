import { useState, useEffect } from "react";
import "./results.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setActivePage } from "./redux/actions/active";


const PRODUCTS = ["Personal Loan", "Home Loan", "Credit Card"];

const BADGE_CLASS = {
  Found: "badge badge-found",
  "Not Found": "badge badge-not-found",
  Paid: "badge badge-paid",
  Unpaid: "badge badge-unpaid",
  Yes: "badge badge-not-found",
  No: "badge badge-found",
};

const Badge = ({ value }) => (
  <span className={BADGE_CLASS[value] ?? "badge"}>{value}</span>
);

const Spinner = () => <span className="spinner" />;

const normalize = (val) => {
  if (!val || typeof val !== "string") return val;
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getRandomDefaulter = () => (Math.random() < 0.5 ? "Yes" : "No");

function App() {
  const dispatch = useDispatch();
  const [enrichedData, setEnrichedData] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState({});
  const [filters, setFilters] = useState({
    name: "",
    product: "",
    customer_status: "",
    payment_status: "",
  });

  const data = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(setActivePage("Results"));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const arr = Object.keys(data)
        .map((key) => data[key])
        .filter((item) => item !== null && typeof item === "object")
        .map((item) => ({
          ...item,
          customer_status: normalize(item.customer_status),
          payment_status: normalize(item.payment_status),
          product: normalize(item.product),
          defaulter: getRandomDefaulter(),
        }));
      if (arr.length > 0) setEnrichedData(arr);
    }
  }, [data]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const checkPaymentStatus = async (cifCode) => {
    setCheckingStatus((prev) => ({ ...prev, [cifCode]: true }));
    try {
      const res = await fetch("http://localhost:8000/check-current-payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cif_code: cifCode }),
      });
      const result = await res.json();
      setEnrichedData((prev) =>
        prev.map((item) =>
          item.cif_code === cifCode
            ? { ...item, payment_status: normalize(result.payment_status) }
            : item
        )
      );
    } catch (e) {
      console.error("Error checking payment status:", e);
    } finally {
      setCheckingStatus((prev) => ({ ...prev, [cifCode]: false }));
    }
  };

  const downloadFile = () => {
    let filteredArray = Object.keys(data)
      .map((key) => data[key])
      .filter((item) => item !== null);
    setEnrichedData(filteredArray);
  };

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
    <>
      <div
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={downloadFile}
          style={{
            backgroundColor: "#fc0",
            color: "#000",
            padding: "6px 20px",
            border: "0",
            borderRadius: "8px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
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
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
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
                    {[
                      "#",
                      "Name",
                      "Address",
                      "Birth Date",
                      "Customer Status",
                      "Hold Amount",
                      "Product",
                      "Payment Status",
                      "Defaulter"
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="td-empty">
                        No records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, idx) => (
                      <tr key={item.cif_code}>
                        <td className="td-index">{idx + 1}</td>
                        <td className="td-name">
                          {item?.first_name} {item?.last_name}
                        </td>
                        <td className="td-address">{item?.address}</td>
                        <td className="td-date">
                          {moment(item?.dob).format("DD MMM, YYYY")}
                        </td>
                        <td>
                          <Badge value={item?.customer_status} />
                        </td>
                        <td className="td-amount">
                          $ {item?.hold_amount?.toLocaleString()}
                        </td>
                        <td className="td-product">{item?.product}</td>
                        <td>
                          <Badge value={item?.payment_status} />
                          {item?.payment_status === "Unpaid" && (
                            <button
                              className="check-btn"
                              onClick={() => checkPaymentStatus(item.cif_code)}
                              disabled={checkingStatus[item.cif_code]}
                              title="Check current payment status"
                            >
                              {checkingStatus[item.cif_code] ? <Spinner /> : "↻"}
                            </button>
                          )}
                        </td>
                        <td>
                          <Badge value={item?.defaulter} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <br />
    </>
  );
}

export default App;
