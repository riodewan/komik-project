<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReadingHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\Comic;
use App\Models\Chapter;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReadingHistoryController extends Controller
{
    public function index()
    {
        $history = ReadingHistory::with('comic', 'chapter')
            ->where('user_id', Auth::id())
            ->orderByDesc('read_at')
            ->get();

        return response()->json($history);
    }

    public function store(Request $request)
    {
        $request->validate([
            'comic_id' => 'required|exists:comics,id',
            'chapter_id' => 'required|exists:chapters,id',
        ]);

        $entry = ReadingHistory::create([
            'user_id' => Auth::id(),
            'comic_id' => $request->comic_id,
            'chapter_id' => $request->chapter_id,
        ]);

        return response()->json($entry);
    }
}
