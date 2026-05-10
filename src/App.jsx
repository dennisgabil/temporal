import { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Agents from "./Agents";
import Result from "./Results";
import Workflow from "./Workflow";
import cbaImg from "./assets/commBank-logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { setActivePage } from "./redux/actions/active";

function App() {
  const dispatch = useDispatch();
  const activePage = useSelector((state) => state.activePage);
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(activePage?.activePage);
  }, [activePage]);

  const clickLink = (e) => {
    setActive(e.target.text);
    dispatch(setActivePage(e.target.text));
  };

  return (
    <>
      <section id="center" style={{ backgroundColor: "#f4f4f4" }}>
        <nav
          style={{ backgroundColor: "#fff", width: "100%", height: "70px" }}
          className="container"
        >
          <div className="left">
            <img src={cbaImg} style={{ width: "50px", marginLeft: "20px" }} />
          </div>
          <div className="middle" style={{ fontWeight: "800" }}>
            <Link
              to="/"
              onClick={clickLink}
              className={active == "Garnishee" ? "active" : ""}
            >
              Garnishee
            </Link>{" "}
            &nbsp; &nbsp;{" "}
            <Link
              to="/agents"
              onClick={clickLink}
              className={active == "Agents" ? "active" : ""}
            >
              Agents
            </Link>{" "}
            &nbsp; &nbsp;{" "}
            <Link
              to="/results"
              onClick={clickLink}
              className={active == "Results" ? "active" : ""}
            >
              Results
            </Link>{" "}
            &nbsp; &nbsp;
            <Link
              to="/workflow"
              onClick={clickLink}
              className={active == "Workflow" ? "active" : ""}
            >
              Workflow
            </Link>
          </div>
          <div className="right"></div>
        </nav>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/results" element={<Result />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/workflow" element={<Workflow />} />
          </Routes>
        </div>
      </section>
    </>
  );
}

export default App;
