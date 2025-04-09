import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash } from 'lucide-react';
import React from 'react';

interface Student {
    id: number;
    code: string;
    user: {
        name: string;
        email: string;
    };
    active_loans_count: number;
}

interface Props {
    students: Student[];
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
];

const StudentsList: React.FC<Props> = ({ students, can }) => {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this student?')) {
            router.delete(route('admin.students.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Students Management</h1>
                    {can.create && (
                        <Link href={route('admin.students.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Student
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Registration Number</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Active Loans</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.code}</TableCell>
                                    <TableCell>{student.user.name}</TableCell>
                                    <TableCell>{student.user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.active_loans_count > 0 ? 'default' : 'secondary'}>{student.active_loans_count}</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={route('admin.students.show', student.id)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {can.edit && (
                                            <Link href={route('admin.students.edit', student.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can.delete && (
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(student.id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {students.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                        No students found
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

export default StudentsList;
