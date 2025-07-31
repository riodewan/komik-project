<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{

    protected $fillable = [
        'comic_id',
        'title',
    ];

    public function comic()
    {
        return $this->belongsTo(\App\Models\Comic::class, 'comic_id', 'id');
    }


    public function images()
    {
        return $this->hasMany(ChapterImage::class)->orderBy('order');
    }

}
