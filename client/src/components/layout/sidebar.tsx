import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
}

const Sidebar = ({ open, setOpen, isMobile }: SidebarProps) => {
  const [location] = useLocation();

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <aside 
      className={cn(
        "sidebar bg-white shadow-lg flex flex-col fixed lg:relative h-full z-20 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20",
        isMobile && !open && "-translate-x-full"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-xl">C</div>
          {open && <span className="font-semibold text-xl text-neutral-800">ConnectCRM</span>}
        </div>
        <button 
          onClick={() => setOpen(!open)} 
          className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="px-2 space-y-1">
          <li className="relative">
            <Link 
              href="/dashboard" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/dashboard" || location === "/" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-dashboard-line text-xl mr-3"></i>
              {open && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/contacts" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/contacts" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-contacts-line text-xl mr-3"></i>
              {open && <span>Contacts & Leads</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/pipeline" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/pipeline" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-git-branch-line text-xl mr-3"></i>
              {open && <span>Pipeline</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/campaigns" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/campaigns" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-megaphone-line text-xl mr-3"></i>
              {open && <span>Campaigns</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/funnels" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/funnels" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-filter-line text-xl mr-3"></i>
              {open && <span>Funnel Builder</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/automation" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/automation" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-settings-3-line text-xl mr-3"></i>
              {open && <span>Automation</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/messaging" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/messaging" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-message-3-line text-xl mr-3"></i>
              {open && <span>Messaging</span>}
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/calendar" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/calendar" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-calendar-line text-xl mr-3"></i>
              {open && <span>Calendar</span>}
            </Link>
          </li>
          
          {open && (
            <li className="relative mt-4">
              <div className="px-3 mb-2 text-xs font-semibold uppercase text-neutral-400">
                Settings
              </div>
            </li>
          )}
          
          <li className="relative">
            <Link 
              href="/settings" 
              onClick={closeSidebarOnMobile}
              className={cn(
                "flex items-center p-3 rounded-lg",
                location === "/settings" 
                  ? "text-primary bg-blue-50 font-medium" 
                  : "text-neutral-500 hover:text-primary hover:bg-blue-50"
              )}
            >
              <i className="ri-settings-line text-xl mr-3"></i>
              {open && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
            <i className="ri-user-line text-neutral-600"></i>
          </div>
          {open && (
            <>
              <div>
                <p className="font-medium text-sm">Alex Johnson</p>
                <p className="text-xs text-neutral-500">Administrator</p>
              </div>
              <button className="ml-auto text-neutral-400 hover:text-neutral-600">
                <i className="ri-logout-box-r-line"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
