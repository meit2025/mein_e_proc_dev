<?php

namespace Modules\Report\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\Destination;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

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

    public function businessTripDec()
    {
        $users = User::select('nip', 'name', 'id')->get();
        $inBusinessTripRequest = BusinessTrip::where('type', 'declaration')->pluck('parent_id')->toArray();
        $listBusinessTrip = BusinessTrip::where('type', 'request')->whereNotIn('id', $inBusinessTripRequest)->get();
        $listPurposeType = PurposeType::select('name', 'code', 'id')->get();
        return Inertia::render('Report/BusinessTripDeclaration/index', compact('users', 'listPurposeType', 'listBusinessTrip'));
    }

    public function purchase(Request $request)
    {
        $filterableColumns = [
            'no_po',
            'requisitioner_name',
            'requisition_date',
            'purchase_requisition_number',
            'requirement_tracking_number',
            'item_number',
            'document_type',
            'valuation_type',
            'is_closed',
            'purchasing_group',
            'purchasing_organization',
            'account_assignment_category',
            'item_delivery_date',
            'storage_location',
            'desired_vendor',
            'material_group',
            'material_number',
            'unit_of_measure',
            'quantity',
            'tax_code',
            'item_category',
            'short_text',
            'plant',
            'deletion_indicator',
            'cost_center',
            'order_number',
            'asset_subnumber',
            'main_asset_number',
            'purchase_id',

            'code_transaction',

            'header_not',
            'tanggal_entertainment',
            'tempat_entertainment',
            'alamat_entertainment',
            'jenis_entertainment',
            'nama_entertainment',
            'posisi_entertainment',
            'nama_perusahaan',
            'jenis_usaha_entertainment',
            'jenis_kegiatan_entertainment',
            'status',
            'code',
            'message',
            'attachment',
            'balance',
            'attachment_link'
        ];

        $pr = PurchaseRequisition::where('purchase_id', $request->data_id)->where('code_transaction', $request->type_code_transaction);
        $data = $this->filterAndPaginate($request, $pr, $filterableColumns);
        return $this->successResponse($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('report::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('report::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('report::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
