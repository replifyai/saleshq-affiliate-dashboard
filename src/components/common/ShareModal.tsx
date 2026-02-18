'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Social media platform configuration
const SOCIAL_PLATFORMS = [
  {
    id: 'direct',
    name: 'Direct',
    color: '#FFD100',
    textColor: '#231F20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    textColor: '#FFFFFF',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    color: '#000000',
    textColor: '#FFFFFF',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    textColor: '#FFFFFF',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    textColor: '#FFFFFF',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    textColor: '#FFFFFF',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  shareUrl: string;
  onShare: (platform: string) => void;
  onCopyLink: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  productName,
  shareUrl,
  onShare,
  onCopyLink,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#231F20]/40 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border border-[#FFD100]/30",
          "bg-gradient-to-br from-[#FFFAE6] via-white to-[#FFFAE6]/60",
          "shadow-[0_25px_60px_-15px_rgba(255,209,0,0.25),0_0_0_1px_rgba(255,209,0,0.1)]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-[#FFD100] via-[#FFE887] to-[#FFD100]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD100] to-[#FFE887] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-[#231F20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#231F20]">Share Product</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#231F20]/5 transition-all duration-200 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[#636363] group-hover:text-[#231F20] transition-colors" />
          </button>
        </div>

        {/* Product Name */}
        <div className="px-6 pb-4">
          <p className="text-sm text-[#636363] line-clamp-2">{productName}</p>
        </div>

        {/* Social Platform Icons */}
        <div className="px-6 pb-5">
          <p className="text-[11px] text-[#999] mb-3 uppercase tracking-widest font-semibold">
            Share via
          </p>
          <div className="grid grid-cols-6 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onShare(platform.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group",
                  "hover:bg-[#FFD100]/10 hover:scale-105 active:scale-95"
                )}
                aria-label={`Share on ${platform.name}`}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md"
                  style={{
                    backgroundColor: platform.color,
                    color: platform.textColor,
                  }}
                >
                  {platform.icon}
                </div>
                <span className="text-[10px] text-[#636363] font-medium truncate w-full text-center group-hover:text-[#231F20]">
                  {platform.name.split('/')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="px-6">
          <div className="border-t border-[#FFD100]/20" />
        </div>

        {/* Copy Link Section */}
        <div className="p-6 pt-4">
          <p className="text-[11px] text-[#999] mb-3 uppercase tracking-widest font-semibold">
            Or copy link
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full bg-[#231F20]/[0.03] border border-[#FFD100]/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#636363] truncate focus:outline-none focus:border-[#FFD100] focus:ring-2 focus:ring-[#FFD100]/20 transition-all"
              />
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 shadow-sm hover:shadow-md",
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-[#FFD100] to-[#FFE887] text-[#231F20] hover:from-[#FFE030] hover:to-[#FFD100]"
              )}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
