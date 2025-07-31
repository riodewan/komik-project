<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genre;

class GenreController extends Controller
{
    public function index() {
        return response()->json(Genre::all());
    }

    public function store(Request $request) {
        $request->validate(['name' => 'required|string|max:255']);
        $genre = Genre::create(['name' => $request->name]);
        return response()->json($genre, 201);
    }

    public function show($id) {
        return response()->json(Genre::findOrFail($id));
    }

    public function update(Request $request, $id) {
        $request->validate(['name' => 'required|string|max:255']);
        $genre = Genre::findOrFail($id);
        $genre->update(['name' => $request->name]);
        return response()->json($genre);
    }

    public function destroy($id) {
        $genre = Genre::findOrFail($id);
        $genre->delete();
        return response()->json(['message' => 'Genre dihapus']);
    }
}
