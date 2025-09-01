import React from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface IconButtonProps {
  url?: string;
  type: "View" | "Edit" | "Delete";
  label: string;
  onClick?: () => void;
}

const renderIcon = (type: string) => {
  switch (type) {
    case "View":
      return <FiEye className="w-4.5 h-4.5" />;
    case "Edit":
      return <FiEdit className="w-4.5 h-4.5" />;
    case "Delete":
      return <FiTrash2 className="w-4.5 h-4.5" />;
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

const getClasses = (type: IconButtonProps["type"]) => {
  switch (type) {
    case "View":
      return "p-2 text-black-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md";
    case "Edit":
      return "p-2 text-black-700 hover:text-green-600 hover:bg-green-50 transition-colors rounded-md";
    case "Delete":
      return "p-2 text-black-700 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md";
    default:
      return "p-2 text-black-700 transition-colors rounded-md";
  }
};

const IconButton: React.FC<IconButtonProps> = ({
  url,
  label,
  type,
  onClick,
}) => {
  const classes = getClasses(type);

  if (url) {
    return (
      <Link to={url} title={label} className={classes}>
        {renderIcon(type)}
      </Link>
    );
  }
  return (
    <button type="button" title={label} onClick={onClick} className={classes}>
      {renderIcon(type)}
    </button>
  );
};

export default IconButton;
