import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

type Subaccount = {
  id: number;
  name: string;
  companyName: string;
  avatarFallback: string;
};

// Sample subaccount data - In a real implementation, this would come from an API call
const subaccounts: Subaccount[] = [
  { 
    id: 0, 
    name: "Main Account", 
    companyName: "Your Company Name", 
    avatarFallback: "YC" 
  },
  { 
    id: 1, 
    name: "ABC Company", 
    companyName: "ABC Corp", 
    avatarFallback: "AC" 
  },
  { 
    id: 2, 
    name: "XYZ Inc", 
    companyName: "XYZ Corporation", 
    avatarFallback: "XY" 
  },
];

// Create a context to handle subaccount state globally
interface SubaccountContextType {
  currentSubaccount: Subaccount;
  subaccounts: Subaccount[];
  switchSubaccount: (subaccountId: number) => void;
  isLoading: boolean;
}

const SubaccountContext = createContext<SubaccountContextType | undefined>(undefined);

export function SubaccountProvider({ children }: { children: ReactNode }) {
  const [currentSubaccount, setCurrentSubaccount] = useState<Subaccount>(subaccounts[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const switchSubaccount = (subaccountId: number) => {
    setIsLoading(true);
    
    // Simulate API call to switch accounts
    setTimeout(() => {
      const newAccount = subaccounts.find(account => account.id === subaccountId);
      if (newAccount) {
        setCurrentSubaccount(newAccount);
        toast({
          title: "Account Switched",
          description: `You are now working in ${newAccount.name}`,
        });
      }
      setIsLoading(false);
    }, 600);
  };

  // Fetch subaccounts on component mount - would be an API call in a real app
  useEffect(() => {
    // This would be an API call in a real app
    // e.g., getSubaccounts().then(data => setSubaccounts(data))
  }, []);

  return (
    <SubaccountContext.Provider
      value={{
        currentSubaccount,
        subaccounts,
        switchSubaccount,
        isLoading
      }}
    >
      {children}
    </SubaccountContext.Provider>
  );
}

// Hook to access the subaccount context
export function useSubaccounts() {
  const context = useContext(SubaccountContext);
  if (context === undefined) {
    throw new Error("useSubaccounts must be used within a SubaccountProvider");
  }
  return context;
}

export function SubaccountSwitcher() {
  const [open, setOpen] = useState(false);
  const { currentSubaccount, subaccounts, switchSubaccount, isLoading } = useSubaccounts();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className="w-auto justify-between px-3 border-gray-200 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-6 w-6 rounded-full bg-primary/20 animate-pulse" />
            ) : (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{currentSubaccount.avatarFallback}</AvatarFallback>
              </Avatar>
            )}
            <span className="truncate">{isLoading ? "Switching..." : currentSubaccount.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search accounts..." className="h-9" />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup heading="Your Accounts">
              {subaccounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.name}
                  onSelect={() => {
                    if (account.id !== currentSubaccount.id) {
                      switchSubaccount(account.id);
                    }
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{account.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground">{account.companyName}</span>
                    </div>
                  </div>
                  
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentSubaccount.id === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <Link href="/settings">
                <CommandItem 
                  className="cursor-pointer py-3 text-primary hover:bg-primary/5 hover:text-primary" 
                  onSelect={() => setOpen(false)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create New Subaccount</span>
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}