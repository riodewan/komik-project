<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ComicController;
use App\Http\Controllers\Api\ChapterController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\ReadingHistoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Models\User;
use App\Models\Comic;
use App\Models\Chapter;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 422);
    }

    // Generate token Sanctum
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login success',
        'token' => $token,
        'user' => $user,
    ]);
});

Route::prefix('admin')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('comics', ComicController::class);
    Route::apiResource('announcements', AnnouncementController::class);

    Route::post('/comics/{comic}/chapters', [ChapterController::class, 'store']);
    Route::delete('/chapters/{chapter}', [ChapterController::class, 'destroy']);
    Route::get('/chapters/{chapter}', [ChapterController::class, 'show']);
    Route::put('/chapters/{chapter}', [ChapterController::class, 'update']); // Bisa pakai PUT/PATCH
    Route::delete('/chapters/images/{id}', [ChapterController::class, 'deleteImage']);

    Route::apiResource('genres', GenreController::class);

    // routes/api.php
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/stats', function () {
        return [
            'users' => \App\Models\User::count(),
            'comics' => \App\Models\Comic::count(),
            'chapters' => \App\Models\Chapter::count(),
        ];
    });
});

//bookmark
Route::get('/bookmarks', [BookmarkController::class, 'index']);
Route::post('/bookmarks', [BookmarkController::class, 'store']);
Route::delete('/bookmarks/{id}', [BookmarkController::class, 'destroy']);

//reading history
Route::get('/reading-history', [ReadingHistoryController::class, 'index']);
Route::post('/reading-history', [ReadingHistoryController::class, 'store']);

//comment
Route::get('/chapters/{chapterId}/comments', [CommentController::class, 'index']);
Route::post('/comments', [CommentController::class, 'store']);
Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

// Public Announcements
Route::get('/announcements', [AnnouncementController::class, 'indexUser']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'showUser']);

// Public Comics and Chapters
Route::get('/last-chapters', [ComicController::class, 'latestChapter']);


// Logout
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});

