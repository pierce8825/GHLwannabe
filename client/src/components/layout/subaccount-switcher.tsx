import { useState } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function SubaccountSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Subaccount>(subaccounts[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between px-3 border-gray-200 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{selectedAccount.avatarFallback}</AvatarFallback>
            </Avatar>
            <span className="truncate">{selectedAccount.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search accounts..." className="h-9" />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup>
              {subaccounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.name}
                  onSelect={() => {
                    setSelectedAccount(account);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
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
                      selectedAccount.id === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}