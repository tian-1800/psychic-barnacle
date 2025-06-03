"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { FiHome, FiPaperclip, FiUsers } from "react-icons/fi";

const Menu = [
  {
    label: "Intraday",
    Icon: FiHome,
    href: "/intraday",
  },
  {
    label: "Daily",
    Icon: FiUsers,
    href: "/daily",
  },
  {
    label: "Weekly",
    Icon: FiPaperclip,
    href: "/weekly",
  },
  {
    label: "Monthly",
    Icon: FiPaperclip,
    href: "/monthly",
  },
] satisfies {
  label: string;
  Icon: IconType;
  href: string;
}[];

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {Menu.map(({ label, Icon, href }) => (
        <li key={href}>
          <Link
            href={href}
            className={`flex items-center text-sm gap-2 px-2 py-1.5 rounded hover:bg-stone-200 transition-[box-shadow,_background-color,_color] ${
              pathname === href ? "bg-white text-stone-950 shadow" : "hover:bg-stone-200 text-stone-500 shadow-none"
            }`}
          >
            <Icon />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
