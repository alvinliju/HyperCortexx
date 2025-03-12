"use client";
import {cn} from '@/lib/utils'
import { Folder } from "lucide-react";
import Link from 'next/link'
import { usePathname } from 'next/navigation';
const sideBarItemsData = [
  {
    id: 0,
    name: "Startup",
    href: "/dashboard/startup",
    icon: Folder,
  },
  {
    id: 1,
    name: "SystemDesign",
    href: "/dashboard/systemdesign",
    icon: Folder,
  },
  {
    id: 2,
    name: "Whitepapers",
    href: "/dashboard/whitepapers",
    icon: Folder,
  },
];

function SideBarItems() {
    const pathName = usePathname();
  return (
    <>
      {sideBarItemsData.map((item) => (
          <Link className={cn(pathName === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground", "flex items-center gap-2 px-2 py-2 rounded-md transition-all hover:text-primary")} href={item.href} key={item.id}>
            <item.icon/>
            {item.name}
          </Link>
      ))}
    </>
  );
}

export default SideBarItems;
