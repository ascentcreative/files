<?php

return [

    // nothing here yet...
    'converters' => [
        'application/pdf' => [
            'image/jpg' => \AscentCreative\Files\Converters\PdfToJpg::class,
        ]
        ],
    
    // 'blocked_extensions' => [
    //     bat|exe|cmd|sh|php([0-9])?|pl|cgi|386|dll|com|torrent|js|app|jar|pif|vb|vbscript|wsf|asp|cer|csr|jsp|drv|sys|ade|adp|bas|chm|cpl|crt|csh|fxp|hlp|hta|inf|ins|isp|jse|htaccess|htpasswd|ksh|lnk|mdb|mde|mdt|mdw|msc|msi|msp|mst|ops|pcd|prg|reg|scr|sct|shb|shs|url|vbe|vbs|wsc|wsf|wsh
    // ]

    'allowed_extensions' => [

    ]

];
