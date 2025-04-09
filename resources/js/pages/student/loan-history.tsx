import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpDown, BookOpen, Check, Search } from 'lucide-react';
import { useState } from 'react';

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
    returned_at: string;
}

interface LoanHistoryProps {
    loans: Loan[];
}

export default function LoanHistory({ loans }: LoanHistoryProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Loan History',
            href: route('student.loans.history'),
        },
    ];
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'returned_at' | 'book'>('returned_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Filter and sort loans
    const filteredLoans = loans
        .filter(
            (loan) =>
                loan.book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loan.book.author.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
            if (sortBy === 'returned_at') {
                const dateA = new Date(a.returned_at).getTime();
                const dateB = new Date(b.returned_at).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                // Sort by book name
                return sortOrder === 'asc' ? a.book.name.localeCompare(b.book.name) : b.book.name.localeCompare(a.book.name);
            }
        });

    // Toggle sort order
    const handleSort = (columnName: 'returned_at' | 'book') => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(columnName);
            setSortOrder('desc');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loan History" />

            <div className="container py-6">
                <h1 className="mb-8 text-3xl font-bold">My Loan History</h1>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Search by title or author..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {filteredLoans.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Returned Books</CardTitle>
                            <CardDescription>History of all your past book loans</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Borrowed Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead onClick={() => handleSort('returned_at')} className="cursor-pointer">
                                            <div className="flex items-center">
                                                Returned Date
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLoans.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell className="font-medium">
                                                <Link href={route('student.books.show', loan.book.id)}>
                                                    <div className="hover:text-blue-600">
                                                        <div>{loan.book.name}</div>
                                                        <div className="text-sm text-gray-500">{loan.book.author}</div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>{formatDate(loan.borrowed_at)}</TableCell>
                                            <TableCell>{formatDate(loan.due_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                                    {formatDate(loan.returned_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{loan.book.type === 'physical' ? 'Physical' : 'Digital'}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center py-12">
                            <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-xl font-medium">No Loan History</h3>
                            <p className="mb-6 text-center text-gray-500">
                                You haven't returned any books yet. Your loan history will appear here once you've returned books.
                            </p>
                            <Link href={route('student.loans.active')}>
                                <Button variant="outline">View Active Loans</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
