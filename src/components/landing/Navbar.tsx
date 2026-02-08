import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

interface NavbarProps {
  onScrollToBuilder: () => void;
}

const Navbar = ({ onScrollToBuilder }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, displayName, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <nav className="fixed top-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-[100] backdrop-blur-[10px]">
      <div className="flex items-center gap-3 font-heading font-bold text-lg tracking-tight">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>AdGen</span>
      </div>

      <div className="hidden md:flex gap-8">
        <a href="#" className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors duration-300">Platform</a>
        <a href="#" className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors duration-300">Solutions</a>
        <a href="#" className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors duration-300">Pricing</a>
      </div>

      {!loading && (
        <>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={displayName || "User"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium max-w-[120px] truncate hidden sm:inline">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-transparent text-foreground py-2 px-5 rounded-full font-medium text-[13px] border border-[rgba(255,255,255,0.08)] cursor-pointer inline-flex items-center gap-2 transition-all duration-300 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]"
            >
              Sign In
            </button>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
