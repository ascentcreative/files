<?php

namespace AscentCreative\Files\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Image extends Model
{
    use HasFactory;

    public $table = 'images_images';

    public $fillable = ['disk', 'hashed_filename', 'original_filename', 'mime_type', 'imageable_type', 'imageable_id', 'imageable_key', 'imageable_sort'];

}
