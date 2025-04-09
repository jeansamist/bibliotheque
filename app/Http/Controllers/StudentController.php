<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    /**
     * Constructor to apply middleware
     */
    public function __construct()
    {
        // Apply auth middleware to all methods
        $this->middleware('auth');
    }

    /**
     * Check if user has admin or root role
     *
     * @return bool
     */
    private function isAdminOrRoot()
    {
        return Auth::check() && (Auth::user()->hasRole('admin') || Auth::user()->hasRole('root'));
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with('user')->get();
        
        return Inertia::render('admin/students/index', [
            'students' => $students,
            'can' => [
                'create' => $this->isAdminOrRoot(),
                'edit' => $this->isAdminOrRoot(),
                'delete' => $this->isAdminOrRoot()
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        // Get users that don't have a student profile yet
        $availableUsers = User::whereDoesntHave('student')->get();

        return Inertia::render('admin/students/create', [
            'availableUsers' => $availableUsers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:students,code',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed', // Assure-toi d’avoir password_confirmation dans le form
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // 1. Créer l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'student', // ou une autre valeur selon ta logique
        ]);

        // 2. Créer le profil étudiant lié à l'utilisateur
        Student::create([
            'code' => $request->code,
            'user_id' => $user->id,
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student and user created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        $student = $student->load(['user', 'loans.book']);
        
        // Get available books for loan
        $availableBooks = \App\Models\Book::where('available', true)->get();

        return Inertia::render('admin/students/show', [
            'student' => $student,
            'availableBooks' => $availableBooks,
            'can' => [
                'edit' => $this->isAdminOrRoot(),
                'delete' => $this->isAdminOrRoot(),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        // Load the student with its user relationship
        $student = $student->load('user');

        // Get users that don't have a student profile yet, plus the current student's user
        $availableUsers = User::where('id', $student->user_id)
            ->orWhereDoesntHave('student')
            ->get();

        return Inertia::render('admin/students/edit', [
            'student' => $student,
            'availableUsers' => $availableUsers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:students,code,' . $student->id,
            'user_id' => 'required|exists:users,id|unique:students,user_id,' . $student->id,
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $student->update($validator->validated());

        return redirect()->route('admin.students.index')->with('success', 'Student updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        // Check if student has active loans
        if ($student->activeLoans()->count() > 0) {
            return back()->with('error', 'Cannot delete student with active loans.');
        }

        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student deleted successfully!');
    }

    /**
     * Display loans for the specified student.
     */
    public function loans(Student $student)
    {
        $student->load('loans.book');
        
        return Inertia::render('admin/students/loans', [
            'student' => $student,
            'activeLoans' => $student->activeLoans,
            'returnedLoans' => $student->returnedLoans,
            'can' => [
                'createLoan' => $this->isAdminOrRoot(),
                'returnBook' => $this->isAdminOrRoot(),
            ]
        ]);
    }

    /**
     * Assign a book to a student (create loan).
     */
    public function assignBook(Request $request, Student $student)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'due_at' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if book is available
        $book = \App\Models\Book::find($request->book_id);
        if (!$book->available) {
            return back()->with('error', 'Book is not available for loan.');
        }

        // Create the loan
        $loan = new Loan([
            'book_id' => $request->book_id,
            'borrowed_at' => now(),
            'due_at' => $request->due_at,
        ]);

        $student->loans()->save($loan);

        // Mark book as unavailable
        $book->update(['available' => false]);

        return back()->with('success', 'Book assigned successfully!');
    }

    /**
     * Return a book (update loan).
     */
    public function returnBook(Request $request, Student $student, Loan $loan)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        // Ensure loan belongs to the student
        if ($loan->student_id !== $student->id) {
            abort(403, 'This loan does not belong to the specified student.');
        }

        // Ensure book hasn't been returned already
        if ($loan->returned_at !== null) {
            return back()->with('error', 'This book has already been returned.');
        }

        // Return the book
        $loan->returnBook();

        // Mark book as available again
        $loan->book->update(['available' => true]);

        return back()->with('success', 'Book returned successfully!');
    }
}