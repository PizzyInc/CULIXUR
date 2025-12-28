<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderChefNotification extends Notification implements ShouldQueue
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
                    ->subject('New Assignment Opportunity - Culixur')
                    ->greeting('Hello Chef ' . $notifiable->name . ',')
                    ->line('You have been selected for a new culinary orchestration.')
                    ->line('Order ID: #' . $this->order->order_id)
                    ->line('Menu: ' . $this->order->menu)
                    ->line('Location: ' . $this->order->address)
                    ->action('View Assignment', url('/culinary'))
                    ->line('Please log in to confirm your availability.');
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
            'message' => 'New assignment: ' . $this->order->menu . ' for ' . $this->order->member->name,
            'type' => 'NEW_ASSIGNMENT',
        ];
    }
}
