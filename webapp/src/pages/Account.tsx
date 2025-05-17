// src/pages/Account.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface UserInfo {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function Account() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return <main className="p-8 text-center">Loading user data...</main>;
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-semibold">Account</h1>
          <p className="text-sm mt-1">View your account details below.</p>
        </section>

        <Card className="bg-background text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </p>
            <p>
              <span className="font-medium">Username:</span> {user.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
