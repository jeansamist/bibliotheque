import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Book, BookOpen, Clock, Folder, History, LayoutGrid, UserCircle, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // Common dashboard - shown to all users
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    
    // Admin section - only for admin and root users
    {
        title: 'Books',
        href: '/admin/books',
        icon: Book,
        roles: ['admin', 'root'],
    },
    {
        title: 'Students',
        href: '/admin/students',
        icon: Users,
        roles: ['admin', 'root'],
    },
    
    // Student portal section - only for student users
    {
        title: 'Student Dashboard',
        href: '/student/dashboard',
        icon: LayoutGrid,
        roles: ['student'],
    },
    {
        title: 'My Profile',
        href: '/student/profile',
        icon: UserCircle,
        roles: ['student'],
    },
    {
        title: 'Browse Books',
        href: '/student/books',
        icon: Book,
        roles: ['student'],
    },
    {
        title: 'Active Loans',
        href: '/student/loans/active',
        icon: Clock,
        roles: ['student'],
    },
    {
        title: 'Loan History',
        href: '/student/loans/history',
        icon: History,
        roles: ['student'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
