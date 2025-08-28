import React from "react";
import { ClipLoader } from "react-spinners";

const Loading: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#EDEDED] z-50">
    <ClipLoader color="#E60012" size={100} aria-label="ring-loading" />
  </div>
);

export default Loading;