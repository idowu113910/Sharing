import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dev from "../assets/dev.png";
import link from "../assets/links.png";
import profile from "../assets/profile-details.png";
import preview from "../assets/preview.png";
import { GrFormAdd } from "react-icons/gr";
import hand from "../assets/hand.png";
import dev2 from "../assets/devlink.png";
import { HiLink } from "react-icons/hi";
import { LuCircleUserRound } from "react-icons/lu";
import hand2 from "../assets/hand 2.png";
import iphone from "../assets/phone desktop.svg";
import { TbBrandGithub } from "react-icons/tb";

import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";
import { SiFrontendmentor } from "react-icons/si";

const Customize = ({ value, onChange, linkId }) => {
  const navigate = useNavigate();
  const validationTimeoutRef = useRef({});

  const [links, setLinks] = useState(() => {
    // Load links from localStorage on initial render
    const savedData = localStorage.getItem("devlinks_links");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [savedLinks, setSavedLinks] = useState(() => {
    // Load saved links from localStorage on initial render
    const savedData = localStorage.getItem("devlinks_savedLinks");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Add a new link
  const handleAdd = () => {
    if (links.length >= 5) {
      toast.error("You can only add up to 5 links.");
      return;
    }
    // 🚫 Stop adding more than 5

    const newLink = {
      id: Date.now(),
      platform: "GitHub",
      url: "",
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    localStorage.setItem("devlinks_links", JSON.stringify(updatedLinks));
  };

  // Remove a link
  const handleRemove = (id) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    const updatedSavedLinks = savedLinks.filter((link) => link.id !== id);
    setLinks(updatedLinks);
    setSavedLinks(updatedSavedLinks);
    localStorage.setItem("devlinks_links", JSON.stringify(updatedLinks));
    localStorage.setItem(
      "devlinks_savedLinks",
      JSON.stringify(updatedSavedLinks)
    );

    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);

    // Clear any pending validation timeout for this link
    if (validationTimeoutRef.current[id]) {
      clearTimeout(validationTimeoutRef.current[id]);
      delete validationTimeoutRef.current[id];
    }
  };

  // Update link data

  // Validate and save links

  const handleSave = () => {
    setIsSaving(true);
    const newErrors = {};

    // Validate all links
    links.forEach((link) => {
      if (!link.url.trim()) {
        newErrors[link.id] = "Can't be empty";
        toast.error(`Link ${link.platform} can't be empty`);
      } else if (!isValidUrl(link.url)) {
        newErrors[link.id] = "Please check the URL";
        toast.error(`Invalid URL for ${link.platform}`);
      } else if (link.platform === "WhatsApp") {
        // Extract phone number from WhatsApp URL
        const phoneMatch = link.url.match(/wa\.me\/(\d+)/);
        if (!phoneMatch || phoneMatch[1].length < 11) {
          newErrors[link.id] = "Please check the WhatsApp URL";
          toast.error("Invalid WhatsApp URL");
        }
      } else {
        // Check if URL matches the selected platform
        const pattern = PLATFORM_PATTERNS[link.platform];
        if (pattern && !pattern.test(link.url)) {
          newErrors[link.id] = `URL does not match ${link.platform}`;
          toast.error(`Wrong URL for ${link.platform}`);
        }
      }
    });

    setErrors(newErrors);

    // Simulate save delay
    setTimeout(() => {
      if (Object.keys(newErrors).length === 0) {
        setSavedLinks([...links]);
        localStorage.setItem("devlinks_savedLinks", JSON.stringify(links));
        toast.success("Links saved successfully");
      }
      setIsSaving(false);
    }, 800);
  };

  // Simple URL validation
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  // Get platform colors
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

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const icons = {
      GitHub: <TbBrandGithub className="w-4 h-4" />,
      X: <FaXTwitter className="w-4 h-4" />,
      LinkedIn: <FaLinkedin className="w-4 h-4" />,
      YouTube: <FaYoutube className="w-4 h-4" />,
      Facebook: <FaFacebook className="w-4 h-4" />,
      Instagram: <IoLogoInstagram className="w-4 h-4" />,
      WhatsApp: <FaWhatsapp className="w-4 h-4" />,
      FrontendMentor: <SiFrontendmentor className="w-4 h-4" />,
    };
    return icons[platform];
  };

  // Get platform-specific placeholder
  const getPlatformPlaceholder = (platform) => {
    const placeholders = {
      GitHub: "e.g. https://www.github.com/johnappleseed",
      X: "e.g. https://www.x.com/johnappleseed",
      LinkedIn: "e.g. https://www.linkedin.com/in/johnappleseed",
      YouTube: "e.g. https://www.youtube.com/@johnappleseed",
      Facebook: "e.g. https://www.facebook.com/johnappleseed",
      Instagram: "e.g. https://www.instagram.com/johnappleseed",
      WhatsApp: "e.g. https://wa.me/1234567890",
      "Frontend Mentor":
        "e.g. https://www.frontendmentor.io/profile/johnappleseed",
    };
    return placeholders[platform] || "e.g. https://www.example.com/yourname";
  };

  const PLATFORM_PATTERNS = {
    GitHub: /^https?:\/\/(www\.)?github\.com\/.+$/i,
    LinkedIn: /^https?:\/\/(www\.)?linkedin\.com\/.+$/i,
    YouTube: /^https?:\/\/(www\.)?youtube\.com\/.+$/i,
    Instagram: /^https?:\/\/(www\.)?instagram\.com\/.+$/i,
    WhatsApp: /^https?:\/\/(www\.)?wa\.me\/.+$/i,
    X: /^https?:\/\/(www\.)?x\.com\/.+$/i,
    "Frontend Mentor": /^https?:\/\/(www\.)?frontendmentor\.io\/profile\/.+$/i,
  };

  const OPTIONS = [
    { id: "GitHub", label: "GitHub", icon: <TbBrandGithub /> },
    { id: "LinkedIn", label: "LinkedIn", icon: <FaLinkedin /> },
    { id: "YouTube", label: "YouTube", icon: <FaYoutube /> },
    { id: "Instagram", label: "Instagram", icon: <IoLogoInstagram /> },
    { id: "WhatsApp", label: "WhatsApp", icon: <FaWhatsapp /> },
    { id: "Facebook", label: "Facebook", icon: <FaFacebook /> },
    {
      id: "Frontend Mentor",
      label: "Frontend Mentor",
      icon: <SiFrontendmentor />,
    },
    { id: "X", label: "X", icon: <FaXTwitter /> },
  ];

  const [openDropdowns, setOpenDropdowns] = useState({});

  const [open, setOpen] = useState(false);
  // rotateCount increments on every toggle -> cumulative 360° spins
  const [rotateCount, setRotateCount] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const focusedIndexRef = useRef(-1);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  // keyboard support
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
      return;
    }
    if (!open) return;
    const idx = focusedIndexRef.current;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(idx + 1, OPTIONS.length - 1);
      focusedIndexRef.current = next;
      focusOption(next);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(idx - 1, 0);
      focusedIndexRef.current = prev;
      focusOption(prev);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const focusOption = (i) => {
    const list = listRef.current;
    if (!list) return;
    const option = list.querySelectorAll('[role="option"]')[i];
    if (option) option.focus();
  };

  const toggleOpen = (id) => {
    setOpenDropdowns((prev) => (prev === id ? null : id));
    setRotateCount((c) => c + 1);
  };

  const handleSelect = (platformId) => {
    // Update the link's platform
    updateLink(link.id, "platform", platformId);

    // Close the dropdown
    setOpenDropdowns((prev) => ({
      ...prev,
      [link.id]: false,
    }));
  };

  const updateLink = (linkId, field, value) => {
    setLinks((prevLinks) =>
      prevLinks.map((item) =>
        item.id === linkId ? { ...item, [field]: value } : item
      )
    );
  };

  // =================

  return (
    <div className="h-[812px] md:h-[900px] lg:relative">
      {/* Mobile Navbar */}

      <NavBar />

      <div className="flex flex-col gap-y-[8px] p-9 lg:mt-4 lg:relative left-136">
        <h4 className="font-bold text-[24px] md:text-[32px] text-[#333333] leading-[150%]">
          Customize your links
        </h4>
        <h6 className="text-[16px] font-normal text-[#737373] tracking-wide">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </h6>
      </div>

      <div
        className={`flex items-center border border-[#633CFF] rounded-[8px] w-[295px] md:w-[640px] lg:w-[728px]
    h-[46px] py-[11px] px-[16px] gap-[8px] md:gap-[4px] mx-auto
    justify-center text-[#633CFF] select-none lg:ml-[584px] md:ml-[34px] transition-colors duration-300
    bg-transparent
    ${
      savedLinks.length >= 5
        ? "opacity-40 cursor-not-allowed"
        : "cursor-pointer hover:bg-[#633CFF]/10"
    }`}
        onClick={() => {
          if (savedLinks.length >= 5) return;
          handleAdd();
        }}
        role="button"
        tabIndex={savedLinks.length >= 5 ? -1 : 0}
        onKeyDown={(e) => {
          if (savedLinks.length >= 5) return;
          if (e.key === "Enter" || e.key === " ") handleAdd();
        }}
      >
        <GrFormAdd />

        <button
          type="button"
          className="text-[16px] font-semibold mr-4"
          onClick={(e) => {
            e.stopPropagation();
            if (savedLinks.length >= 5) return;
            handleAdd();
          }}
          disabled={savedLinks.length >= 5}
        >
          Add new link
        </button>
      </div>

      {/* Links container */}
      <div className="flex flex-col gap-4">
        {links.length === 0 ? (
          <p className="text-center lg:ml-138 mt-4 text-sm md:text-base text-gray-500">
            No links yet — tap "Add new link".
          </p>
        ) : (
          links.map((link, idx) => (
            <div
              key={link.id}
              className="mt-12 w-[255px] md:w-[600px] lg:w-[688px] mx-auto md:mx-0 md:ml-[50px] lg:ml-[605px] lg:mr-0 bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[16px] font-bold text-[#737373]">
                    = Link #{idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(link.id)}
                  className="text-[16px] text-[#737373] font-normal hover:text-red-500 md:mt-1.5"
                  aria-label={`Remove link ${idx + 1}`}
                >
                  Remove
                </button>
              </div>
              <label className="block text-[12px] font-normal text-[#333333] mt-4 mb-1">
                Platform
              </label>

              <div className="relative w-full" ref={containerRef}>
                {/* Left icon (current platform) */}
                <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#737373] w-[18px] h-[18px] pointer-events-none z-10">
                  {link.platform === "GitHub" && <TbBrandGithub />}
                  {link.platform === "LinkedIn" && <FaLinkedin />}
                  {link.platform === "YouTube" && <FaYoutube />}
                  {link.platform === "Instagram" && <IoLogoInstagram />}
                  {link.platform === "WhatsApp" && <FaWhatsapp />}
                  {link.platform === "Facebook" && <FaFacebook />}
                  {link.platform === "Frontend Mentor" && <SiFrontendmentor />}
                  {link.platform === "X" && <FaXTwitter />}
                </div>

                {/* Arrow button (acts as the toggler) */}
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdowns === link.id}
                  onClick={() => toggleOpen(link.id)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-left border border-[#D9D9D9] rounded-lg p-3 text-sm pl-11 pr-10 
hover:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] hover:border-[#633CFF]
transition-all duration-300 focus:border-[#633CFF] focus:outline-none bg-white flex items-center justify-between"
                >
                  <span className="truncate text-[#333333]">
                    {OPTIONS.find((o) => o.id === link.platform)?.label ||
                      "Select platform"}
                  </span>

                  {/* Rotating arrow */}
                  <span
                    className="pointer-events-none -mr-6"
                    style={{
                      display: "inline-flex",
                      transition: "transform 300ms ease-out",
                      transform:
                        openDropdowns === link.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 text-[#633CFF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {/* Options list - Removed scrollbar */}
                {openDropdowns === link.id && (
                  <div
                    ref={listRef}
                    role="listbox"
                    aria-label="Platforms"
                    className="absolute left-0 top-full mt-2 z-[9999] bg-white border border-[#D9D9D9] rounded-lg 
shadow-[0_0_32px_0_rgba(0,0,0,0.1)] w-[255px] md:w-[600px] lg:w-[686px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ maxHeight: "224px", overflowY: "auto" }}
                  >
                    {OPTIONS.map((opt, i) => (
                      <div key={opt.id} className="w-full">
                        <button
                          role="option"
                          tabIndex={0}
                          onClick={() => {
                            updateLink(link.id, "platform", opt.id);
                            setOpenDropdowns((prev) => ({
                              ...prev,
                              [link.id]: false,
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              updateLink(link.id, "platform", opt.id);
                              setOpenDropdowns((prev) => ({
                                ...prev,
                                [link.id]: false,
                              }));
                            }
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              const next = Math.min(i + 1, OPTIONS.length - 1);
                              focusedIndexRef.current = next;
                              focusOption(next);
                            }
                            if (e.key === "ArrowUp") {
                              e.preventDefault();
                              const prev = Math.max(i - 1, 0);
                              focusedIndexRef.current = prev;
                              focusOption(prev);
                            }
                            if (e.key === "Escape")
                              setOpenDropdowns((prev) => ({
                                ...prev,
                                [link.id]: false,
                              }));
                          }}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-200 group"
                        >
                          {/* Icon - changes color on hover */}
                          <span
                            className={`w-5 h-5 flex items-center justify-center transition-colors duration-200
${
  opt.id === link.platform
    ? "text-[#633CFF]"
    : "text-[#737373] group-hover:text-[#633CFF]"
}`}
                          >
                            {opt.icon}
                          </span>

                          {/* Label - changes color on hover */}
                          <span
                            className={`truncate text-sm transition-colors duration-200
${
  opt.id === link.platform
    ? "text-[#633CFF] font-semibold"
    : "text-[#333333] group-hover:text-[#633CFF]"
}`}
                          >
                            {opt.label}
                          </span>

                          {/* Checkmark for selected item */}
                          {opt.id === link.platform && (
                            <span className="ml-auto text-[#633CFF] text-lg font-bold">
                              ✓
                            </span>
                          )}
                        </button>

                        {/* Divider line - 656px width, centered */}
                        {i < OPTIONS.length - 1 && (
                          <div className="flex justify-center">
                            <div className="border-b border-[#E5E5E5] w-[223px] md:w-[568px] lg:w-[656px]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="block text-[12px] text-[#333333] mb-1 mt-4">
                Link
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none z-10">
                  <GoLink className="w-[16px] h-[16px]" />
                </div>
                <input
                  id={`link-input-${link.id}`}
                  value={link.url}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateLink(link.id, "url", value);

                    // Clear previous errors immediately
                    if (errors[link.id]) {
                      const newErrors = { ...errors };
                      delete newErrors[link.id];
                      setErrors(newErrors);
                    }

                    // Clear any existing timeout for this link
                    if (validationTimeoutRef.current[link.id]) {
                      clearTimeout(validationTimeoutRef.current[link.id]);
                    }

                    // Only validate if the URL looks complete (has a domain with extension like .com, .org, etc)
                    const hasCompleteUrl = /^https?:\/\/.+\..+/.test(value);

                    if (value && link.platform && hasCompleteUrl) {
                      validationTimeoutRef.current[link.id] = setTimeout(() => {
                        const pattern = PLATFORM_PATTERNS[link.platform];
                        // Show toast after checking if URL is wrong
                        if (pattern && !pattern.test(value)) {
                          toast.error(`Invalid ${link.platform} URL!`);
                          setErrors((prev) => ({
                            ...prev,
                            [link.id]: `URL does not match ${link.platform}`,
                          }));
                        } else if (pattern && pattern.test(value)) {
                          // Optional: Show success toast when URL is correct
                          // toast.success(`Valid ${link.platform} URL!`);
                        }
                      }, 1500); // Wait 1.5 seconds after they stop typing
                    }
                  }}
                  type="url"
                  placeholder={getPlatformPlaceholder(link.platform)}
                  className={`w-full border rounded-lg p-3 pl-10 text-sm hover:shadow-[0_0_32px_0_rgba(99,60,255,0.5)] transition-shadow duration-300 focus:outline-none ${
                    errors[link.id]
                      ? "border-red-500 focus:border-red-500 placeholder:md:opacity-100 placeholder:opacity-0 text-transparent md:text-[#333333]"
                      : "border-[#D9D9D9] focus:border-[#633CFF]"
                  }`}
                />
                {errors[link.id] && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs font-normal hidden md:inline">
                    {errors[link.id]}
                  </span>
                )}
                {errors[link.id] && (
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-red-500 text-xs font-normal md:hidden">
                    {errors[link.id]}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center lg:relative left-65 mt-20 gap-y-[24px]">
          <img src={hand} alt="" className="block md:hidden" />
          <img src={hand2} alt="" className="hidden md:block md:mt-5" />
          <h4 className="text-[24px] md:text-[32px] font-bold leading-[150%] text-[#333333]">
            Let's get you started
          </h4>
          <h5 className="font-normal text-[#737373] text-[16px] w-[255px] md:w-[488px] h-[120px] md:h-[72px] md:text-center md:justify-center px-1">
            Use the "Add new link" button to get started. Once you have more
            than one link, you can reorder and edit them. We're here to help you
            share your profiles with everyone!
          </h5>
        </div>
      )}

      <div
        className={`border-t border-t-[#D9D9D9] w-[343px] md:w-[721px] lg:w-[808px]
mx-auto mt-18 lg:mt-0 flex items-center justify-center md:justify-end
lg:sticky lg:bottom-0 lg:left-[500px] overflow-hidden lg:z-50
lg:bg-white lg:py-4 lg:shadow-[0_-2px_8px_rgba(0,0,0,0.05)]
transition-all duration-300 
${links.length === 0 ? "opacity-40 pointer-events-none" : "opacity-100"}`}
      >
        <button
          onClick={() => handleSave(link)}
          disabled={isSaving || links.length === 0}
          className="mt-4 lg:mt-0 w-[311px] md:w-[91px] h-[46px] py-[11px] px-[27px]
border-0 rounded-[8px] bg-[#633CFF] text-white font-semibold text-[16px] hover:bg-[#532DD1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* iPhone Preview with Overlay */}
      <div className="lg:absolute bottom-[58px] left-25 hidden lg:block">
        <div className="relative flex justify-center items-center min-h-screen">
          {/* Shared coordinate container */}
          <div className="relative w-[307px] h-[631px]">
            {/* SVG PHONE */}
            <svg
              className="absolute inset-0"
              width="307"
              height="631"
              viewBox="0 0 307 631"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer phone border */}
              <rect
                x="1"
                y="1"
                width="305"
                height="629"
                rx="47"
                stroke="#737373"
                fill="none"
              />

              {/* Inner screen border with notch */}
              <path
                d="M 15,55 
           Q 15,15 55,15 
           L 95,15 
           Q 100,15 100,20
           Q 100,28 105,33
           Q 110,38 120,38
           L 187,38
           Q 197,38 202,33
           Q 207,28 207,20
           Q 207,15 212,15
           L 252,15 
           Q 292,15 292,55 
           L 292,576 
           Q 292,616 252,616 
           L 55,616 
           Q 15,616 15,576 
           Z"
                stroke="#737373"
                fill="none"
              />

              {/* Avatar placeholder */}
              <circle cx="153.5" cy="120" r="48" fill="#EFEFEF" />

              {/* Name bar */}
              <rect
                x="83.5"
                y="190"
                width="140"
                height="14"
                rx="7"
                fill="#EFEFEF"
              />

              {/* Username bar */}
              <rect
                x="103.5"
                y="215"
                width="100"
                height="10"
                rx="5"
                fill="#EFEFEF"
              />

              {/* Link placeholders (only shown if no saved links) */}
              {savedLinks.length === 0 && (
                <>
                  <rect
                    x="36"
                    y="295"
                    width="237"
                    height="44"
                    rx="10"
                    fill="#EFEFEF"
                  />
                  <rect
                    x="36"
                    y="355"
                    width="237"
                    height="44"
                    rx="10"
                    fill="#EFEFEF"
                  />
                  <rect
                    x="36"
                    y="415"
                    width="237"
                    height="44"
                    rx="10"
                    fill="#EFEFEF"
                  />
                  <rect
                    x="36"
                    y="475"
                    width="237"
                    height="44"
                    rx="10"
                    fill="#EFEFEF"
                  />
                  <rect
                    x="36"
                    y="535"
                    width="237"
                    height="44"
                    rx="10"
                    fill="#EFEFEF"
                  />
                </>
              )}
            </svg>

            {/* SAVED LINKS — EXACT SVG POSITIONS */}
            {savedLinks.map((link, index) => {
              const positions = [295, 355, 415, 475, 535];

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-between px-4 rounded-lg text-white transition-transform hover:scale-105"
                  style={{
                    top: `${positions[index]}px`,
                    left: "36px",
                    width: "237px",
                    height: "44px",
                    backgroundColor: getPlatformColor(link.platform),
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {getPlatformIcon(link.platform)}
                    </span>
                    <span className="text-xs font-medium">{link.platform}</span>
                  </div>
                  <FaArrowRight className="w-2.5 h-2.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
