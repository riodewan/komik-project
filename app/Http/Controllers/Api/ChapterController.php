<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chapter;
use App\Models\ChapterImage;
use App\Models\Comic;
use Illuminate\Support\Facades\Storage;

class ChapterController extends Controller
{
    public function store(Request $request, $comicId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $comic = Comic::findOrFail($comicId);

        $chapter = Chapter::create([
            'comic_id' => $comic->id,
            'title' => $request->title,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store("chapters/{$chapter->id}", 'public');
                ChapterImage::create([
                    'chapter_id' => $chapter->id,
                    'image_path' => $path,
                    'order' => $index
                ]);
            }
        }

        return response()->json([
            'message' => 'Chapter berhasil dibuat',
            'chapter' => $chapter->load('images')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $chapter = Chapter::with('images')->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $chapter->update([
            'title' => $request->title,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store("chapters/{$chapter->id}", 'public');
                ChapterImage::create([
                    'chapter_id' => $chapter->id,
                    'image_path' => $path,
                    'order' => $chapter->images()->count() + $index
                ]);
            }
        }

        return response()->json([
            'message' => 'Chapter berhasil diupdate',
            'chapter' => $chapter->load('images')
        ]);
    }

    public function deleteImage($id)
    {
        $image = ChapterImage::findOrFail($id);
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Gambar chapter dihapus']);
    }


    public function destroy($id)
    {
        $chapter = Chapter::findOrFail($id);
        Storage::disk('public')->deleteDirectory("chapters/{$chapter->id}");
        $chapter->delete();

        return response()->json(['message' => 'Chapter dihapus']);
    }

    public function show($id)
    {
        $chapter = Chapter::with(['images', 'comic'])
            ->findOrFail($id);

        // Ambil semua chapter dari komik ini, urut berdasarkan created_at
        $allChapters = Chapter::where('comic_id', $chapter->comic_id)
            ->orderBy('created_at')
            ->get();

        // Temukan index chapter saat ini
        $currentIndex = $allChapters->search(function ($ch) use ($chapter) {
            return $ch->id == $chapter->id;
        });

        // Siapkan previous dan next
        $previous = $currentIndex > 0 ? $allChapters[$currentIndex - 1] : null;
        $next = $currentIndex < $allChapters->count() - 1 ? $allChapters[$currentIndex + 1] : null;

        return response()->json([
            'id' => $chapter->id,
            'title' => $chapter->title,
            'comic_id' => $chapter->comic_id,
            'images' => $chapter->images->map(function ($img) {
                return [
                    'id' => $img->id,
                    'image_path' => $img->image_path,
                ];
            }),
            'previous_chapter' => $previous ? [
                'id' => $previous->id,
                'title' => $previous->title,
            ] : null,
            'next_chapter' => $next ? [
                'id' => $next->id,
                'title' => $next->title,
            ] : null,
        ]);
    }

}
