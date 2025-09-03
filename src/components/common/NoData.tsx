import React from "react";
import { GoPeople } from "react-icons/go";

type NoDataAvailableProps = {
  message?: string;
  icon?: React.ReactNode;
};

const NoDataAvailable = ({ message = "No data found", icon }: NoDataAvailableProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 py-8">
      {icon || <GoPeople className="text-5xl text-gray-300" />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default NoDataAvailable;
