// src/components/ShareLinksButton.jsx
import React from "react";
import toast from "react-hot-toast";
import { encodePayloadToUrl } from "../utils/share";

export default function ShareLinksButton({
  links = [],
  profile = null, // pass profile object if you have it
  label = "Share Link",
  small = false,
}) {
  // fallback: try reading profile from localStorage if not passed
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
  const previewPath = "/shared"; // public preview route
  const shareUrl = encoded
    ? `${origin}${previewPath}#data=${encoded}`
    : `${origin}${previewPath}`;

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard");
    } catch (err) {
      console.error("Clipboard copy failed", err);
      toast.error("Could not copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: effectiveProfile
            ? `${effectiveProfile.firstName || ""} ${
                effectiveProfile.lastName || ""
              }`.trim() || "Saved links"
            : "Saved links",
          text: "Check out these links",
          url: shareUrl,
        });
        toast.success("Shared successfully");
        return;
      } catch (err) {
        // fallback to copy
        console.info("Web Share failed or cancelled", err);
      }
    }
    await copyToClipboard(shareUrl);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleNativeShare}
        className={`${
          small ? "px-3 py-2 text-sm" : "px-3 py-2"
        } rounded-[8px] bg-[#633CFF] text-white font-semibold hover:bg-[#532DD1] transition`}
        aria-label="Share links"
      >
        {label}
      </button>

      <button
        onClick={() => copyToClipboard(shareUrl)}
        className={`${
          small ? "px-3 py-2 text-sm" : "px-3 py-2"
        } rounded-[8px] border border-gray-300 hover:bg-gray-50 transition`}
        aria-label="Copy share link"
      >
        Copy Link
      </button>
    </div>
  );
}
