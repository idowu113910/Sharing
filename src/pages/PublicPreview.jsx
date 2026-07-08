// src/pages/PublicPreview.jsx
import React, { useEffect, useState } from "react";
import { decodePayloadFromUrl } from "../utils/Share.jsx";
import { TbBrandGithub } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

const PublicPreview = () => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const rawHash = window.location.hash || "";
    const encoded = rawHash.replace(/^#data=/, "");
    const decoded = decodePayloadFromUrl(encoded);

    setProfile(decoded?.profile || null);
    setLinks(Array.isArray(decoded?.links) ? decoded.links : []);
    setLoaded(true);
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

  if (!loaded) {
    return (
      <div className="w-full min-h-dvh flex items-center justify-center bg-gray-50">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-dvh bg-gray-50 relative overflow-x-hidden">
      {/* Blue background — scales progressively, hidden on the smallest mobile range */}
      <div className="hidden tablet-min:block w-full bg-[#633CFF] h-[240px] laptop-min:h-[300px] desktop:h-[357px] rounded-bl-[32px] rounded-br-[32px] overflow-hidden" />

      {/* Card container */}
      <div className="relative -mt-0 tablet-min:-mt-[180px] laptop-min:-mt-[230px] desktop:-mt-[280px] px-4 tablet-min:px-6 flex justify-center">
        <div className="w-full max-w-[380px] tablet-min:max-w-md bg-white rounded-[24px] border border-[#D9D9D9] shadow-lg p-5 tablet-min:p-6 pb-8 tablet-min:pb-10 text-center">
          {/* Profile image */}
          <div className="w-[88px] h-[88px] tablet-min:w-[104px] tablet-min:h-[104px] rounded-full overflow-hidden bg-gray-200 mx-auto">
            {profile?.profileImage && (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Name / Email */}
          <div className="mt-5 tablet-min:mt-6">
            <p className="font-bold text-[20px] tablet-min:text-[24px] text-[#333]">
              {profile?.firstName || profile?.lastName
                ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                : "Shared Links"}
            </p>
            {profile?.email && (
              <p className="text-[#737373] text-[13px] tablet-min:text-sm mt-1">
                {profile.email}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-col items-center mt-6 tablet-min:mt-8 gap-3 tablet-min:gap-4">
            {links.length === 0 ? (
              <div className="text-sm text-slate-500">
                No links were shared.
              </div>
            ) : (
              links.map((link, index) => (
                <a
                  key={link.id ?? `${link.url}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-[8px] w-full max-w-[320px] h-[52px] tablet-min:h-[56px] p-3 tablet-min:p-4 gap-3 hover:scale-105 transition-all"
                  style={{ backgroundColor: getPlatformColor(link.platform) }}
                >
                  {getPlatformIcon(link.platform)}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-white text-[14px] tablet-min:text-[16px] font-medium truncate">
                      {link.platform}
                    </div>
                  </div>
                  <FaArrowRight className="text-white w-4 h-4 flex-shrink-0" />
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
