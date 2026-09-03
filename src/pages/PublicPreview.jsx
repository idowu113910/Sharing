import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    // Read shared keys
    const savedProfile = localStorage.getItem("devlinks_profileDetails");
    const savedLinks = localStorage.getItem("devlinks_savedLinks");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
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
      GitHub: <TbBrandGithub className="w-5 h-5" />,
      X: <FaXTwitter className="w-5 h-5" />,
      LinkedIn: <FaLinkedin className="w-5 h-5" />,
      YouTube: <FaYoutube className="w-5 h-5" />,
      Facebook: <FaFacebook className="w-5 h-5" />,
      Instagram: <IoLogoInstagram className="w-5 h-5" />,
      WhatsApp: <FaWhatsapp className="w-5 h-5" />,
    };
    return icons[platform];
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative pb-16">
      {/* Background Top Header Banner */}
      <div className="bg-[#633CFF] h-[357px] w-full rounded-b-[32px]" />

      {/* Main Profile Display Card */}
      <div className="max-w-[349px] mx-auto bg-white rounded-[24px] shadow-lg p-10 -mt-[200px] flex flex-col items-center relative z-10">
        {/* Profile Image */}
        <div className="w-[104px] h-[104px] rounded-full border-4 border-[#633CFF] overflow-hidden bg-[#EFEFEF] mb-6">
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#737373]">
              No Image
            </div>
          )}
        </div>

        {/* Profile Name & Email */}
        <h1 className="text-[32px] font-bold text-[#333333] text-center leading-tight mb-2">
          {profile?.firstName || profile?.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : "User Profile"}
        </h1>
        <p className="text-[#737373] text-[16px] mb-12 text-center">
          {profile?.email || ""}
        </p>

        {/* Links List */}
        <div className="w-full flex flex-col gap-5">
          {links.map((link, index) => (
            <a
              key={link.id || index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[56px] rounded-[12px] flex items-center justify-between px-4 text-white transition-transform hover:opacity-90"
              style={{
                backgroundColor: getPlatformColor(link.platform),
              }}
            >
              <div className="flex items-center gap-3">
                {getPlatformIcon(link.platform)}
                <span className="font-semibold text-[16px]">
                  {link.platform}
                </span>
              </div>
              <FaArrowRight className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicPreview;
