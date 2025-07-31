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
        $chapter = Chapter::with('images')->findOrFail($id);
        // ✅ Pastikan mengirim comic_id agar frontend bisa redirect balik
        return response()->json([
            'id' => $chapter->id,
            'title' => $chapter->title,
            'comic_id' => $chapter->comic_id,
            'images' => $chapter->images
        ]);
    }
}
