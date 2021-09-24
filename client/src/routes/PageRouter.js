import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
// Routing
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Custom Routing
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";

// Components

const PageRouter = () => {
  const { authenticated, admin } = useSelector((state) => state.userLogin);
  const [Ready, setReady] = useState(false);
  const [Error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [url, setUrl] = useState("");
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    setDisabled(true);
    setError(false);
    try {
      let res = await axios.post("/api/timetable/", {
        username: ID,
        password: password,
      });
      if (res.status === 200) {
        setUrl("http://localhost:5000/api/timetable/" + res.data);
        setReady(true);
      }
    } catch (error) {
      setError(true);
      setDisabled(false);
    }
  };
  const handleDownload = async () => {
    window.open(url);
  };

  return (
    <Router>
      <Container>
        <Switch>
          <Container style={{ padding: "25% 0" }}>
            <h2>Timetable Downloader</h2>{" "}
            <p>
              Created by Yassine Salhi: yassinesalhi136@gmail.com - email for
              queries
            </p>
            {!Ready ? (
              <>
                <FormControl
                  style={{ margin: "25px 0" }}
                  placeholder="Student ID"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setID(e.target.value)}
                />
                <FormControl
                  style={{ margin: "25px 0" }}
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
                {Error && (
                  <h6>An Error Occured, verify credentials and try again...</h6>
                )}
                <Button onClick={handleSubmit} disabled={disabled}>
                  {!disabled ? "Fetch Timetable" : "Loading..."}
                </Button>
              </>
            ) : (
              <Button onClick={handleDownload}>Download</Button>
            )}
          </Container>
        </Switch>
      </Container>
    </Router>
  );
};

export default PageRouter;
