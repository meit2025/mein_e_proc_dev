<?php

namespace Modules\PurchaseRequisition\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\PurchaseRequisition\Http\Requests\Procurement as RequestsProcurement;
use Modules\PurchaseRequisition\Models\Item;
use Modules\PurchaseRequisition\Models\Procurement;
use Modules\PurchaseRequisition\Models\Vendor;
use Modules\PurchaseRequisition\Models\VendorUnit;

class ProcurementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterableColumns = [
            'const_center',
            'cost_center_budgeted',
            'transaction_budgeted',
            'vendor_remark',
            'vendor_selected_competitive_lowest_price',
            'vendor_selected_competitive_price',
            'vendor_selected_competitive_capable',
            'selected_vendor_remark',
        ];
        $data = $this->filterAndPaginate($request, Procurement::class, $filterableColumns);
        return $this->successResponse($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('purchaserequisition::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RequestsProcurement $request)
    {
        //
        // Create the procurement record
        $procurement = Procurement::create($request->only([
            'const_center',
            'cost_center_budgeted',
            'transaction_budgeted',
            'vendor_remark',
            'vendor_selected_competitive_lowest_price',
            'vendor_selected_competitive_price',
            'vendor_selected_competitive_capable',
            'selected_vendor_remark',
        ]));

        // Create associated items
        foreach ($request->item as $itemData) {
            Item::create([
                'procurement_id' => $procurement->id,
                'material_number' => $itemData['material_number'],
                'qty' => $itemData['qty'],
            ]);
        }

        // Create associated vendors and vendor units
        foreach ($request->vendor as $vendorData) {
            $vendor = Vendor::create([
                'procurement_id' => $procurement->id,
                'vendor' => $vendorData['vendor'],
                'vendor_winner' => $vendorData['vendor_winner'],
            ]);

            foreach ($vendorData['unit'] as $unitData) {
                VendorUnit::create([
                    'vendor_id' => $vendor->id,
                    'unit_price' => $unitData['unit_price'],
                    'total_amount' => $unitData['total_amount'],
                    'other_criteria' => $unitData['other_criteria'],
                ]);
            }
        }
        return $this->successResponse($request->all());
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $procurement = Procurement::with(['vendor.unit', 'item'])->findOrFail($id);
        return response()->json($procurement);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('purchaserequisition::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RequestsProcurement $request, $id)
    {
        //
        $procurement = Procurement::findOrFail($id);

        // Update procurement details
        $procurement->update($request->only([
            'const_center',
            'cost_center_budgeted',
            'transaction_budgeted',
            'vendor_remark',
            'vendor_selected_competitive_lowest_price',
            'vendor_selected_competitive_price',
            'vendor_selected_competitive_capable',
            'selected_vendor_remark',
        ]));

        // Update or recreate items
        $procurement->items()->delete();
        foreach ($request->item as $itemData) {
            Item::create([
                'procurement_id' => $procurement->id,
                'material_number' => $itemData['material_number'],
                'qty' => $itemData['qty'],
            ]);
        }

        // Update or recreate vendors and vendor units
        $procurement->vendors()->delete();
        foreach ($request->vendor as $vendorData) {
            $vendor = Vendor::create([
                'procurement_id' => $procurement->id,
                'vendor' => $vendorData['vendor'],
                'vendor_winner' => $vendorData['vendor_winner'],
            ]);

            foreach ($vendorData['unit'] as $unitData) {
                VendorUnit::create([
                    'vendor_id' => $vendor->id,
                    'unit_price' => $unitData['unit_price'],
                    'total_amount' => $unitData['total_amount'],
                    'other_criteria' => $unitData['other_criteria'],
                ]);
            }
        }
        return $this->successResponse($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $procurement = Procurement::findOrFail($id);
        $procurement->delete();

        return $this->successResponse($procurement);
    }
}
