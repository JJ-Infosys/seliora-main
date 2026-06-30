'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Seloria</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Where timeless craftsmanship meets modern elegance — every piece tells a story.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Crafting Beauty Since Day One</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Seloria was born from a passion for jewelry that transcends trends. We believe that the right piece of jewelry doesn't just accessorize an outfit — it becomes a part of who you are.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every ring, necklace, earring, and bracelet in our collection is thoughtfully designed and carefully crafted. We source only the finest materials to ensure that each piece is not just beautiful, but built to last a lifetime.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From bridal jewelry to everyday elegance, Seloria has something for every moment, every milestone, and every woman.
              </p>
            </div>
            <div className="relative">
              <div className="bg-amber-100 rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💎</div>
                  <p className="text-amber-800 font-semibold text-xl">Premium Quality</p>
                  <p className="text-amber-600 mt-2">Handcrafted with love</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Seloria?</h2>
            <p className="text-gray-600 mt-2">Our commitment to quality, beauty, and trust</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✦', title: 'Handcrafted Quality', desc: 'Every piece is carefully crafted by skilled artisans using traditional techniques combined with modern design.' },
              { icon: '🔒', title: 'Certified Authenticity', desc: 'All our jewelry comes with authenticity certificates ensuring you receive genuine, high-quality materials.' },
              { icon: '💝', title: 'Gifting Made Easy', desc: 'Beautiful packaging and gift options make Seloria the perfect choice for every special occasion.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '500+', label: 'Products' },
              { number: '10,000+', label: 'Happy Customers' },
              { number: '5★', label: 'Average Rating' },
              { number: '100%', label: 'Authentic Jewelry' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold">{s.number}</p>
                <p className="text-amber-100 mt-1 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
