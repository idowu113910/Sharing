// src/components/ShareLinksButton.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { encodePayloadToUrl } from "../utils/Share.jsx";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiCopy, FiShare2 } from "react-icons/fi";

export default function ShareLinksButton({
  links = [],
  profile = null,
  label = "Share Link",
  small = false,
}) {
  const [showMenu, setShowMenu] = useState(false);

  // fallback: read profile from localStorage if not passed
  let effectiveProfile = profile;
  if (!effectiveProfile && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("devlinks_profileDetails");
      effectiveProfile = raw ? JSON.parse(raw) : null;
    } catch (e) {
      effectiveProfile = null;
    }
  }

  const encoded = encodePayloadToUrl({ profile: effectiveProfile, links });
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const previewPath = "/shared";
  const shareUrl = encoded
    ? `${origin}${previewPath}?data=${encoded}` // use query param instead of hash
    : `${origin}${previewPath}`;

  const profileName = effectiveProfile
    ? `${effectiveProfile.firstName || ""} ${
        effectiveProfile.lastName || ""
      }`.trim()
    : "";

  const shareText = profileName
    ? `Check out ${profileName}'s links`
    : "Check out these links";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
      setShowMenu(false);
    } catch (err) {
      toast.error("Could not copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      const shareData = {
        title: profileName || "My Links",
        text: shareText,
        url: shareUrl,
      };
      try {
        const shareStartTime = Date.now();
        await navigator.share(shareData);
        const shareTime = Date.now() - shareStartTime;
        if (shareTime > 1000) toast.success("Link shared successfully");
      } catch (err) {
        if (err.name !== "AbortError") setShowMenu(true);
      }
    } else {
      setShowMenu(true);
    }
  };

  const shareToSocial = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com/shared?data=abc123`;
        break;

      case "x":
        shareLink = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "telegram":
        shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(
          profileName || "Check out these links"
        )}&body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    if (platform === "email") {
      window.location.href = shareLink;
    } else {
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }

    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`${
          small
            ? "w-[133px] h-[46px] text-sm"
            : "w-[133px] h-[46px] text-[16px]"
        } rounded-[8px] bg-[#633CFF] text-white font-semibold hover:bg-[#532DD1] transition whitespace-nowrap flex items-center justify-center gap-2`}
      >
        <FiShare2 className="w-4 h-4" />
        {label}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Share via</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {/* Facebook */}
              <button
                onClick={() => shareToSocial("facebook")}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <FaFacebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>

              {/* X (official FaXTwitter icon) */}
              <button
                onClick={() => shareToSocial("x")}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaXTwitter className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">X</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => shareToSocial("linkedin")}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center">
                  <FaLinkedin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => shareToSocial("whatsapp")}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                  <FaWhatsapp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => shareToSocial("telegram")}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center">
                  <FaTelegram className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">Telegram</span>
              </button>

              {/* Email */}
              <button
                onClick={() => shareToSocial("email")}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-[#EA4335] rounded-full flex items-center justify-center">
                  <FaEnvelope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">Email</span>
              </button>
            </div>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 font-medium"
            >
              <FiCopy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}
