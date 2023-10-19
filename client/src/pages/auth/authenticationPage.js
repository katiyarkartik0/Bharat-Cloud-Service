import React, { useState } from "react";
import "./authentication.css"; // Import the CSS file

import Button from "components/Button/Button";
import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";

const activeButtonStyles = { "background-color": "#17A9FD" };
const inActiveButtonStyles = { "background-color": "#fff", "color": "black" };

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
    <div className="form-box">
      <div className="form-container">
        <div className="button-box">
          <Button
            type="click"
            onClickEvent={() => setIsLogin(true)}
            style={isLogin ? activeButtonStyles : inActiveButtonStyles}
            text="Already have an account"
          />
          <Button
            type="click"
            onClickEvent={() => setIsLogin(false)}
            style={!isLogin ? activeButtonStyles : inActiveButtonStyles}
            text="Register"
          />
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
      </div>

    </>
  );
};

export default AuthenticationPage;
