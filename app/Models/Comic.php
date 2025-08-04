<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Genre;

class Comic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'cover_image', 'author', 'artist', 'type','status'
    ];

    public function chapters()
    {
        return $this->hasMany(\App\Models\Chapter::class, 'comic_id', 'id');
    }

    public function genres() {
        return $this->belongsToMany(Genre::class, 'comic_genre');
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function readingHistory()
    {
        return $this->hasMany(ReadingHistory::class);
    }

    public function latestChapter()
    {
        return $this->hasOne(Chapter::class)->latestOfMany();
    }

    public function bookmarkedByUsers()
    {
        return $this->belongsToMany(User::class, 'bookmarks')->withTimestamps();
    }

    public function inReadlistOfUsers()
    {
        return $this->belongsToMany(User::class, 'readlists')->withTimestamps();
    }

    public function inHistoryOfUsers()
    {
        return $this->belongsToMany(User::class, 'histories')->withTimestamps();
    }

}
