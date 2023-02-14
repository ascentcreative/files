<?php

return [

    // nothing here yet...
    'max' => [
        'width'=>2000,
        'height'=>2000,
        'method'=>'preserve_aspect', // 'crop', 'fit'?
        'quality'=>85,
    ],

    'thumb' => [
        'width'=>600,
        'height'=>400,
        'method'=>'crop',
        'quality'=>65,
    ],

    'preview' => [
        'width'=>150,
        'height'=>150,
        'method'=>'preserve_aspect',
        'quality'=>65,
    ]
    
];
