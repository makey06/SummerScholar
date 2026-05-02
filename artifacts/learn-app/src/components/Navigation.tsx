import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Home, BookOpen, Trophy, User } from "lucide-react";
import { useGetProfile } from "@workspace/api-client-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/categories", icon: BookOpen, label: "Learn" },
  { href: "/achievements", icon: Trophy, label: "Trophies" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Navigation() {
  const [location] = useLocation();
  const profile = useGetProfile();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl">🌟</span>
            <span className="font-fredoka text-xl text-primary hidden sm:block">
              Summer Learning
            </span>
          </motion.div>
        </Link>

        {profile.data && (
          <div className="flex items-center gap-1 bg-secondary/30 rounded-full px-3 py-1">
            <span className="text-lg">{profile.data.avatarEmoji}</span>
            <span className="font-bold text-sm text-foreground">{profile.data.name}</span>
            <span className="text-yellow-500 font-bold text-sm ml-1">⭐{profile.data.totalStars}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid={`nav-${label.toLowerCase()}`}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl cursor-pointer transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-bold">{label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
