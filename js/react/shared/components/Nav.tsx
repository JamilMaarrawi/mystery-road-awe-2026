import { NavLink, useMatch } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", end: true },
  { path: "/evidence", label: "Evidence", end: true },
  { path: "/people", label: "People & Locations", end: false },
  { path: "/timeline", label: "Timeline", end: true },
  { path: "/workspace", label: "Workspace", end: true },
] as const;

export function Nav() {
  const isLocationsRoute = useMatch("/locations");

  return (
    <nav className="main-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            isActive || (item.path === "/people" && isLocationsRoute) ? "nav-btn active" : "nav-btn"
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
