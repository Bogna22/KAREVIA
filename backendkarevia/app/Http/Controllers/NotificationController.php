<?php
namespace App\Http\Controllers;

use App\Models\KareviaNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            KareviaNotification::where('user_id', $request->user()->id)
                ->orderByDesc('created_at')->take(50)->get()
        );
    }

    public function unreadCount(Request $request)
    {
        return response()->json(['count' => KareviaNotification::where('user_id', $request->user()->id)->where('lue', false)->count()]);
    }

    public function markRead(Request $request, KareviaNotification $notification)
    {
        if ($notification->user_id !== $request->user()->id)
            return response()->json(['message' => 'Non autorisé.'], 403);
        $notification->update(['lue' => true]);
        return response()->json(['message' => 'Notification lue.']);
    }

    public function markAllRead(Request $request)
    {
        KareviaNotification::where('user_id', $request->user()->id)->update(['lue' => true]);
        return response()->json(['message' => 'Toutes les notifications marquées comme lues.']);
    }

    public function destroy(Request $request, KareviaNotification $notification)
    {
        if ($notification->user_id !== $request->user()->id)
            return response()->json(['message' => 'Non autorisé.'], 403);
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée.']);
    }
}
