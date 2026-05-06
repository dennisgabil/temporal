import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setActivePage } from "./redux/actions/active";

function App() {
  const dispatch = useDispatch();
  const [enrichedData, setEnrichedData] = useState(null);

  const data = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(setActivePage("Results"));
  }, [data, dispatch]);

  const downloadFile = () => {
    let filteredArray = Object.keys(data)
      .map((key) => data[key])
      .filter((item) => item !== null);
    setEnrichedData(filteredArray);
  };

  return (
    <>
      <div
        style={{
          width: "700px",
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
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Download
        </button>
        <ToastContainer type="success" theme="light" autoClose={3000} />
        <br />
        {enrichedData && enrichedData.length > 0 && (
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
                <th>Amount</th>
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
                    <td>${item?.hold_amount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <br />
    </>
  );
}

export default App;
