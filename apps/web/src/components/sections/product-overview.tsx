import { SanityImage } from '@/components/sanity-image';
import { RichText } from '@/components/richtext';
import { Button } from '@workspace/ui/components/button';
import { useState } from 'react';

interface Feature {
  _id: string;
  title?: string;
  ancestryDnaRequired?: boolean;
}

interface ProductOverviewProps {
  products: Array<{
    product?: {
      _id: string;
      title?: string;
      image?: any;
      price?: number;
      description?: any;
      features?: Feature[];
    };
  }>;
  loggedInProducts?: Array<{
    _id: string;
    title?: string;
    image?: any;
    price?: number;
    description?: any;
    features?: Feature[];
  }>;
  callToAction: string;
  disclaimers?: Array<{ _id: string; text: any }>;
}

export function ProductOverview({ products, loggedInProducts, callToAction, disclaimers }: ProductOverviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [userState, setUserState] = useState<'loggedOut' | 'loggedIn'>('loggedOut');

  // Choose which products array to display
  let displayProducts: any[] = [];
  if (userState === 'loggedIn' && loggedInProducts?.length) {
    displayProducts = loggedInProducts;
  } else {
    displayProducts = products.map((item) => item.product).filter(Boolean);
  }

  if (!displayProducts?.length) return null;
  return (
    <section className="my-16">
      <div className="mb-4 flex justify-end">
        <label htmlFor="userState" className="mr-2 font-medium text-sm">View as:</label>
        <select
          id="userState"
          value={userState}
          onChange={e => setUserState(e.target.value as 'loggedOut' | 'loggedIn')}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="loggedOut">Logged Out</option>
          <option value="loggedIn">Logged In</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayProducts.map((product, idx) => {
          if (!product) return null;
          // Use _id if available, otherwise fallback to idx
          const key = product._id || idx;
          return (
            <div
              key={key}
              className="flex flex-col rounded-lg border bg-background p-6 shadow-sm items-center text-center h-full"
            >
              {product.image && (
                <SanityImage
                  asset={product.image}
                  alt={product.image.alt || product.title}
                  width={400}
                  height={250}
                  className="mb-4 h-48 w-full object-cover rounded"
                />
              )}
              <div className="mb-2 text-xl font-semibold text-primary text-center">
                {typeof product.price === 'number' ? (
                  <span>ONLY ${Math.floor(product.price)}*</span>
                ) : ''}
              </div>
              <div className="flex flex-col justify-center items-center min-h-[90px] mb-2 w-full">
                <h2 className="text-2xl font-bold text-center">{product.title}</h2>
              </div>
              <div className="flex-grow flex flex-col w-full">
                <Button className="mb-4 w-full justify-center">{callToAction}</Button>
                <button
                  className="text-blue-600 underline text-sm mb-4"
                  type="button"
                  onClick={() => setOpenIndex(idx)}
                >
                  What's included
                </button>
                {openIndex === idx && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md w-full relative text-left">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl"
                        onClick={() => setOpenIndex(null)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <h3 className="mb-4 text-2xl font-bold text-center">{product.title}</h3>
                      {product.image && (
                        <SanityImage
                          asset={product.image}
                          alt={product.image.alt || product.title}
                          width={400}
                          height={250}
                          className="mb-4 h-48 w-full object-cover rounded"
                        />
                      )}
                      <div className="text-muted-foreground text-center">
                        <RichText richText={product.description} />
                      </div>
                    </div>
                  </div>
                )}
                {product.features && product.features.length > 0 && (
                  <ul className="list-disc pl-5 text-center flex flex-col items-center">
                    {product.features.map((feature: Feature) => (
                      <li key={feature._id} className="text-center w-full">
                        {feature.title}
                        {feature.ancestryDnaRequired && (
                          <span className="ml-2 text-xs text-orange-600">(DNA kit required)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Disclaimers at the bottom */}
      {disclaimers?.length ? (
        <div className="mt-6 text-[8px] text-center text-muted-foreground space-y-1">
          {disclaimers.map((d) => (
            <div key={d._id} className="flex items-start justify-center gap-1">
              <span className="font-bold">*</span>
              <RichText richText={d.text} className="inline" />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
} 