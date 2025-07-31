<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ComicController extends Controller
{
    public function index()
    {
        $comics = \App\Models\Comic::with('genres')->latest()->get();

        return response()->json(['data' => $comics]);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'artist' => 'nullable|string|max:255',
            'type' => 'required|in:Manga,Manhwa,Manhua',
            'status' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'genre_ids' => 'array',
            'genre_ids.*' => 'exists:genres,id'
        ]);

        // ✅ Tambahkan slug otomatis dari title
        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $comic = Comic::create($validated);

        if ($request->has('genre_ids')) {
            $comic->genres()->sync($request->genre_ids);
        }

        return response()->json(['data' => $comic->load('genres')], 201);
    }

    public function update(Request $request, $id)
    {
        $comic = Comic::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'artist' => 'nullable|string|max:255',
            'type' => 'required|in:Manga,Manhwa,Manhua',
            'status' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'genre_ids' => 'array',
            'genre_ids.*' => 'exists:genres,id'
        ]);

        // ✅ generate slug
        $validated['slug'] = \Str::slug($validated['title']);

        if ($request->hasFile('cover_image')) {
            // Hapus cover lama
            if ($comic->cover_image && \Storage::disk('public')->exists($comic->cover_image)) {
                \Storage::disk('public')->delete($comic->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $comic->update($validated);

        if ($request->has('genre_ids')) {
            $comic->genres()->sync($request->genre_ids);
        } else {
            $comic->genres()->sync([]); // kosongkan jika tidak ada genre
        }

        return response()->json(['data' => $comic->load('genres')]);
    }

    public function show($id)
    {
        $comic = Comic::with(['genres', 'chapters' => function($q){
            $q->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        return response()->json(['data' => $comic]);
    }

    public function destroy($id)
    {
        $comic = Comic::findOrFail($id);

        if ($comic->cover_image && Storage::disk('public')->exists($comic->cover_image)) {
            Storage::disk('public')->delete($comic->cover_image);
        }

        $comic->delete();

        return response()->json(['message' => 'Comic deleted successfully']);
    }

    public function latestChapter()
    {
        $comics = Comic::with(['latestChapter'])->get();

        // Filter hanya komik yang memiliki chapter
        $comics = $comics->filter(function ($comic) {
            return $comic->latestChapter !== null;
        })->values();

        return response()->json($comics);
    }
}
