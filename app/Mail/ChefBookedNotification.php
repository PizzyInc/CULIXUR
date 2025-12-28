<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ChefBookedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $chef;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order, User $chef)
    {
        $this->order = $order;
        $this->chef = $chef;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('You Have Been Selected for an Order - Culixur')
                    ->view('emails.chef.booked')
                    ->with([
                        'order' => $this->order,
                        'member' => $this->order->member,
                        'chef' => $this->chef,
                    ]);
    }
}
