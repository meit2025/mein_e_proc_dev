<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

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
}
