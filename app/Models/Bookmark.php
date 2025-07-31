<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $fillable = ['user_id', 'comic_id', 'last_read_chapter_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comic()
    {
        return $this->belongsTo(Comic::class);
    }

    public function lastReadChapter()
    {
        return $this->belongsTo(Chapter::class, 'last_read_chapter_id');
    }
}
