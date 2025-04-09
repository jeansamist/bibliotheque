import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Check, Clock, BookOpen, AlertTriangle } from 'lucide-react';

interface Book {
  id: number;
  name: string;
  author: string;
  year: number;
  type: 'physical' | 'file';
  file_path?: string;
  available: boolean;
}

interface Loan {
  id: number;
  book: Book;
  borrowed_at: string;
  due_at: string;
  returned_at?: string;
}

interface Student {
  id: number;
  code: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface Stats {
  activeLoans: number;
  overdueLoans: number;
}

interface DashboardProps {
  student: Student;
  stats: Stats;
  recentLoans: Loan[];
  recentBooks: Book[];
}

export default function Dashboard({ student, stats, recentLoans, recentBooks }: DashboardProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('student.dashboard') }
  ];
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Dashboard" />
      
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-8">Welcome, {student.user.name}</h1>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Student ID</CardTitle>
              <CardDescription>Your unique code</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{student.code}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Loans</CardTitle>
              <CardDescription>Books currently borrowed</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{stats.activeLoans}</p>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overdue</CardTitle>
              <CardDescription>Books past due date</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{stats.overdueLoans}</p>
              <AlertTriangle className={`h-6 w-6 ${stats.overdueLoans > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Useful shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Link href={route('student.profile')}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <span>My Profile</span>
                  </Button>
                </Link>
                <Link href={route('student.loans.active')}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <span>My Loans</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent loans */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Loans</CardTitle>
              <CardDescription>Books you've recently borrowed</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLoans.length > 0 ? (
                <div className="space-y-4">
                  {recentLoans.map((loan) => (
                    <div key={loan.id} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{loan.book.name}</h3>
                        <p className="text-sm text-gray-500">{loan.book.author}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-xs">
                            Due: {new Date(loan.due_at).toLocaleDateString()}
                          </span>
                          {loan.returned_at && (
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" /> Returned
                            </Badge>
                          )}
                          {!loan.returned_at && new Date(loan.due_at) < new Date() && (
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end mt-4">
                    <Link href={route('student.loans.history')}>
                      <Button variant="ghost" size="sm">View All Loans</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">You haven't borrowed any books yet.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recently added books */}
          <Card>
            <CardHeader>
              <CardTitle>New Arrivals</CardTitle>
              <CardDescription>Recently added books to the library</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBooks.length > 0 ? (
                <div className="space-y-4">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-100">
                        <BookOpen className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{book.name}</h3>
                        <p className="text-sm text-gray-500">{book.author} • {book.year}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                          <Link href={route('student.books.show', book.id)}>
                            <Button variant="ghost" size="sm">Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end mt-4">
                    <Link href={route('student.books')}>
                      <Button variant="ghost" size="sm">View All Books</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">No new books have been added recently.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
