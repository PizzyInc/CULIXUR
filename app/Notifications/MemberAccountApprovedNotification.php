<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MemberAccountApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $passphrase;

    /**
     * Create a new notification instance.
     */
    public function __construct($passphrase)
    {
        $this->passphrase = $passphrase;
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
                    ->subject('Welcome to Culixur - Account Approved')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('We are pleased to inform you that your membership application has been approved.')
                    ->line('You can now log in to your dashboard using the following credentials:')
                    ->line('Member ID: ' . $notifiable->member_id)
                    ->line('Temporary Passphrase: ' . $this->passphrase)
                    ->action('Log In Now', url('/login'))
                    ->line('Please change your passphrase upon your first login.')
                    ->line('Welcome to the elite culinary circle.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your account has been approved. Welcome to Culixur!',
            'type' => 'ACCOUNT_APPROVED',
        ];
    }
}
