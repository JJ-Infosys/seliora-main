'use client';

import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setTerms(data.terms || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderTerms = () => {
    if (!terms.trim()) return (
      <p className="text-gray-500 dark:text-slate-400 italic">No terms and conditions have been added yet.</p>
    );
    return (
      <div
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: terms }}
      />
    );
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 py-16 border-b border-transparent dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-slate-100 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600 dark:text-slate-300">Please read these terms carefully before using Seloria.</p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-8">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              By using Seloria, you agree to these Terms and Conditions. If you do not agree, please do not use our website.
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
                ))}
              </div>
            ) : renderTerms()}
          </div>
        </div>
      </section>
    </div>
  );
}
