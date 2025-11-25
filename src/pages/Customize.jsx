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
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";

const Customize = ({ value, onChange, linkId }) => {
  useEffect(() => {
    const urlHash = window.location.hash;
    if (!urlHash) {
      // only clear session if not visiting a public link
      localStorage.removeItem("devlinks_profileDetails");
      localStorage.removeItem("devlinks_savedLinks");
    }
  }, []);

  const navigate = useNavigate();

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
  };

  // Update link data
  const updateLink = (id, field, value) => {
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
    localStorage.setItem("devlinks_links", JSON.stringify(updatedLinks));
  };

  // Validate and save links

  const handleSave = () => {
    setIsSaving(true);
    const newErrors = {};

    links.forEach((link) => {
      if (!link.url.trim()) {
        newErrors[link.id] = "Can't be empty";
      } else if (!isValidUrl(link.url)) {
        newErrors[link.id] = "Please check the URL";
      } else if (link.platform === "WhatsApp") {
        const phoneMatch = link.url.match(/wa\.me\/(\d+)/);
        if (!phoneMatch || phoneMatch[1].length < 10) {
          // allow 10+ digits
          newErrors[link.id] = "Please check the URL";
        }
      }
    });

    setErrors(newErrors);

    setTimeout(() => {
      if (Object.keys(newErrors).length === 0) {
        setSavedLinks(links); // spreading optional
        localStorage.setItem("devlinks_savedLinks", JSON.stringify(links));
        toast.success("Links saved successfully!");
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
      GitHub: <TbBrandGithub className="w-4 h-4" />,
      Twitter: <FaTwitter className="w-4 h-4" />,
      LinkedIn: <FaLinkedin className="w-4 h-4" />,
      YouTube: <FaYoutube className="w-4 h-4" />,
      Facebook: <FaFacebook className="w-4 h-4" />,
      Instagram: <IoLogoInstagram className="w-4 h-4" />,
      WhatsApp: <FaWhatsapp className="w-4 h-4" />,
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
        className="flex items-center border border-[#633CFF] rounded-[8px] w-[295px] md:w-[640px] lg:w-[728px]
           h-[46px] py-[11px] px-[16px] gap-[8px] md:gap-[4px] mx-auto
           justify-center text-[#633CFF] cursor-pointer select-none lg:ml-[584px] md:ml-[34px] transition-colors duration-300 bg-transparent hover:bg-[#633CFF]/10 hover:text-[#633CFF]"
        onClick={handleAdd}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleAdd();
        }}
      >
        <GrFormAdd />
        <button
          type="button"
          className="text-[16px] font-semibold mr-4"
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
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
              <div className="relative w-full">
                <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#737373] w-[12.52px] h-[14.53px] pointer-events-none z-10">
                  {link.platform === "GitHub" && <TbBrandGithub />}
                  {link.platform === "LinkedIn" && <FaLinkedin />}
                  {link.platform === "YouTube" && <FaYoutube />}
                  {link.platform === "Instagram" && <IoLogoInstagram />}
                  {link.platform === "WhatsApp" && <FaWhatsapp />}
                </div>

                <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-[#633CFF] transition-transform duration-300"
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
                </div>

                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateLink(link.id, "platform", e.target.value)
                  }
                  className="w-full border border-[#D9D9D9] rounded-lg p-3 text-sm pl-10 pr-10 hover:shadow-[0_0_32px_0_rgba(99,60,255,0.5)] transition-shadow duration-300 focus:border-[#633CFF] focus:outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23633CFF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "16px",
                  }}
                >
                  <option value="GitHub">GitHub</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
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
                    updateLink(link.id, "url", e.target.value);
                    if (errors[link.id]) {
                      const newErrors = { ...errors };
                      delete newErrors[link.id];
                      setErrors(newErrors);
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
  transition-opacity duration-300 
  ${links.length === 0 ? "opacity-40 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex gap-4">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || links.length === 0}
            className="mt-4 lg:mt-0 w-[311px] md:w-[91px] h-[46px] py-[11px] px-[27px]
      border-0 rounded-[8px] bg-[#633CFF] text-white font-semibold text-[16px] 
      hover:bg-[#532DD1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          {/* Start New Session Button */}
          <button
            onClick={() => {
              localStorage.removeItem("devlinks_profileDetails");
              localStorage.removeItem("devlinks_savedLinks");
              window.location.reload(); // refresh page for a clean slate
            }}
            className="mt-4 lg:mt-0 w-[311px] md:w-[150px] h-[46px] py-[11px] px-[16px]
      border-0 rounded-[8px] bg-gray-200 text-gray-800 font-semibold text-[16px] 
      hover:bg-gray-300 transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>

      {/* iPhone Preview with Overlay */}
      <div className="lg:absolute bottom-[58px] left-25 hidden lg:block">
        <div className="relative">
          <img src={iphone} alt="iPhone mockup" />

          {/* Saved Links Overlay - positioned over the link areas in the iPhone image */}
          <div className="absolute top-[44%] left-[11%] right-[11%] flex flex-col gap-y-[20px]">
            {savedLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-[11px] rounded-lg text-white transition-transform hover:scale-105"
                style={{
                  backgroundColor: getPlatformColor(link.platform),
                  height: "44px",
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
