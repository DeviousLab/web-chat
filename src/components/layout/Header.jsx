import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CometContext } from "../../context/CometContext";

const Header = () => {
  const { user, setUser, cometChat } = useContext(CometContext);
  const navigate = useNavigate();

  const removeAuthedInfo = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  const logout = async () => {
    const isLogout = window.confirm("Do you want to log out?");
    if (isLogout) {
      await cometChat.logout();
      removeAuthedInfo();
      navigate("/login");
    }
  };

  if (!user) {
    return (
      <>
        <div className="header">
          <div className="header__left">
            <span>Web Chat</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="header">
      <div className="header__left">
        <span>Web Chat</span>
        <img src={user.image} alt={user.fullname} />
        <span>Welcome {user.fullname}</span>
      </div>
      <div className="header__right">
        <div className="header__logout" onClick={logout}>Logout</div>
      </div>
    </div>
  );
};

export default Header;
