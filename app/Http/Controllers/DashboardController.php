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
    public function index(Request $request)
    {
        $statusFilter = $request->input('status', 'reim');
        $dateFilter = $request->input('date', '1year');
        $user = Auth::user();

        // Define status mapping
        $statusTypes = [
            'waiting' => 1,
            'process' => 3,
            'rejected' => 4,
            'approved' => 5,
        ];

        // Initialize categories array
        $categories = [];

        // Base queries based on status filter
        if ($statusFilter === 'reim') {
            $query = ReimburseGroup::query();
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'requester');
            $categories = $this->countStatuses($query, $statusTypes);
        } elseif ($statusFilter === 'trip') {
            $query = BusinessTrip::query()->where('type', 'request');
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'request_for');
            $categories = $this->countStatuses($query, $statusTypes);
        } elseif ($statusFilter === 'dec') {
            $query = BusinessTrip::query()->where('type', 'declaration');
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'request_for');
            $categories = $this->countStatuses($query, $statusTypes);
        } elseif ($statusFilter === 'vendor') {
            $query = Purchase::query();
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'user_id');
            $categories = $this->countStatuses($query, $statusTypes);
        }

        // Total counts for each category
        $dataTotal = [
            'request' => [
                'reim' => $this->getTotalCount(ReimburseGroup::query(), $user, 'requester'),
                'businessTrip' => $this->getTotalCount(BusinessTrip::query()->where('type', 'request'), $user, 'request_for'),
                'businessDec' => $this->getTotalCount(BusinessTrip::query()->where('type', 'declaration'), $user, 'request_for'),
                'vendorSelection' => $this->getTotalCount(Purchase::query(), $user, 'user_id'),
            ],
            'categories' => $categories,
        ];

        return Inertia::render('Dashboard/index', [
            'title' => 'Dashboard',
            'dataTotal' => $dataTotal,
            'statusFilter' => $statusFilter,
            'dateFilter' => $dateFilter,
        ]);
    }

    public function filter(Request $request)
    {
        // Retrieve filters from request
        $statusFilter = $request->input('status', 'reim');
        $dateFilter = $request->input('date', '1year');
        $user = Auth::user();

        // Define status mapping
        $statusTypes = [
            'waiting' => 1,
            'process' => 3,
            'rejected' => 4,
            'approved' => 5,
        ];

        // Initialize categories array
        $categories = [];

        // Base queries based on status filter
        if ($statusFilter === 'reim') {
            $query = ReimburseGroup::query();
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'requester');
            $categories = $this->countStatuses($query, $statusTypes);
        } elseif ($statusFilter === 'trip') {
            $query = BusinessTrip::query()->where('type', 'request');
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'request_for');
            $categories = $this->countStatuses($query, $statusTypes);
        } elseif ($statusFilter === 'dec') {
            $query = BusinessTrip::query()->where('type', 'declaration');
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'request_for');
            $categories = $this->countStatuses($query, $statusTypes);
        } elseif ($statusFilter === 'vendor') {
            $query = Purchase::query();
            $this->applyUserAndDateFilters($query, $user, $dateFilter, 'user_id');
            $categories = $this->countStatuses($query, $statusTypes);
        }

        // Total counts for each category
        $dataTotal = [
            'request' => [
                'reim' => $this->getTotalCount(ReimburseGroup::query(), $user, 'requester'),
                'businessTrip' => $this->getTotalCount(BusinessTrip::query()->where('type', 'request'), $user, 'request_for'),
                'businessDec' => $this->getTotalCount(BusinessTrip::query()->where('type', 'declaration'), $user, 'request_for'),
                'vendorSelection' => $this->getTotalCount(Purchase::query(), $user, 'user_id'),
            ],
            'categories' => $categories,
        ];


        return response()->json([
            'dataTotal' => $dataTotal,
            'statusFilter' => $statusFilter,
            'dateFilter' => $dateFilter,
        ]);
    }

    private function applyUserAndDateFilters($query, $user, $dateFilter, $userColumn)
    {
        if ($user->is_admin === '0') {
            $query->where($userColumn, $user->id);
        }

        switch ($dateFilter) {
            case '1year':
                $query->where('created_at', '>=', now()->subYear());
                break;
            case '1month':
                $query->where('created_at', '>=', now()->subMonth());
                break;
            case '1week':
                $query->where('created_at', '>=', now()->subWeek());
                break;
            case '1day':
                $query->where('created_at', '>=', now()->subDay());
                break;
            default:
                // If no valid filter is provided, return all time
                break;
        }
    }

    private function countStatuses($query, $statusTypes)
    {
        $counts = [];
        foreach ($statusTypes as $key => $statusId) {
            $counts[$key] = (clone $query)->where('status_id', $statusId)->count();
        }

        return $counts;
    }

    private function getTotalCount($query, $user, $userColumn)
    {
        if ($user->is_admin === '0') {
            $query->where($userColumn, $user->id);
        }

        return $query->count();
    }

    public function roles()
    {
        return Inertia::render('Role/index', [
            'title' => 'Dashboard',
        ]);
    }
}
