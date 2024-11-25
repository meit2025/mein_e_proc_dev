<?php

namespace App\Http\Controllers;

use App\Events\NotifikasiUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\PurchaseRequisition\Models\Purchase;

class DashboardController extends Controller
{
    //
    public function index()
    {
        $reimburseTotal                 = ReimburseGroup::with(['reimburses'])->count();
        $businessTripRequestTotal       = BusinessTrip::with(['purposeType'])->where('type', 'request')->count();
        $businessTripDeclarationTotal   = BusinessTrip::with(['purposeType'])->where('type', 'declaration')->count();
        $purchaseRequisitionTotal       = Purchase::count();
        
        $dataTotal = [
            'reimburse'                 => $reimburseTotal,
            'businessTripRequest'       => $businessTripRequestTotal,
            'businessTripDeclaration'   => $businessTripDeclarationTotal,
            'purchaseRequisition'       => $purchaseRequisitionTotal,
        ];
        return Inertia::render('Dashboard/index', [
            'title'     => 'Dashboard',
            'dataTotal' => $dataTotal
        ]);
    }

    public function roles()
    {
        return Inertia::render('Role/index', [
            'title' => 'Dashboard',
        ]);
    }
}
