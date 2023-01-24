<?php

namespace AscentCreative\Files\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class File extends Model
{
    use HasFactory;

    public $table = 'files_files';

    public $fillable = ['disk', 'hashed_filename', 'original_filename', 'mime_type', 'attachedto_type', 'attachedto_id', 'attachedto_key', 'attachedto_sort'];

}
