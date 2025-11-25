import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Customize from "./pages/Customize";
import ProfileDetails from "./pages/ProfileDetails";
import Preview from "./pages/Preview";
import PublicPreview from "./pages/PublicPreview";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Customize />} />
          <Route path="/profiledetails" element={<ProfileDetails />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/shared" element={<PublicPreview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
