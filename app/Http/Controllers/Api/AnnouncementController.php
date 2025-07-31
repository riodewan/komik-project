<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index()
    {
        return response()->json(
            Announcement::orderByDesc('published_at')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string|min:10',
        ]);

        $announcement = Announcement::create([
            'title'        => $request->title,
            'content'      => $request->content,
            'published_at' => now(),
        ]);

        return response()->json($announcement, 201);
    }

    public function show($id)
    {
        return response()->json(Announcement::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string|min:10',
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update([
            'title'        => $request->title,
            'content'      => $request->content,
            'published_at' => now(),
        ]);

        return response()->json($announcement);
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json(['message' => 'Pengumuman berhasil dihapus']);
    }

    public function indexUser()
    {
        return response()->json(
            Announcement::orderByDesc('published_at')->get()
        );
    }

    public function showUser($id)
    {
        return response()->json(Announcement::findOrFail($id));
    }
}
