import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Calendar, Clock } from 'lucide-react';

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
    returned_at: string | null;
}

interface ActiveLoansProps {
    loans: Loan[];
}

export default function ActiveLoans({ loans }: ActiveLoansProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Active Loans',
            href: route('student.loans.active'),
        },
    ];
    // Function to check if a loan is overdue
    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    // Function to calculate days remaining or overdue
    const getDaysStatus = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
        } else if (diffDays === 0) {
            return { text: 'Due today', isOverdue: false };
        } else if (diffDays === 1) {
            return { text: '1 day remaining', isOverdue: false };
        } else {
            return { text: `${diffDays} days remaining`, isOverdue: false };
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Active Loans" />

            <div className="container py-6">
                <h1 className="mb-8 text-3xl font-bold">My Active Loans</h1>

                {loans.length > 0 ? (
                    <div className="space-y-6">
                        {/* Overdue loans warning */}
                        {loans.some((loan) => isOverdue(loan.due_at)) && (
                            <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4">
                                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                                <div>
                                    <h3 className="font-medium text-red-800">Overdue Books</h3>
                                    <p className="mt-1 text-sm text-red-700">
                                        You have one or more overdue books. Please return them as soon as possible to avoid penalties.
                                    </p>
                                </div>
                            </div>
                        )}

                        {loans.map((loan) => {
                            const status = getDaysStatus(loan.due_at);

                            return (
                                <Card key={loan.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="grid gap-4 md:grid-cols-4">
                                            <div className="p-6 md:col-span-3">
                                                <div className="flex gap-4">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                        <BookOpen className="h-6 w-6 text-blue-600" />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-lg font-semibold">{loan.book.name}</h3>
                                                        <p className="text-gray-500">{loan.book.author}</p>

                                                        <div className="mt-4 flex flex-wrap gap-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm">
                                                                    Borrowed: {new Date(loan.borrowed_at).toLocaleDateString()}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                <span className="text-sm">Due: {new Date(loan.due_at).toLocaleDateString()}</span>
                                                            </div>

                                                            <Badge
                                                                className={status.isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
                                                            >
                                                                {status.text}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-gray-50 p-6 md:flex-col md:justify-center md:border-l md:p-4">
                                                <Link href={route('student.books.show', loan.book.id)}>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Book
                                                    </Button>
                                                </Link>

                                                {loan.book.type === 'file' && loan.book.file_path && (
                                                    <Link href={route('student.books.download', loan.book.id)} className="mt-2">
                                                        <Button variant="ghost" size="sm" className="w-full">
                                                            Download
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center py-12">
                            <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-xl font-medium">No Active Loans</h3>
                            <p className="mb-6 text-center text-gray-500">You don't have any books currently on loan.</p>
                            <Link href={route('student.books')}>
                                <Button>Browse Books</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
