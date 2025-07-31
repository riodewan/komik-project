<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Genre;

class Comic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'cover_image', 'author', 'artist', 'status'
    ];

    public function chapters()
    {
        return $this->hasMany(\App\Models\Chapter::class, 'comic_id', 'id');
    }

    public function genres() {
        return $this->belongsToMany(Genre::class, 'comic_genre');
    }
}
