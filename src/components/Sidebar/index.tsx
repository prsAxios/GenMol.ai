"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import gsap from "gsap";
import {
  LayoutGrid,
  Atom,
  Network,
  Microscope,
  Settings,
  MessageSquareText,
  ChevronLeft,
} from "lucide-react";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "",
    menuItems: [
      {
        icon: <LayoutGrid size={25} />,
        label: "Dashboard",
        route: "/",
      },
      {
        icon: <Atom size={25} />,
        label: "Molecules Bank",
        route: "/molecule-bank",
      },
      {
        icon: <Network size={25} />,
        label: "Model",
        route: "/model",
      },
      {
        icon: <Microscope size={25} />,
        label: "Research",
        route: "/research",
      },
      {
        icon: <MessageSquareText size={25} />,
        label: "Messages",
        route: "/message",
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <Settings size={25} />,
        label: "Settings",
        route: "/settings",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const LogoRef = useRef<HTMLDivElement | null>(null);


  //i dont want fade in fade out animation
  useEffect(() => {

    const el = LogoRef.current;
    gsap.fromTo(el, {
      scale: 0.5,
    }, {
      scale: 1,
      duration: 2,
      ease: "power3.out",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(el, {
      boxShadow: "0 0 0px #00faff",
      filter: "drop-shadow(0 0 20px #00faff)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed  shadow-5xl border-r border-black dark:border-white left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white dark:bg-black-2 duration-300 ease-linear lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <div className="flex flex-row items-center justify-center space-x-2">
              <div ref={LogoRef} className="ml-2 rounded-full  p-1">
                <Image
                  width={32}
                  height={32}
                  src={"/images/logo/mainLogo.png"}
                  alt="Logo"
                  priority
                />
              </div>
              <p className="text-xl font-semibold text-black  dark:text-white">GenMol.ai</p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <ChevronLeft />
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black dark:text-white">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
