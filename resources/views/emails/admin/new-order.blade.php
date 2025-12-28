<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Order Received</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Order Received</h1>
            <p>Culixur Admin</p>
        </div>
        
        <div class="content">
            <h2>Admin Alert</h2>
            <p>A new order has been placed and requires your attention for chef assignment.</p>
            
            <div class="alert">
                <strong>Action Required:</strong> Please assign a chef to this order from the member's selected preferences.
            </div>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> #{{ $order->id }}</p>
                <p><strong>Service Type:</strong> {{ $order->service_type }}</p>
                <p><strong>Menu:</strong> {{ $order->menu }}</p>
                <p><strong>Date & Time:</strong> {{ \Carbon\Carbon::parse($order->datetime)->format('M j, Y \a\t g:i A') }}</p>
                <p><strong>Location:</strong> {{ $order->address }}</p>
                <p><strong>Guest Count:</strong> {{ $order->guest_count }}</p>
                <p><strong>Price:</strong> ₦{{ number_format($order->price) }}</p>
                <p><strong>Status:</strong> {{ $order->status }}</p>
            </div>
            
            <div class="order-details">
                <h3>Member Information</h3>
                <p><strong>Name:</strong> {{ $member->name }}</p>
                <p><strong>Member ID:</strong> {{ $member->member_id }}</p>
                <p><strong>Email:</strong> {{ $member->email }}</p>
                <p><strong>Phone:</strong> {{ $member->phone ?? 'Not provided' }}</p>
                <p><strong>Membership:</strong> {{ $member->membership_tier ?: 'Standard' }}</p>
            </div>
            
            @if($selectedChefs->count() > 0)
                <div class="order-details">
                    <h3>Member's Chef Preferences</h3>
                    <p>The member selected the following chefs:</p>
                    <ul>
                        @foreach($selectedChefs as $chef)
                            <li><strong>{{ $chef->name }}</strong> - {{ $chef->chefProfile?->specialty }}</li>
                        @endforeach
                    </ul>
                    <p><em>Please assign one of these chefs to the order.</em></p>
                </div>
            @endif
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ route('admin.orders.index') }}" class="button">Manage Orders</a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Review the member's chef preferences</li>
                <li>Check chef availability</li>
                <li>Assign the most suitable chef</li>
                <li>Monitor order progress</li>
            </ol>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Culixur. All rights reserved.</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
