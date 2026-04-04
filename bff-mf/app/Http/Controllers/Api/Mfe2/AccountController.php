<?php

namespace App\Http\Controllers\Api\Mfe2;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AccountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $accounts = Account::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['accounts' => $accounts]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'provider' => 'nullable|string',
            'account_number' => 'nullable|string',
            'balance' => 'nullable|numeric',
        ]);

        $account = Account::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'active',
        ]);

        return response()->json(['account' => $account], 201);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $account = Account::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json(['account' => $account]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $account = Account::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'type' => 'nullable|string',
            'provider' => 'nullable|string',
            'account_number' => 'nullable|string',
            'balance' => 'nullable|numeric',
            'status' => 'nullable|string',
        ]);

        $account->update($validated);

        return response()->json(['account' => $account]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $account = Account::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $account->delete();

        return response()->json(['message' => 'Compte supprimé']);
    }
}