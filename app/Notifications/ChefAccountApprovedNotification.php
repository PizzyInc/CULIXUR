<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChefAccountApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
                    ->subject('Chef Account Approved - Culixur')
                    ->greeting('Hello Chef ' . $notifiable->name . ',')
                    ->line('Congratulations! Your chef account has been approved by the Culixur administration.')
                    ->line('You can now start receiving culinary orchestration assignments on your dashboard.')
                    ->action('Go to Dashboard', url('/culinary'))
                    ->line('We look forward to your exceptional service.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your chef account has been approved. You are now live!',
            'type' => 'CHEF_APPROVED',
        ];
    }
}
