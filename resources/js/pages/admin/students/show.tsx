import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface Book {
    id: number;
    name: string;
    author: string;
    type: string;
    available: boolean;
}

interface Student {
    id: number;
    code: string;
    user: {
        name: string;
        email: string;
    };
    active_loans_count: number;
    loans: Array<{
        id: number;
        book: {
            name: string;
            author: string;
        };
        borrowed_at: string;
        due_date: string;
        returned_at: string | null;
    }>;
}

interface Props {
    student: Student;
    availableBooks: Book[];
}

export default function ShowStudent({ student, availableBooks }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        book_id: '',
        due_at: getTwoWeeksFromNow(),
    });
    
    // Helper function to get a date two weeks from now, formatted for HTML date input
    function getTwoWeeksFromNow() {
        const date = new Date();
        date.setDate(date.getDate() + 14); // Add 14 days
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.students.assignBook', student.id), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Students',
            href: route('admin.students.index'),
        },
        {
            title: student.user.name,
            href: route('admin.students.show', student.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Student Details</h1>
                    <div className="flex gap-2">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Loan
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Loan</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="book_id">Select Book</Label>
                                        <Select value={data.book_id} onValueChange={(value) => setData('book_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a book" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableBooks
                                                    .filter((b) => b.type === 'physical')
                                                    .map((book) => (
                                                        <SelectItem key={book.id} value={book.id.toString()}>
                                                            {book.name} - {book.author}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.book_id && <p className="text-sm text-red-500">{errors.book_id}</p>}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="due_at">Due Date</Label>
                                        <Input
                                            id="due_at"
                                            type="date"
                                            value={data.due_at}
                                            onChange={(e) => setData('due_at', e.target.value)}
                                            min={getTwoWeeksFromNow()} // Prevent selecting dates earlier than 2 weeks from now
                                        />
                                        {errors.due_at && <p className="text-sm text-red-500">{errors.due_at}</p>}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button 
                                            type="submit" 
                                            className="w-full" 
                                            disabled={processing || !data.book_id || !data.due_at}
                                        >
                                            Create Loan
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Link href={route('admin.students.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-semibold">Registration Number:</span>
                                <p>{student.code}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Full Name:</span>
                                <p>{student.user.name}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Email:</span>
                                <p>{student.user.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Loan Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <span className="font-semibold">Active Loans:</span>
                                    <Badge className="ml-2" variant={student.active_loans_count > 0 ? 'default' : 'secondary'}>
                                        {student.active_loans_count}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="font-semibold">Total Loans:</span>
                                    <Badge className="ml-2" variant="secondary">
                                        {student.loans.length}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Loan History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-2 text-left">Book</th>
                                            <th className="px-4 py-2 text-left">Author</th>
                                            <th className="px-4 py-2 text-left">Borrowed</th>
                                            <th className="px-4 py-2 text-left">Due Date</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.loans.map((loan) => (
                                            <tr key={loan.id} className="border-b">
                                                <td className="px-4 py-2">{loan.book.name}</td>
                                                <td className="px-4 py-2">{loan.book.author}</td>
                                                <td className="px-4 py-2">{new Date(loan.borrowed_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">{new Date(loan.due_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">
                                                    <Badge variant={loan.returned_at ? 'secondary' : 'default'}>
                                                        {loan.returned_at ? 'Returned' : 'Active'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
