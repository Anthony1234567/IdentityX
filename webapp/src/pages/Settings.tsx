import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Connection {
  _id: string;
  provider: string;
  accountName: string;
}

export default function Settings() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [newProvider, setNewProvider] = useState("Google");
  const [newAccount, setNewAccount] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/connections", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setConnections)
      .catch(() => toast.error("Failed to load connections"));
  }, []);

  const handleAddConnection = async () => {
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          provider: newProvider,
          accountName: newAccount,
        }),
      });

      if (!res.ok) throw new Error("Failed to add connection");

      toast.success("Connection added successfully");
      setNewAccount("");
      setOpen(false);

      const updated = await res.json();
      setConnections((prev) => [...prev, updated]);
    } catch {
      toast.error("Failed to add connection");
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete connection");

      toast.success("Connection removed");
      setConnections((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to delete connection");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Manage your connected accounts and integrations.
          </p>
        </section>

        <Card className="bg-background text-foreground">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Connected Accounts
            </CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect a New Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <select
                      id="provider"
                      className="w-full border rounded px-3 py-2"
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                    >
                      <option>Google</option>
                      <option>GitHub</option>
                      <option>Slack</option>
                      <option>Discord</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="account">Account Identifier</Label>
                    <Input
                      id="account"
                      placeholder="Enter email or username"
                      value={newAccount}
                      onChange={(e) => setNewAccount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddConnection}>
                    Connect
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No connections yet.
              </p>
            ) : (
              connections.map((conn) => (
                <div
                  key={conn._id}
                  className="flex items-center justify-between border p-3 rounded-lg"
                >
                  <div className="flex flex-col gap-0.5">
                    <Badge variant="secondary">{conn.provider}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {conn.accountName}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(conn._id)}
                  >
                    Disconnect
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
