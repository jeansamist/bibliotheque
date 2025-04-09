import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Download, Pencil, Plus, Trash } from 'lucide-react';
import React from 'react';

interface Book {
    id: number;
    name: string;
    author: string;
    year: number;
    type: 'physical' | 'file';
    category: string;
    available: boolean;
    file_path: string | null;
}

interface Category {
    value: string;
    label: string;
}

interface Props {
    books: Book[];
    categories: Category[];
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: '/books',
    },
];

const BookIndex: React.FC<Props> = ({ books, categories, can }) => {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            router.delete(route('admin.books.destroy', id));
        }
    };

    const handleDownload = (id: number) => {
        window.location.href = route('admin.books.download', id);
    };

    const getCategoryLabel = (value: string) => {
        return categories.find((c) => c.value === value)?.label || value;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Books</h1>
                    {can.create && (
                        <Link href={route('admin.books.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Book
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell className="font-medium">{book.name}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.year}</TableCell>
                                    <TableCell>
                                        <Badge variant={book.type === 'physical' ? 'default' : 'secondary'}>
                                            {book.type === 'physical' ? 'Physical' : 'Digital'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getCategoryLabel(book.category)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={book.available ? 'default' : 'destructive'}>
                                            {book.available ? 'Available' : 'Unavailable'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        {can.edit && (
                                            <Link href={route('admin.books.edit', book.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {book.type === 'file' && book.file_path && (
                                            <Button variant="outline" size="sm" onClick={() => handleDownload(book.id)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {can.delete && (
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(book.id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {books.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                                        No books found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
};

export default BookIndex;
