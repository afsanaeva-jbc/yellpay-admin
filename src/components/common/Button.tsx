import React from "react";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { FaCircleInfo } from "react-icons/fa6";
import { TfiPencilAlt } from "react-icons/tfi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface ButtonProps {
  url?: string;
  type: string;
  label: string;
  onClick?: () => void;
}

const renderIcon = (type: string) => {
  switch (type) {
    case "View":
      return (
        <AiOutlineEye className="transition delay-150 duration-500 ease-in-out hover:translate-y-0 hover:scale-120 text-blue-500 hover:text-blue-700 font-medium text-2xl cursor-pointer flex items-center" />
      );
    case "Delete":
      return (
        <RiDeleteBinLine className="transition delay-150 duration-500 ease-in-out hover:translate-y-0 hover:scale-120 text-red-500 hover:text-red-700 font-medium rounded-full text-xl cursor-pointer flex items-center" />
      );
    case "Edit":
      return (
        <TfiPencilAlt className="transition delay-150 duration-500 ease-in-out hover:translate-y-0 hover:scale-120 text-green-500 hover:text-green-700 font-medium text-xl cursor-pointer flex items-center" />
      );
    case "Status":
      return (
        <IoMdCheckmarkCircleOutline className="transition delay-150 duration-500 ease-in-out hover:translate-y-0 hover:scale-120 text-orange-500 hover:text-orange-700 font-medium text-xl cursor-pointer flex items-center" />
      );
    case "Info":
      return <FaCircleInfo />;
    default:
      return null;
  }
};

const Button: React.FC<ButtonProps> = ({ url, label, type, onClick }) => {
  if (url) {
    return (
      <Link to={url} title={label}>
        {renderIcon(type)}
      </Link>
    );
  }
  return (
    <button type="button" title={label} onClick={onClick}>
      {renderIcon(type)}
    </button>
  );
};

export default Button;
