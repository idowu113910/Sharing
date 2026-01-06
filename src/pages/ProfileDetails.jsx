import React, { useEffect, useState } from "react";
import link from "../assets/links.png";
import profile from "../assets/profile-details.png";
import preview from "../assets/preview.png";
import dev from "../assets/dev.png";
import dev2 from "../assets/devlink.png";
import { HiLink } from "react-icons/hi";
import { LuCircleUserRound } from "react-icons/lu";
import { PiImage } from "react-icons/pi";
import { GrFormAdd } from "react-icons/gr";
import iphone from "../assets/phone desktop.svg";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useRef } from "react";
import { TbBrandGithub } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import sav from "../assets/succ img.svg";
import toast from "react-hot-toast";

const ProfileDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [links, setLinks] = useState(() => {
    // Load links from localStorage on initial render
    const savedData = localStorage.getItem("devlinks_links");
    return savedData ? JSON.parse(savedData) : [];
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Add minimum delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms minimum delay
      // 1️⃣ Validation
      const newErrors = {};
      if (!firstName.trim()) newErrors.firstName = "Can't be empty";
      if (!lastName.trim()) newErrors.lastName = "Can't be empty";
      if (!email.trim()) newErrors.email = "Can't be empty";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) newErrors.email = "Invalid email";
      setErrors(newErrors);
      // 2️⃣ Stop saving if there are errors
      if (Object.keys(newErrors).length > 0) {
        console.warn("Validation failed, not saving", newErrors);
        toast.error("Please fix the errors before saving");
        return;
      }
      // 3️⃣ Save links
      try {
        setSavedLinks([...links]);
        localStorage.setItem("devlinks_savedLinks", JSON.stringify(links));
        console.log("Links saved:", links);
      } catch (err) {
        console.error("Error saving links:", err);
        toast.error("Failed to save links");
        return;
      }
      // 4️⃣ Save profile details
      try {
        const profileObj = {
          firstName,
          lastName,
          email,
          profileImage: profileImage || null,
        };
        localStorage.setItem(
          "devlinks_profileDetails",
          JSON.stringify(profileObj)
        );
        setSavedProfile(profileObj);
        console.log("Profile details saved:", profileObj);
        toast.success("Profile Updated Successfully");
      } catch (err) {
        console.error("Error saving profile details:", err);
        toast.error("Failed to save profile details");
      }
    } catch (err) {
      console.error("Unexpected error in handleSave:", err);
      toast.error("An unexpected error occurred");
    } finally {
      // Hide loading state first
      setIsSaving(false);
      // Then show success message after a tiny delay
      setTimeout(() => {
        setSaveMessage("Your changes have been successfully saved!");
        setTimeout(() => setSaveMessage(""), 3000);
      }, 100);
    }
  };

  // ==============================================

  const inputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  // =======================================================

  const [savedLinks, setSavedLinks] = useState([]);

  useEffect(() => {
    // Load saved links for display
    const saved = localStorage.getItem("devlinks_savedLinks");
    if (saved) {
      setSavedLinks(JSON.parse(saved));
    }

    // Load profile details
    const profileData = localStorage.getItem("devlinks_profileDetails");
    if (profileData) {
      setSavedProfile(JSON.parse(profileData));
    }
  }, []);

  // ======================

  // Platform colors
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

  // Platform icons
  const getPlatformIcon = (platform) => {
    const icons = {
      GitHub: <TbBrandGithub className="w-4 h-4" />,
      X: <FaXTwitter className="w-4 h-4" />,
      LinkedIn: <FaLinkedin className="w-4 h-4" />,
      YouTube: <FaYoutube className="w-4 h-4" />,
      Facebook: <FaFacebook className="w-4 h-4" />,
      Instagram: <IoLogoInstagram className="w-4 h-4" />,
      WhatsApp: <FaWhatsapp className="w-4 h-4" />,
    };
    return icons[platform];
  };

  // ====================================================

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("devlinks_profileImage") || null
  );

  const handleFileChangee = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target.result);
      localStorage.setItem("devlinks_profileImage", ev.target.result); // persist
    };
    reader.readAsDataURL(file);
  };

  // =======================================================================

  // profile details state is already present in your code, but add a persisted state for display:
  const [savedProfile, setSavedProfile] = useState(() => {
    const raw = localStorage.getItem("devlinks_profileDetails");
    return raw ? JSON.parse(raw) : null;
  });

  // ensure profileImage is loaded from localStorage if you used key "devlinks_profileImage"
  useEffect(() => {
    const img = localStorage.getItem("devlinks_profileImage");
    if (img) {
      setProfileImage(img); // if you declared setProfileImage earlier
    }

    const raw = localStorage.getItem("devlinks_profileDetails");
    if (raw) setSavedProfile(JSON.parse(raw));
  }, []);

  // =======================================================

  return (
    <div className="md:h-[950px]  h-[1074px] lg:relative">
      <NavBar />
      <div className="lg:relative left-[550px]">
        <div className="flex flex-col p-8 md:p-12 gap-y-[8px] lg:mt-9">
          <h4 className="text-[24px] md:text-[32px] font-bold text-[#333333]">
            Profile Details
          </h4>
          <h6 className="font-normal text-[#737373] text-[16px] w-[295px] md:w-[640px] md:tracking-wide">
            Add your details to create a personal touch to your profile.
          </h6>
        </div>

        <div className="p-[20px] ml-12  lg:gap-[16px]  md:flex md:w-[640px] lg:w-[728px] md:h-[233px] md:justify-between rounded-[12px] gap-y-[12px] border border-[#FAFAFA] w-[295px]">
          <h2 className="text-[16px] font-normal text-[#737373] md:mt-12 ">
            Profile picture
          </h2>

          <div className="md:flex md:gap-[24px] lg:flex items-start">
            {/* Upload box */}
            <div
              onClick={openPicker}
              className="rounded-[12px] w-[193px] h-[193px] bg-[#EFEBFF] mt-5 md:-mt-1 md:ml-[30px] lg:ml-[12px]
       flex items-center justify-center cursor-pointer overflow-hidden relative group"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChangee}
              />

              {!profileImage && (
                <div className="text-[#633CFF] flex flex-col items-center justify-center gap-y-[8px]">
                  <PiImage className="w-[40px] h-[40px]" />
                  <p className="text-[16px] font-semibold">+ Upload Image</p>
                </div>
              )}

              {profileImage && (
                <div className="w-full h-full relative">
                  <img
                    src={profileImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <PiImage className="w-[32px] h-[32px] text-white" />
                    <p className="text-white text-[14px] font-medium">
                      Change Image
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Text beside the box */}
            <p className="font-normal text-[12px] text-[#737373] w-[255px] md:w-[127px] lg:w-[215px] mt-6 md:mt-16">
              Image must be below 1024x1024px. Use PNG or JPG format.
            </p>
          </div>
        </div>

        <div className="w-[295px] md:w-[640px] rounded-[12px] border border-[#FAFAFA] p-[20px] ml-12 mt-10">
          {/* FIRST NAME */}
          <div className="md:flex md:w-[600px] md:justify-between md:-mt-3 -mt-3">
            <p className="font-normal text-[12px] md:text-[16px] text-[#333333] md:text-[#888888] md:mt-4">
              First name*
            </p>

            <div className="relative mt-2">
              <input
                type="text"
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName)
                    setErrors({ ...errors, firstName: null });
                }}
                className={`border-[1px] py-[12px] px-[16px] rounded-[8px] h-[48px]
              w-[255px] md:w-[344px] shadow-[0_0_32px_0_rgba(217,217,217,0.5)]
              ${errors.firstName ? "border-red-500" : "border-[#D9D9D9]"}`}
              />

              {errors.firstName && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-[12px]">
                  {errors.firstName}
                </span>
              )}
            </div>
          </div>

          {/* LAST NAME */}
          <div className="mt-3 md:mt-1.5 md:flex md:w-[600px] md:justify-between">
            <p className="font-normal text-[12px] md:text-[16px] text-[#333333] md:text-[#888888] md:mt-4">
              Last name*
            </p>

            <div className="relative mt-2">
              <input
                type="text"
                placeholder="e.g. Appleseed"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors({ ...errors, lastName: null });
                }}
                className={`border-[1px] py-[12px] px-[16px] rounded-[8px] h-[48px]
              w-[255px] md:w-[344px]
              ${errors.lastName ? "border-red-500" : "border-[#D9D9D9]"}`}
              />

              {errors.lastName && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-[12px]">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className="mt-3 md:mt-1.5 md:flex md:w-[600px] md:justify-between">
            <p className="font-normal text-[12px] md:text-[16px] text-[#333333] md:text-[#888888] md:mt-4">
              Email*
            </p>

            <div className="relative mt-2">
              <input
                type="text"
                placeholder="e.g. email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                className={`border-[1px] py-[12px] px-[16px] rounded-[8px] h-[48px]
              w-[255px] md:w-[344px]
              ${errors.email ? "border-red-500" : "border-[#D9D9D9]"}`}
              />

              {errors.email && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-[12px]">
                  {errors.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-t-[#D9D9D9] w-[343px] md:w-[721px] lg:w-[808px] mx-auto mt-18 lg:mt-0 flex items-center justify-center md:justify-end lg:fixed lg:bottom-0 lg:right-[30px] lg:z-50 lg:bg-white lg:py-4 lg:shadow-[0_-2px_8px_rgba(0,0,0,0.05)] transition-opacity duration-300">
          <button
            onClick={handleSave}
            disabled={isSaving || links.length === 0}
            className="mt-4 lg:mt-0 w-[311px] md:w-[91px] h-[46px] py-[11px] px-[27px] border-0 rounded-[8px] bg-[#633CFF] text-white font-semibold text-[16px] hover:bg-[#532DD1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="lg:absolute bottom-[75px] left-25 hidden lg:block">
        <div className="relative">
          <div className="lg:absolute -bottom-[5px] left-5 hidden lg:block">
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
                  {!profileImage && (
                    <circle cx="153.5" cy="120" r="48" fill="#EFEFEF" />
                  )}

                  {/* Name bar placeholder */}
                  {!savedProfile?.firstName && (
                    <rect
                      x="83.5"
                      y="190"
                      width="140"
                      height="14"
                      rx="7"
                      fill="#EFEFEF"
                    />
                  )}

                  {/* Email bar placeholder */}
                  {!savedProfile?.email && (
                    <rect
                      x="103.5"
                      y="215"
                      width="100"
                      height="10"
                      rx="5"
                      fill="#EFEFEF"
                    />
                  )}

                  {/* Link placeholders */}
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

                {/* SAVED PROFILE IMAGE (exact avatar replacement) */}
                {profileImage && (
                  <div
                    className="absolute rounded-full overflow-hidden"
                    style={{
                      top: "72px",
                      left: "105.5px",
                      width: "96px",
                      height: "96px",
                    }}
                  >
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* SAVED NAME (exact replacement) */}
                {savedProfile?.firstName && (
                  <div
                    className="absolute text-[#333333] text-[18px] font-bold flex items-center justify-center"
                    style={{
                      top: "190px",
                      left: "83.5px",
                      width: "140px",
                      height: "14px",
                      pointerEvents: "none",
                    }}
                  >
                    {savedProfile.firstName} {savedProfile.lastName}
                  </div>
                )}

                {/* SAVED EMAIL (exact replacement) */}
                {savedProfile?.email && (
                  <div
                    className="absolute text-[#737373] text-[14px] flex items-center justify-center font-normal"
                    style={{
                      top: "215px",
                      left: "103.5px",
                      width: "100px",
                      height: "10px",
                      pointerEvents: "none",
                    }}
                  >
                    {savedProfile.email}
                  </div>
                )}

                {/* SAVED LINKS (exact replacement) */}
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

      {saveMessage && (
        <div
          className="flex items-center justify-center mt-4 gap-[8px] relative bottom-[140px] left-[48px] lg:relative lg:left-[500px] lg:top-[3px] md:relative md:left-[150px] md:bottom-15  text-[#FAFAFA] text-[10px] md:text-[16px] font-medium rounded-[12px]
         py-[16px] px-[24px] w-[280px] md:w-[406px] h-[56px]  bg-[#333333] "
        >
          <img
            src={sav} // replace with your icon
            alt="Success"
            className="w-[20px] h-[20px]"
          />
          <span>{saveMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
