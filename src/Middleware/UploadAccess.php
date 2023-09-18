<?php

namespace AscentCreative\Files\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Crypt;

class UploadAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        if($token = $request->header('X-UPLOAD-TOKEN')) {
            try {
                $decrypt = Crypt::decryptString($token);
                $ary = explode(':', $decrypt);
                if(session()->get('upload_tokens.' . $ary[0]) == $ary[1]) {
                    return $next($request);
                }
            } catch (\Exception $e) {
                throw new \Illuminate\Auth\AuthenticationException('Invalid Token');
            }
        } else {

            // incorporate AUTH and can:upload-files checks if no token
            if(!auth()->user()) {
                throw new \Illuminate\Auth\AuthenticationException();
            }

            if(!auth()->user()->can('upload-files')) {
                throw new \Illuminate\Auth\AuthenticationException('Permission Error');
            }

        }

        return $next($request);
    }
}
