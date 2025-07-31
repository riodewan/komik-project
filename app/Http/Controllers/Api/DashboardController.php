<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comic;
use App\Models\Chapter;
use App\Models\User;
use App\Models\Genre;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_comics' => \App\Models\Comic::count(),
            'total_chapters' => \App\Models\Chapter::count(),
            'total_users' => \App\Models\User::count(),
            'total_genres' => \App\Models\Genre::count(),
            'latest_comics' => \App\Models\Comic::latest()->take(5)->get(),
            'latest_chapters' => \App\Models\Chapter::with('comic')->latest()->take(5)->get(),
            'chapters_per_month' => \App\Models\Chapter::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                ->whereYear('created_at', now()->year)
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(function ($row) {
                    return [
                        'month' => date('M', mktime(0, 0, 0, $row->month, 1)),
                        'total' => $row->total
                    ];
                })
        ]);
    }

}
