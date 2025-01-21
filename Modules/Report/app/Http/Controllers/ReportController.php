<?php

namespace Modules\Report\Http\Controllers;

use App\Exports\BusinessTripDeclarationExport;
use App\Exports\BusinessTripExport;
use App\Exports\PurchaseRequisitionExport;
use App\Exports\ReimburseExport;
use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Modules\Approval\Models\Approval;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\Destination;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\Master\Models\DocumentType;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterDepartment;
// use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\MasterStatus;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\PurchaseRequisition\Models\Vendor;
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
            // $periods = MasterPeriodReimburse::select('id', 'code', 'start', 'end')->get();
            $cost_center = MasterCostCenter::select('id', 'cost_center')->get();
            $taxes = Pajak::select('id', 'mwszkz')->get();

            $types = MasterTypeReimburse::select('code', 'name')->get();
            $statuses = MasterStatus::select('code', 'name')->get();
            $departments = MasterDepartment::select('id', 'name')->get();

            // $latestPeriod = MasterPeriodReimburse::orderBy('id', 'desc')->first();

            return Inertia::render(
                'Report/Reimbuse/Index',
                compact('purchasing_groups', 'currentUser',  'users', 'categories', 'currencies', 'cost_center', 'taxes', 'types', 'statuses', 'departments')
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function list(Request $request)
    {
        try {
            $startDate = $request->get('startDate');
            $endDate = $request->get('endDate');
            $status = $request->get('status');
            $type = $request->get('type');
            $department = $request->get('department');

            $query =  ReimburseGroup::query()->with(['reimburses', 'status', 'user']);

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

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
            if ($status) {
                $query->whereHas('status', function ($q) use ($status) {
                    $q->where('code', $status);
                });
            }
            if ($type) {
                $query->whereHas('reimburses', function ($q) use ($type) {
                    $q->where('type', $type);
                });
            }

            if ($department) {
                $query->whereHas('user', function ($q) use ($department) {
                    $q->where('department_id', $department);
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
                    'request_for' => $map->user->name,
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
            $startDate = $request->get('startDate');
            $endDate = $request->get('endDate');
            $status = $request->get('status');
            $type = $request->get('type');
            $department = $request->get('department');

            // Start the query with relationships
            $query = ReimburseGroup::query()->with(['reimburses', 'status', 'user']);

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

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
            if ($status) {
                $query->whereHas('status', function ($q) use ($status) {
                    $q->where('code', $status);
                });
            }
            if ($type) {
                $query->whereHas('reimburses', function ($q) use ($type) {
                    $q->where('type', $type);
                });
            }
            if ($department) {
                $query->whereHas('user', function ($q) use ($department) {
                    $q->where('department_id', $department);
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
                    'code' => $item->code,
                    'request_for' => $item->user->name,
                    'remark' => $item->remark,
                    'balance' => $balance,
                    'form_count' => $item->reimburses->count(),
                    'status' => $item->status->name,
                    'createdDate' => $item->created_at->format('Y-m-d H:i:s'),
                ];
            });

            // dd($transformedData);
            $filename = 'Reimburse.xlsx';
            return Excel::download(new ReimburseExport($transformedData), $filename);
        } catch (\Exception $e) {
            // Return an error response with the exception message
            return $this->errorResponse($e->getMessage());
        }
    }

    public function businessTrip()
    {
        $users = User::select('nip', 'name', 'id')->get();

        $listPurposeType = PurposeType::select('name', 'id')->get();
        $pajak = Pajak::select('id', 'mwszkz', 'desimal')->get();
        $costcenter = MasterCostCenter::select('id', 'cost_center', 'controlling_name')->get();
        $purchasingGroup = PurchasingGroup::select('id', 'purchasing_group')->get();

        $listDestination = Destination::get();
        $departments = MasterDepartment::select('id', 'name')->get();

        return Inertia::render('Report/BusinessTrip/index', compact('users', 'listPurposeType', 'pajak', 'costcenter', 'purchasingGroup', 'listDestination', 'departments'));
    }

    public function listBT(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status', 'businessTripDestination', 'requestFor']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)->where('document_name', 'TRIP')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('department_id', $department);
            });
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
        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'businessTripDestination', 'requestedBy', 'requestedBy.positions', 'requestedBy.divisions', 'requestedBy.departements']);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');


        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP')
                ->pluck('document_id')
                ->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }
        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('department_id', $department);
            });
        }

        $data = $query->where('type', 'request')
            ->latest()
            ->search(request(['search']))
            ->get();

        // Transform the data for export
        $transformedData = $data->map(function ($businessTrip) {
            $destinations = $businessTrip->businessTripDestination->map(function ($destination) {
                $allowanceItems = $destination->detailDestinationTotal->map(function ($allowanceItem) {
                    return [
                        'item_name' => $allowanceItem->allowance->name,
                        'amount' => $allowanceItem->price,
                    ];
                });

                return [
                    'destination' => $destination->destination,
                    'start_date' => $destination->business_trip_start_date,
                    'end_date' => $destination->business_trip_end_date,
                    'allowance_items' => $allowanceItems,
                    'total_allowance' => $allowanceItems->sum('amount'),
                ];
            });

            return [
                'requestedBy' => $businessTrip->requestedBy,
                'requestFor' => $businessTrip->requestFor,
                'requestNo' => $businessTrip->request_no,
                'status' => $businessTrip->status,
                'purposeType' => $businessTrip->purposeType,
                'remarks' => $businessTrip->remarks,
                'destinations' => $destinations,
            ];
        });


        // Return the exported file
        $filename = 'BusinessTrips.xlsx';
        return Excel::download(new BusinessTripExport($transformedData), $filename);
    }

    public function businessTripDec()
    {
        $users = User::select('nip', 'name', 'id')->get();
        $inBusinessTripRequest = BusinessTrip::where('type', 'declaration')->pluck('parent_id')->toArray();
        $listBusinessTrip = BusinessTrip::where('type', 'request')->whereNotIn('id', $inBusinessTripRequest)->get();
        $listPurposeType = PurposeType::select('name', 'id')->get();
        $listDestination = Destination::get();
        $departments = MasterDepartment::select('id', 'name')->get();

        return Inertia::render('Report/BusinessTripDeclaration/index', compact('users', 'listPurposeType', 'listBusinessTrip', 'listDestination', 'departments'));
    }

    public function listBTDec(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status', 'requestFor']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }
        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('department_id', $department);
            });
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
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');


        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'parentBusinessTrip', 'businessTripDestination']);

        // Check approval filter
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')
                ->pluck('document_id')
                ->toArray();

            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('department_id', $department);
            });
        }

        // Filter for type declaration
        $data = $query->where('type', 'declaration')->latest()->get();

        // Transform the data for export
        $transformedData = $data->map(function ($businessTrip) {
            $destinations = $businessTrip->businessTripDestination->map(function ($destination) {
                $allowanceItems = $destination->detailDestinationTotal->map(function ($allowanceItem) {
                    return [
                        'item_name' => $allowanceItem->allowance->name,
                        'amount' => $allowanceItem->price,
                    ];
                });

                return [
                    'destination' => $destination->destination,
                    'start_date' => $destination->business_trip_start_date,
                    'end_date' => $destination->business_trip_end_date,
                    'allowance_items' => $allowanceItems,
                    'total_allowance' => $allowanceItems->sum('amount'),
                ];
            });

            return [
                'requestedBy' => $businessTrip->requestedBy,
                'requestFor' => $businessTrip->requestFor,
                'requestNo' => $businessTrip->request_no,
                'status' => $businessTrip->status,
                'purposeType' => $businessTrip->purposeType,
                'remarks' => $businessTrip->remarks,
                'destinations' => $destinations,
            ];
        });

        $filename = 'BusinessTripDeclarations.xlsx';
        return Excel::download(new BusinessTripDeclarationExport($transformedData), $filename);
    }


    public function purchase(Request $request)
    {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $vendor = $request->get('vendor');
        $department = $request->get('department');
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user', 'vendors');
        if ($startDate && $endDate) {
            $data->whereBetween('created_at', [$startDate, $endDate]);
        }
        if ($status) {
            $data->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $data->where('document_type', $type);
        }

        if ($vendor) {
            $data->whereHas('vendors', function ($q) use ($vendor) {
                $q->where('id', $vendor);
            });
        }
        if ($department) {
            $data->whereHas('user', function ($q) use ($department) {
                $q->where('department_id', $department);
            });
        }

        $data = $this->filterAndPaginate($request, $data, $filterableColumns, true);
        return $this->successResponse($data);
    }

    public function purchaseExport(Request $request)
    {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $vendor = $request->get('vendor');
        $department = $request->get('department');

        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user', 'vendors');
        if ($startDate && $endDate) {
            $data->whereBetween('created_at', [$startDate, $endDate]);
        }
        if ($status) {
            $data->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $data->where('document_type', $type);
        }
        if ($vendor) {
            $data->whereHas('vendors', function ($q) use ($vendor) {
                $q->where('id', $vendor);
            });
        }
        if ($department) {
            $data->whereHas('user', function ($q) use ($department) {
                $q->where('department_id', $department);
            });
        }

        $data = $this->filterNotPaggination($request, $data, $filterableColumns, true);

        $filename = 'Purchase.xlsx';
        return Excel::download(new PurchaseRequisitionExport($data), $filename);
        return $this->successResponse($data);
    }

    public function purchaseTypes(Request $request)
    {
        $data = DocumentType::select('id', 'purchasing_doc')->get();
        return $this->successResponse($data);
    }

    public function departments(Request $request)
    {
        $data = MasterDepartment::select('id', 'name')->get();
        return $this->successResponse($data);
    }

    public function purchaseVendors(Request $request)
    {
        $data = Vendor::with('masterBusinesPartnerss') // Eager load the relationship
            ->where('winner', true) // Filter winners
            ->get(['id', 'winner']); // Select columns only from the `vendors` table

        // Map related data to the result
        $data = $data->map(function ($vendor) {
            return [
                'id' => $vendor->id,
                'vendor' => $vendor->masterBusinesPartnerss->name_one ?? null, // Access related column
            ];
        });

        return $this->successResponse($data);
    }
}
