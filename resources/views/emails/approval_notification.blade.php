<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Approval Notification</title>
    <style>
        /* Styling untuk email */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #003366;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-width: 120px;
            height: auto;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h1 {
            color: #333;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
        .footer a {
            color: #003366;
            text-decoration: none;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
            {{-- <img src="https://www.mitsubishielectric.co.id/assets_gws_template_responsive/img/mein-logo-header1.png" alt="Company Logo">  <!-- Ganti dengan URL logo Anda --> --}}
            <h2>Approval Notification {{ucfirst(strtolower($type))}}</h2>
        </div>

        <!-- Email Content -->
        <div class="content">
            <h1>Dear {{ $user->name }},</h1>  <!-- Nama pengguna yang dikirim dari mailable -->
            <p> {{ucfirst(strtolower($type))}} document is awaiting your <strong>approved</strong>. Kindly log in to the website to review and approve it.</p>
            <p>Please feel free to contact us if you have any questions or concerns.</p>
            <p>Thank you for your patience!</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>Mitsubishi Electric</strong></p>
            <p>If you have any questions, please <a href="mailto:support@example.com">contact us</a>.</p>
            <p><small>&copy; {{ date('Y') }} Mitsubishi Electric. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
