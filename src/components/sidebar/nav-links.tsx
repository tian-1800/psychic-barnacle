"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiHome, FiPaperclip, FiUsers, FiChevronDown, FiChevronRight } from "react-icons/fi";

const Menu = [
  {
    label: "Home",
    Icon: FiHome,
    href: "/",
  },
  {
    label: "Intraday",
    Icon: FiHome,
    href: "/intraday",
  },
  {
    label: "Daily",
    Icon: FiUsers,
    subMenu: [
      { label: "OHLC", href: "/ohlc/daily" },
      { label: "Price Movement", href: "/stock-price/daily" },
    ],
  },
  {
    label: "Weekly",
    Icon: FiPaperclip,
    subMenu: [
      { label: "OHLC", href: "/ohlc/weekly" },
      { label: "Price Movement", href: "/stock-price/weekly" },
    ],
  },
  {
    label: "Monthly",
    Icon: FiPaperclip,
    subMenu: [
      { label: "OHLC", href: "/ohlc/monthly" },
      { label: "Price Movement", href: "/stock-price/monthly" },
    ],
  },
] satisfies {
  label: string;
  Icon: IconType;
  href?: string;
  subMenu?: { label: string; href: string }[];
}[];

const NavLinks = () => {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <ul className="flex flex-col gap-1">
      {Menu.map(({ label, Icon, href, subMenu }) => (
        <li key={label}>
          {href ? (
            <Link
              href={href}
              className={`flex items-center text-sm gap-2 px-2 py-1.5 rounded hover:bg-stone-200 transition-[box-shadow,_background-color,_color] ${
                pathname === href ? "bg-white text-stone-950 shadow" : "hover:bg-stone-200 text-stone-500 shadow-none"
              }`}
            >
              <Icon />
              {label}
            </Link>
          ) : (
            <div className="flex flex-col">
              <div
                className="flex items-center justify-between text-sm gap-2 px-2 py-1.5 rounded text-stone-500 cursor-pointer hover:bg-stone-200"
                onClick={() => toggleSubMenu(label)}
              >
                <div className="flex items-center gap-2">
                  <Icon />
                  {label}
                </div>
                {openSubMenus[label] ? <FiChevronDown /> : <FiChevronRight />}
              </div>
              {openSubMenus[label] && (
                <ul className="ml-4 flex flex-col gap-1">
                  {subMenu?.map(({ label: subLabel, href: subHref }) => (
                    <li key={subHref}>
                      <Link
                        href={subHref}
                        className={`flex items-center text-sm gap-2 px-2 py-1.5 rounded hover:bg-stone-200 transition-[box-shadow,_background-color,_color] ${
                          pathname === subHref
                            ? "bg-white text-stone-950 shadow"
                            : "hover:bg-stone-200 text-stone-500 shadow-none"
                        }`}
                      >
                        {subLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
