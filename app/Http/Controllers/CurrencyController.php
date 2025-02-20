<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function ConntectAccess(Request $request)
    {
        $databasePath = "/Users/fajarsetiawan/Kerjaan/kerjaan/ubuntu/majapahit/mitsubishi/mitsubishi-web/att2000.mdb";
        $tableName = "USERINFO"; // Change this to your table

        $command = "mdb-export " . escapeshellarg($databasePath) . " " . escapeshellarg($tableName);
        $handle = popen($command, "r"); // Open process

        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                echo htmlspecialchars($line) . "<br>"; // Print each line to avoid memory overload
            }
            pclose($handle);
        } else {
            echo "Failed to retrieve data.";
        }
    }
}
