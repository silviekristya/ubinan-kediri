import { FaChevronLeft } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: (open: boolean) => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => setIsOpen && setIsOpen(!isOpen)}
        className="rounded-md w-8 h-8"
        variant="outline"
        size="icon"
      >
        <FaChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
