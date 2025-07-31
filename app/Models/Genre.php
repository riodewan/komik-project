<?php

// app/Models/Genre.php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Comic;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $fillable = ['name'];

    public function comics()
    {
        return $this->belongsToMany(Comic::class, 'comic_genre');
    }
}


