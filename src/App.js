import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import "./index.css"
import Dashboad from "./pages/Dashboad";
import Report from "./pages/Report";
import Technition from "./pages/Technition"

function App() {
  return (
    
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path ="/Dashboad" element={<Dashboad />} />
        <Route path ="/Report" element={<Report />} />
        <Route path ="/Technition" element={<Technition/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
