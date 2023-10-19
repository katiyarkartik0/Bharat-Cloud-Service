import React from "react";
import { useNavigate } from "react-router-dom";

import "./UnauthorizedPage.css";
import Button from "components/Button/Button";

const style = {
  width: "50%",
  padding: "10px",
  "margin-top": "20px",
  border: "none",
  outline: "none",
  "font-size": "16px",
  // color: #fff;
  // background-color: #5f27cd;
  "border-radius": "5px",
};

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="unauthorized-page">
      <h1 className="display-status">Unauthorized Access</h1>
      <p className="prompt-text">
        You are not authorized to access this page. Please log in to continue.
      </p>
      <Button
        text={"Go Back"}
        onClickEvent={() => navigate("/")}
        style={style}
      />
      {/* <button className="go-back-btn" onClick={() => navigate("/")}>
        Go Back
      </button> */}
    </div>
  );
};

export default UnauthorizedPage;
