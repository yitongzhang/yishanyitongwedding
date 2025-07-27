"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import EmailSignupModal from "@/components/EmailSignupModal";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check if returning from auth and open modal
      if (searchParams.get('auth') === 'success' && session?.user) {
        setIsModalOpen(true);
        // Remove the query parameter
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      // If user just signed in, open the modal
      if (event === 'SIGNED_IN' && session?.user) {
        setIsModalOpen(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        {/* Brown background layer */}
        <div className="absolute inset-0 bg-[#332917]" />
        
        {/* Lavender field overlay layer */}
        <div
          className="absolute inset-20 -rotate-[0.5deg] bg-cover bg-center mix-blend-overlay opacity-50"
          style={{
            backgroundImage: 'url("/img/provence.png")',
          }}
        />
        
        {/* Loading content */}
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
            </div>
            <div className=" text-[#E9E1C7] px-8 py-4 rounded-full shadow-lg">
              <p className="text-xl font-semibold">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* SVG Filters for text effects */}
      <svg className="absolute w-0 h-0" style={{ visibility: "hidden" }}>
        <defs>
          <filter
            id="noisy-outline"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            {/* Create noise */}
            <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />

            {/* Create displacement map for distortion */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              result="displaced"
            />

            {/* Create multiple outlines with morphology */}
            <feMorphology
              in="displaced"
              operator="dilate"
              radius="2"
              result="outline1"
            />

            <feMorphology
              in="displaced"
              operator="dilate"
              radius="4"
              result="outline2"
            />

            {/* Color the outlines */}
            <feFlood floodColor="#8B4513" result="color1" />
            <feComposite
              in="color1"
              in2="outline1"
              operator="in"
              result="coloredOutline1"
            />

            <feFlood floodColor="#654321" result="color2" />
            <feComposite
              in="color2"
              in2="outline2"
              operator="in"
              result="coloredOutline2"
            />

            {/* Combine all layers */}
            <feMerge>
              <feMergeNode in="displaced" />
            </feMerge>
          </filter>

          <filter
            id="rough-border"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            {/* Create noise for border roughness */}
            <feTurbulence
              baseFrequency="0.2"
              numOctaves="4"
              result="borderNoise"
            />

            {/* Displace the border to make it rough */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="borderNoise"
              scale="2"
              result="roughBorder"
            />
          </filter>
        </defs>
      </svg>

      {/* Brown background layer */}
      <div className="absolute inset-0 bg-[#332917]" />

      <div className="absolute top-6 left-20 text-[#e5d4aa] opacity-30 tracking-wide">
        Family style
      </div>
      <div className="absolute top-6 left-1/2 text-[#e5d4aa] opacity-30 tracking-wide">
        3000 20th St, SF, CA
      </div>
      <div className="absolute top-6 right-20 text-[#e5d4aa] opacity-30 tracking-wide">
        Penny Roma
      </div>
      <div className="absolute bottom-6 left-20 text-[#e5d4aa] opacity-30 tracking-wide">
        RSVP Now
      </div>
      <div className="absolute bottom-6 left-1/2 text-[#e5d4aa] opacity-30 tracking-wide">
        October 4th
      </div>
      <div className="absolute bottom-6 right-20 text-[#e5d4aa] opacity-30 tracking-wide">
        More info soon!
      </div>
      {/* Lavender field overlay layer */}
      <div
        className="absolute inset-20 -rotate-[0.5deg] bg-cover bg-center mix-blend-overlay opacity-50"
        style={{
          backgroundImage: 'url("/img/provence.png")',
        }}
      />

      {/* Content layer */}
      <div className="relative min-h-screen">
        <div className="relative w-full h-screen">
          <div className="absolute top-1/2 left-1/2 -translate-x-[310px] -translate-y-[320px] rotate-2">
            <Image
              src="/img/ourName.png"
              alt="Yishan and Yitong"
              width={270}
              height={140}
              className="mx-auto"
            />
          </div>
          <h1 className="absolute top-1/2 left-1/2 -translate-x-[10px] -translate-y-[200px] text-3xl text-[#FCF3D6] max-w-[22rem] rotate-3">
            Warmly invite you to our wedding celebration in San Francisco on
            October 4th, 2025
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-[300px] translate-y-[300px] bg-[#E4B42E] text-[#1E1300] font-gooper-semibold py-4 px-6 rounded-full transition-all shadow-lg text-xl"
            style={{ filter: "url(#rough-border)" }}
          >
            <span className="whitespace-nowrap">{user ? "Edit your RSVP" : "Sign in to RSVP"}</span>
          </button>

          <Image
            src="/img/weddingPhoto.png"
            alt="Yishan and Yitong as adults"
            width={300}
            height={843}
            className="absolute top-1/2 left-1/2 z-10 -translate-x-[300px] -translate-y-[150px]"
          />
          <Image
            src="/img/kidsPhoto.png"
            alt="Yishan and Yitong as kids"
            width={240}
            height={843}
            className="absolute top-1/2 left-1/2 z-20 translate-y-[162px] -translate-x-[20px] rotate-3"
          />
          <Image
            src="/img/yishanHead.png"
            alt="Yishan's head"
            width={90}
            height={843}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <Image
            src="/img/yitongHead.png"
            alt="Yitong's head"
            width={100}
            height={843}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <Image
            src="/img/mou.png"
            alt="mou"
            width={100}
            height={843}
            className="absolute top-1/2 left-1/2 z-20 translate-x-[220px] -rotate-12"
          />
          <Image
            src="/img/fei.png"
            alt="fei"
            width={100}
            height={843}
            className="absolute top-1/2 left-1/2 -translate-x-[340px] -translate-y-[320px]"
          />
                    <Image
            src="/img/fei.png"
            alt="fei"
            width={100}
            height={843}
            className="absolute top-1/2 left-1/2 -translate-x-[390px] -translate-y-[290px] -rotate-12"
          />
                    <Image
            src="/img/fei.png"
            alt="fei"
            width={100}
            height={843}
            className="absolute top-1/2 left-1/2 -translate-x-[420px] -translate-y-[240px] -rotate-45"
          />

          <video
            autoPlay
            loop
            muted
            playsInline
            className="border-8 border-[#FBF2D5] absolute top-1/2 left-1/2 -translate-y-[50px] -translate-x-[50px] w-80 h-auto rotate-3"
            style={{ filter: 'sepia(20%) saturate(110%) hue-rotate(-10deg) brightness(90%)' }}
          >
            <source src="/img/flowersLoop.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Email Signup Modal */}
      <EmailSignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative overflow-hidden">
        {/* Brown background layer */}
        <div className="absolute inset-0 bg-[#332917]" />
        
        {/* Lavender field overlay layer */}
        <div
          className="absolute inset-20 -rotate-[0.5deg] bg-cover bg-center mix-blend-overlay opacity-50"
          style={{
            backgroundImage: 'url("/img/provence.png")',
          }}
        />
        
        {/* Loading content */}
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <Image
                src="/img/ourName.png"
                alt="Yishan and Yitong"
                width={270}
                height={140}
                className="mx-auto opacity-80"
              />
            </div>
            <div className="bg-[#E4B42E] text-[#332917] px-8 py-4 rounded-full shadow-lg">
              <p className="text-xl font-semibold">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
