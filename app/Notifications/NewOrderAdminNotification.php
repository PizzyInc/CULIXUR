<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderAdminNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
                    ->subject('System Alert: New Order Created')
                    ->greeting('Hello Admin,')
                    ->line('A new booking orchestration has been initiated.')
                    ->line('Order ID: #' . $this->order->order_id)
                    ->line('Member: ' . $this->order->member->name)
                    ->line('Menu: ' . $this->order->menu)
                    ->action('Manage Booking', url('/admin'))
                    ->line('Please review and monitor logistics.');
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
            'message' => 'New order created by ' . $this->order->member->name,
            'type' => 'ADMIN_NEW_ORDER',
        ];
    }
}
