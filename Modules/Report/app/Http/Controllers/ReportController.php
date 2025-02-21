<?php

namespace Modules\Report\Http\Controllers;

use App\Exports\BusinessTripDeclarationExport;
use App\Exports\BusinessTripExport;
use App\Exports\BusinessTripOverallExport;
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
use Modules\Reimbuse\Models\Reimburse;
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
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate);
            }
            if ($status) {
                $query->whereHas('status', function ($q) use ($status) {
                    $q->where('code', $status);
                });
            }
            if ($type) {
                $query->whereHas('reimburses', function ($q) use ($type) {
                    $q->where('reimburse_type', $type);
                });
            }

            if ($department) {
                $query->whereHas('user', function ($q) use ($department) {
                    $q->where('departement_id', $department);
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
            $query = ReimburseGroup::query()->with(['reimburses', 'status', 'user', 'reimburses.reimburseType.gradeReimburseTypes', 'reimburses.purchasingGroupModel.approvalPr', 'PurchaseRequisition']);

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
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate);
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
                    $q->where('departement_id', $department);
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
                    'employee_no' => $item->userCreateRequest->nip,
                    'employee_name' => $item->userCreateRequest->name,
                    'type_of_reimbursement' => $item->reimburses->first()->reimburseType->name,
                    'type_of_expense' => '-',
                    'additional_field' => '-',
                    'paid_status' => '',
                    'paid_date' => '',
                    'source' => '',
                    'cancels' => '',
                    'claim' => $item->reimburses->first()->claim_date,
                    'curency' => $item->reimburses->first()->currency,
                    'reimburses' => $item->reimburses,
                    'pr' => $item->PurchaseRequisition,
                    'request_for' => $item->user->name,
                    'remark' => $item->remark,
                    'balance' => $balance,
                    'form_count' => $item->reimburses->count(),
                    'status' => $item->status->name,
                    'request_date' => $item->created_at->format('d/m/Y'),
                ];
            });

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
        $statuses = MasterStatus::select('code', 'name')->get();

        return Inertia::render('Report/BusinessTrip/index', compact('users', 'listPurposeType', 'pajak', 'costcenter', 'purchasingGroup', 'listDestination', 'departments', 'statuses'));
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
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
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
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
            });
        }

        $data = $query->where('type', 'request')
            ->latest()
            ->search(request(['search']))
            ->get();

        // Transform the data for export
        $transformedData = $data->map(function ($businessTrip) {
            $destinations = collect($businessTrip->businessTripDestination ?? [])->map(function ($destination) {
                $allowanceItemsDay = collect($destination->detailDestinationDay ?? [])->map(function ($allowanceItem) {
                    $allowance = optional($allowanceItem->allowance);
                    return [
                        'item_name' => $allowance->name ? $allowance->name . ' [DAY]' : 'Unknown [DAY]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allowanceItemsTotal = collect($destination->detailDestinationTotal ?? [])->map(function ($allowanceItem) {
                    $allowance = optional($allowanceItem->allowance);
                    return [
                        'item_name' => $allowance->name ? $allowance->name . ' [TOTAL]' : 'Unknown [TOTAL]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allAllowanceItems = $allowanceItemsDay->merge($allowanceItemsTotal);

                return [
                    'destination' => $destination->destination ?? '',
                    'start_date' => $destination->business_trip_start_date ?? '',
                    'end_date' => $destination->business_trip_end_date ?? '',
                    'allowance_items' => $allAllowanceItems,
                    'total_allowance' => $allAllowanceItems->sum('amount') ?? 0,
                ];
            });

            return [
                'requestDate' => $businessTrip->created_at ?? '',
                'requestedBy' => $businessTrip->requestedBy ?? '',
                'requestFor' => $businessTrip->requestFor ?? '',
                'requestNo' => $businessTrip->request_no ?? '',
                'status' => $businessTrip->status ?? '',
                'purposeType' => $businessTrip->purposeType ?? '',
                'remarks' => $businessTrip->remarks ?? '',
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
        $statuses = MasterStatus::select('code', 'name')->get();

        return Inertia::render('Report/BusinessTripDeclaration/index', compact('users', 'listPurposeType', 'listBusinessTrip', 'listDestination', 'departments', 'statuses'));
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
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
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
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
            });
        }

        // Filter for type declaration
        $data = $query->where('type', 'declaration')->latest()->get();

        // Transform the data for export
        $transformedData = $data->map(function ($businessTrip) {
            $destinations = collect($businessTrip->businessTripDestination ?? [])->map(function ($destination) {
                $allowanceItemsDay = collect($destination->detailDestinationDay ?? [])->map(function ($allowanceItem) {
                    $allowance = $allowanceItem->allowance ?? null;
                    return [
                        'item_name' => $allowance ? ($allowance->name . ' [DAY]') : 'Unknown [DAY]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allowanceItemsTotal = collect($destination->detailDestinationTotal ?? [])->map(function ($allowanceItem) {
                    $allowance = $allowanceItem->allowance ?? null;
                    return [
                        'item_name' => $allowance ? ($allowance->name . ' [TOTAL]') : 'Unknown [TOTAL]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allAllowanceItems = $allowanceItemsDay->merge($allowanceItemsTotal);

                return [
                    'destination' => $destination->destination ?? '',
                    'start_date' => $destination->business_trip_start_date ?? '',
                    'end_date' => $destination->business_trip_end_date ?? '',
                    'allowance_items' => $allAllowanceItems,
                    'total_allowance' => $allAllowanceItems->sum('amount') ?? 0,
                ];
            });

            return [
                'requestDate' => $businessTrip->created_at ?? '',
                'requestedBy' => $businessTrip->requestedBy ?? '',
                'requestFor' => $businessTrip->requestFor ?? '',
                'requestNo' => $businessTrip->request_no ?? '',
                'status' => $businessTrip->status ?? '',
                'purposeType' => $businessTrip->purposeType ?? '',
                'remarks' => $businessTrip->remarks ?? '',
                'destinations' => $destinations,
            ];
        });

        $filename = 'BusinessTripDeclarations.xlsx';
        return Excel::download(new BusinessTripDeclarationExport($transformedData), $filename);
    }

    public function businessTripOverall()
    {
        $users = User::select('nip', 'name', 'id')->get();

        $listPurposeType = PurposeType::select('name', 'id')->get();
        $pajak = Pajak::select('id', 'mwszkz', 'desimal')->get();
        $costcenter = MasterCostCenter::select('id', 'cost_center', 'controlling_name')->get();
        $purchasingGroup = PurchasingGroup::select('id', 'purchasing_group')->get();

        $listDestination = Destination::get();
        $departments = MasterDepartment::select('id', 'name')->get();
        $statuses = MasterStatus::select('code', 'name')->get();

        return Inertia::render('Report/BusinessTripOverall/index', compact('users', 'listPurposeType', 'pajak', 'costcenter', 'purchasingGroup', 'listDestination', 'departments', 'statuses'));
    }

    public function listBTOverall(Request $request)
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
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
            });
        }

        $data = $query->latest()->search(request(['search']))->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field

            return [
                'id' => $map->id,
                'status_id' => $map->status_id,
                'request_no' => $map->request_no,
                'remarks' => $map->remarks,
                'request_for' => $map->requestFor->name,
                'employee_no' => $map->requestedBy->nip,
                'employee_name' => $map->requestedBy->name,
                'position' => $map->requestedBy->positions->name,
                'dept' => $map->requestedBy->departements->name,
                'division' => $map->requestedBy->divisions->name,
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

    public function exportBTOverall(Request $request)
    {
        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'parentBusinessTrip', 'businessTripDestination', 'requestedBy', 'requestedBy.positions', 'requestedBy.divisions', 'requestedBy.departements']);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');


        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
            });
        }

        $data = $query->latest()->search(request(['search']))->get();

        // Transform data
        $transformedData = $data->map(function ($businessTrip) {
            $isDeclaration = $businessTrip->type === 'declaration';

            return [
                'type' => $businessTrip->type ?? '',
                'employee' => $businessTrip->requestFor ?? '',
                'requested_by' => $businessTrip->requestedBy ?? '',
                'request_no' => $businessTrip->request_no ?? '',
                'status' => $businessTrip->status ?? '',
                'purpose' => $businessTrip->purposeType ?? '',
                'remarks' => $businessTrip->remarks ?? '',
                'is_declaration' => $isDeclaration,
                'request_no_parent' => optional($businessTrip->parentBusinessTrip)->request_no ?? '',
                'destinations' => optional($businessTrip->businessTripDestination)->map(function ($destination) use ($isDeclaration) {
                    return [
                        'start_date' => $destination->business_trip_start_date ?? '',
                        'end_date' => $destination->business_trip_end_date ?? '',
                        'destination' => $destination->destination ?? '',
                        'date' => $isDeclaration ? ($destination->created_at ?? '') : ($destination->business_trip_start_date ?? ''),
                        'allowances' => optional($destination->detailDestinationTotal)->map(function ($item) {
                            return [
                                'item_name' => optional($item->allowance)->name ?? '',
                                'amount' => $item->price ?? 0
                            ];
                        }) ?? [],
                        'total' => optional($destination->detailDestinationTotal)->sum('price') ?? 0
                    ];
                }) ?? []
            ];
        });
        // Return the exported file
        $filename = 'BusinessTripOverall.xlsx';
        return Excel::download(new BusinessTripOverallExport($transformedData), $filename);
    }


    public function purchase(Request $request)
    {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $vendor = $request->get('vendor');
        $department = $request->get('department');
        $userData = false;
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
            'purchases_number',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user', 'vendors', 'purchaseRequisitions');

        $hasColumns =  [
            [
                "join" => "user",
                "column" => "name",
            ],
            [
                "join" => "createdBy",
                "column" => "name",
            ],
            [
                "join" => "updatedBy",
                "column" => "name",
            ],
            [
                "join" => "status",
                "column" => "name",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "purchase_requisition_number",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "no_po",
            ],
        ];

        if ($startDate && $endDate) {
            $data->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('departement_id', $department);
            });
        }
        if (Auth::user()->is_admin != '1') {
            $userData = true;
        }

        $data = $this->filterAndPaginateHasJoin($request, $data, $filterableColumns,  $hasColumns, $userData);
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
        $userData = false;

        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
            'purchases_number',
        ];

        $hasColumns =  [
            [
                "join" => "user",
                "column" => "name",
            ],
            [
                "join" => "createdBy",
                "column" => "name",
            ],
            [
                "join" => "updatedBy",
                "column" => "name",
            ],
            [
                "join" => "status",
                "column" => "name",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "purchase_requisition_number",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "no_po",
            ],
            [
                "join" => "vendorsWinner",
                "column" => "name",
            ],
            [
                "join" => "cashAdvancePurchases",
                "column" => "reference",
            ],
        ];


        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user', 'vendors', 'purchaseRequisitions', 'vendorsWinner', 'cashAdvancePurchases');
        if ($startDate && $endDate) {
            $data->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
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
                $q->where('vendor', $vendor);
            });
        }
        if ($department) {
            $data->whereHas('user', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        if (Auth::user()->is_admin != '1') {
            $userData = true;
        }

        $data = $this->filterAndNotPaginateHasJoin($request, $data, $filterableColumns, $hasColumns, $userData);

        $transformedData = $data->map(function ($pr) {
            return [
                'po_no' => collect($pr->purchaseRequisitions)->firstWhere('no_po', '!=', null)->no_po ?? '-',
                'pr_no' => collect($pr->purchaseRequisitions)->firstWhere('purchase_requisition_number', '!=', null)->purchase_requisition_number ?? '-',
                'quatation_no' => $pr->purchases_number ?? '',
                'requested_by' => optional($pr->user)->name ?? '',
                'requester' => optional($pr->createdBy)->name ?? '',
                'document_type' => $pr->document_type ?? '',
                'purchasing_groups' => $pr->purchasing_groups ?? '',
                'cost_center' => collect($pr->purchaseRequisitions)->firstWhere('cost_center', '!=', null)->cost_center ?? '-',
                'delivery_date' => $pr->delivery_date ?? '',
                'storage_locations' => $pr->storage_locations ?? '',
                'header_note' => collect($pr->purchaseRequisitions)->firstWhere('header_not', '!=', null)->header_not ?? '-',

                // Entertainment
                'tanggal_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('tanggal_entertainment', '!=', null)->tanggal_entertainment ?? '-',
                'tempat_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('tempat_entertainment', '!=', null)->tempat_entertainment ?? '-',
                'alamat_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('alamat_entertainment', '!=', null)->alamat_entertainment ?? '-',
                'jenis_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('jenis_entertainment', '!=', null)->jenis_entertainment ?? '-',
                'nama_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('nama_entertainment', '!=', null)->nama_entertainment ?? '-',
                'posisi_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('posisi_entertainment', '!=', null)->posisi_entertainment ?? '-',
                'nama_perusahaan' => collect($pr->purchaseRequisitions)->firstWhere('nama_perusahaan', '!=', null)->nama_perusahaan ?? '-',
                'jenis_usaha_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('jenis_usaha_entertainment', '!=', null)->jenis_usaha_entertainment ?? '-',
                'jenis_kegiatan_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('jenis_kegiatan_entertainment', '!=', null)->jenis_kegiatan_entertainment ?? '-',

                'status' => optional($pr->status)->name ?? '',
                'number_pr' => collect($pr->purchaseRequisitions)->firstWhere('purchase_requisition_number', '!=', null)->purchase_requisition_number ?? '-',
                'status_pr' => collect($pr->purchaseRequisitions)->firstWhere('status', '!=', null)->status ?? '-',
                'status_po' => collect($pr->purchaseRequisitions)->firstWhere('is_closed', '!=', null)->is_closed ?? '-',
                'currency' => collect($pr->purchaseRequisitions)->firstWhere('currency', '!=', null)->currency ?? '-',
                'attachment' => collect($pr->purchaseRequisitions)->pluck('attachment')->filter()->implode(','),
                'created_at' => $pr->created_at ?? '',
                'total_vendor' => $pr->total_vendor ?? '',
                'propose_vendor' => optional($pr->vendorsWinner)->name ?? '',

                // Item detail dari relasi vendorsWinner.units (hasMany)
                'items' => optional($pr->vendorsWinner)->units->map(function ($unit) {
                    $qty = $unit->qty ?? 0;
                    $unit_price = $unit->unit_price ?? 0;
                    return [
                        'request_date' => $unit->requisition_date ?? '',
                        'qty' => $qty,
                        'unit_price' => $unit_price,
                        'total_amount' => $qty * $unit_price, // Menghitung total amount
                        'account_assignment' => $unit->account_assignment_categories ?? '',
                        'material_group' => $unit->material_group ?? '',
                        'material_number' => $unit->material_number ?? '',
                        'uom' => $unit->uom ?? '',
                        'tax' => $unit->tax ?? '',
                        'short_text' => $unit->short_text ?? '',
                    ];
                })->toArray(),

                // Cash advanced
                'is_cashAdvance' => $pr->is_cashAdvance ?? '',
                'amount' => optional($pr->cashAdvancePurchases)->nominal ?? '0',
                'percentage' => optional($pr->cashAdvancePurchases)->dp ?? '',
                'reference' => optional($pr->cashAdvancePurchases)->reference ?? '',
            ];
        });

        $filename = 'Purchase.xlsx';
        return Excel::download(new PurchaseRequisitionExport($transformedData), $filename);
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

    public function statuses(Request $request)
    {
        $data = MasterStatus::select('code', 'name')->get();
        return $this->successResponse($data);
    }

    public function purchaseVendors(Request $request)
    {
        $data = Vendor::with('masterBusinesPartnerss') // Eager load the relationship
            ->where('winner', true) // Filter winners
            ->get();

        // Map related data to the result
        $data = $data->map(function ($vendor) {
            return [
                'vendor' => $vendor->vendor,
                'vendor_name' => $vendor->masterBusinesPartnerss->name_one ?? '', // Access related column
            ];
        })->unique('vendor') // Ensure uniqueness based on 'vendor' column
            ->values(); // Reset collection keys

        return $this->successResponse($data);
    }
}
