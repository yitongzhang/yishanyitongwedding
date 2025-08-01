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
      if (searchParams.get("auth") === "success" && session?.user) {
        setIsModalOpen(true);
        // Remove the query parameter
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
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
            <div className="mb-6"></div>
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

      <div className="absolute md:top-6 top-2  md:left-20 left-2 text-[#e5d4aa] opacity-30 tracking-wide">
        Family style
      </div>
      <div className="absolute md:top-6 top-2  md:left-[1/2] left-[calc(50%-60px)] text-[#e5d4aa] opacity-30 tracking-wide">
        3000 20th St, SF, CA
      </div>
      <div className="absolute md:top-6 top-2  md:right-20 right-2 text-[#e5d4aa] opacity-30 tracking-wide">
        Penny Roma
      </div>
      <div className="absolute md:bottom-6 bottom-2  md:left-20 left-2 text-[#e5d4aa] opacity-30 tracking-wide">
        RSVP Now
      </div>
      <div className="absolute md:bottom-6 bottom-2  md:left-[1/2] left-[calc(50%-50px)] text-[#e5d4aa] opacity-30 tracking-wide">
        October 4th
      </div>
      <div className="absolute md:bottom-6 bottom-2  md:right-20 right-2 text-[#e5d4aa] opacity-30 tracking-wide">
        More info soon!
      </div>
      {/* Lavender field overlay layer */}
      <div
        className={`
          absolute
          inset-y-10
          left-0
          right-0
          bg-cover
          bg-center
          mix-blend-overlay
          opacity-50
          md:inset-20
          md:-rotate-[0.5deg]
        `}
        style={{
          backgroundImage: 'url("/img/provence.png")',
        }}
      />

      {/* Content layer */}
      <div className="relative min-h-screen">
        <div className="relative w-full h-screen">
          <div className="absolute hidden md:block md:top-1/2 md:left-1/2 md:-translate-x-[310px] md:-translate-y-[320px] rotate-2 md:w-[270px] w-[180px] left-[calc(50%-110px)] top-14">
            <Image
              src="/img/ourName.png"
              alt="Yishan and Yitong"
              width={270}
              height={140}
              className="mx-auto"
            />
          </div>
          <div className="md:hidden absolute md:top-1/2 md:left-1/2 left-[calc(50%-170px)] top-14">
            <Image
              src="/img/ourNameForEmail.png"
              alt="Yishan and Yitong"
              width={340}
              height={140}
              className="mx-auto"
            />
          </div>
          <h1 className="absolute md:top-1/2 top-[150px] md:left-1/2 md:-translate-x-[10px] md:-translate-y-[200px] md:text-3xl text-xl text-[#FCF3D6] left-[calc(50%-160px)] max-w-[320px] md:rotate-3 md:text-left text-center">
            Warmly invite you to our wedding celebration in San Francisco on
            October 4th, 2025
          </h1>
          <div className="group">
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-[220px] left-1/2 md:bottom-auto -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-x-[300px] md:translate-y-[310px] bg-[#E4B42E] text-[#1E1300] font-gooper-semibold py-4 px-6 rounded-full transition-all shadow-lg text-xl md:-rotate-3 transform transition-transform duration-200 hover:scale-105"
              style={{ filter: "url(#rough-border)" }}
            >
              <span className="whitespace-nowrap">
                {user ? "Edit your RSVP" : "Sign in to RSVP"}
              </span>
            </button>

            <Image
              src="/img/yishanHead.png"
              alt="Yishan's head"
              width={90}
              height={843}
              className="absolute top-1/2 left-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
              style={{
                animation: "wiggle-left 3s ease-in-out infinite",
              }}
            />
            <Image
              src="/img/yitongHead.png"
              alt="Yitong's head"
              width={100}
              height={843}
              className="absolute top-1/2 left-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
              style={{
                animation: "wiggle-right 2.5s ease-in-out infinite",
              }}
            />
          </div>{" "}
          <a
            href="https://www.google.com/calendar/render?action=TEMPLATE&text=Yishan%20and%20Yitong%27s%20Wedding&dates=20251004/20251005&details=Join%20us%20for%20Yishan%20and%20Yitong%27s%20wedding%20celebration%20in%20San%20Francisco!&location=3000%2020th%20St%2C%20San%20Francisco%2C%20CA&sf=true&output=xml"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute hidden md:block md:top-1/2 md:left-1/2 z-10 md:-translate-x-[8px] md:-translate-y-[288px] translate-x-0 translate-y-0 top-80 rotate-3 md:w-[60px] transition-transform duration-200 hover:scale-105"
            title="Add to Google Calendar"
          >
            <Image
              src="/img/addToCalendar.svg"
              alt="Add to calendar"
              width={100}
              height={200}
              className="w-full h-auto"
              style={{ filter: "url(#rough-border)" }}
            />
          </a>
          <Image
            src="/img/weddingPhoto.png"
            alt="Yishan and Yitong as adults"
            width={300}
            height={843}
            className="absolute md:top-1/2 left-[calc(50%-100px)] md:left-1/2 z-10 md:-translate-x-[300px] md:-translate-y-[150px] translate-x-0 translate-y-0 top-80 w-[200px] md:w-[300px]"
          />
          <Image
            src="/img/kidsPhoto.png"
            alt="Yishan and Yitong as kids"
            width={240}
            height={843}
            className="absolute top-1/2 left-1/2 z-20 translate-y-[162px] -translate-x-[20px] rotate-3 hidden md:block"
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
            className="absolute top-1/2 left-1/2 -translate-x-[390px] -translate-y-[290px] -rotate-12 hidden md:block"
          />
          <Image
            src="/img/fei.png"
            alt="fei"
            width={100}
            height={843}
            className="absolute top-1/2 left-1/2 -translate-x-[420px] -translate-y-[240px] -rotate-45 hidden md:block"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="border-8 border-[#FBF2D5] absolute top-1/2 left-1/2 -translate-y-[50px] -translate-x-[50px] w-80 h-auto rotate-3 hidden md:block"
            style={{
              filter:
                "sepia(20%) saturate(110%) hue-rotate(-10deg) brightness(90%)",
            }}
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
    <Suspense
      fallback={
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
      }
    >
      <HomeContent />
    </Suspense>
  );
}
