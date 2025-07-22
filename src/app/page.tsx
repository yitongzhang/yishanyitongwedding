"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import SignInPrompt from "@/components/SignInPrompt";
import EmailSignupModal from "@/components/EmailSignupModal";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      {/* Brown background layer */}
      <div className="absolute inset-0 bg-[#1E1300]" />
      
      {/* Lavender field overlay layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50"
        style={{
          backgroundImage: 'url("/img/lavenderfield.png")'
        }}
      />
      
      {/* Content layer */}
      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-2">
            <Image
              src="/img/yishanandyitong.svg"
              alt="Yishan and Yitong"
              width={600}
              height={140}
              className="mx-auto"
            />
          </div>

          <h1 className="text-3xl text-yellow-500 max-w-xl mx-auto">
            warmly invite you to our wedding celebration in San Francisco on
            October 4th, 2025
          </h1>
          
          {/* Email signup button */}
          <div className="mt-8 mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Sign In to RSVP
            </button>
          </div>
          
          {/* Additional images */}
          <div className="flex justify-center items-center gap-8 mt-8 mb-4">
            <Image
              src="/img/mou.png"
              alt="Mou"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <Image
              src="/img/fei.png"
              alt="Fei"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          
          <Image
              src="/img/yishanyitongadult.png"
              alt="Yishan and Yitong"
              width={450}
              height={843}  
              className="mx-auto absolute bottom-0 left-1/2 -translate-x-1/2"
            />
          
        </div>
      </div>

      {/* Email Signup Modal */}
      <EmailSignupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
