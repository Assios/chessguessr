import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => ({
  title: 'Privacy Policy - Chessguessr',
});

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">Information We Collect</h2>
          <p>
            Chessguessr does not require accounts or collect personal
            information. Game progress and statistics are stored locally in your
            browser.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Cookies</h2>
          <p>
            We use cookies to store your preferences (such as theme settings)
            and to improve your experience on the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{' '}
            <a href="mailto:mail@chessguessr.com" className="underline">
              mail@chessguessr.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
