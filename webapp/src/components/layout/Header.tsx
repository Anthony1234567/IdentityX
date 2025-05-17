// src/components/Header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function Header() {
  const navigate = useNavigate();
  const user = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background text-foreground">
      <h1 className="text-lg font-semibold">IdentityX</h1>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          onClick={() => navigate("/settings")}
        >
          <Settings className="w-5 h-5" />
        </Button>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user?.username?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80 p-4 space-y-4 bg-background text-foreground">
            <div className="flex justify-center relative">
              <p className="text-sm font-medium">{user?.email}</p>
              <button
                className="absolute right-0"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl">
                  {user?.username?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold">Hi, {user?.firstName}!</p>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  navigate("/account");
                  setOpen(false);
                }}
              >
                Manage Account
              </Button>
            </div>

            <div className="mt-4">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
