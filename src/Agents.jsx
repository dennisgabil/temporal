import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setUsers } from "./redux/actions/users";
import { setActivePage } from "./redux/actions/active";

export default function Agents() {
  const dispatch = useDispatch();
  const [agents, setAgents] = useState(null);

  useEffect(() => {
    dispatch(setActivePage('Agents'));

    fetch("http://localhost:8000/list_agents", {
      method: "GET", 
    })
      .then((response) => response.json()) // Parses response body as JSON
      .then((data) => {
        console.log(data);
        setAgents(data);
        // dispatch(setUsers(data?.enriched_data));
        // toast.success(data.message);
      }) // Handles the result
      .catch((error) => console.error("Error:", error));
    }, []);

  return (
    <>
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
      {agents && (
        <table
          border="1"
          cellPadding="5"
          style={{
            width: "97%",
            textAlign: "left",
            marginTop: "15px",
            marginBottom: "20px",
            fontSize: "12px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {agents &&
            agents?.agents.map((item) => (
              <tr key={item?.agent_id}>
                <td>
                  {item?.agent_id}
                </td>
                <td>
                  {item?.name}
                </td>
                <td>{item?.description}</td>
                <td>{item?.type}</td>
              </tr>
              ))}
          </tbody>
        </table>
        )}
    </div>
    </>
    );
}
