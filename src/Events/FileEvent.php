<?php

namespace AscentCreative\Files\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use AscentCreative\Files\Models\File;


class FileEvent //implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $file;
    public $action;

    const FILE_CREATED = 'created';
  

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(File $file, $action)
    {   
        $this->file = $file;
        $this->action = $action;
    }

}
