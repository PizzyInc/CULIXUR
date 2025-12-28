<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->order->getStatusDisplayAttribute();
        
        return (new MailMessage)
                    ->subject('Order Status Update - Culixur')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('The status of your culinary orchestration #' . $this->order->order_id . ' has been updated.')
                    ->line('New Status: ' . $status)
                    ->action('View Order Status', url('/dashboard'))
                    ->line('Thank you for choosing Culixur.');
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
            'new_status' => $this->order->status,
            'message' => 'Your order #' . $this->order->order_id . ' status is now ' . $this->order->status,
            'type' => 'ORDER_STATUS_CHANGED',
        ];
    }
}
