import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationButton = ({ to, label, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button className="modal-howto-btn" onClick={handleClick}>
      {label}
    </button>
  );
};

export default NavigationButton;
