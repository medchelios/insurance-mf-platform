<?php

namespace App\Http\Controllers\Api\Mfe1;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClaimController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $claims = Claim::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['claims' => $claims]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'description' => 'nullable|string',
            'incident_date' => 'nullable|date',
            'estimated_amount' => 'nullable|numeric',
        ]);

        $claim = Claim::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'nouveau',
        ]);

        return response()->json(['claim' => $claim], 201);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $claim = Claim::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json(['claim' => $claim]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $claim = Claim::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'estimated_amount' => 'nullable|numeric',
        ]);

        $claim->update($validated);

        return response()->json(['claim' => $claim]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $claim = Claim::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $claim->delete();

        return response()->json(['message' => 'Sinistre supprimé']);
    }
}