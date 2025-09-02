import React from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// Types
interface IconButtonProps {
  url?: string;
  type: "View" | "Edit" | "Delete" | "Back" | "Status" | "Info";
  label: string;
  onClick?: () => void;
}

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  url?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

// Icon Rendering
const renderIcon = (type: string) => {
  switch (type) {
    case "View":
      return <FiEye className="w-4.5 h-4.5" />;
    case "Edit":
      return <FiEdit className="w-4.5 h-4.5" />;
    case "Delete":
      return <FiTrash2 className="w-4.5 h-4.5" />;
    case "Back":
      return <FiArrowLeft className="w-4.5 h-4.5" />;
    case "Status":
      return (
        <IoMdCheckmarkCircleOutline className="transition duration-300 ease-in-out hover:scale-110 text-orange-500 hover:text-orange-700 text-xl cursor-pointer" />
      );
    case "Info":
      return <FaCircleInfo className="text-blue-500" />;
    default:
      return null;
  }
};

// Style Classes
const getClasses = (type: IconButtonProps["type"]) => {
  switch (type) {
    case "View":
      return "p-2 text-black-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md cursor-pointer";
    case "Edit":
      return "p-2 text-black-700 hover:text-green-600 hover:bg-green-50 transition-colors rounded-md cursor-pointer";
    case "Delete":
      return "p-2 text-black-700 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md cursor-pointer";
    case "Back":
      return "p-2 text-black-700 hover:text-gray-600 hover:bg-gray-50 transition-colors rounded-md cursor-pointer";
    default:
      return "p-2 text-black-700 transition-colors rounded-md";
  }
};

// IconButton Component
const IconButton: React.FC<IconButtonProps> = ({ url, label, type, onClick }) => {
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

// BackButton Component
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseClasses = `
    inline-flex items-center gap-2
    border border-gray-300
    px-3 py-2
    text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50
    transition-colors rounded-md font-medium
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // const content = (
  //   <>
  //     <FiArrowLeft className="w-4 h-4" />
  //     <span>{label}</span>
  //   </>
  // );

  // if (url) {
  //   return (
  //     <Link to={url} className={baseClasses} title={label}>
  //       {content}
  //     </Link>
  //   );
  // }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      title={label}
    >
     <FiArrowLeft className="w-4 h-4" />
      <span style={{color:"#000000"}}>{label}</span>
    </button>
  );
};

export default IconButton;
export { BackButton };
