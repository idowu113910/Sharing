import React, { useEffect, useState } from "react";
import { TbBrandGithub } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { FaFacebook } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import ShareLinksButton from "../components/ShareButton";

const Preview = () => {
  const navigate = useNavigate();

  const [savedProfile, setSavedProfile] = useState(null);
  const [savedLinks, setSavedLinks] = useState([]);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Load profile details
    const profileData = localStorage.getItem("devlinks_profileDetails");
    if (profileData) setSavedProfile(JSON.parse(profileData));

    // Load links
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

  // Get platform icon
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

  // Get platform-specific placeholder
  const getPlatformPlaceholder = (platform) => {
    const placeholders = {
      GitHub: "e.g. https://www.github.com/johnappleseed",
      Twitter: "e.g. https://www.twitter.com/johnappleseed",
      LinkedIn: "e.g. https://www.linkedin.com/in/johnappleseed",
      YouTube: "e.g. https://www.youtube.com/@johnappleseed",
      Facebook: "e.g. https://www.facebook.com/johnappleseed",
      Instagram: "e.g. https://www.instagram.com/johnappleseed",
      WhatsApp: "e.g. https://wa.me/1234567890",
    };
    return placeholders[platform] || "e.g. https://www.example.com/yourname";
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);

      // Reset copied message after 2 seconds
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 3500);
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
  // ================================================

  // helper: simple URL normalizer + basic validation
  const normalizeUrl = (raw) => {
    if (!raw) return null;
    let url = raw.trim();
    // if user omitted protocol, assume https
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
      // basic validation
      const parsed = new URL(url);
      return parsed.href;
    } catch {
      return null;
    }
  };

  // helper: copy to clipboard + show feedback
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage("Link copied to clipboard ✓");
      setTimeout(() => setShareMessage(""), 2000);
    } catch (err) {
      console.error("Clipboard error:", err);
      setShareMessage("Could not copy link");
      setTimeout(() => setShareMessage(""), 2000);
    }
  };

  // Example async function to persist the share link to your backend
  // Implement this endpoint on your server to accept { shareLink } and
  // save it to the user's profile. Adjust path/method/auth as needed.
  const saveShareLinkToServer = async (link) => {
    try {
      const res = await fetch("/api/profile/share-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareLink: link }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updatedProfile = await res.json();
      // update local savedProfile state
      setSavedProfile(updatedProfile);
      return true;
    } catch (err) {
      console.error("Failed saving share link:", err);
      return false;
    }
  };

  // Main handler: uses saved profile link if present, otherwise prompts the user
  const handleShareLink = async () => {
    const profileUrl = window.location.href;
    const profileName = `${savedProfile?.firstName || ""} ${
      savedProfile?.lastName || ""
    }`.trim();
    const shareTitle = profileName || "My Profile Links";
    const shareText = `Check out ${
      profileName ? profileName + "'s" : "my"
    } profile links!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
        setShareMessage("Shared successfully! ✓");
        setTimeout(() => setShareMessage(""), 2000);
        return;
      } catch (err) {
        // user cancelled or share failed — fall through to copy
        console.info("Web Share API failed or cancelled:", err);
      }
    }

    // fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(profileUrl);
      setShareMessage("Link copied to clipboard ✓");
      setTimeout(() => setShareMessage(""), 2000);
    } catch (err) {
      console.error("Clipboard error:", err);
      setShareMessage("Could not copy link");
      setTimeout(() => setShareMessage(""), 2000);
    }
  };

  // final guard

  // 3. Use Web Share API if available, otherwise copy to clipboard

  return (
    <>
      <div className="md:h-[1024px] h-[848px] bg-gray-50 pb-20">
        {/* Blue background */}
        <div className="md:bg-[#633CFF] md:h-[357px] md:rounded-bl-[32px] md:rounded-br-[32px] md:overflow-hidden relative">
          <div className="md:bg-[#633CFF] md:h-[357px] md:rounded-bl-[32px] md:rounded-br-[32px] md:overflow-hidden">
            {/* Navigation buttons */}
            <div className="w-[335px] md:w-[720px] lg:w-[1300px] flex md:h-[78px] gap-[16px] md:rounded-[12px] md:border-[1px] justify-between md:p-6 mx-auto pt-5 md:py-[16px] md:pb-[16px] md:pl-[24px] md:mt-4 md:bg-white md:border-white">
              <button
                onClick={handleBackToEditor}
                disabled={isNavigating}
                className="w-[159.5px] h-[46px] rounded-[8px] border-[1px] py-[11px] px-[27px] text-[#633CFF] text-[14px] font-semibold border-[#633CFF] hover:bg-[#EFEBFF] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? "Loading..." : "Back to Editor"}
              </button>

              {/* NEW: share component */}
              <ShareLinksButton links={savedLinks} />
            </div>
          </div>
          {/* You can keep top buttons here if needed */}
        </div>

        {/* Profile Card */}
        <div className="md:rounded-[24px] md:border-[1px] md:border-[#D9D9D9] md:w-[349px] md:mx-auto md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[150px] md:bg-white md:shadow-lg w-[335px] mx-auto mt-8 md:mt-20 lg:mt-10 bg-white rounded-[24px] p-6 pb-10">
          {/* Profile Image */}
          <div className="w-[104px] h-[104px] rounded-full overflow-hidden bg-gray-200 mx-auto mt-12 md:mt-4">
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

        {/* Fixed Copy Success Message at Bottom */}
        {copiedLinkId && (
          <div className="fixed lg:bottom-[5px] lg:right-[470px] lg:left-[480px] md:left-[200px] bottom-[25px] md:bottom-[2px] left-3 z-50">
            <div className="bg-[#333333] text-white lg:text-[16px] text-[14px] flex gap-[8px] font-medium px-6 py-3 rounded-[12px] shadow-[0_4px_4px_#0000001A] lg:w-[397px] w-[350px]">
              <LuLink className="text-[#737373] w-[15.63px h-[15.63px] mt-1" />
              The link has been copied to your clipboard!
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translate(-50%, 10px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>

        {/* Spacer */}
        <div className="hidden md:block md:h-[400px]"></div>
      </div>
    </>
  );
};

export default Preview;
