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

Route::get('/search-comics', [ComicController::class, 'search']);

//comment
Route::get('/chapters/{chapterId}/comments', [CommentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // Comment
    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    //reading history
    Route::get('/reading-history', [ReadingHistoryController::class, 'index']);
    Route::post('/reading-history', [ReadingHistoryController::class, 'store']);

    //bookmark
    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/bookmarks', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks/{id}', [BookmarkController::class, 'destroy']);
});

// Public Announcements
Route::get('/announcements', [AnnouncementController::class, 'indexUser']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'showUser']);

// Public Comics and Chapters
Route::get('/last-chapters', [ComicController::class, 'latestChapter']);

Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirect']);
Route::get('/auth/google/callback', [AuthController::class, 'callback']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    Route::put('/user', function (Request $request) {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'bio' => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->update($request->only(['name', 'email', 'username', 'bio']));

        return response()->json(['user' => $user]);
    });

    Route::post('/change-password', function (Request $request) {
        $user = $request->user();

        $request->validate([
            'current' => 'required',
            'new' => 'required|min:6',
            'confirm' => 'required|same:new',
        ]);

        if (!Hash::check($request->current, $user->password)) {
            return response()->json(['message' => 'Password lama tidak cocok'], 422);
        }

        $user->password = Hash::make($request->new);
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah']);
    });
});

// Logout
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});

