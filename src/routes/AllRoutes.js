import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PromptJson from "../pages/PromptJson";

function AllRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} />
       */}
       <Route path="/" element={<PromptJson />} />
    </Routes>
  );
}

export default AllRoutes;
