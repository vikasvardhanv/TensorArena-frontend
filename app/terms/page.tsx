import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-black text-gray-300 p-8 pt-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

            <section className="space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold text-white mt-8">1. Agreement to Terms</h2>
                <p>
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you")
                    and TensorArena ("we," "us" or "our"), concerning your access to and use of the TensorArena website as well as any other media form,
                    media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8">2. Intellectual Property Rights</h2>
                <p>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs,
                    audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein
                    (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8">3. User Representations</h2>
                <p>
                    By using the Site, you represent and warrant that:
                    (1) all registration information you submit will be true, accurate, current, and complete;
                    (2) you will maintain the accuracy of such information and promptly update such registration information as necessary;
                    (3) you have the legal capacity and you agree to comply with these Terms of Service.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8">4. Subscriptions and Payments</h2>
                <p>
                    TensorArena offers premium subscriptions. By selecting a subscription service, you agree to pay the fees designated for that service.
                    Payments are non-refundable. Subscription codes are valid for one-time use and grant access for the specified duration.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8">5. Contact Us</h2>
                <p>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site,
                    please contact us at support@tensorarena.com.
                </p>
            </section>
        </div>
    );
}
