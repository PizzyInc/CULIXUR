<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmationMemberNotification extends Notification implements ShouldQueue
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
                    ->subject('Booking Confirmation - Culixur')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('Your culinary booking has been received and is being orchestrated.')
                    ->line('Order ID: #' . $this->order->order_id)
                    ->line('Menu: ' . $this->order->menu)
                    ->line('Date: ' . $this->order->datetime->format('M d, Y H:i'))
                    ->action('View Dashboard', url('/dashboard'))
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
            'message' => 'Your booking for ' . $this->order->menu . ' has been confirmed.',
            'type' => 'BOOKING_CONFIRMATION',
        ];
    }
}
