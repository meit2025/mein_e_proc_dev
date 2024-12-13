<?php

namespace App\Http\Controllers;

use App\Events\NotifikasiUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\Vendor;

class DashboardController extends Controller
{
    //
    // public function index()
    // {
    //     $reimburseTotal                 = ReimburseGroup::with(['reimburses'])->count();
    //     $businessTripRequestTotal       = BusinessTrip::with(['purposeType'])->where('type', 'request')->count();
    //     $businessTripDeclarationTotal   = BusinessTrip::with(['purposeType'])->where('type', 'declaration')->count();
    //     $purchaseRequisitionTotal       = Purchase::count();

    //     $dataTotal = [
    //         'reimburse'                 => $reimburseTotal,
    //         'businessTripRequest'       => $businessTripRequestTotal,
    //         'businessTripDeclaration'   => $businessTripDeclarationTotal,
    //         'purchaseRequisition'       => $purchaseRequisitionTotal,
    //     ];
    //     return Inertia::render('Dashboard/index', [
    //         'title'     => 'Dashboard',
    //         'dataTotal' => $dataTotal
    //     ]);
    // }

    // public function roles()
    // {
    //     return Inertia::render('Role/index', [
    //         'title' => 'Dashboard',
    //     ]);
    // }

    public function index(Request $request)
    {
        $statusFilter = $request->input('status', 'reim');
        $monthFilter = $request->input('month', '12');
        $user = Auth::user();

        // Definisikan status yang mungkin dengan ID yang sesuai
        $statusTypes = [
            'waitingApprove' => 1,
            'onProcess' => 3,
            'reject' => 4,
            'fullyApproved' => 5,
        ];

        // Inisialisasi array untuk menyimpan jumlah per kategori dan status
        $categories = [];

        if ($statusFilter == 'reim') {
            // Query untuk Reimburse
            $reimburseQuery = ReimburseGroup::query();
            if ($user->is_admin == '0') {
                $reimburseQuery->where('requester', $user->id);
            }
            if ($monthFilter) {
                $reimburseQuery->whereMonth('created_at', $monthFilter);
            }
            foreach ($statusTypes as $key => $statusId) {
                $categories[$key] = $reimburseQuery->where('status_id', $statusId)->count();
            }
        } elseif ($statusFilter == 'trip') {
            // Query untuk Business Trip Request
            $businessTripRequestQuery = BusinessTrip::query()->where('type', 'request');
            if ($user->is_admin == '0') {
                $businessTripRequestQuery->where('request_for', $user->id);
            }
            if ($monthFilter) {
                $businessTripRequestQuery->whereMonth('created_at', $monthFilter);
            }
            foreach ($statusTypes as $key => $statusId) {
                $categories[$key] = $businessTripRequestQuery->where('status_id', $statusId)->count();
            }
        } elseif ($statusFilter == 'dec') {
            // Query untuk Business Trip Declaration
            $businessTripDeclarationQuery = BusinessTrip::query()->where('type', 'declaration');
            if ($user->is_admin == '0') {
                $businessTripDeclarationQuery->where('request_for', $user->id);
            }
            if ($monthFilter) {
                $businessTripDeclarationQuery->whereMonth('created_at', $monthFilter);
            }
            foreach ($statusTypes as $key => $statusId) {
                $categories[$key] = $businessTripDeclarationQuery->where('status_id', $statusId)->count();
            }
        } elseif ($statusFilter == 'vendor') {
            // Query untuk Vendor Selection
            $vendorSelectionQuery = Purchase::query();
            if ($user->is_admin == '0') {
                $vendorSelectionQuery->where('user_id', $user->id);
            }
            if ($monthFilter) {
                $vendorSelectionQuery->whereMonth('created_at', $monthFilter);
            }
            foreach ($statusTypes as $key => $statusId) {
                $categories[$key] = $vendorSelectionQuery->where('status_id', $statusId)->count();
            }
        }
        // Query Request
        $reim = ReimburseGroup::query();
        $trip = BusinessTrip::query()->where('type', 'request');
        $dec = BusinessTrip::query()->where('type', 'declaration');
        $vendor = Purchase::query();

        if ($user->is_admin == '0') {
            $reim = $reim->where('requester', $user->id);
            $trip = $trip->where('request_for', $user->id);
            $dec = $dec->where('request_for', $user->id);
            $vendor = $vendor->where('user_id', $user->id);
        }

        $reim = $reim->count();
        $trip = $trip->count();
        $dec = $dec->count();
        $vendor = $vendor->count();


        $dataTotal = [
            'request' => [
                'reim' => $reim,
                'businessTrip' => $trip,
                'businessDec' => $dec,
                'vendorSelection' => $vendor,
            ],
            'categories' => $categories
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
