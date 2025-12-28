<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusUpdatedAdminNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $chef;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, $chef)
    {
        $this->order = $order;
        $this->chef = $chef;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Only DB for status updates to avoid admin spam, can add mail if needed.
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_id,
            'chef_name' => $this->chef->name,
            'new_status' => $this->order->status,
            'message' => 'Chef ' . $this->chef->name . ' updated order #' . $this->order->order_id . ' to ' . $this->order->status,
            'type' => 'ADMIN_STATUS_UPDATE',
        ];
    }
}
