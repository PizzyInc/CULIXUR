<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Order Assignment</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Order Assignment</h1>
            <p>Culixur</p>
        </div>
        
        <div class="content">
            <h2>Hello Chef!</h2>
            <p>A new order has been assigned to you. Please review the details below:</p>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Service Type:</strong> {{ $order->service_type }}</p>
                <p><strong>Menu:</strong> {{ $order->menu }}</p>
                <p><strong>Date & Time:</strong> {{ \Carbon\Carbon::parse($order->datetime)->format('M j, Y \a\t g:i A') }}</p>
                <p><strong>Location:</strong> {{ $order->address }}</p>
                <p><strong>Guest Count:</strong> {{ $order->guest_count }}</p>
                @if($order->allergies)
                    <p><strong>Allergies:</strong> {{ $order->allergies }}</p>
                @endif
                <p><strong>Price:</strong> ₦{{ number_format($order->price) }}</p>
            </div>
            
            <div class="order-details">
                <h3>Member Information</h3>
                <p><strong>Name:</strong> {{ $member->name }}</p>
                <p><strong>Member ID:</strong> {{ $member->member_id }}</p>
                <p><strong>Email:</strong> {{ $member->email }}</p>
                <p><strong>Membership:</strong> {{ $member->membership_tier ?: 'Standard' }}</p>
            </div>
            
            @if($selectedChefs->count() > 0)
                <div class="order-details">
                    <h3>Selected Chefs</h3>
                    <p>This member selected the following chefs:</p>
                    <ul>
                        @foreach($selectedChefs as $chef)
                            <li>{{ $chef->name }} - {{ $chef->chefProfile?->specialty }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ route('chef.dashboard') }}" class="button">View Order in Dashboard</a>
            </div>
            
            <p>Please log in to your chef dashboard to accept or decline this order.</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Culixur. All rights reserved.</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
