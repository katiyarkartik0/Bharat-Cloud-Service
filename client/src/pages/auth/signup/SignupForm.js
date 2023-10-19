import React, { useState } from "react";
import { userSignup } from "api/auth";

import "./SignupForm.css";
import Button from "components/Button/Button";
import { useDispatch } from "react-redux";
// import { setToast } from "store/slices/toastSlice";
import { fieldValidation } from "helpers/validator";
import { Loader } from "utils/Loader/Loader";

const defaultUserData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const defaultError = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);
  const [errors, setErrors] = useState(defaultError);
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = userData;

    const { isDataValid, msg, field } = fieldValidation(userData);

    if (!isDataValid) {
      setErrors({ [field]: msg });
      return;
    }
    setIsLoading(true);
    await userSignup({ name, email, password })
      .then(async (res) => {
        if (res.ok) {
          // dispatch(
          //   setToast({
          //     status: "success",
          //     displayMessage:
          //       "congratulations! your account has been created. Try signing in",
          //   })
          // );
          setUserData(defaultUserData);
        } else if (!res.ok) {
          const { msg } = await res.json();
          console.log(msg)
          // dispatch(setToast({ status: "failure", displayMessage: msg }));
          return;
        }
      })
      .catch((err) =>
      {}
        // dispatch(
        //   setToast({ status: "failure", displayMessage: JSON.stringify(err) })
        // )
      );
    setErrors(defaultError);
    setIsLoading(false);
  };
  return (
    <form className="form" onSubmit={handleSubmit} onChange={handleUserData}>
      <input
        type="text"
        className="input-field"
        placeholder="Full Name"
        name="name"
        value={userData.name}
      />
      {errors.name && <span className="input-error">{errors.name}</span>}
      <input
        type="text"
        className="input-field"
        placeholder="Email"
        name="email"
        value={userData.email}
      />
      {errors.email && <span className="input-error">{errors.email}</span>}
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          className="input-field"
          placeholder="Password"
          name="password"
          value={userData.password}
        />
        <span className="show-hide" onClick={togglePasswordVisibility}>
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>
      {errors.password && (
        <span className="input-error">{errors.password}</span>
      )}
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          className="input-field"
          placeholder="Confirm Password"
          value={userData.confirmPassword}
          name="confirmPassword"
        />
        <span className="show-hide" onClick={togglePasswordVisibility}>
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>
      {errors.confirmPassword && (
        <span className="input-error">{errors.confirmPassword}</span>
      )}
      {!isLoading && <Button type="submit" text="Sign Up" />}
      {isLoading && <Loader />}
    </form>
  );
};

export default SignupForm;
