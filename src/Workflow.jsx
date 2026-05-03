import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useDispatch } from "react-redux";
import { setActivePage } from "./redux/actions/active";

export default function BasicChart() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Workflow"));
  }, []);

  const dataset = [
    {
      activity_name: "fetch_file_from_s3",
      attempt: Math.random() * 20,
      start_time_offset_ms: Math.random() * 90,
      end_time_offset_ms: Math.random() * 75,
      duration_ms: Math.random() * 50,
    },
    {
      activity_name: "validate_csv_file",
      attempt: Math.random() * 30,
      start_time_offset_ms: Math.random() * 90,
      end_time_offset_ms: Math.random() * 75,
      duration_ms: Math.random() * 50,
    },
    {
      activity_name: "read_cqv",
      attempt: Math.random() * 50,
      start_time_offset_ms: Math.random() * 90,
      end_time_offset_ms: Math.random() * 75,
      duration_ms: Math.random() * 50,
    },
    {
      activity_name: "enrich_with_cif_codes",
      attempt: Math.random() * 30,
      start_time_offset_ms: Math.random() * 90,
      end_time_offset_ms: Math.random() * 75,
      duration_ms: Math.random() * 50,
    },
  ];

  const chartSetting = {
    yAxis: [
      {
        label: "Revenue File Workflow",
        width: 60,
      },
    ],
    height: 300,
  };

  const valueFormatter = (value) => {
    return value;
  };

  const [agents, setAgents] = useState(null);
  const [query, setQuery] = useState(null);
  const [activities, setActivities] = useState(null);
  const [activitiesQuery, setActivitiesQuery] = useState(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const submitQuery = () => {
    fetch("http://localhost:8000/agent", {
      method: "POST", // Specifies the HTTP method
      headers: {
        "Content-Type": "application/json", // Informs server data is in JSON format
      },
      body: JSON.stringify({
        // Data to be sent (must be stringified for JSON)
        question: query,
      }),
    })
      .then((response) => response.json()) // Parses response body as JSON
      .then((data) => setAgents(data)) // Handles the result
      .catch((error) => console.error("Error:", error));
    };

    const handleActivitiesQueryChange = (e) => {
      console.log(e.target.value);
      setActivitiesQuery(e.target.value);
    };

    const submitActivitiesQuery = () => {
      fetch("http://localhost:8000/agent", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          question:
          "Show activities extracting_users-users_info.csv, " + activitiesQuery,
        }),
      })
      .then((response) => response.json()) 
      .then((data) => setActivities(data)) 
      .catch((error) => console.error("Error:", error));
    };

  // const dataset = activities && activities?.data?.activities;

    return (
      <div className={"workflow"}>
        <div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            style={{ width: "500px", marginBottom: '20px' }}
          />{" "}
          &nbsp;
          <button           style={{
            backgroundColor: "#fc0",
            color: "#000",
            padding: "6px 20px",
            border: "0",
            borderRadius: "8px",
            marginTop: '20px',
            cursor: 'pointer'
          }} onClick={submitQuery}>SUBMIT</button>
        </div>


        {agents && agents?.data && (
          <div style={{ marginBottom: '50px'}}>
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              textAlign: "left",
              marginBottom: "50px",
              fontSize: "12px",
              borderCollapse: "collapse",
              marginTop: '15px',
              backgroundColor: '#fff'
            }}
          >
            <thead>
              <tr>
                <th>Workflow ID</th>
                <th>Run ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents &&
              agents?.data.map((item) => (
                <tr key={item.run_id}>
                  <td>{item.workflow_id}</td>
                  <td>
                    <a
                      href={`http://localhost:8233/namespaces/default/workflows/extracting_users-users_info.csv/${item.run_id}/history`}
                      target="_blank"
                    >
                      {item.run_id}
                    </a>
                  </td>
                  <td>{item.status}</td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
        )}


        <BarChart
          style={{ backgroundColor: '#fff' }}
          dataset={dataset}
          xAxis={[{ dataKey: "activity_name" }]}
          series={[
            {
              dataKey: "attempt",
              label: "Attempt",
              valueFormatter,
              color: "#003f5c",
            },
            {
              dataKey: "start_time_offset_ms",
              label: "Start Time Offset (ms)",
              valueFormatter,
              color: "#bc4c96",
            },
            {
              dataKey: "end_time_offset_ms",
              label: "End Time Offset (ms)",
              valueFormatter,
              color: "#ff5f66",
            },
            {
              dataKey: "duration_ms",
              label: "Duration (ms)",
              valueFormatter,
              color: "#ffa600",
            },
            ]}
            {...chartSetting}
          />
        <br/>

        </div>
        );
  }
