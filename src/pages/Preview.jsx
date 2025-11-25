import React, { useEffect, useState } from "react";
import { TbBrandGithub } from "react-icons/tb";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { LuLink } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import ShareLinksButton from "../components/ShareButton";

const Preview = ({ hideButtons = false }) => {
  const navigate = useNavigate();
  const [savedProfile, setSavedProfile] = useState(null);
  const [savedLinks, setSavedLinks] = useState([]);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const profileData = localStorage.getItem("devlinks_profileDetails");
    if (profileData) setSavedProfile(JSON.parse(profileData));

    const linksData = localStorage.getItem("devlinks_savedLinks");
    if (linksData) setSavedLinks(JSON.parse(linksData));
  }, []);

  const getPlatformColor = (platform) => {
    const colors = {
      GitHub: "#1A1A1A",
      Twitter: "#1DA1F2",
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
      Twitter: <FaTwitter className="w-4 h-4 text-white" />,
      LinkedIn: <FaLinkedin className="w-4 h-4 text-white" />,
      YouTube: <FaYoutube className="w-4 h-4 text-white" />,
      Facebook: <FaFacebook className="w-4 h-4 text-white" />,
      Instagram: <IoLogoInstagram className="w-4 h-4 text-white" />,
      WhatsApp: <FaWhatsapp className="w-4 h-4 text-white" />,
    };
    return icons[platform];
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 3500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleBackToEditor = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate("/");
      setIsNavigating(false);
    }, 500);
  };

  return (
    <div className="md:h-[1024px] h-[848px] bg-gray-50 pb-20 relative">
      {/* Blue Background */}
      <div className="md:bg-[#633CFF] md:h-[357px] md:rounded-bl-[32px] md:rounded-br-[32px] md:overflow-hidden relative"></div>

      {/* Conditional Buttons */}
      {/* Conditional Buttons */}
      {!hideButtons && (
        <div className="hidden md:flex w-[335px] md:w-[720px] lg:w-[1300px] md:h-[78px] gap-[16px] justify-between md:p-6 mx-auto pt-3 md:pt-4 border-[1px] border-white rounded-[8px] bg-white md:relative bottom-[340px]">
          <button
            onClick={handleBackToEditor}
            disabled={isNavigating}
            className="w-[159.5px] h-[46px] rounded-[8px] border-[1px] py-[11px] px-[27px] text-[#633CFF] text-[8px] md:text-[14px] font-semibold border-[#633CFF] hover:bg-[#EFEBFF] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isNavigating ? "Loading..." : "Back to Editor"}
          </button>

          <ShareLinksButton links={savedLinks} />
        </div>
      )}

      {/* Mobile-only buttons (sm and below) */}
      {!hideButtons && (
        <div className="md:hidden w-full px-4 mt-4">
          <div className="flex items-center justify-between gap-3 max-w-[420px] mx-auto">
            <button
              onClick={handleBackToEditor}
              disabled={isNavigating}
              className="min-w-[110px] h-10 rounded-[8px] border-[1px] border-[#633CFF] bg-white text-[#633CFF] text-sm font-semibold px-3 py-2 whitespace-nowrap hover:bg-[#EFEBFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Back to Editor"
            >
              {isNavigating ? "Loading..." : "Back"}
            </button>

            {/* ShareLinksButton small variant — it already accepts `small` prop */}
            <div className="flex items-center">
              <ShareLinksButton links={savedLinks} small={true} />
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="md:rounded-[24px] md:border-[1px] md:border-[#D9D9D9] md:w-[349px] md:mx-auto md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[150px] md:bg-white md:shadow-lg w-[335px] mx-auto mt-8 md:mt-20 lg:mt-10 bg-white rounded-[24px] p-6 pb-10 z-10">
        {/* Profile Image */}
        <div className="w-[104px] h-[104px] rounded-full overflow-hidden bg-gray-200 mx-auto mt-12 md:mt-10">
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
          <p className="font-bold text-[32px] text-[#333333]">
            {savedProfile?.firstName} {savedProfile?.lastName}
          </p>
          <p className="text-[#737373] font-normal text-[16px] mt-3 md:mt-1.5">
            {savedProfile?.email}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center mt-14 md:mt-12 gap-y-[20px]">
          {savedLinks.map((link) => (
            <div
              key={link.id}
              onClick={() => handleCopyLink(link)}
              className="flex items-center rounded-[8px] w-[237px] h-[56px] p-[16px] gap-[8px] cursor-pointer hover:shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: getPlatformColor(link.platform) }}
            >
              {getPlatformIcon(link.platform)}
              <p className="text-[16px] font-normal flex-1 text-white">
                {link.platform}
              </p>
              <FaArrowRight className="w-[10.56px] h-[10.56px] text-white" />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Copy Success Message */}
      {copiedLinkId && (
        <div className="fixed bottom-[25px] left-3 z-50">
          <div className="bg-[#333333] text-white text-[14px] flex gap-[8px] font-medium px-6 py-3 rounded-[12px] shadow-[0_4px_4px_#0000001A] w-[350px]">
            <LuLink className="text-[#737373] w-[15.63px] h-[15.63px] mt-1" />
            The link has been copied to your clipboard!
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
