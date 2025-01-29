import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CreatorSpecialties from './bio/CreatorSpecialties';
import { Instagram, Globe } from 'lucide-react';

interface CreatorBioProps {
  bio?: string | null;
  location?: string | null;
  instagram?: string | null;
  website?: string | null;
  specialties?: string[];
  creatorId: string;
  onMessageClick?: () => void;
}

const CreatorBio = ({ bio, location, instagram, website, specialties = [], creatorId, onMessageClick }: CreatorBioProps) => {
  return (
    <div className="space-y-6">
      {bio && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-nino-text">About</h3>
          <p className="text-base leading-relaxed text-nino-text/90">{bio}</p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-nino-text">Details</h3>
        <div className="space-y-2">
          {location && (
            <p className="text-sm text-nino-text/80">
              📍 {location}
            </p>
          )}
          <div className="flex items-center gap-4">
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-nino-text/80 hover:text-nino-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
                {instagram}
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-nino-text/80 hover:text-nino-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      <CreatorSpecialties specialties={specialties} />
    </div>
  );
};

export default CreatorBio;