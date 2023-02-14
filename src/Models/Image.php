<?php

namespace AscentCreative\Files\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;


class Image extends File
{
    use HasFactory;

    public $table = 'files_files';

    protected static function booted()
    {
        static::addGlobalScope('is_image', function (Builder $builder) {
            $builder->where('mime_type', 'like', 'image/%');
        });
    }

    // public $fillable = ['disk', 'hashed_filename', 'original_filename', 'mime_type', 'attachedto_type', 'attachedto_id', 'attachedto_key', 'imageable_sort'];

}
