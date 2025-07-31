<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CommentController extends Controller
{
    public function index($chapterId)
    {
        $comments = Comment::with('user')
            ->where('chapter_id', $chapterId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $comments]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'chapter_id' => $request->chapter_id,
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'));
    }

    public function destroy($id)
    {
        $comment = Comment::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}
