'use client';

import React from 'react';
import { Button } from '@/components/common';
import { SocialMediaHandle } from './types';

interface SocialMediaSectionProps {
  socialMedia: SocialMediaHandle[];
  isEditing: boolean;
  onAddHandle: () => void;
  onUpdateHandle: (index: number, field: keyof SocialMediaHandle, value: string | boolean) => void;
  onRemoveHandle: (index: number) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socialMedia,
  isEditing,
  onAddHandle,
  onUpdateHandle: updateSocialMediaHandle,
  onRemoveHandle: removeSocialMediaHandle,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-xl border border-[#FFD100]/40 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Social Media Handles</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your social media accounts to showcase your digital presence
          </p>
        </div>
        {isEditing && (
          <Button
            onClick={onAddHandle}
            variant="outline"
            className="flex items-center space-x-2 shrink-0"
          >
            <span>➕</span>
            <span>Add Handle</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {socialMedia.map((social, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-[#FFFAE6]/50 border border-[#FFD100]/30 rounded-lg">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Platform</label>
                {isEditing ? (
                  <select
                    value={social.platform}
                    onChange={(e) => updateSocialMediaHandle(index, 'platform', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select Platform</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Discord">Discord</option>
                    <option value="Twitch">Twitch</option>
                    <option value="Reddit">Reddit</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="Tumblr">Tumblr</option>
                    <option value="Medium">Medium</option>
                    <option value="Steam">Steam</option>
                    <option value="Spotify">Spotify</option>
                    <option value="SoundCloud">SoundCloud</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Stack Overflow">Stack Overflow</option>
                    <option value="Behance">Behance</option>
                    <option value="Dribbble">Dribbble</option>
                    <option value="DeviantArt">DeviantArt</option>
                    <option value="Vimeo">Vimeo</option>
                    <option value="Clubhouse">Clubhouse</option>
                    <option value="Mastodon">Mastodon</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-foreground font-medium">{social.platform}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Handle/Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={social.handle}
                    onChange={(e) => updateSocialMediaHandle(index, 'handle', e.target.value)}
                    placeholder="e.g., @username, /username, #channelname"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground font-medium">{social.handle}</span>
                    {social.platform === 'Twitter' && <span className="text-[#1DA1F2]">🐦</span>}
                    {social.platform === 'LinkedIn' && <span className="text-[#0077B5]">💼</span>}
                    {social.platform === 'Instagram' && <span className="text-[#E4405F]">📷</span>}
                    {social.platform === 'Facebook' && <span className="text-[#1877F2]">📘</span>}
                    {social.platform === 'YouTube' && <span className="text-[#FF0000]">📺</span>}
                    {social.platform === 'TikTok' && <span className="text-[#000000]">📱</span>}
                    {social.platform === 'Discord' && <span className="text-[#5865F2]">🎮</span>}
                    {social.platform === 'WhatsApp' && <span className="text-[#25D366]">💬</span>}
                    {social.platform === 'GitHub' && <span className="text-[#333333]">⚡</span>}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => updateSocialMediaHandle(index, 'url', e.target.value)}
                    placeholder="https://platform.com/username"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
                  />
                ) : (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors"
                  >
                    {social.url}
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {social.verified && (
                <span className="text-success text-lg" title="Verified">
                  ✅
                </span>
              )}
              {isEditing && (
                <button
                  onClick={() => removeSocialMediaHandle(index)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  title="Remove handle"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {socialMedia.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-6xl mb-6 block">📱</span>
          <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Social Media</h3>
          <p className="mb-6 max-w-md mx-auto">
            Add your social media handles to showcase your digital presence and connect with potential customers.
          </p>
          {isEditing && (
            <div className="space-y-4">
              <Button
                onClick={onAddHandle}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Add Social Media Handle
              </Button>
              <div className="text-sm">
                <p className="font-medium text-foreground">Popular platforms:</p>
                <p className="text-muted-foreground">Twitter, Instagram, LinkedIn, YouTube, TikTok, Facebook</p>
              </div>
            </div>
          )}
          {!isEditing && (
            <p className="text-sm bg-[#FFFAE6]/50 border border-[#FFD100]/30 rounded-lg p-4 inline-block">
              Edit your profile to add social media handles
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialMediaSection;