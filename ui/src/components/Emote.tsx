"use client";

import React, { useState, useEffect, useRef } from 'react';
import { EmoteType, EmoteData } from '@/types/backend';

interface EmoteProps {
  currentEmote: EmoteData | null;
}

const emoteConfig: Record<EmoteType, { image: string; sound: string; label: string }> = {
  heheheha: {
    image: '/game/emotes/heheheha.avif',
    sound: '/game/emotes/heheheha.mp3',
    label: 'He He He Ha'
  },
  mumumu: {
    image: '/game/emotes/mumumu.png',
    sound: '/game/emotes/mumumu.mp3',
    label: 'Mu Mu Mu'
  },
  pleuuurr: {
    image: '/game/emotes/pleuuurr.png',
    sound: '/game/emotes/pleuuurr.mp3',
    label: 'Pleuuurr'
  }
};

export default function Emote({ currentEmote }: EmoteProps) {
  const [animatingEmote, setAnimatingEmote] = useState<EmoteData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play emote sound and animation when receiving emote
  useEffect(() => {
    if (currentEmote && currentEmote.emoteType) {
      setAnimatingEmote(currentEmote);

      // Play sound
      const config = emoteConfig[currentEmote.emoteType];
      if (config && config.sound) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(config.sound);
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.error('Failed to play emote sound:', e));
      }

      // Clear animation after 3 seconds
      const timer = setTimeout(() => {
        setAnimatingEmote(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentEmote]);

  return animatingEmote ? (
    <>
      {/* Animated emote display */}
      <div
        className="absolute z-50 pointer-events-none"
        style={{
          // Position to the right of red king tower
          top: '10%',
          left: '60%',
          animation: 'emoteAnimation 3s ease-in-out'
        }}
      >
        <img
          src={emoteConfig[animatingEmote.emoteType].image}
          alt={emoteConfig[animatingEmote.emoteType].label}
          className="w-24 h-24 object-contain drop-shadow-lg"
        />
      </div>

      <style jsx>{`
        @keyframes emoteAnimation {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          20% {
            transform: scale(1.2) rotate(10deg);
            opacity: 1;
          }
          40% {
            transform: scale(0.9) rotate(-5deg);
          }
          60% {
            transform: scale(1.05) rotate(2deg);
          }
          80% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  ) : null;
}