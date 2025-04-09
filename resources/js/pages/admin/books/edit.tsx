import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import React from 'react';

interface Book {
    id: number;
    name: string;
    author: string;
    year: number;
    type: 'physical' | 'file';
    file_path: string | null;
}

interface Props {
    book: Book;
}

const BookEdit: React.FC<Props> = ({ book }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Books',
            href: '/books',
        },
        {
            title: 'Edit Book',
            href: `/books/${book.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        author: string;
        year: number;
        type: 'physical' | 'file';
        file: File | null;
        _method: string;
    }>({
        name: book.name,
        author: book.author,
        year: book.year,
        type: book.type,
        file: null,
        _method: 'PATCH',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.books.update', book.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Books
                        </Button>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Book</h1>
                    </div>
                    {book.type === 'file' && book.file_path && (
                        <Button variant="outline" onClick={() => (window.location.href = route('admin.books.download', book.id))}>
                            <Download className="mr-2 h-4 w-4" />
                            Download File
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        <div>
                            <Label htmlFor="name">Book Title</Label>
                            <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" type="text" value={data.author} onChange={(e) => setData('author', e.target.value)} className="mt-1" />
                            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                        </div>

                        <div>
                            <Label htmlFor="year">Publication Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={data.year}
                                onChange={(e) => setData('year', parseInt(e.target.value))}
                                className="mt-1"
                            />
                            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                        </div>

                        <div>
                            <Label htmlFor="type">Book Type</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value as 'physical' | 'file')}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select book type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physical">Physical Book</SelectItem>
                                    <SelectItem value="file">Digital File</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

                        {data.type === 'file' && (
                            <div>
                                <Label htmlFor="file">Book File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    accept=".pdf,.doc,.docx"
                                    className="mt-1"
                                />
                                {book.file_path && <p className="mt-1 text-sm text-gray-500">Current file: {book.file_path}</p>}
                                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Update Book
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default BookEdit;
