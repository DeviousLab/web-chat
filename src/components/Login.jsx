import React, { useEffect, useRef, useContext } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import withModal from "./Modal"
import Register from "./Register";
import { CometContext } from "../context/CometContext";
import * as cometChatHook from "../hooks/CometChat";
import * as firebaseHook from "../hooks/Firebase";
import * as uiHook from "../hooks/Loading";

const Login = ({ toggleModal }) => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { cometChat, setUser } = useContext(CometContext);
  const navigate = useNavigate();

  useEffect(() => {
    const authedUser = JSON.parse(localStorage.getItem("auth"));
    if (authedUser) {
      navigate("/");
    } else {
      setUser(null);
    }
  }, [navigate, setUser]);

  const getInputs = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    return { email, password };
  };

  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  const saveAuthedInfo = (user) => {
    setUser(user);
    localStorage.setItem("auth", JSON.stringify(user));
  };

  const login = async () => {
    try {
      uiHook.showLoading();
      const { email, password } = getInputs();
      if (isUserCredentialsValid(email, password)) {
        await firebaseHook.login(email, password);
        const user = await firebaseHook.getSingleDataWithQuery({
          key: "users",
          query: "email",
          criteria: email,
        });
        await cometChatHook.login(cometChat, user);
        saveAuthedInfo(user);
        uiHook.hideLoading();
        navigate("/");
      } else {
        uiHook.hideLoading();
        toast.error(`Your username or password is invalid`);
      }
    } catch (error) {
      uiHook.hideLoading();
    }
  };

  return (
    <div className="login__container">
      <div className="login__welcome">
        <p>
          A{" "}
          <span style={{ color: "#0B65C2", fontWeight: "bold" }}>Web Chat App</span>{" "}
          built with React
        </p>
      </div>
      <div className="login__form-container">
        <div className="login__form">
          <input
            type="text"
            placeholder="Email"
            ref={emailRef}
          />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <button className="login__submit-btn" onClick={login}>Login</button>
          <span className="login__signup" onClick={() => toggleModal(true)}>
            Create New Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default withModal(Register)(Login);