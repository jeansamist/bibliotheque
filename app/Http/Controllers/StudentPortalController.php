<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Student;
use App\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Middleware\CheckUserRole;

class StudentPortalController extends Controller
{
    /**
     * Constructor to apply middleware
     */
    public function __construct()
    {
        // Apply auth middleware to all methods
        $this->middleware('auth');
        // Apply student role middleware
        $this->middleware(CheckUserRole::class . ':student');
    }

    /**
     * Get the current authenticated student profile
     */
    private function getStudentProfile()
    {
        $user = Auth::user();
        return Student::where('user_id', $user->id)->with('user')->first();
    }

    /**
     * Display the student dashboard
     */
    public function dashboard()
    {
        $student = $this->getStudentProfile();
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        // Get active loans count
        $activeLoansCount = $student->activeLoans()->count();
        
        // Get overdue loans count
        $overdueLoansCount = $student->activeLoans()
            ->where('due_at', '<', now())
            ->count();
            
        // Get recently borrowed books
        $recentLoans = $student->loans()
            ->with('book')
            ->orderBy('borrowed_at', 'desc')
            ->take(5)
            ->get();
            
        // Get recently added books to the library
        $recentBooks = Book::where('available', true)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('student/dashboard', [
            'student' => $student,
            'stats' => [
                'activeLoans' => $activeLoansCount,
                'overdueLoans' => $overdueLoansCount,
            ],
            'recentLoans' => $recentLoans,
            'recentBooks' => $recentBooks,
        ]);
    }

    /**
     * Display the student profile page
     */
    public function profile()
    {
        $student = $this->getStudentProfile();
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        return Inertia::render('student/profile', [
            'student' => $student
        ]);
    }

    /**
     * Update student profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'current_password' => 'required_with:password|password',
            'password' => 'nullable|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        // Update user information
        $user->name = $request->name;
        $user->email = $request->email;
        
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        
        $user->save();

        return back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Display the list of available books
     */
    public function books()
    {
        $books = Book::where('available', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('student/books', [
            'books' => $books
        ]);
    }

    /**
     * Display details of a specific book
     */
    public function bookDetails(Book $book)
    {
        return Inertia::render('student/book-details', [
            'book' => $book,
            'isAvailable' => $book->available,
            'canDownload' => ($book->type === 'file' && !empty($book->file_path))
        ]);
    }

    /**
     * Download a book file if it's a digital book
     */
    public function downloadBook(Book $book)
    {
        // Check if book is digital and has a file
        if ($book->type !== 'file' || empty($book->file_path)) {
            abort(404, 'This book has no downloadable file.');
        }

        // Check if the file exists
        $filePath = storage_path('app/public/' . $book->file_path);
        if (!file_exists($filePath)) {
            abort(404, 'Book file not found.');
        }

        return response()->download($filePath);
    }

    /**
     * Display student's active loans
     */
    public function activeLoans()
    {
        $student = $this->getStudentProfile();
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        $activeLoans = $student->activeLoans()->with('book')->get();

        return Inertia::render('student/active-loans', [
            'loans' => $activeLoans
        ]);
    }

    /**
     * Display student's loan history
     */
    public function loanHistory()
    {
        $student = $this->getStudentProfile();
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        $returnedLoans = $student->returnedLoans()->with('book')->orderBy('returned_at', 'desc')->get();

        return Inertia::render('student/loan-history', [
            'loans' => $returnedLoans
        ]);
    }

    /**
     * Request a book loan
     */
    public function requestLoan(Request $request)
    {
        $student = $this->getStudentProfile();
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        // Check if book is available
        $book = Book::find($request->book_id);
        if (!$book->available) {
            return back()->with('error', 'Book is not available for loan.');
        }

        // Create the loan with default due date (14 days from now)
        $loan = new Loan([
            'book_id' => $request->book_id,
            'borrowed_at' => now(),
            'due_at' => now()->addDays(14),
        ]);

        $student->loans()->save($loan);

        // Mark book as unavailable
        $book->update(['available' => false]);

        return back()->with('success', 'Book loan requested successfully!');
    }
}
