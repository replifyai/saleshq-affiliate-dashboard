'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useSnackbar } from '@/components/snackbar';
import { useProfile } from '@/contexts/ProfileContext';
import apiClient from '@/services/apiClient';

interface Collection {
  id: string;
  name: string;
  productCount: number;
  link: string;
}

interface FeaturedCollectionsProps {
  collections?: Collection[];
  className?: string;
}

const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  collections: propCollections,
  className
}) => {
  const { showSuccess } = useSnackbar();
  const { state } = useProfile();
  const [fetchedCollections, setFetchedCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(!propCollections);

  const storeHost = state.profile?.shopDomain || process.env.NEXT_PUBLIC_STORE_HOST || '';

  useEffect(() => {
    if (propCollections) return;

    let isMounted = true;
    setLoading(true);

    apiClient.getAllProductCollections()
      .then((res) => {
        if (!isMounted) return;
        const mapped: Collection[] = (res.productCollections || []).map((col: any) => ({
          id: col.id,
          name: col.name,
          productCount: col.productIds?.length ?? 0,
          link: storeHost ? `${storeHost}/collections/${col.slug || col.id}` : `/collections/${col.slug || col.id}`,
        }));
        setFetchedCollections(mapped);
      })
      .catch(() => {})
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [propCollections, storeHost]);

  const collections = propCollections ?? fetchedCollections;

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    showSuccess('Collection link copied!');
  };

  if (loading) {
    return (
      <div className={cn('bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6', className)}>
        <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-5">
          Featured Collections
        </span>
        <div className="text-sm text-[#BCBCBC]">Loading collections...</div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className={cn('bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6', className)}>
        <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-5">
          Featured Collections
        </span>
        <div className="text-sm text-[#BCBCBC]">No collections available.</div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6', className)}>
      <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-5">
        Featured Collections
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-xl hover:border-[#BCBCBC] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#131313] truncate">{collection.name}</p>
              <p className="text-sm text-[#BCBCBC]">{collection.productCount} products</p>
            </div>
            <button
              onClick={() => handleCopy(collection.link)}
              className="ml-3 p-2.5 rounded-xl bg-[#FFE887] hover:bg-[#FFD54F] transition-colors flex-shrink-0"
              aria-label="Copy collection link"
            >
              <Copy className="w-4 h-4 text-[#131313]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollections;
