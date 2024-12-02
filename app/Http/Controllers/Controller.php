<?php

namespace App\Http\Controllers;

use Clue\Redis\Protocol\Model\Request;
use DateTime;
use DateTimeZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\Approval;
use Modules\Gateway\Models\Log;

abstract class Controller
{
    //
    /**
     * Default JSON response for success.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse($data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status_code' => $statusCode,
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Default JSON response for error.
     *
     * @param string $message
     * @param int $statusCode
     * @param mixed $errors
     * @return JsonResponse
     */
    protected function errorResponse(string $message = 'Error', int $statusCode = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'status_code' => $statusCode,
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    /**
     * Default JSON response for not found.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    public function filterAndPaginate($request, $model, array $filterableColumns, $userData = false)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = $model instanceof \Illuminate\Database\Eloquent\Builder ? $model : $model::query();

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Menggunakan fungsi helper
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request, $filterableColumns) {
                foreach ($filterableColumns as $column) {
                    $q->orWhere($column, 'ILIKE', '%' . $request->search . '%');
                }
            });
        }

        if ($userData) {
            if ($request->approval == 1) {

                $data = Approval::where('user_id', Auth::user()->id)
                    ->where('document_name', 'PR')->pluck('document_id')->toArray();
                dd($data,  Auth::user()->id);
                $query = $query->whereIn('id', $data);
            } else {
                $query->where(function ($q) use ($request, $filterableColumns) {
                    $q->orWhere('user_id', Auth::user()->id)
                        ->orWhere('createdBy', Auth::user()->id);
                });
            }
        }

        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    protected function applyColumnFilter($query, $column, $operator, $value)
    {
        switch ($operator) {
            case 'equals':
                return $query->where($column, '=', $value);
            case 'does not equal':
                return $query->where($column, '!=', $value);
            case 'contains':
                return $query->where($column, 'like', "%{$value}%");
            case 'does not contain':
                return $query->where($column, 'not like', "%{$value}%");
            case 'starts with':
                return $query->where($column, 'like', "{$value}%");
            case 'ends with':
                return $query->where($column, 'like', "%{$value}");
            case 'is empty':
                return $query->where(function ($query) use ($column) {
                    $query->where($column, '=', '')
                        ->orWhereNull($column);
                });
            case 'is not empty':
                return $query->where(function ($query) use ($column) {
                    $query->where($column, '!=', '')
                        ->whereNotNull($column);
                });
            case 'is any of':
                // Assumes value is a comma-separated string of options
                $values = explode(',', $value);
                return $query->whereIn($column, $values);
            default:
                // Default fallback (e.g., equals)
                return $query->where($column, '=', $value);
        }
    }

    protected function logToDatabase($id, $functionName, $level, $message, $context = [])
    {
        Log::create([
            'releted_id' => $id,
            'function_name' => $functionName,
            'level' => $level,
            'message' => $message,
            'context' => json_encode($context), // Store additional context as JSON
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    protected function DateTimeNow()
    {
        $date = new DateTime('now', new DateTimeZone('Asia/Jakarta'));
        return $date->format('Y-m-d H:i:s');
    }
}
