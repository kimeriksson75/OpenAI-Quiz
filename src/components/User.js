import React from "react";
import PropTypes from "prop-types";
import useRandomBackground from "../hooks/useRandomBackground";

function User({ user }) {
  const { bgColor, pattern } = useRandomBackground();

  return (
    <div
      key={`user-${user.socketID}`}
      className={`user ${pattern}`}
      style={{ backgroundColor: bgColor }}
    >
      <img
        alt="user avatar"
        className="user-image"
        src={`https://i.pravatar.cc/150?u=${user.socketID}`}
      />
      <div>
        <p>{user?.name?.slice(0, 8)}</p>
      </div>
    </div>
  );
}

User.propTypes = {
  user: PropTypes.object.isRequired,
};

export default User;
