// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Lock } from "lucide-react";

interface LoginProps {
  onAuth: (user: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
}

export default function Login({ onAuth }: LoginProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveUsername, setSaveUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignOn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("authenticated", "true");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        console.log("[Login] Saving user to localStorage:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        onAuth(data.user);
      } else {
        console.warn("[Login] No user info returned in response.");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <section className="w-full max-w-sm space-y-6 p-6 border rounded-xl bg-background text-foreground">
        <h1 className="text-2xl font-semibold text-center">IdentityX</h1>

        <form className="space-y-6" onSubmit={handleSignOn}>
          <Input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between">
            <Label htmlFor="save-username">Save Username</Label>
            <Switch
              id="save-username"
              checked={saveUsername}
              onCheckedChange={setSaveUsername}
            />
          </div>

          <Button
            type="submit"
            disabled={!usernameOrEmail || !password || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock size={16} />
                Sign On
              </div>
            )}
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <p>
            <a href="#" className="underline">
              Forgot Username or Password?
            </a>
          </p>
          <p>
            Don’t have an account?{" "}
            <button
              type="button"
              className="underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
