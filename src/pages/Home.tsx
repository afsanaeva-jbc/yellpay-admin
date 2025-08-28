// import React, { useState } from "react";
// import Navbar from "../layout/Navbar";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { Outlet } from "react-router-dom";
// import SideBar from "../layout/Sidebar";

// const Home: React.FC = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [open, setOpen] = useState(true);
//   return (
//     <div className="h-screen flex flex-col">
//       {/* Fixed Navbar */}
//       <div className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-[#ffffff] via-[#F6575D] to-[#D5242A] h-16 flex items-center px-4">
//         <button
//           onClick={() => setShowSidebar(!showSidebar)}
//           className={`md:hidden text-white text-2xl p-2 rounded-md ${showSidebar ? "ring-2 ring-white" : ""}`}
//           aria-label="Toggle Sidebar"
//           title="Toggle Sidebar"
//         >
//           <GiHamburgerMenu />
//         </button>
//         <div className="flex-1">
//           <Navbar />
//         </div>
//       </div>

//       {/* Sidebar + Content */}
//       <div className="flex flex-1 pt-16 relative overflow-auto">
//         {/* Sidebar */}

//         <div
//           className={`transition-all duration-300 bg-gradient-to-b from-[#D5242A] to-[#F6575D]  shadow-lg text-white fixed top-16 left-0 h-[calc(100vh-64px)] z-30 ${showSidebar ? "w-64" : "w-0"} md:relative md:top-0 md:h-auto md:w-70 overflow-hidden hover:overflow-y-auto scrollbar-track-transparent`}
//         >
//          <SideBar open={open} setOpen={setOpen} />
//         </div>

//         {/* Content Area */}
//         <div
//           className={`
//             flex-1 bg-[#EDEDED] overflow-auto transition-all duration-300 p-5 md:p-10
//             ${showSidebar ? "pl-70" : "pl-5"}
//           `}
//         >
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
