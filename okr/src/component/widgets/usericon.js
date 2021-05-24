import React from "react";
import PropTypes from "prop-types";
import "./usericon.css";

export const AVATAR_SIZE = {
  SIZE20: "size20",
  SIZE24: "size24",
  SIZE28: "size28",
  SIZE32: "size32",
  SIZE36: "size36",
  SIZE40: "size40",
  SIZE48: "size48",
  SIZE60: "size60",
  SIZE72: "size72",
  SIZE96: "size96"
};

function extractAvatarChar(name) {
  return name
    .split(" ")
    .filter((part) => part)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function getAvatarColor(name) {
  const color = ["blue", "green", "magenta", "yellow", "red", "orange", "purple"];
  const random = Math.floor(Math.random() * color.length);
  return color[random];
}

export default function UserIcon(props) {
  const {
    name,
    size = AVATAR_SIZE.SIZE20,
    className = "",
  } = props;

  const userName = name || "Unknown";
  return (
    <div className={`userThumb ${size} ${className}`}>
      <div className={`textAvatar ${size} ${getAvatarColor(userName)}`}>
        {size === AVATAR_SIZE.SIZE16 || size === AVATAR_SIZE.SIZE20
          ? userName[0]
          : extractAvatarChar(userName)}
      </div>
    </div>
  );
}

UserIcon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.number,
};
