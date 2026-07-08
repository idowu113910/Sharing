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
    <div className="w-full">
      {/* Mobile layout (below tablet-min) */}
      <div className="flex items-center justify-between gap-[8px] px-4 py-5 tablet-min:hidden">
        <img src={dev} alt="" className="w-[28px] h-[28px] flex-shrink-0" />

        <div className="flex mx-auto gap-[8px]">
          {/* Links */}
          <div
            className={`py-[10px] px-[20px] rounded-[8px] cursor-pointer ${
              isLinksPage ? "bg-[#EFEBFF] border border-[#633CFF]" : ""
            }`}
            onClick={() => handleNavigate("/")}
          >
            <HiLink
              className={`w-[18px] h-[18px] ${
                isLinksPage ? "text-[#633CFF]" : "text-[#737373]"
              }`}
            />
          </div>

          {/* Profile */}
          <div
            className={`py-[10px] px-[20px] rounded-[8px] cursor-pointer ${
              isProfilePage ? "bg-[#EFEBFF] border border-[#633CFF]" : ""
            }`}
            onClick={() => handleNavigate("/profiledetails")}
          >
            <LuCircleUserRound
              className={`w-[18px] h-[18px] ${
                isProfilePage ? "text-[#633CFF]" : "text-[#737373]"
              }`}
            />
          </div>
        </div>

        <Eye
          className="cursor-pointer border border-[#633CFF] w-[44px] h-[38px] rounded-[8px] py-[9px] px-[12px] text-[#633CFF] flex-shrink-0"
          onClick={() => handleNavigate("/preview")}
        />
      </div>

      {/* Tablet and up layout */}
      <div className="hidden tablet-min:flex items-center justify-between py-4 px-4 tablet-min:px-6 laptop-min:px-10 desktop:px-16 w-full mt-2 tablet-min:mt-4">
        <img
          src={dev2}
          alt=""
          className="w-[120px] h-[26px] laptop-min:w-[146px] laptop-min:h-[32px] flex-shrink-0"
        />

        <div className="flex gap-2 laptop-min:gap-[16px] items-center">
          {/* Links */}
          <div
            onClick={() => handleNavigate("/")}
            className={`flex items-center gap-[6px] laptop-min:gap-[8px] px-3 laptop-min:px-[27px] py-2 laptop-min:py-[11px] rounded-[8px] cursor-pointer ${
              isLinksPage
                ? "bg-[#EFEBFF] text-[#633CFF]"
                : "text-[#737373] hover:text-[#633CFF]"
            }`}
          >
            <HiLink className="w-[18px] h-[18px] laptop-min:w-[20px] laptop-min:h-[20px] flex-shrink-0" />
            <span className="font-semibold text-[14px] laptop-min:text-[16px] whitespace-nowrap">
              Links
            </span>
          </div>

          {/* Profile */}
          <div
            onClick={() => handleNavigate("/profiledetails")}
            className={`flex items-center gap-[6px] laptop-min:gap-[8px] px-3 laptop-min:px-[27px] py-2 laptop-min:py-[11px] rounded-[8px] cursor-pointer ${
              isProfilePage
                ? "bg-[#EFEBFF] text-[#633CFF]"
                : "text-[#737373] hover:text-[#633CFF]"
            }`}
          >
            <LuCircleUserRound className="w-[16px] h-[16px] laptop-min:w-[18px] laptop-min:h-[18px] flex-shrink-0" />
            <span className="font-semibold text-[14px] laptop-min:text-[16px] whitespace-nowrap">
              Profile Details
            </span>
          </div>
        </div>

        <button
          onClick={() => handleNavigate("/preview")}
          className="border border-[#633CFF] px-4 laptop-min:px-[27px] py-2 laptop-min:py-[11px] rounded-[8px] text-[#633CFF] font-semibold text-[14px] laptop-min:text-[16px] hover:bg-[#EFEBFF] whitespace-nowrap flex-shrink-0"
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default NavBar;
