// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignupProps {
  onAuth: (user: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
}

export default function Signup({ onAuth }: SignupProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const username = email.split("@")[0];

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("authenticated", "true");
      if (data.token) localStorage.setItem("token", data.token);

      if (data.user) {
        console.log("[Signup] Saving user to localStorage:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        console.warn("[Signup] No user info returned in response.");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <section className="w-full max-w-md space-y-6 p-6 border rounded-xl bg-background text-foreground">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <form className="space-y-6" onSubmit={handleSignup}>
          {/* Name Row */}
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {isValidEmail(email) && (
              <p className="text-sm text-muted-foreground mt-1">
                Your username will be <strong>{email.split("@")[0]}</strong>
              </p>
            )}
          </div>

          {/* Password */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Error */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Submit */}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="underline"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </p>
      </section>
    </main>
  );
}
