import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { SubaccountSwitcher } from "./subaccount-switcher";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [location] = useLocation();
  
  // Get the page title based on the current location
  const getPageTitle = () => {
    const path = location === "/" ? "/dashboard" : location;
    const title = path.slice(1).charAt(0).toUpperCase() + path.slice(2);
    return title;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-neutral-500 hover:bg-gray-100 mr-2"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
          <SubaccountSwitcher />
          <Separator orientation="vertical" className="mx-4 h-8" />
          <h1 className="text-xl font-semibold text-neutral-800">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              <i className="ri-search-line"></i>
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  alert('Search functionality would trigger here');
                }
              }}
            />
          </div>
          <button 
            className="p-2 rounded-md text-neutral-500 hover:bg-gray-100 relative"
            onClick={() => {
              alert('Notifications panel would open here');
            }}
          >
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger"></span>
          </button>
          <button 
            className="p-2 rounded-md text-neutral-500 hover:bg-gray-100"
            onClick={() => {
              alert('Help center and documentation would open here');
            }}
          >
            <i className="ri-question-line text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
