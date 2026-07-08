import React from "react";
import toast from "react-hot-toast";
import { encodePayloadToUrl } from "../utils/Share.jsx";

// Shrinks a base64 image data URL down to a small square thumbnail.
// This is what makes it safe to embed in a share URL / hand to
// navigator.share() — a full-resolution upload can be hundreds of KB,
// while a 64x64 low-quality JPEG thumbnail is typically only a few KB.
function resizeImageForSharing(dataUrl, maxSize = 64, quality = 0.6) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");

        // Crop to a centered square, then scale down to maxSize x maxSize
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    } catch (e) {
      console.error("resizeImageForSharing failed", e);
      resolve(null);
    }
  });
}

export default function ShareLinksButton({
  links = [],
  profile = null,
  label = "Share Link",
  small = false,
}) {
  const handleShare = async () => {
    // Always read the freshest saved data directly from localStorage at
    // click time, rather than trusting props that may have been captured
    // before an async localStorage load finished upstream. This is the
    // single source of truth for what actually gets shared.
    let effectiveProfile = profile;
    let effectiveLinks = links;

    if (typeof window !== "undefined") {
      try {
        const rawProfile = localStorage.getItem("devlinks_profileDetails");
        if (rawProfile) effectiveProfile = JSON.parse(rawProfile);
      } catch (e) {
        console.error("Failed to read profile from localStorage", e);
      }

      try {
        const rawLinks = localStorage.getItem("devlinks_savedLinks");
        if (rawLinks) {
          const parsedLinks = JSON.parse(rawLinks);
          if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
            effectiveLinks = parsedLinks;
          }
        }
      } catch (e) {
        console.error("Failed to read links from localStorage", e);
      }
    }

    if (!effectiveLinks || effectiveLinks.length === 0) {
      toast.error("Save at least one link before sharing");
      return;
    }

    // Include a small thumbnail of the profile image rather than the
    // full-resolution upload — this keeps the shared payload small enough
    // for navigator.share() and the URL itself, while still letting the
    // shared preview show a profile picture instead of nothing.
    let sharedThumbnail = null;
    if (effectiveProfile?.profileImage) {
      sharedThumbnail = await resizeImageForSharing(
        effectiveProfile.profileImage,
      );
    }

    const shareSafeProfile = effectiveProfile
      ? {
          firstName: effectiveProfile.firstName || "",
          lastName: effectiveProfile.lastName || "",
          email: effectiveProfile.email || "",
          profileImage: sharedThumbnail,
        }
      : null;

    const encoded = encodePayloadToUrl({
      profile: shareSafeProfile,
      links: effectiveLinks,
    });

    if (!encoded) {
      toast.error("Could not prepare the link to share");
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/shared#data=${encoded}`;

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

    if (navigator.share) {
      try {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          const shareStartTime = Date.now();
          await navigator.share(shareData);
          const shareTime = Date.now() - shareStartTime;

          if (shareTime > 1000) {
            toast.success("Link shared successfully");
          }
          return;
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        // fall through to clipboard on any other native share failure
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed", err);
      toast.error("Could not share or copy link");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center rounded-[8px] bg-[#633CFF] text-white font-semibold
        whitespace-nowrap transition-colors hover:bg-[#532DD1]
        ${small ? "px-4 py-2 text-sm h-10" : "px-6 py-[11px] text-[16px] h-[46px]"}
      `}
      aria-label="Share link"
    >
      {label}
    </button>
  );
}
