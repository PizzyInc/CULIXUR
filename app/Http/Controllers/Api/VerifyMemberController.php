<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;

class VerifyMemberController extends Controller
{
    public function verify($qrCode)
    {
        try {
            // Find member by QR code
            $member = User::where('qr_code', $qrCode)
                ->where('role', 'MEMBER')
                ->first();

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid QR code or member not found'
                ], 404);
            }

            // Find active order for this member
            $order = Order::where('member_id', $member->id)
                ->whereIn('status', ['PENDING', 'ASSIGNED', 'ACCEPTED', 'EN_ROUTE'])
                ->with(['member', 'chef'])
                ->latest()
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active order found for this member'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'active_order' => $order,
                'member' => $member
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error verifying member: ' . $e->getMessage()
            ], 500);
        }
    }
}
