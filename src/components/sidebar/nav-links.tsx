"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiHome,
  FiTrendingUp,
  FiBarChart2,
  FiCalendar,
  FiBriefcase,
  FiDollarSign,
  FiGlobe,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const Menu: {
  group: string;
  items: {
    label: string;
    Icon: IconType;
    href?: string;
    subMenu?: { label: string; href: string }[];
  }[];
}[] = [
  {
    group: "Stock",
    items: [
      {
        label: "Home",
        Icon: FiHome,
        href: "/",
      },
      {
        label: "Intraday",
        Icon: FiTrendingUp,
        href: "/intraday",
      },
      {
        label: "Daily",
        Icon: FiBarChart2,
        subMenu: [
          { label: "OHLC", href: "/ohlc/daily" },
          { label: "Price Movement", href: "/stock-price/daily" },
        ],
      },
      {
        label: "Weekly",
        Icon: FiCalendar,
        subMenu: [
          { label: "OHLC", href: "/ohlc/weekly" },
          { label: "Price Movement", href: "/stock-price/weekly" },
        ],
      },
      {
        label: "Monthly",
        Icon: FiCalendar,
        subMenu: [
          { label: "OHLC", href: "/ohlc/monthly" },
          { label: "Price Movement", href: "/stock-price/monthly" },
        ],
      },
    ],
  },
  {
    group: "Company",
    items: [
      {
        label: "Overview",
        Icon: FiBriefcase, // Briefcase icon for company overview
        href: "/company/overview",
      },
      {
        label: "Earnings",
        Icon: FiDollarSign, // Dollar sign icon for company earnings
        href: "/company/earning",
      },
    ],
  },
  {
    group: "Forex",
    items: [
      {
        label: "Exchange",
        Icon: FiGlobe, // Globe icon for forex exchange
        href: "/forex/exchange",
      },
    ],
  },
];

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
    <ul className="flex flex-col gap-4">
      {Menu.map(({ group, items }) => (
        <li key={group}>
          <h3 className="text-xs font-semibold text-stone-700 uppercase px-2">{group}</h3>
          <ul className="flex flex-col gap-1">
            {items.map(({ label, Icon, href, subMenu }) => (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    className={`flex items-center text-sm gap-2 px-2 py-1.5 rounded hover:bg-stone-200 transition-[box-shadow,_background-color,_color] ${
                      pathname === href
                        ? "bg-white text-stone-950 shadow"
                        : "hover:bg-stone-200 text-stone-500 shadow-none"
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
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
