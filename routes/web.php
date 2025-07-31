<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // Halaman utama
});

// Route fallback untuk admin (SPA React)
Route::get('/{any}', function () {
    return view('admin'); // view ini harus load React SPA
})->where('any', '.*');

