<?php

namespace Modules\Report\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\Approval\Models\Approval;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\Destination;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\Reimbuse\Models\ReimburseGroup;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {

            $is_Admin = Auth::user()->is_admin;

            $listFamily = [];
            if (!$is_Admin) {
                $users = User::where('id', Auth::id())->select('nip', 'name')->get();

                // $listFamily = Family::where('userId', Auth::user()->id)->get();
            } else {
                $users = User::select('nip', 'name')->get();
                // $listFamily = Family::where('userId', User::select('nip')->pluck('nip')->toArray())->get();
            }

            $currentUser = Auth::user();

            $categories = ['Employee', 'Family'];
            $purchasing_groups = PurchasingGroup::select('id', 'purchasing_group', 'purchasing_group_desc')->get();
            $currencies = Currency::select('code', 'name')->where('code', 'IDR')->get();
            $periods = MasterPeriodReimburse::select('id', 'code', 'start', 'end')->get();
            $cost_center = MasterCostCenter::select('id', 'cost_center')->get();
            $taxes = Pajak::select('id', 'mwszkz')->get();

            $latestPeriod = MasterPeriodReimburse::orderBy('id', 'desc')->first();

            return Inertia::render(
                'Report/Reimbuse/Index',
                compact('purchasing_groups', 'currentUser', 'latestPeriod',  'users', 'categories', 'currencies', 'periods', 'cost_center', 'taxes')
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function list(Request $request)
    {
        try {
            $query =  ReimburseGroup::query()->with(['reimburses', 'status']);
            if ($request->approval == 1) {
                $approval = Approval::where('user_id', Auth::user()->id)
                    ->where(['document_name' => 'REIM', 'status' => 'Waiting'])->pluck('document_id')->toArray();
                $query = $query->whereIn('id', $approval);
            } else {
                if (Auth::user()->is_admin == '0') $data = $query->where('requester', Auth::user()->nip);
            }

            if ($request->search) {
                $query = $query->orWhere('code', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('remark', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('requester', 'ILIKE', '%' . $request->search . '%');

                $query = $query->orWhereHas('reimburses', function ($q) use ($request) {
                    $q->where('remark', 'ILIKE', '%' . $request->search . '%');
                });

                $query = $query->orWhereHas('status', function ($q) use ($request) {
                    $q->where('name', 'ILIKE', '%' . $request->search . '%');
                });
            }

            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, 'desc');
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) {
                $balance = 0;
                foreach ($map->reimburses as $reimburse) {
                    $balance += $reimburse->balance;
                }
                $map = json_decode($map);
                return [
                    'id' => $map->id,
                    'code' => $map->code,
                    'request_for' => $map->requester,
                    'remark' => $map->remark,
                    'balance' => $balance,
                    'form' => count($map->reimburses),
                    'status' => [
                        'name' => $map->status->name,
                        'classname' => $map->status->classname,
                        'code' =>
                        $map->status->code
                    ],
                    'createdDate' => $map->created_at,

                ];
            });
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function export(Request $request)
    {
        try {
            // Start the query with relationships
            $query = ReimburseGroup::query()->with(['reimburses', 'status']);

            // Handle approval-specific filtering
            if ($request->approval == 1) {
                $approval = Approval::where('user_id', Auth::id())
                    ->where(['document_name' => 'REIM', 'status' => 'Waiting'])
                    ->pluck('document_id')
                    ->toArray();

                $query->whereIn('id', $approval);
            } else {
                // Filter for non-admin users based on requester
                if (Auth::user()->is_admin == '0') {
                    $query->where('requester', Auth::user()->nip);
                }
            }

            // Apply search functionality
            if ($request->filled('search')) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('code', 'ILIKE', '%' . $search . '%')
                        ->orWhere('remark', 'ILIKE', '%' . $search . '%')
                        ->orWhere('requester', 'ILIKE', '%' . $search . '%')
                        ->orWhereHas('reimburses', function ($q) use ($search) {
                            $q->where('remark', 'ILIKE', '%' . $search . '%');
                        })
                        ->orWhereHas('status', function ($q) use ($search) {
                            $q->where('name', 'ILIKE', '%' . $search . '%');
                        });
                });
            }

            // Handle pagination and sorting
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');

            $query->orderBy($sortBy, $sortDirection);

            // Retrieve the data
            $data = $query->get();

            // Transform data for export
            $transformedData = $data->map(function ($item) {
                $balance = $item->reimburses->sum('balance');

                return [
                    'id' => $item->id,
                    'code' => $item->code,
                    'request_for' => $item->requester,
                    'remark' => $item->remark,
                    'balance' => $balance,
                    'form_count' => $item->reimburses->count(),
                    'status' => [
                        'name' => $item->status->name,
                        'classname' => $item->status->classname,
                        'code' => $item->status->code,
                    ],
                    'createdDate' => $item->created_at->format('Y-m-d H:i:s'),
                ];
            });

            return $this->successResponse($transformedData);
        } catch (\Exception $e) {
            // Return an error response with the exception message
            return $this->errorResponse($e->getMessage());
        }
    }

    public function businessTrip()
    {
        $users = User::select('nip', 'name', 'id')->get();

        $listPurposeType = PurposeType::select('name', 'code', 'id')->get();
        $pajak = Pajak::select('id', 'mwszkz', 'desimal')->get();
        $costcenter = MasterCostCenter::select('id', 'cost_center', 'controlling_name')->get();
        $purchasingGroup = PurchasingGroup::select('id', 'purchasing_group')->get();

        $listDestination = Destination::get();
        return Inertia::render('Report/BusinessTrip/index', compact('users', 'listPurposeType', 'pajak', 'costcenter', 'purchasingGroup', 'listDestination'));
    }

    public function listBT(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)->where('document_name', 'TRIP')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        } else {
            $query = $query->where('created_by', Auth::user()->id)->orWhere('request_for', Auth::user()->id);
        }

        $data = $query->where('type', 'request')->latest()->search(request(['search']))->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field

            return [
                'id' => $map->id,
                'status_id' => $map->status_id,
                'request_no' => $map->request_no,
                'remarks' => $map->remarks,
                'request_for' => $map->requestFor->name,
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' => $map->status->code
                ],
                'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
            ];
        });

        return $this->successResponse($data);
    }

    public function exportBT(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)->where('document_name', 'TRIP')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        } else {
            $query = $query->where('created_by', Auth::user()->id)->orWhere('request_for', Auth::user()->id);
        }

        $data = $query->where('type', 'request')->latest()->search(request(['search']))->get();

        $transformedData = $data->map(function ($map) {

            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field

            return [
                'id' => $map->id,
                'status_id' => $map->status_id,
                'request_no' => $map->request_no,
                'remarks' => $map->remarks,
                'request_for' => $map->requestFor->name,
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' => $map->status->code
                ],
                'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
            ];
        });

        return $this->successResponse($transformedData);
    }

    public function businessTripDec()
    {
        $users = User::select('nip', 'name', 'id')->get();
        $inBusinessTripRequest = BusinessTrip::where('type', 'declaration')->pluck('parent_id')->toArray();
        $listBusinessTrip = BusinessTrip::where('type', 'request')->whereNotIn('id', $inBusinessTripRequest)->get();
        $listPurposeType = PurposeType::select('name', 'code', 'id')->get();
        return Inertia::render('Report/BusinessTripDeclaration/index', compact('users', 'listPurposeType', 'listBusinessTrip'));
    }

    public function listBTDec(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        }

        $data = $query->where('type', 'declaration')->latest()->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            // $purposeRelations = $map->purposeType ? $map->purposeType->name : '';
            $requestFor = $map->requestFor ? $map->requestFor->name : '';
            $requestNo = $map->parentBusinessTrip ? $map->parentBusinessTrip->request_no : '';

            return [
                'id' => $map->id,
                'declaration_no' => $map->request_no,
                'request_no' => $requestNo,
                'request_for' => $requestFor,
                'remarks' => $map->remarks,
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' =>
                    $map->status->code
                ],
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
                // 'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                // 'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
            ];
        });


        return $this->successResponse($data);
    }

    public function exportBTDec(Request $request)
    {
        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'parentBusinessTrip']);

        // Check approval filter
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')
                ->pluck('document_id')
                ->toArray();

            $query = $query->whereIn('id', $data);
        }

        // Filter for type declaration
        $data = $query->where('type', 'declaration')->latest()->get();

        // Transform data
        $transformedData = $data->map(function ($map) {
            $requestFor = $map->requestFor ? $map->requestFor->name : '';
            $requestNo = $map->parentBusinessTrip ? $map->parentBusinessTrip->request_no : '';

            return [
                'id' => $map->id,
                'declaration_no' => $map->request_no,
                'request_no' => $requestNo,
                'request_for' => $requestFor,
                'remarks' => $map->remarks,
                'status' => [
                    'name' => $map->status->name ?? '',
                    'classname' => $map->status->classname ?? '',
                    'code' => $map->status->code ?? '',
                ],
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
            ];
        });

        // Return as JSON for success response
        return $this->successResponse($transformedData);
    }


    public function purchase(Request $request)
    {
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user');

        $data = $this->filterAndPaginate($request, $data, $filterableColumns, true);
        return $this->successResponse($data);
    }

    public function purchaseExport(Request $request)
    {
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user');

        $data = $this->filterNotPaggination($request, $data, $filterableColumns, true);
        return $this->successResponse($data);
    }
}
