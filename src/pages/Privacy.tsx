import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mx-auto max-w-4xl'>
        <CardContent className='p-6'>
          <h1 className='mb-6 text-3xl font-bold'>Privacy Policy</h1>
          <p className='text-foreground-muted text-sm'>Last Modified: January 24, 2025</p>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>1. Introduction</h2>
            <p className='text-foreground-muted'>
              This privacy policy explains how we collect and use your data while using Blueprint.
              We take your privacy seriously and are committed to protecting your personal
              information.
            </p>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>2. Information We Collect</h2>

            <h3 className='mb-3 text-lg font-semibold'>2.1 Account Information</h3>
            <ul className='text-foreground-muted mb-4 list-disc pl-6'>
              <li>Email address</li>
              <li>Username</li>
              <li>Display name</li>
              <li>Profile picture</li>
              <li>OAuth data (if using third-party login)</li>
            </ul>

            <h3 className='mb-3 text-lg font-semibold'>2.2 Usage Data</h3>
            <ul className='text-foreground-muted mb-4 list-disc pl-6'>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Time and date of visits</li>
              <li>Download statistics</li>
            </ul>

            <h3 className='mb-3 text-lg font-semibold'>2.3 Content Data</h3>
            <ul className='text-foreground-muted list-disc pl-6'>
              <li>Uploaded mods and schematics</li>
              <li>Comments and ratings</li>
              <li>Project descriptions</li>
            </ul>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>3. How We Use Your Information</h2>
            <ul className='text-foreground-muted list-disc pl-6'>
              <li>Provide and maintain the Service</li>
              <li>Process uploads and downloads</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Prevent abuse and maintain security</li>
              <li>Communicate with you about your account</li>
              <li>Generate anonymous usage statistics</li>
            </ul>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>4. Data Sharing and Third Parties</h2>
            <p className='text-foreground-muted mb-4'>We may share your information with:</p>
            <ul className='text-foreground-muted list-disc pl-6'>
              <li>Service providers that help us operate Blueprint</li>
              <li>Law enforcement when required by law</li>
              <li>Other users (only your public profile information)</li>
            </ul>
            <p className='text-foreground-muted mt-4'>
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>5. Data Security</h2>
            <ul className='text-foreground-muted list-disc pl-6'>
              <li>All data is encrypted in transit and at rest</li>
              <li>Access to personal data is restricted to authorized personnel</li>
              <li>Regular security audits are performed</li>
              <li>We promptly address security vulnerabilities</li>
            </ul>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>6. Your Rights</h2>
            <p className='text-foreground-muted mb-4'>You have the right to:</p>
            <ul className='text-foreground-muted list-disc pl-6'>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Restrict processing of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>7. Cookies</h2>
            <p className='text-foreground-muted'>
              We use cookies to maintain your session, remember your preferences, and collect usage
              data. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>8. Children&apos;s Privacy</h2>
            <p className='text-foreground-muted'>
              Our Service is not intended for children under 13. We do not knowingly collect
              personal information from children under 13. If you become aware that a child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>9. Data Retention</h2>
            <p className='text-foreground-muted'>
              We retain your personal information for as long as necessary to provide the Service
              and fulfill the purposes outlined in this policy. You can request deletion of your
              account and associated data at any time.
            </p>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>10. Changes to Privacy Policy</h2>
            <p className='text-foreground-muted'>
              We may update this privacy policy periodically. We will notify you of any material
              changes by posting the new policy on this page and updating the &quot;Last
              Modified&quot; date.
            </p>
          </section>

          <section className=''>
            <h2 className='mb-4 text-xl font-semibold'>11. International Data Transfers</h2>
            <p className='text-foreground-muted'>
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section>
            <h2 className='mb-4 text-xl font-semibold'>12. Contact Us</h2>
            <p className='text-foreground-muted'>
              For questions about this privacy policy or your personal data, contact us at:
              privacy@blueprint-site.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
