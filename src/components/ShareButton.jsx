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
    // DETAILED DEBUGGING
    const debugInfo = {
      userAgent: navigator.userAgent,
      hasShare: !!navigator.share,
      hasCanShare: !!navigator.canShare,
      platform: navigator.platform,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      shareUrlLength: shareUrl.length,
      shareUrl: shareUrl,
    };

    console.log("=== SHARE DEBUG INFO ===", debugInfo);

    // Show alert with debug info on mobile
    alert(`Debug Info:
Share API: ${debugInfo.hasShare ? "YES" : "NO"}
Protocol: ${debugInfo.protocol}
Browser: ${debugInfo.userAgent.substring(0, 50)}...
URL Length: ${debugInfo.shareUrlLength}`);

    // Check if Web Share API is supported
    if (!navigator.share) {
      console.log("❌ Web Share API NOT supported");
      alert("Web Share API is NOT supported on this browser");
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      } catch (err) {
        console.error("Clipboard copy failed", err);
        toast.error("Could not copy link");
      }
      return;
    }

    console.log("✅ Web Share API IS supported!");
    alert("Web Share API IS supported! Attempting to share...");

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

    console.log("Share data:", shareData);

    // Check if can share this specific data
    if (navigator.canShare) {
      const canShareResult = navigator.canShare(shareData);
      console.log("Can share this data?", canShareResult);
      alert(`Can share: ${canShareResult}`);

      if (!canShareResult) {
        alert("Cannot share this data format!");
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard");
        } catch (err) {
          toast.error("Could not copy link");
        }
        return;
      }
    }

    try {
      const shareStartTime = Date.now();

      console.log("🚀 Calling navigator.share()...");
      await navigator.share(shareData);

      const shareTime = Date.now() - shareStartTime;
      console.log("✅ Share completed! Time:", shareTime);

      if (shareTime > 1000) {
        toast.success("Link shared successfully");
      }
    } catch (err) {
      console.error("❌ Share failed:", err);
      alert(`Share error: ${err.name} - ${err.message}`);

      if (err.name === "AbortError") {
        console.log("User cancelled share");
      } else if (err.name === "NotAllowedError") {
        console.log("Permission denied");
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard");
        } catch (copyErr) {
          toast.error("Could not copy link");
        }
      } else {
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
