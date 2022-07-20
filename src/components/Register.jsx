import React, { useState, useRef, useContext } from 'react'
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";
import { toast } from 'react-toastify';

import { CometContext } from '../context/CometContext';
import * as cometChatHook from "../hooks/CometChat";
import * as firebaseHook from "../hooks/Firebase";
import * as uiHook from "../hooks/Loading";

const Register = ({ toggleModal }) => {
  const [avatar, setAvatar] = useState(null);

  const aboutRef = useRef('');
  const confirmPasswordRef = useRef('');
  const emailRef = useRef('');
  const filepickerRef = useRef('');
  const fullnameRef = useRef('');
  const passwordRef = useRef('');

  const { cometChat } = useContext(CometContext);

  const uploadAvatar = (event) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setAvatar(readerEvent.target.result);
    };
  };

  const isSignupValid = ({
    about,
    fullname,
    email,
    password,
    confirmPassword,
  }) => {
    if (!avatar) {
      toast.error("Please upload an avatar");
      return false;
    }
    if (validator.isEmpty(fullname)) {
      toast.error("Please enter a name");
      return false;
    }
    if (!validator.isEmail(email)) {
      toast.error("Please enter an email");
      return false;
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      toast.error(
        "Your password must have at least 8 characters"
      );
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      toast.error("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Confirmed password and password must be the same");
      return false;
    }
    if (validator.isEmpty(about)) {
      toast.error("Please add a description");
      return false;
    }
    return true;
  };

  const getInputs = () => {
    const about = aboutRef.current.value;
    const fullname = fullnameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    return { about, fullname, email, password, confirmPassword };
  };

  const onAvatarUploaded = async (entity, url) => {
    entity.image = url;
    await firebaseHook.insert({
      key: "users",
      id: entity.id,
      payload: entity,
    });
    await cometChatHook.createAccount({
      cometChat,
      id: entity.id,
      fullname: entity.fullname,
      avatar: url,
    });
  };

  const signup = async () => {
    try {
      const { about, fullname, email, password, confirmPassword } = getInputs();
      if (
        isSignupValid({
          about,
          fullname,
          email,
          password,
          confirmPassword,
        })
      ) {
        const id = uuidv4();
        const createdAccount = { id, fullname, email, about };
        uiHook.showLoading();
        await firebaseHook.createAccount(email, password);
        await firebaseHook.upload({
          key: "users",
          id,
          payload: avatar,
          entity: createdAccount,
          callback: onAvatarUploaded,
        });
        uiHook.hideLoading();
        toast.success(
          `${email} was created successfully! Please sign in with your created account`
        );
        toggleModal(false);
      }
    } catch (error) {
      uiHook.hideLoading();
    }
  };

  return (
    <div className="signup">
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title">Register</div>
          <div className="signup__close">
            <AiOutlineClose size={20} onClick={() => toggleModal(false)} />
          </div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          {avatar && (
            <div
              className="signup__user-avatar"
              onClick={() => filepickerRef.current.click()}
            >
              <img src={avatar} alt="avatar" />
            </div>
          )}
          {!avatar && (
            <div
              onClick={() => filepickerRef.current.click()}
              className="signup__upload-container"
            >
              <AiOutlineCloudUpload size={20} /> Upload Avatar
            </div>
          )}
          <input
            className="signup__upload-avatar"
            hidden
            ref={filepickerRef}
            type="file"
            onChange={uploadAvatar}
          />
          <input type="text" placeholder="Fullname" ref={fullnameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          <textarea
            className="signup__about"
            placeholder="Tell us about yourself!"
            ref={aboutRef}
          ></textarea>
          <button className="signup__btn" onClick={signup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Register