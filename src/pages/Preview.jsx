import React, { useEffect, useState } from "react";
import { TbBrandGithub } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ShareLinksButton from "../components/ShareButton";

const Preview = ({ hideButtons = false }) => {
  const navigate = useNavigate();
  const [savedProfile, setSavedProfile] = useState(null);
  const [savedLinks, setSavedLinks] = useState([]);

  useEffect(() => {
    const profileData = localStorage.getItem("devlinks_profileDetails");
    if (profileData) setSavedProfile(JSON.parse(profileData));

    const linksData = localStorage.getItem("devlinks_savedLinks");
    if (linksData) setSavedLinks(JSON.parse(linksData));
  }, []);

  const getPlatformColor = (platform) => {
    const colors = {
      GitHub: "#1A1A1A",
      X: "#000000",
      LinkedIn: "#2D68FF",
      YouTube: "#EE3939",
      Facebook: "#1877F2",
      Instagram: "#E4405F",
      WhatsApp: "#25D366",
    };
    return colors[platform] || "#333333";
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      GitHub: <TbBrandGithub className="w-4 h-4 text-white" />,
      X: <FaXTwitter className="w-4 h-4 text-white" />,
      LinkedIn: <FaLinkedin className="w-4 h-4 text-white" />,
      YouTube: <FaYoutube className="w-4 h-4 text-white" />,
      Facebook: <FaFacebook className="w-4 h-4 text-white" />,
      Instagram: <IoLogoInstagram className="w-4 h-4 text-white" />,
      WhatsApp: <FaWhatsapp className="w-4 h-4 text-white" />,
    };
    return icons[platform];
  };

  const handleBackToEditor = () => {
    navigate("/");
  };

  return (
    <div className="min-h-dvh w-full bg-gray-50 pb-20 relative overflow-x-hidden">
      {/* Banner + action bar share one grid cell, so the bar overlaps the
          banner reliably at every screen size with no absolute-position or
          negative-margin math involved. */}
      <div className="grid">
        {/* Blue Background */}
        <div className="[grid-area:1/1] tablet-min:bg-[#633CFF] tablet-min:h-[240px] laptop-min:h-[300px] desktop:h-[357px] tablet-min:rounded-bl-[32px] tablet-min:rounded-br-[32px] tablet-min:overflow-hidden" />

        {/* Top action bar (Back + Share) */}
        {!hideButtons && (
          <div className="[grid-area:1/1] self-start justify-self-center z-20 w-full px-4 tablet-min:px-6 mt-4 tablet-min:mt-[40px] max-w-[420px] tablet-min:max-w-[720px] laptop-min:max-w-[1150px] desktop:max-w-[1300px]">
            <div className="flex items-center justify-between gap-3 w-full tablet-min:gap-[16px] tablet-min:p-6 tablet-min:pt-4 tablet-min:border-[1px] tablet-min:border-white tablet-min:rounded-[8px] tablet-min:bg-white">
              <button
                onClick={handleBackToEditor}
                className="min-w-[100px] tablet-min:w-[159.5px] h-10 tablet-min:h-[46px] rounded-[8px] border-[1px] border-[#633CFF]
                bg-white text-[#633CFF] text-[13px] tablet-min:text-[14px] font-semibold px-3 tablet-min:px-[27px] py-2 tablet-min:py-[11px]
                whitespace-nowrap hover:bg-[#EFEBFF] transition-colors cursor-pointer"
                aria-label="Back to Editor"
              >
                Back to Editor
              </button>

              <ShareLinksButton links={savedLinks} profile={savedProfile} />
            </div>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div
        className="w-[90%] max-w-[349px] mx-auto mt-8 tablet-min:mt-20 laptop-min:mt-10
        bg-white rounded-[24px] p-6 pb-10 z-10
        tablet-min:border-[1px] tablet-min:border-[#D9D9D9] tablet-min:shadow-lg
        tablet-min:absolute tablet-min:left-1/2 tablet-min:-translate-x-1/2 tablet-min:top-[150px]"
      >
        {/* Profile Image */}
        <div className="w-[96px] h-[96px] tablet-min:w-[104px] tablet-min:h-[104px] rounded-full overflow-hidden bg-gray-200 mx-auto mt-12 tablet-min:mt-10">
          {savedProfile?.profileImage && (
            <img
              src={savedProfile.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mt-8">
          <p className="font-bold text-[24px] tablet-min:text-[32px] text-[#333333] text-center">
            {savedProfile?.firstName} {savedProfile?.lastName}
          </p>
          <p className="text-[#737373] font-normal text-[14px] tablet-min:text-[16px] mt-3 tablet-min:mt-1.5">
            {savedProfile?.email}
          </p>
        </div>

        {/* Social Links — tapping opens the saved URL */}
        <div className="flex flex-col items-center mt-14 tablet-min:mt-12 gap-y-[20px]">
          {savedLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-[8px] w-full max-w-[237px] h-[56px] p-[16px] gap-[8px] cursor-pointer hover:shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: getPlatformColor(link.platform) }}
            >
              {getPlatformIcon(link.platform)}
              <p className="text-[16px] font-normal flex-1 text-white text-left">
                {link.platform}
              </p>
              <FaArrowRight className="w-[10.56px] h-[10.56px] text-white" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
