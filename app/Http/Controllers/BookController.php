<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Enums\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\CheckRole;

class BookController extends Controller
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
        $books = Book::all();
        
        return Inertia::render('admin/books/index', [
            'books' => $books,
            'can' => [
                'create' => $this->isAdminOrRoot(),
                'edit' => $this->isAdminOrRoot(),
                'delete' => $this->isAdminOrRoot()
            ],
            'categories' => collect(BookCategory::cases())->map(fn ($category) => [
                'value' => $category->value,
                'label' => $category->label()
            ])
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

        return Inertia::render('admin/books/create', [
            'categories' => collect(BookCategory::cases())->map(fn ($category) => [
                'value' => $category->value,
                'label' => $category->label()
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'year' => 'required|integer|min:1000|max:' . date('Y'),
            'type' => 'required|in:file,physical',
            'category' => 'required|in:' . implode(',', BookCategory::values()),
            'file' => 'nullable|file|mimes:pdf,epub,mobi|max:10240',
            'available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        
        // Handle file upload if type is 'file'
        $filePath = null;
        if ($request->type === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('books', 'public');
            $data['file_path'] = $filePath;
        }
        
        // Set availability (default to true if not provided)
        $data['available'] = $request->has('available') ? $request->available : true;
        
        // Remove the file field as it's not in the model
        if (isset($data['file'])) {
            unset($data['file']);
        }

        Book::create($data);

        return redirect()->route('books.index')->with('success', 'Book created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        return Inertia::render('admin/books/show', [
            'book' => $book,
            'can' => [
                'edit' => $this->isAdminOrRoot(),
                'delete' => $this->isAdminOrRoot(),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('admin/books/edit', [
            'book' => $book,
            'categories' => collect(BookCategory::cases())->map(fn ($category) => [
                'value' => $category->value,
                'label' => $category->label()
            ])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'year' => 'required|integer|min:1000|max:' . date('Y'),
            'type' => 'required|in:file,physical',
            'category' => 'required|in:' . implode(',', BookCategory::values()),
            'file' => 'nullable|file|mimes:pdf,epub,mobi|max:10240',
            'available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        
        // Handle file upload if there's a new file
        if ($request->type === 'file' && $request->hasFile('file')) {
            // Delete old file if exists
            if ($book->file_path && Storage::disk('public')->exists($book->file_path)) {
                Storage::disk('public')->delete($book->file_path);
            }
            
            $file = $request->file('file');
            $filePath = $file->store('books', 'public');
            $data['file_path'] = $filePath;
        } elseif ($request->type === 'physical') {
            // If changing from file to physical, remove file path and delete the file
            if ($book->file_path && Storage::disk('public')->exists($book->file_path)) {
                Storage::disk('public')->delete($book->file_path);
            }
            $data['file_path'] = null;
        }
        
        // Set availability
        $data['available'] = $request->has('available') ? $request->available : $book->available;
        
        // Remove the file field as it's not in the model
        if (isset($data['file'])) {
            unset($data['file']);
        }

        $book->update($data);

        return redirect()->route('books.index')->with('success', 'Book updated successfully!');
    }

    /**
     * Download the digital book file.
     */
    public function download(Book $book)
    {
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        if ($book->type !== 'file' || !$book->file_path) {
            abort(404, 'No file available for download.');
        }

        $filePath = Storage::disk('public')->path($book->file_path);
        
        if (!file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        return response()->download($filePath);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        // Check if user has proper permission
        if (!$this->isAdminOrRoot()) {
            abort(403, 'Unauthorized action.');
        }

        // Delete the file if it exists
        if ($book->file_path && Storage::disk('public')->exists($book->file_path)) {
            Storage::disk('public')->delete($book->file_path);
        }

        $book->delete();

        return redirect()->route('books.index')->with('success', 'Book deleted successfully!');
    }
}