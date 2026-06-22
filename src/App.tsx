import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Monitor from "@/pages/Monitor";
import Alerts from "@/pages/Alerts";
import Review from "@/pages/Review";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Monitor />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/review" element={<Review />} />
        </Route>
      </Routes>
    </Router>
  );
}
