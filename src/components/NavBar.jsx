import React from "react";
import dev from "../assets/dev.png";
import dev2 from "../assets/devlink.png";
import { HiLink } from "react-icons/hi";
import { LuCircleUserRound } from "react-icons/lu";
import { Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLinksPage = location.pathname === "/";
  const isProfilePage = location.pathname === "/profiledetails";

  const handleNavigate = (route) => {
    navigate("/loading", {
      state: { to: route },
    });
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="flex gap-[8px] justify-between px-[16px] py-[24px] block md:hidden">
        <img src={dev} alt="" className="w-[32px] h-[32px]" />

        <div className="flex mx-auto gap-[8px]">
          {/* Links */}
          <div
            className={`py-[11px] px-[27px] rounded-[8px] cursor-pointer ${
              isLinksPage ? "bg-[#EFEBFF] border border-[#633CFF]" : ""
            }`}
            onClick={() => handleNavigate("/")}
          >
            <HiLink
              className={`w-[20px] h-[20px] ${
                isLinksPage ? "text-[#633CFF]" : "text-[#737373]"
              }`}
            />
          </div>

          {/* Profile */}
          <div
            className={`py-[11px] px-[27px] rounded-[8px] cursor-pointer ${
              isProfilePage ? "bg-[#EFEBFF] border border-[#633CFF]" : ""
            }`}
            onClick={() => handleNavigate("/profiledetails")}
          >
            <LuCircleUserRound
              className={`w-[20px] h-[20px] ${
                isProfilePage ? "text-[#633CFF]" : "text-[#737373]"
              }`}
            />
          </div>
        </div>

        <Eye
          className="cursor-pointer border border-[#633CFF] w-[52px] h-[42px] rounded-[8px] py-[11px] px-[16px] text-[#633CFF]"
          onClick={() => handleNavigate("/preview")}
        />
      </div>

      {/* Tablet & Desktop Navbar */}
      <div className="hidden md:block">
        <div className="flex justify-between py-[16px] px-[24px] w-full mt-4">
          <img src={dev2} alt="" className="w-[146px] h-[32px]" />

          <div className="flex gap-[16px] items-center">
            {/* Links */}
            <div
              onClick={() => handleNavigate("/")}
              className={`flex items-center gap-[8px] px-[27px] py-[11px] rounded-[8px] cursor-pointer ${
                isLinksPage
                  ? "bg-[#EFEBFF] text-[#633CFF]"
                  : "text-[#737373] hover:text-[#633CFF]"
              }`}
            >
              <HiLink className="w-[20px] h-[20px]" />
              <span className="font-semibold">Links</span>
            </div>

            {/* Profile */}
            <div
              onClick={() => handleNavigate("/profiledetails")}
              className={`flex items-center gap-[8px] px-[27px] py-[11px] rounded-[8px] cursor-pointer ${
                isProfilePage
                  ? "bg-[#EFEBFF] text-[#633CFF]"
                  : "text-[#737373] hover:text-[#633CFF]"
              }`}
            >
              <LuCircleUserRound className="w-[18px] h-[18px]" />
              <span className="font-semibold">Profile Details</span>
            </div>
          </div>

          <button
            onClick={() => handleNavigate("/preview")}
            className="border border-[#633CFF] px-[27px] py-[11px] rounded-[8px] text-[#633CFF] font-semibold hover:bg-[#EFEBFF]"
          >
            Preview
          </button>
        </div>
      </div>
    </>
  );
};

export default NavBar;
