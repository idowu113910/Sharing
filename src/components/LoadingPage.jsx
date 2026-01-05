import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetRoute = location.state?.to || "/";

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for network changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Navigate as soon as we’re online
  useEffect(() => {
    if (isOnline) {
      navigate(targetRoute, { replace: true });
    }
  }, [isOnline, navigate, targetRoute]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {isOnline ? (
        <>
          <div className="w-10 h-10 border-4 border-[#633CFF] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#737373]">Loading…</p>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-red-500 mb-2">
            You’re offline
          </p>
          <p className="text-xs text-[#737373]">
            Check your internet connection
          </p>
        </>
      )}
    </div>
  );
};

export default LoadingPage;
