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
            ->orderBy('created_at', 'asc') // atau latest() untuk terbaru
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'chapter_id' => 'required|exists:chapters,id',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'chapter_id' => $request->chapter_id,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
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
