<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>You Have Been Selected</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .highlight { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You Have Been Selected!</h1>
            <p>Culixur</p>
        </div>
        
        <div class="content">
            <h2>Congratulations Chef {{ $chef->name }}!</h2>
            
            <div class="highlight">
                <strong>Great News!</strong> You have been selected by a member for their upcoming service. This means your skills and expertise are highly valued.
            </div>
            
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
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ route('chef.dashboard') }}" class="button">View Order in Dashboard</a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Log in to your chef dashboard</li>
                <li>Review the order details</li>
                <li>Accept or decline the order</li>
                <li>If accepted, prepare for the service</li>
            </ol>
            
            <p>Thank you for being part of our elite chef community!</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Culixur. All rights reserved.</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
