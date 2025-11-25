// src/pages/PublicPreview.jsx
import React, { useEffect, useState } from "react";
import { decodePayloadFromUrl } from "../utils/share";
import { TbBrandGithub } from "react-icons/tb";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

const PublicPreview = () => {
  const [payload, setPayload] = useState({ profile: null, links: [] });

  useEffect(() => {
    const hash = (window.location.hash || "").replace(/^#data=/, "");
    const decoded = decodePayloadFromUrl(hash);
    setPayload(decoded);
  }, []);

  const { profile, links } = payload;

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

  return (
    <div className="w-full min-h-screen bg-gray-50 relative">
      {/* Blue background only on desktop */}
      <div className="hidden md:block w-full bg-[#633CFF] h-[357px] rounded-bl-[32px] rounded-br-[32px] overflow-hidden"></div>

      {/* Card container */}
      <div className="relative -mt-0 md:-mt-32 px-4 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-[24px] border border-[#D9D9D9] shadow-lg p-6 pb-10 text-center">
          {/* Profile image */}
          <div className="w-[104px] h-[104px] rounded-full overflow-hidden bg-gray-200 mx-auto">
            {profile?.profileImage && (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Name / Email */}
          <div className="mt-6">
            <p className="font-bold text-[24px] text-[#333]">
              {profile?.firstName || profile?.lastName
                ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                : "Shared Links"}
            </p>
            {profile?.email && (
              <p className="text-[#737373] text-sm mt-1">{profile.email}</p>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-col items-center mt-8 gap-4">
            {links.length === 0 ? (
              <div className="text-sm text-slate-500">
                No links were shared.
              </div>
            ) : (
              links.map((link) => (
                <a
                  key={link.id || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-[8px] w-full max-w-[320px] h-[56px] p-4 gap-3 hover:scale-105 transition-all"
                  style={{ backgroundColor: getPlatformColor(link.platform) }}
                >
                  {getPlatformIcon(link.platform)}
                  <div className="flex-1 text-left">
                    <div className="text-white text-[16px] font-medium truncate">
                      {link.platform}
                    </div>
                    {link.title && (
                      <div className="text-white text-sm opacity-80 truncate">
                        {link.title}
                      </div>
                    )}
                  </div>
                  <FaArrowRight className="text-white w-4 h-4" />
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPreview;
