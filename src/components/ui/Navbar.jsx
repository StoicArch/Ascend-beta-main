import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (className) => {
    const section = document.querySelector(className);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        {/* LEFT */}
        <div
          className="nav-logo"
          onClick={() => window.scrollTo(0, 0)}
        >
          <span className="logo-main">
            ASCEND
          </span>

          <span className="logo-sub">
            Get A Pump
          </span>
        </div>

        {/* CENTER */}
        <div className="nav-center">

          <button
            onClick={() =>
              scrollToSection(".features")
            }
          >
            Features
          </button>

          <button
            onClick={() =>
              scrollToSection(".pricing")
            }
          >
            Pricing
          </button>

          <button
            onClick={() =>
              scrollToSection(".problem-section")
            }
          >
            Why ASCEND
          </button>

        </div>

        {/* RIGHT */}
        <div className="nav-right">

          <button
            className="login-btn"
            onClick={() => navigate("/auth")}
          >
            Log In
          </button>

          <button
            className="start-btn"
            onClick={() => navigate("/auth")}
          >
            Start Free
          </button>

          {/* MOBILE ICON */}
          <div
            className={`hamburger ${
              mobileOpen ? "active" : ""
            }`}
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          mobileOpen ? "show-mobile" : ""
        }`}
      >
        <button
          onClick={() =>
            scrollToSection(".features")
          }
        >
          Features
        </button>

        <button
          onClick={() =>
            scrollToSection(".pricing")
          }
        >
          Pricing
        </button>

        <button
          onClick={() =>
            scrollToSection(".problem-section")
          }
        >
          Why ASCEND
        </button>

        <button
          className="mobile-cta"
          onClick={() => navigate("/auth")}
        >
          Start Free
        </button>
      </div>
    </>
  );
}