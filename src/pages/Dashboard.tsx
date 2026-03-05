import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/">
          <h1 className="font-display text-xl text-primary">
            Shaadi<span className="text-secondary">.</span>Digital
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-muted-foreground hidden md:block">
            {user?.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="rounded-none font-body gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </Button>
        </div>
      </header>

      <main className="container py-12 px-4 md:px-8">
        <h2 className="font-display text-3xl text-foreground mb-2">Your Dashboard</h2>
        <p className="font-body text-muted-foreground mb-10">Manage your wedding invitations</p>

        {/* Empty state */}
        <div className="border-2 border-dashed border-border bg-card flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 bg-secondary/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="font-display text-xl text-foreground mb-2">Create Your First Invite</h3>
          <p className="font-body text-sm text-muted-foreground mb-6 text-center max-w-sm">
            Browse our template gallery and pick the perfect design for your wedding invitation.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-body">
            <Link to="/templates">Browse Templates</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
