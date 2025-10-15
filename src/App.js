import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Userdashboard from "./pages/Userdashboad";
import Reporthistory from "./pages/Reporthistory";
import Sidebar from "./compornents/Sidebar";
import Profile from "./pages/Profile"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Userdashboad" element={<Userdashboard />} />
        <Route path="/Reporthistory" element={<Reporthistory />} />
        <Route path="/Sidebar" elemenet={<Sidebar />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
