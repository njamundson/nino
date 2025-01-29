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
}

const CreatorBio = ({ bio, location, instagram, website, specialties = [], creatorId }: CreatorBioProps) => {
  const { data: application } = useQuery({
    queryKey: ['creator-application', creatorId],
    queryFn: async () => {
      console.log('Fetching application for creator:', creatorId);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            description
          )
        `)
        .eq('creator_id', creatorId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching application:', error);
        throw error;
      }

      console.log('Application data:', data);
      return data;
    },
    enabled: !!creatorId
  });

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

      {application && application.cover_letter && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-nino-text">Application for {application.opportunity?.title}</h3>
          <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-nino-text/70">
                Status: <span className="font-medium text-nino-primary">{application.status}</span>
              </span>
              <span className="text-sm text-nino-text/70">
                {new Date(application.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-base leading-relaxed text-nino-text/90 whitespace-pre-wrap break-words">
              {application.cover_letter}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBio;