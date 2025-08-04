<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comic;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'bookmarks' => $user->bookmarks()->with('genres')->get(),
            'readlist' => $user->readlists()->with('genres')->get(),
            'history' => $user->histories()->with('genres')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'comic_id' => 'required|exists:comics,id',
            'type' => 'required|in:bookmark,readlist,history',
        ]);

        $comicId = $request->comic_id;
        $type = $request->type;

        if ($type === 'bookmark') {
            if ($user->bookmarks()->where('comic_id', $request->comic_id)->exists()) {
                return response()->json(['message' => 'Sudah ada di Bookmark'], 409);
            }
            $user->bookmarks()->syncWithoutDetaching([$request->comic_id]);
        }
        elseif ($type === 'readlist') {
            if ($user->readlists()->where('comic_id', $request->comic_id)->exists()) {
                return response()->json(['message' => 'Sudah ada di Readlist'], 409);
            }
            $user->readlists()->syncWithoutDetaching([$request->comic_id]);
        }
        elseif ($type === 'history') {
            if ($user->histories()->where('comic_id', $request->comic_id)->exists()) {
                return response()->json(['message' => 'Sudah ada di History'], 409);
            }
            $user->histories()->syncWithoutDetaching([$request->comic_id]);
        }


        return response()->json(['message' => 'Berhasil ditambahkan ke library.']);
    }

    public function destroy(Request $request, Comic $comic)
    {
        $request->validate([
            'type' => 'required|in:bookmark,readlist,history',
        ]);

        $type = $request->type;
        $user = $request->user();

        if ($type === 'bookmark') {
            $user->bookmarks()->detach($comic->id);
        } elseif ($type === 'readlist') {
            $user->readlists()->detach($comic->id);
        } elseif ($type === 'history') {
            $user->histories()->detach($comic->id);
        }

        return response()->json(['message' => 'Berhasil dihapus dari library.']);
    }
}
