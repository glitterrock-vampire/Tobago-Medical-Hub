import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton, useAuth } from "@clerk/react";
import logoImg from "@assets/0_Business_Card_1784263553137.png";

const isClerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function AuthControls({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const baseClass = mobile
    ? "inline-flex w-full items-center justify-center rounded-md border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
    : "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary";

  const primaryClass = mobile
    ? "inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
    : "inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90";

  if (!isClerkConfigured) {
    return (
      <Link href="/admin" className={baseClass} onClick={onNavigate}>
        Staff Portal
      </Link>
    );
  }

  return (
    <ClerkAuthControls
      baseClass={baseClass}
      primaryClass={primaryClass}
      mobile={mobile}
      onNavigate={onNavigate}
    />
  );
}

function ClerkAuthControls({
  baseClass,
  primaryClass,
  mobile,
  onNavigate,
}: {
  baseClass: string;
  primaryClass: string;
  mobile: boolean;
  onNavigate?: () => void;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return (
      <>
        <Link href="/admin" className={baseClass} onClick={onNavigate}>
          Admin
        </Link>
        <div className={mobile ? "flex justify-center pt-1" : "flex items-center pl-1"}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/sign-in" className={baseClass} onClick={onNavigate}>
        Sign In
      </Link>
      <Link href="/sign-up" className={primaryClass} onClick={onNavigate}>
        Sign Up
      </Link>
    </>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img src={logoImg} alt="Tobago East Medical Services" className="h-9 w-9 rounded-full object-cover" />
            <span className="hidden font-serif font-bold sm:inline-block text-lg text-primary tracking-tight">
              Tobago East Medical
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Link href="/" className="flex md:hidden items-center space-x-2">
            <img src={logoImg} alt="Tobago East Medical Services" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-serif font-bold text-lg text-primary tracking-tight">
              TEMS
            </span>
          </Link>
          <div className="flex md:hidden items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <AuthControls />
            <Link href="/book" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background">
          <div className="container py-4 flex flex-col space-y-4 px-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  location === link.href ? "text-primary" : "text-foreground/60"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/book" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-2 w-full"
              onClick={() => setIsOpen(false)}
            >
              Book Appointment
            </Link>
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <AuthControls mobile onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
