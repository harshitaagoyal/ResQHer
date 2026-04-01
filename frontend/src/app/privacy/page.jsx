'use client';

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto pt-8">
        
        {/* Main Title - Standard Professional Size */}
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight mb-4">
          Privacy Policy
        </h1>
        
        {/* Divider line like the image */}
        <div className="w-10 h-1 bg-slate-800 mb-6"></div>

        <p className="text-[15px] text-slate-600 mb-10">
          Last Updated: May 5, 2023
        </p>

        <div className="space-y-8">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4">
              What Does This Privacy Policy Cover?
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              In your dealings with <span className="font-semibold">ResQHer</span> which includes our apps, you may provide us with personal information. Personal information for the purposes of this Privacy Policy means information that personally identifies you, like your name, street address, email address, phone number, and other personally identifiable information that you choose to give to us or that we collect in relation to your use of ResQHer.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4">
              What Information Do We Collect?
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600 mb-6">
              We may collect other information when you use our Products and Services, such as:
            </p>
            
            <ul className="space-y-6">
              <li className="text-[15px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-800">Registration and Profile Information:</span> When you register to use ResQHer services or update your profile, we may collect various kinds of information about you, including your name, username, phone number, photos, email addresses, and date of birth. It might also include locations, information about emergencies and incidents, and contact details of your friends, family, and guardians.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-800">Device Information:</span> Information about your device, such as your mobile device identifiers, IP address, or browser information (including browser type and language preference).
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-800">Location:</span> We collect your location through your GPS coordinates (e.g., latitude/longitude) available through your mobile device.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-800">Contact List:</span> When you use the Personal Tracking Feature in ResQHer app, we collect contact details of your friends, family, and guardians shared by you.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-800">Cookies:</span> When processing your personal data, operating our websites, or generally providing or supporting our Services, we may use cookies and similar technologies for analytics.
              </li>
            </ul>
          </section>

          {/* Section 3 - Uppercase Heading like image */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4 uppercase">
              HOW WE USE YOUR INFORMATION?
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600 mb-4">
              The data we collect and store enables us to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[15px] text-slate-600 font-medium">
              <li>Provide ResQHer features Like Safety Score and Tracking;</li>
              <li>Create your account and identify you as a user;</li>
              <li>Respond to your inquiries and emails;</li>
              <li>Improve the application and send service-related communications;</li>
              <li>Monitor the effectiveness of our Service and campaigns.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4">
              How Can I Update User Access or Deactivate my Account?
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              If your personal information changes, you may email us at <span className="text-blue-600 underline">resqher80@gmail.com</span> to deactivate your account. You may also correct, update, or amend your personal information in your profile settings within the app.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4">
              How we protect your information
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              We are committed to protecting the information we collect. While no Web site can guarantee security, we have implemented appropriate administrative, technical, and physical security procedures to help protect the personal information you provide to us.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}