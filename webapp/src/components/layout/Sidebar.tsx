import { Home, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const navItems = [{ path: "/dashboard", icon: Home, label: "Dashboard" }];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false); // manual toggle
  const [hoverActive, setHoverActive] = useState(false); // hover effect after delay
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const isOpen = expanded || hoverActive;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setExpanded(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    // only start hover delay if not manually expanded
    if (!expanded) {
      hoverTimeout.current = setTimeout(() => {
        setHoverActive(true);
      }, 250);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoverActive(false);
  };

  const handleToggle = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoverActive(false); // ensure hover doesn't override click
    setExpanded((prev) => !prev);
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`h-screen border-r transition-all duration-200 bg-background text-foreground flex flex-col ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="my-2 ml-2"
        onClick={handleToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <nav className="flex-1 space-y-1 mt-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-r-full transition-colors ${
                isActive ? "bg-muted text-primary" : "hover:bg-muted"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {isOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
