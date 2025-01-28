import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-foreground-muted mb-8">Last Modified: January 24, 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground-muted">
              By accessing or using Blueprint (the "Service"), you agree to be bound by these Terms of Service. 
              The Service is operated by Blueprint ("we", "us", "our"). If you do not agree to these terms, 
              do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-foreground-muted mb-4">
              Blueprint is a platform for sharing and discovering Minecraft mods, schematics, and related content. 
              The Service allows users to:
            </p>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>Upload and share Minecraft mods and schematics</li>
              <li>Download content shared by other users</li>
              <li>Interact with other users through comments and ratings</li>
              <li>Manage their content and profile</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Eligibility</h2>
            <p className="text-foreground-muted">
              You must be at least 13 years old to use the Service. By using the Service, you represent and 
              warrant that you meet this requirement and have the capacity to enter into these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Content and Intellectual Property</h2>
            
            <h3 className="text-lg font-semibold mb-3">4.1 User Content</h3>
            <ul className="list-disc pl-6 text-foreground-muted mb-4">
              <li>You retain all rights to content you upload ("User Content")</li>
              <li>You grant us a non-exclusive, worldwide, royalty-free license to display and distribute your User Content through the Service</li>
              <li>You represent that you have all necessary rights to the content you upload</li>
              <li>We may remove any content that violates these terms</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">4.2 Content Rules</h3>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>Content must not contain malware or malicious code</li>
              <li>Content must not violate copyright or other intellectual property rights</li>
              <li>Content must be accurately described</li>
              <li>Content must comply with our Content Guidelines</li>
              <li>Adult content, inappropriate material, and content promoting illegal activities are prohibited</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. User Conduct</h2>
            <p className="text-foreground-muted mb-4">Users must not:</p>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>Harass, abuse, or harm other users</li>
              <li>Upload malicious content or attempt to damage the Service</li>
              <li>Impersonate others or misrepresent affiliations</li>
              <li>Use automated methods to access the Service without permission</li>
              <li>Extract data or content in bulk from the Service</li>
              <li>Attempt to interfere with the proper operation of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Account Security</h2>
            <p className="text-foreground-muted mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of any unauthorized access to your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Service Modifications</h2>
            <p className="text-foreground-muted mb-4">We reserve the right to:</p>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>Modify or discontinue any part of the Service</li>
              <li>Remove content at our discretion</li>
              <li>Update these terms at any time</li>
              <li>Limit or restrict access to any features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Disclaimers</h2>
            
            <h3 className="text-lg font-semibold mb-3">8.1 General Disclaimers</h3>
            <ul className="list-disc pl-6 text-foreground-muted mb-4">
              <li>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</li>
              <li>WE DO NOT GUARANTEE AVAILABILITY OR RELIABILITY OF THE SERVICE</li>
              <li>WE ARE NOT RESPONSIBLE FOR USER-UPLOADED CONTENT</li>
              <li>THIS IS NOT AN OFFICIAL MINECRAFT SERVICE AND IS NOT AFFILIATED WITH MOJANG OR MICROSOFT</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">8.2 Content Disclaimers</h3>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>We do not verify the functionality or safety of uploaded content</li>
              <li>Users download and use content at their own risk</li>
              <li>We make no guarantees about the compatibility or performance of any content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-foreground-muted uppercase">TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY:</p>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>Direct, indirect, incidental, or consequential damages</li>
              <li>Loss of data, profits, or revenue</li>
              <li>Damages resulting from downloaded content</li>
              <li>Service interruptions or failures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
            <p className="text-foreground-muted">
              We may terminate or suspend your account and access to the Service:
            </p>
            <ul className="list-disc pl-6 text-foreground-muted">
              <li>For violations of these terms</li>
              <li>For any reason at our discretion</li>
              <li>Without prior notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-foreground-muted">
              These terms are governed by the laws of the State of Delaware. Any disputes shall be resolved 
              in the courts of Delaware.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Privacy</h2>
            <p className="text-foreground-muted">
              Use of the Service is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, 
              which is incorporated into these terms by reference. By using the Service, you acknowledge that 
              you have read and understand our Privacy Policy and consent to the collection, use, and disclosure 
              of your information as described therein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-foreground-muted">
              We may update these terms at any time. Continued use of the Service after changes constitutes 
              acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-foreground-muted">
              Questions about these terms should be sent to: support@blueprint-site.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">15. Entire Agreement</h2>
            <p className="text-foreground-muted">
              These Terms of Service constitute the entire agreement between you and Blueprint regarding use 
              of the Service.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;