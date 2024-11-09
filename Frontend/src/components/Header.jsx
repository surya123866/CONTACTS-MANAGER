import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Contacts Management</h1>

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden block focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav
          className={`flex-col md:flex-row md:flex ${
            isMenuOpen ? "flex" : "hidden"
          } md:items-center md:space-x-6`}
        >
          <Link to="/" className="block py-2 px-4 hover:bg-blue-700">
            Home
          </Link>
          <Link to="/about" className="block py-2 px-4 hover:bg-blue-700">
            About
          </Link>
          <Link to="/services" className="block py-2 px-4 hover:bg-blue-700">
            Services
          </Link>
          <Link to="/contact" className="block py-2 px-4 hover:bg-blue-700">
            Contact
          </Link>
          <button onClick={Logout}>Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
