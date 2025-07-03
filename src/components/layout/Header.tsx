
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, LogOut, Loader2, LayoutDashboard, ShieldCheck, User as UserIcon, UserPlus, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, logout, isLoading, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services/loans', label: 'Loans' },
    { href: '/services/ca-services', label: 'CA Services' },
    { href: '/services/government-schemes', label: 'Govt. Schemes' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
  ];
  
  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };


  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const commonLinkClasses = "text-primary hover:text-accent transition-colors font-semibold no-underline";
  const mobileLinkClasses = "block py-3 px-6 text-lg hover:bg-secondary/40";

  return (
    <header className={`bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <nav className="w-full max-w-screen-2xl mx-auto px-6 sm:px-8 py-2 flex justify-between items-center">
        <Link href="/" onClick={() => handleNavClick('/')} className="flex-shrink-0 flex items-center gap-2 no-underline">
          <Image
            src="/rnfintech.png"
            alt="FinTech Logo"
            width={30}
            height={20}
            priority
          />
          <span className="font-bold text-lg text-foreground">FinTech</span>
        </Link>
        <div className="hidden md:flex items-center justify-center flex-grow space-x-3 lg:space-x-6">
          {navLinks.map(link => (
            <Button variant="link" asChild key={link.label} className={commonLinkClasses + " px-2"}>
                <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center flex-shrink-0 space-x-2">
          
          {/* Desktop-only auth state */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoading ? (
              <Button variant="ghost" size="icon" disabled><Loader2 className="w-5 h-5 animate-spin" /></Button>
            ) : currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.fullName}`} alt={currentUser.fullName} />
                      <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background shadow-lg" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {currentUser.isAdmin && (
                       <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                    variant="outline"
                    onClick={() => openAuthModal('login')}
                    className="font-bold border-primary text-primary hover:bg-accent hover:text-accent-foreground hover:border-accent transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                    Login
                </Button>
                <Button
                    onClick={() => openAuthModal('signup')}
                    className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                    Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile-only menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation and user options</SheetDescription>
              <div className="p-6 border-b">
                <Link href="/" onClick={() => handleNavClick('/')} className="flex items-center gap-2 no-underline">
                  <Image
                    src="/rnfintech.png"
                    alt="FinTech Logo"
                    width={30}
                    height={20}
                    priority
                  />
                   <span className="font-bold text-lg text-foreground">FinTech</span>
                </Link>
              </div>
              <nav className="flex flex-col py-2">
                {navLinks.map(link => (
                   <SheetClose asChild key={link.label}>
                        <Link href={link.href} className={`${commonLinkClasses} ${mobileLinkClasses} text-left w-full`}>
                            {link.label}
                        </Link>
                  </SheetClose>
                ))}
                <div className="border-t my-2 mx-6"></div>
                {isLoading ? (
                  <div className="px-6 py-3 text-center"><Loader2 className="w-5 h-5 animate-spin inline-block" /></div>
                ) : currentUser ? (
                   <div className="px-6 py-3 space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">Welcome, {currentUser.fullName}!</p>
                      {currentUser.isAdmin && (
                        <SheetClose asChild>
                          <Button asChild variant="destructive" className="w-full justify-start">
                            <Link href="/admin/dashboard">
                              <ShieldCheck className="mr-2 h-4 w-4"/>
                              Admin Panel
                            </Link>
                          </Button>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                         <Button asChild variant="default" className="w-full justify-start">
                          <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4"/>
                            Dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                         <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/profile">
                            <UserIcon className="mr-2 h-4 w-4"/>
                            Profile
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                          <Button
                              variant="outline"
                              onClick={handleLogout}
                              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive"
                          >
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                          </Button>
                      </SheetClose>
                   </div>
                ) : (
                  <div className="px-6 py-3 space-y-2">
                    <SheetClose asChild>
                      <Button
                        size="lg"
                        onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                        className="w-full justify-start"
                      >
                         <LogIn className="mr-2 h-4 w-4" />
                         Login
                      </Button>
                    </SheetClose>
                     <SheetClose asChild>
                      <Button
                        size="lg"
                        onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 w-full justify-start"
                      >
                         <UserPlus className="mr-2 h-4 w-4" />
                         Sign Up
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
