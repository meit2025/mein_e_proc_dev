<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        // Cek apakah pengguna memiliki permission
        if (!Auth::check()) {
            abort(403, 'Unauthorized');
        }

        if (Auth::check()) {
            $hasPermission = Permission::whereIn('name', $permissions)
                ->whereHas('roles', function ($query) {
                    $role = Role::find(Auth::user()->role_id)->pluck('id');
                    $query->whereIn('id', $role);
                })
                ->exists();

            if (!$hasPermission) {
                abort(403, 'Unauthorized');
            }
        }

        return $next($request);
    }
}
