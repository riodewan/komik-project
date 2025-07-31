<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;
use App\Models\Comic;
use App\Models\Chapter;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BookmarkController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::with('comic', 'lastReadChapter')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($bookmarks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'comic_id' => 'required|exists:comics,id',
        ]);

        $bookmark = Bookmark::updateOrCreate(
            ['user_id' => Auth::id(), 'comic_id' => $request->comic_id],
            ['last_read_chapter_id' => $request->last_read_chapter_id]
        );

        return response()->json($bookmark);
    }

    public function destroy($id)
    {
        $bookmark = Bookmark::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $bookmark->delete();

        return response()->json(['message' => 'Bookmark removed.']);
    }
}
