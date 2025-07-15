
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Menu, LogOut, Loader2, LayoutDashboard, ShieldCheck, User as UserIcon, UserPlus, LogIn, ChevronDown,
  Home, User, Briefcase, CreditCardIcon, Cog,
  FileSpreadsheet, BookOpenCheck, Building2, ClipboardCheck, PiggyBank,
  Banknote, Factory, Users, FileQuestion, Sun, Moon
} from 'lucide-react';


const navLinks = [
  { href: '/', label: 'Home' },
  {
    label: 'Loans',
    children: [
      { href: '/apply/home-loan', label: 'Home Loan', description: 'For property purchase', icon: Home },
      { href: '/apply/personal-loan', label: 'Personal Loan', description: 'For personal needs', icon: User },
      { href: '/apply/business-loan', label: 'Business Loan', description: 'For business expansion', icon: Briefcase },
      { href: '/apply/credit-card', label: 'Credit Card', description: 'Offers and rewards', icon: CreditCardIcon },
      { href: '/apply/machinery-loan', label: 'Machinery Loan', description: 'For new equipment', icon: Cog },
    ]
  },
  {
    label: 'CA Services',
    children: [
        { href: "/apply/accounting-bookkeeping", icon: BookOpenCheck, label: "Accounting", description: "Manage finances" },
        { href: "/apply/gst-service", icon: FileSpreadsheet, label: "GST Services", description: "Complete GST solutions" },
        { href: "/apply/company-incorporation", icon: Building2, label: "Incorporation", description: "Register your company" },
        { href: "/apply/audit-assurance", icon: ClipboardCheck, label: "Audit & Assurance", description: "Ensure accuracy" },
        { href: "/apply/itr-filing", icon: FileSpreadsheet, label: "ITR Filing", description: "Expert ITR filing" },
        { href: "/apply/financial-advisory", icon: PiggyBank, label: "Financial Advisory", description: "Strategic advice" },
    ]
  },
  {
    label: 'Govt. Schemes',
    children: [
      { href: '/apply/government-scheme/pm-mudra-yojana', label: 'PM Mudra Yojana', description: 'Loans for micro enterprises', icon: Banknote },
      { href: '/apply/government-scheme/pmegp-khadi-board', label: 'PMEGP', description: 'Credit-linked subsidy', icon: Factory },
      { href: '/apply/government-scheme/stand-up-india', label: 'Stand-Up India', description: 'For SC/ST & women', icon: Users },
      { href: '/apply/government-scheme/other', label: 'Other Scheme', description: 'Apply for another scheme not listed', icon: FileQuestion },
    ]
  }
];

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <Link
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 focus:bg-primary/10",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <div className="text-sm font-medium leading-none">{title}</div>
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"

const ThemeSwitcher = () => {
    const { setTheme, theme } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

const DynamicLogo = () => {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('/lightmode-logo.png');

  useEffect(() => {
    setLogoSrc(resolvedTheme === 'dark' ? '/darkmode-logo.png' : '/lightmode-logo.png');
  }, [resolvedTheme]);

  return (
     <div className="flex items-center gap-2">
        <Image src={logoSrc} alt="RN FinTech Logo" width={30} height={20} priority  />
        <span className="text-xl font-bold text-foreground">RN FinTech</span>
    </div>
  );
};


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser, logout, isLoading, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const commonLinkClasses = "text-foreground hover:text-primary transition-colors font-semibold no-underline";
  const mobileLinkClasses = "flex items-center py-3 px-6 text-lg hover:bg-secondary";

  return (
    <header className={cn(`bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-shadow duration-300`, isScrolled && 'shadow-md')}>
      <nav className="w-full max-w-screen-2xl mx-auto px-6 sm:px-8 py-2 flex justify-between items-center">
        <Link href="/" className="flex-shrink-0 flex items-center gap-2 no-underline">
           <DynamicLogo />
        </Link>
        
        <div className="hidden md:flex items-center justify-center flex-grow space-x-1">
          {navLinks.map((link) =>
            link.children ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className={cn(commonLinkClasses, "px-3")}>
                    {link.label} <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="start">
                   <ul className="grid gap-1 p-2">
                    {link.children.map((child) => (
                      <ListItem key={child.label} href={child.href} title={child.label} icon={child.icon}>
                        {child.description}
                      </ListItem>
                    ))}
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="link" asChild key={link.label} className={cn(commonLinkClasses, "px-3")}>
                <Link href={link.href!}>{link.label}</Link>
              </Button>
            )
          )}
        </div>

        <div className="flex items-center flex-shrink-0 space-x-2">
          {/* Desktop-only auth state */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeSwitcher />
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
                      <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" /><span>Profile</span></Link>
                    </DropdownMenuItem>
                    {currentUser.isAdmin && (
                       <DropdownMenuItem asChild><Link href="/admin/dashboard"><ShieldCheck className="mr-2 h-4 w-4" /><span>Admin Panel</span></Link></DropdownMenuItem>
                    )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => openAuthModal('login')} className="font-bold border-primary text-primary hover:text-primary transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">Login</Button>
                <Button onClick={() => openAuthModal('signup')} className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile-only menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" disabled={isLoading}>{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Menu className="w-6 h-6" />}</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background p-0 flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 no-underline">
                  <DynamicLogo />
                </Link>
                <ThemeSwitcher />
              </div>
              <nav className="flex-grow overflow-y-auto">
                 <Accordion type="multiple" className="w-full">
                  {navLinks.map((link, index) =>
                    link.children ? (
                      <AccordionItem key={link.label} value={`item-${index}`} className="border-b">
                        <AccordionTrigger className={`${commonLinkClasses} ${mobileLinkClasses} justify-between`}>{link.label}</AccordionTrigger>
                        <AccordionContent className="bg-muted/30">
                          <div className="flex flex-col">
                            {link.children.map((child) => (
                              <SheetClose asChild key={child.label}>
                                <Link href={child.href} className="flex items-center gap-3 pl-10 pr-4 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-primary/10">
                                  <child.icon className="w-5 h-5 text-primary" /> {child.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <SheetClose asChild key={link.label}>
                        <Link href={link.href!} className={`${commonLinkClasses} ${mobileLinkClasses} text-left w-full border-b`}>{link.label}</Link>
                      </SheetClose>
                    )
                  )}
                </Accordion>
              </nav>
              <div className="border-t p-4">
                {isLoading ? (
                  <div className="text-center py-3"><Loader2 className="w-5 h-5 animate-spin inline-block" /></div>
                ) : currentUser ? (
                   <div className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-2 px-2">Welcome, {currentUser.fullName}!</p>
                      {currentUser.isAdmin && ( <SheetClose asChild><Button asChild variant="destructive" className="w-full justify-start"><Link href="/admin/dashboard"><ShieldCheck className="mr-2 h-4 w-4"/>Admin Panel</Link></Button></SheetClose> )}
                      <SheetClose asChild><Button asChild variant="default" className="w-full justify-start"><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</Link></Button></SheetClose>
                      <SheetClose asChild><Button asChild variant="outline" className="w-full justify-start"><Link href="/profile"><UserIcon className="mr-2 h-4 w-4"/>Profile</Link></Button></SheetClose>
                      <SheetClose asChild><Button variant="outline" onClick={handleLogout} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</Button></SheetClose>
                   </div>
                ) : (
                  <div className="space-y-2">
                    <SheetClose asChild><Button size="lg" onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }} className="w-full justify-start"><LogIn className="mr-2 h-4 w-4" />Login</Button></SheetClose>
                     <SheetClose asChild><Button size="lg" onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full justify-start"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Button></SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
