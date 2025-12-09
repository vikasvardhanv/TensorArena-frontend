import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-gray-300 p-8 pt-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

            <section className="space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold text-white mt-8">1. Introduction</h2>
                <p>
                    Welcome to TensorArena ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                    If you have any questions or concerns about this privacy notice or our practices with regard to your personal information,
                    please contact us.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8">2. Information We Collect</h2>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the website,
                    express an interest in obtaining information about us or our products and services, when you participate in activities on the website,
                    or otherwise when you contact us.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Personal Data: Name, email address, and other contact data.</li>
                    <li>Payment Data: Payment information is processed securely by PayPal. We do not store credit card details.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8">3. How We Use Your Information</h2>
                <p>
                    We use personal information collected via our website for a variety of business purposes described below.
                    We process your personal information for these purposes in reliance on our legitimate business interests,
                    in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To post testimonials.</li>
                    <li>To request feedback.</li>
                    <li>To manage user accounts.</li>
                    <li>To send administrative information to you.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8">4. Contact Us</h2>
                <p>
                    If you have questions or comments about this notice, you may email us at support@tensorarena.com.
                </p>
            </section>
        </div>
    );
}
