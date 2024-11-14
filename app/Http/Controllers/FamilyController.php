<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Master\Models\Family as ModelsFamily;

class FamilyController extends Controller
{
    public function show($employee)
    {
        try {
            $data = ModelsFamily::where('user', $employee)->get();
            return $data;
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
