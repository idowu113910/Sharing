import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PiImage } from "react-icons/pi";
import NavBar from "../components/NavBar";
import { TbBrandGithub } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import sav from "../assets/succ img.svg";
import toast from "react-hot-toast";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    let success = false;

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newErrors = {};
      if (!firstName.trim()) newErrors.firstName = "Can't be empty";
      if (!lastName.trim()) newErrors.lastName = "Can't be empty";
      if (!email.trim()) newErrors.email = "Can't be empty";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) newErrors.email = "Invalid email";
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        console.warn("Validation failed, not saving", newErrors);
        toast.error("Please fix the errors before saving");
        return;
      }

      // NOTE: this page only saves profile details (name/email/image).
      // It must NOT touch "devlinks_savedLinks" — that's owned entirely
      // by the Customize page. Overwriting it here was the bug that
      // clobbered a properly-saved WhatsApp/etc. link back to the
      // draft list's default "GitHub" placeholder.
      try {
        const profileObj = {
          firstName,
          lastName,
          email,
          profileImage: profileImage || null,
        };
        localStorage.setItem(
          "devlinks_profileDetails",
          JSON.stringify(profileObj),
        );
        setSavedProfile(profileObj);
        toast.success("Profile Updated Successfully");
        success = true;
        navigate("/preview");
      } catch (err) {
        console.error("Error saving profile details:", err);
        toast.error("Failed to save profile details");
      }
    } catch (err) {
      console.error("Unexpected error in handleSave:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
      if (success) {
        setTimeout(() => {
          setSaveMessage("Your changes have been successfully saved!");
          setTimeout(() => setSaveMessage(""), 3000);
        }, 3000);
      }
    }
  };

  const inputRef = useRef(null);

  function openPicker() {
    inputRef.current?.click();
  }

  const [savedLinks, setSavedLinks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("devlinks_savedLinks");
    if (saved) {
      setSavedLinks(JSON.parse(saved));
    }

    const profileData = localStorage.getItem("devlinks_profileDetails");
    if (profileData) {
      setSavedProfile(JSON.parse(profileData));
    }
  }, []);

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
    };
    return icons[platform];
  };

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("devlinks_profileImage") || null,
  );

  const handleFileChangee = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target.result);
      localStorage.setItem("devlinks_profileImage", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const [savedProfile, setSavedProfile] = useState(() => {
    const raw = localStorage.getItem("devlinks_profileDetails");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const img = localStorage.getItem("devlinks_profileImage");
    if (img) {
      setProfileImage(img);
    }

    const raw = localStorage.getItem("devlinks_profileDetails");
    if (raw) setSavedProfile(JSON.parse(raw));
  }, []);

  return (
    <div className="min-h-dvh w-full bg-white overflow-x-hidden">
      <NavBar />

      <div className="mx-auto w-full max-w-[1150px] px-4 tablet-min:px-6 laptop-min:px-10 desktop:px-0 min-[1360px]:relative">
        <div className="min-[1360px]:max-w-[650px] min-[1360px]:ml-auto">
          {/* Heading */}
          <div className="flex flex-col gap-y-2 py-6 tablet-min:py-8 laptop-min:py-10">
            <h4 className="text-[22px] tablet-min:text-[28px] laptop-min:text-[32px] font-bold text-[#333333]">
              Profile Details
            </h4>
            <h6 className="font-normal text-[#737373] text-[14px] tablet-min:text-[16px] tablet-min:tracking-wide">
              Add your details to create a personal touch to your profile.
            </h6>
          </div>

          {/* Profile picture card */}
          <div className="p-4 tablet-min:p-5 laptop-min:p-[20px] rounded-[12px] border border-[#EFEFEF] w-full flex flex-col tablet-min:flex-row tablet-min:items-start tablet-min:justify-between gap-y-4 tablet-min:gap-x-4">
            <h2 className="text-[14px] tablet-min:text-[16px] font-normal text-[#737373]">
              Profile picture
            </h2>

            <div className="flex flex-col tablet-min:flex-row items-start gap-4 tablet-min:gap-6">
              {/* Upload box */}
              <div
                onClick={openPicker}
                className="rounded-[12px] w-[160px] h-[160px] tablet-min:w-[193px] tablet-min:h-[193px] bg-[#EFEBFF]
       flex items-center justify-center cursor-pointer overflow-hidden relative group flex-shrink-0"
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
                    <PiImage className="w-[32px] h-[32px] tablet-min:w-[40px] tablet-min:h-[40px]" />
                    <p className="text-[14px] tablet-min:text-[16px] font-semibold">
                      + Upload Image
                    </p>
                  </div>
                )}

                {profileImage && (
                  <div className="w-full h-full relative">
                    <img
                      src={profileImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <PiImage className="w-[28px] h-[28px] tablet-min:w-[32px] tablet-min:h-[32px] text-white" />
                      <p className="text-white text-[13px] tablet-min:text-[14px] font-medium">
                        Change Image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="font-normal text-[12px] text-[#737373] max-w-[280px]">
                Image must be below 1024x1024px. Use PNG or JPG format.
              </p>
            </div>
          </div>

          {/* Details form */}
          <div className="w-full rounded-[12px] border border-[#EFEFEF] p-4 tablet-min:p-5 laptop-min:p-[20px] mt-8">
            {/* FIRST NAME */}
            <div className="flex flex-col tablet-min:flex-row tablet-min:items-center tablet-min:justify-between gap-2 tablet-min:gap-4">
              <p className="font-normal text-[12px] tablet-min:text-[14px] laptop-min:text-[16px] text-[#333333] tablet-min:text-[#888888] tablet-min:flex-shrink-0 tablet-min:w-[80px]">
                First name*
              </p>

              <div className="relative w-full">
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
              w-full shadow-[0_0_32px_0_rgba(217,217,217,0.5)]
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
            <div className="mt-4 flex flex-col tablet-min:flex-row tablet-min:items-center tablet-min:justify-between gap-2 tablet-min:gap-4">
              <p className="font-normal text-[12px] tablet-min:text-[14px] laptop-min:text-[16px] text-[#333333] tablet-min:text-[#888888] tablet-min:flex-shrink-0 tablet-min:w-[80px]">
                Last name*
              </p>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="e.g. Appleseed"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName)
                      setErrors({ ...errors, lastName: null });
                  }}
                  className={`border-[1px] py-[12px] px-[16px] rounded-[8px] h-[48px]
              w-full
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
            <div className="mt-4 flex flex-col tablet-min:flex-row tablet-min:items-center tablet-min:justify-between gap-2 tablet-min:gap-4">
              <p className="font-normal text-[12px] tablet-min:text-[14px] laptop-min:text-[16px] text-[#333333] tablet-min:text-[#888888] tablet-min:flex-shrink-0 tablet-min:w-[80px]">
                Email*
              </p>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="e.g. email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`border-[1px] py-[12px] px-[16px] rounded-[8px] h-[48px]
              w-full
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

          {/* Save button */}
          <div className="border-t border-t-[#D9D9D9] w-full mx-auto mt-10 flex items-center justify-center tablet-min:justify-end laptop-min:sticky laptop-min:bottom-0 laptop-min:z-50 laptop-min:bg-white laptop-min:py-4 laptop-min:shadow-[0_-2px_8px_rgba(0,0,0,0.05)] transition-opacity duration-300">
            <button
              onClick={handleSave}
              disabled={isSaving || savedLinks.length === 0}
              className="mt-4 laptop-min:mt-0 w-full tablet-min:w-[140px] h-[46px] py-[11px] px-[27px] border-0 rounded-[8px] bg-[#633CFF] text-white font-semibold text-[16px] hover:bg-[#532DD1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Phone preview — desktop only, from 1360px upward, sits on the left */}
        <div className="min-[1360px]:absolute bottom-[58px] left-0 hidden min-[1360px]:block">
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

              {!profileImage && (
                <circle cx="153.5" cy="120" r="48" fill="#EFEFEF" />
              )}

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

      {saveMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-[8px] text-[#FAFAFA] text-[13px] tablet-min:text-[16px] font-medium rounded-[12px] py-[16px] px-[24px] w-[90%] max-w-[406px] h-[56px] bg-[#333333] z-[9999]">
          <img src={sav} alt="Success" className="w-[20px] h-[20px]" />
          <span>{saveMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
