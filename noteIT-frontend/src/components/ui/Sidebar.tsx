import { LogoIcon } from "../../icons/LogoIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SidebarItem } from "./SideBarItems";

export function Sidebar() {
    return (
        <div className="h-screen w-72 fixed left-0 top-4 bg-white shadow-2xl rounded-3xl p-6 flex flex-col gap-6 transition-all duration-300">
            <div className="flex items-center text-3xl font-semibold text-gray-800">
                <div className="pr-3 text-purple-600">
                    <LogoIcon />
                </div>
                noteIT
            </div>
            <div className="pt-4 flex flex-col gap-3">
                <SidebarItem text="Twitter" icon={<TwitterIcon />} />
                <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
            </div>
        </div>
    );
}
