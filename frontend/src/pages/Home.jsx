import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../auth/auth";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      const role = getRole();
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-text-primary">Loading...</h2>
      </div>
    </div>
  );
};

export default Home;
