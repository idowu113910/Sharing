// src/components/ShareLinksButton.jsx
import React from "react";
import toast from "react-hot-toast";
import { encodePayloadToUrl } from "../utils/Share.jsx";

export default function ShareLinksButton({
  links = [],
  profile = null,
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
  const previewPath = "/shared";
  const shareUrl = encoded
    ? `${origin}${previewPath}#data=${encoded}`
    : `${origin}${previewPath}`;

  const handleShare = async () => {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const isHttps = window.location.protocol === "https:";

    // Check if Web Share API is supported AND we're in a secure context
    if (!navigator.share || (isLocalhost && !isHttps)) {
      console.log("Web Share not available - using clipboard fallback");
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      } catch (err) {
        console.error("Clipboard copy failed", err);
        toast.error("Could not copy link");
      }
      return;
    }

    // Build the name from profile
    const profileName = effectiveProfile
      ? `${effectiveProfile.firstName || ""} ${
          effectiveProfile.lastName || ""
        }`.trim()
      : "";

    const shareData = {
      title: profileName || "My Links",
      text: profileName
        ? `Check out ${profileName}'s links`
        : "Check out these links",
      url: shareUrl,
    };

    try {
      await navigator.share(shareData);
      // Show success toast after successful share
      toast.success("Link shared successfully");
    } catch (err) {
      console.error("Share error:", err.name, err.message);

      if (err.name === "AbortError") {
        console.log("User cancelled share");
        // Do nothing when user cancels
      } else if (err.name === "NotAllowedError") {
        console.log("Permission denied - falling back to copy");
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard");
        } catch (copyErr) {
          toast.error("Could not copy link");
        }
      } else {
        console.error("Unexpected error - falling back to copy");
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard");
        } catch (copyErr) {
          toast.error("Could not share or copy link");
        }
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`${
        small ? "w-[133px] h-[46px] text-sm" : "w-[133px] h-[46px] text-[16px]"
      } rounded-[8px] bg-[#633CFF] text-white font-semibold hover:bg-[#532DD1] transition whitespace-nowrap`}
      aria-label="Share link"
    >
      {label}
    </button>
  );
}
