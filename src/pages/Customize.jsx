import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrFormAdd } from "react-icons/gr";
import hand from "../assets/hand.png";
import hand2 from "../assets/hand 2.png";
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
    const savedData = localStorage.getItem("devlinks_links");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [savedLinks, setSavedLinks] = useState(() => {
    const savedData = localStorage.getItem("devlinks_savedLinks");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    if (links.length >= 5) {
      toast.error("You can only add up to 5 links.");
      return;
    }

    const newLink = {
      id: Date.now(),
      platform: "GitHub",
      url: "",
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    localStorage.setItem("devlinks_links", JSON.stringify(updatedLinks));
  };

  const handleRemove = (id) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    const updatedSavedLinks = savedLinks.filter((link) => link.id !== id);
    setLinks(updatedLinks);
    setSavedLinks(updatedSavedLinks);
    localStorage.setItem("devlinks_links", JSON.stringify(updatedLinks));
    localStorage.setItem(
      "devlinks_savedLinks",
      JSON.stringify(updatedSavedLinks),
    );

    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);

    if (validationTimeoutRef.current[id]) {
      clearTimeout(validationTimeoutRef.current[id]);
      delete validationTimeoutRef.current[id];
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const newErrors = {};

    links.forEach((link) => {
      if (!link.url.trim()) {
        newErrors[link.id] = "Can't be empty";
        toast.error(`Link ${link.platform} can't be empty`);
      } else if (!isValidUrl(link.url)) {
        newErrors[link.id] = "Please check the URL";
        toast.error(`Invalid URL for ${link.platform}`);
      } else if (link.platform === "WhatsApp") {
        const phoneMatch = link.url.match(/wa\.me\/(\d+)/);
        if (!phoneMatch || phoneMatch[1].length < 11) {
          newErrors[link.id] = "Please check the WhatsApp URL";
          toast.error("Invalid WhatsApp URL");
        }
      } else {
        const pattern = PLATFORM_PATTERNS[link.platform];
        if (pattern && !pattern.test(link.url)) {
          newErrors[link.id] = `URL does not match ${link.platform}`;
          toast.error(`Wrong URL for ${link.platform}`);
        }
      }
    });

    setErrors(newErrors);

    setTimeout(() => {
      if (Object.keys(newErrors).length === 0) {
        setSavedLinks([...links]);
        localStorage.setItem("devlinks_savedLinks", JSON.stringify(links));
        toast.success("Links saved successfully");
      }
      setIsSaving(false);
    }, 800);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const focusedIndexRef = useRef(-1);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdowns({});
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen(id);
      return;
    }
    if (!openDropdowns[id]) return;
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
      setOpenDropdowns((prev) => ({ ...prev, [id]: false }));
    }
  };

  const focusOption = (i) => {
    const list = listRef.current;
    if (!list) return;
    const option = list.querySelectorAll('[role="option"]')[i];
    if (option) option.focus();
  };

  const toggleOpen = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateLink = (linkId, field, value) => {
    setLinks((prevLinks) =>
      prevLinks.map((item) =>
        item.id === linkId ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="min-h-dvh w-full bg-white overflow-x-hidden">
      <NavBar />

      <div className="mx-auto w-full max-w-[1150px] px-4 tablet-min:px-6 laptop-min:px-10 desktop:px-0 laptop-min:relative">
        <div className="min-[1360px]:max-w-[650px] min-[1360px]:ml-auto">
          {/* Heading */}
          <div className="flex flex-col gap-y-2 py-6 tablet-min:py-8 laptop-min:py-10">
            <h4 className="font-bold text-[22px] tablet-min:text-[28px] laptop-min:text-[32px] text-[#333333] leading-[150%]">
              Customize your links
            </h4>
            <h6 className="text-[14px] tablet-min:text-[16px] font-normal text-[#737373] tracking-wide">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </h6>
          </div>

          {/* Add new link button */}
          <div
            className={`flex items-center border border-[#633CFF] rounded-[8px] w-full
    h-[46px] py-[11px] px-[16px] gap-[8px]
    justify-center text-[#633CFF] select-none transition-colors duration-300
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
              className="text-[14px] tablet-min:text-[16px] font-semibold"
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
              <p className="text-center mt-8 text-sm tablet-min:text-base text-gray-500">
                No links yet — tap "Add new link".
              </p>
            ) : (
              links.map((link, idx) => (
                <div key={link.id} className="mt-8 w-full bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[14px] tablet-min:text-[16px] font-bold text-[#737373]">
                        Link #{idx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(link.id)}
                      className="text-[14px] tablet-min:text-[16px] text-[#737373] font-normal hover:text-red-500"
                      aria-label={`Remove link ${idx + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                  <label className="block text-[12px] font-normal text-[#333333] mt-4 mb-1">
                    Platform
                  </label>

                  <div className="relative w-full" ref={containerRef}>
                    <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#737373] w-[18px] h-[18px] pointer-events-none z-10">
                      {link.platform === "GitHub" && <TbBrandGithub />}
                      {link.platform === "LinkedIn" && <FaLinkedin />}
                      {link.platform === "YouTube" && <FaYoutube />}
                      {link.platform === "Instagram" && <IoLogoInstagram />}
                      {link.platform === "WhatsApp" && <FaWhatsapp />}
                      {link.platform === "Facebook" && <FaFacebook />}
                      {link.platform === "Frontend Mentor" && (
                        <SiFrontendmentor />
                      )}
                      {link.platform === "X" && <FaXTwitter />}
                    </div>

                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={!!openDropdowns[link.id]}
                      onClick={() => toggleOpen(link.id)}
                      onKeyDown={(e) => handleKeyDown(e, link.id)}
                      className="w-full text-left border border-[#D9D9D9] rounded-lg p-3 text-sm pl-11 pr-10
hover:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] hover:border-[#633CFF]
transition-all duration-300 focus:border-[#633CFF] focus:outline-none bg-white flex items-center justify-between"
                    >
                      <span className="truncate text-[#333333]">
                        {OPTIONS.find((o) => o.id === link.platform)?.label ||
                          "Select platform"}
                      </span>

                      <span
                        className="pointer-events-none"
                        style={{
                          display: "inline-flex",
                          transition: "transform 300ms ease-out",
                          transform: openDropdowns[link.id]
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

                    {openDropdowns[link.id] && (
                      <div
                        ref={listRef}
                        role="listbox"
                        aria-label="Platforms"
                        className="absolute left-0 top-full mt-2 z-[9999] bg-white border border-[#D9D9D9] rounded-lg w-full
shadow-[0_0_32px_0_rgba(0,0,0,0.1)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                                  const next = Math.min(
                                    i + 1,
                                    OPTIONS.length - 1,
                                  );
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

                              {opt.id === link.platform && (
                                <span className="ml-auto text-[#633CFF] text-lg font-bold">
                                  ✓
                                </span>
                              )}
                            </button>

                            {i < OPTIONS.length - 1 && (
                              <div className="flex justify-center">
                                <div className="border-b border-[#E5E5E5] w-[90%]" />
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

                        if (errors[link.id]) {
                          const newErrors = { ...errors };
                          delete newErrors[link.id];
                          setErrors(newErrors);
                        }

                        if (validationTimeoutRef.current[link.id]) {
                          clearTimeout(validationTimeoutRef.current[link.id]);
                        }

                        const hasCompleteUrl = /^https?:\/\/.+\..+/.test(value);

                        if (value && link.platform && hasCompleteUrl) {
                          validationTimeoutRef.current[link.id] = setTimeout(
                            () => {
                              const pattern = PLATFORM_PATTERNS[link.platform];
                              if (pattern && !pattern.test(value)) {
                                toast.error(`Invalid ${link.platform} URL!`);
                                setErrors((prev) => ({
                                  ...prev,
                                  [link.id]: `URL does not match ${link.platform}`,
                                }));
                              }
                            },
                            1500,
                          );
                        }
                      }}
                      type="url"
                      placeholder={getPlatformPlaceholder(link.platform)}
                      className={`w-full border rounded-lg p-3 pl-10 text-sm hover:shadow-[0_0_32px_0_rgba(99,60,255,0.5)] transition-shadow duration-300 focus:outline-none ${
                        errors[link.id]
                          ? "border-red-500 focus:border-red-500 placeholder:tablet-min:opacity-100 placeholder:opacity-0 text-transparent tablet-min:text-[#333333]"
                          : "border-[#D9D9D9] focus:border-[#633CFF]"
                      }`}
                    />
                    {errors[link.id] && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs font-normal hidden tablet-min:inline">
                        {errors[link.id]}
                      </span>
                    )}
                    {errors[link.id] && (
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-red-500 text-xs font-normal tablet-min:hidden">
                        {errors[link.id]}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {links.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-16 gap-y-[24px]">
              <img src={hand} alt="" className="block tablet-min:hidden" />
              <img
                src={hand2}
                alt=""
                className="hidden tablet-min:block tablet-min:mt-5"
              />
              <h4 className="text-[22px] tablet-min:text-[32px] font-bold leading-[150%] text-[#333333] text-center">
                Let's get you started
              </h4>
              <h5 className="font-normal text-[#737373] text-[14px] tablet-min:text-[16px] max-w-[420px] text-center px-1">
                Use the "Add new link" button to get started. Once you have more
                than one link, you can reorder and edit them. We're here to help
                you share your profiles with everyone!
              </h5>
            </div>
          )}

          <div
            className={`border-t border-t-[#D9D9D9] w-full
mx-auto mt-10 flex items-center justify-center tablet-min:justify-end
laptop-min:sticky laptop-min:bottom-0 overflow-hidden laptop-min:z-50
laptop-min:bg-white laptop-min:py-4 laptop-min:shadow-[0_-2px_8px_rgba(0,0,0,0.05)]
transition-all duration-300
${links.length === 0 ? "opacity-40 pointer-events-none" : "opacity-100"}`}
          >
            <button
              onClick={handleSave}
              disabled={isSaving || links.length === 0}
              className="mt-4 laptop-min:mt-0 w-full tablet-min:w-[140px] h-[46px] py-[11px] px-[27px]
border-0 rounded-[8px] bg-[#633CFF] text-white font-semibold text-[16px] hover:bg-[#532DD1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* iPhone Preview with Overlay — desktop only, from 1360px upward */}
        <div className="min-[1360px]:absolute top-0 left-0 hidden min-[1360px]:block">
          <div className="relative flex items-center justify-center min-h-screen">
            <div className="relative w-[307px] h-[631px]">
              <svg
                className="absolute inset-0"
                width="307"
                height="631"
                viewBox="0 0 307 631"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="305"
                  height="629"
                  rx="47"
                  stroke="#737373"
                  fill="none"
                />

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

                <circle cx="153.5" cy="120" r="48" fill="#EFEFEF" />

                <rect
                  x="83.5"
                  y="190"
                  width="140"
                  height="14"
                  rx="7"
                  fill="#EFEFEF"
                />

                <rect
                  x="103.5"
                  y="215"
                  width="100"
                  height="10"
                  rx="5"
                  fill="#EFEFEF"
                />

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
                      <span className="text-xs font-medium">
                        {link.platform}
                      </span>
                    </div>
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
