<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    //

    public function ConversionCurrency(Request $request)
    {
        try {
            $data = $this->convert($request->from, $request->to, $request->amount);
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
