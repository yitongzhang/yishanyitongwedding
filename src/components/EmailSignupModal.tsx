"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignupModal({
  isOpen,
  onClose,
}: EmailSignupModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      // First check if the email exists in our guests table
      const { data: guest } = await supabase
        .from("guests")
        .select("email")
        .eq("email", email)
        .single();

      if (!guest) {
        setStatusMessage(
          "Email not found. Please contact the wedding organizers if you think this is an error."
        );
        setIsLoading(false);
        return;
      }

      // Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setStatusMessage("Error sending magic link. Please try again.");
        console.error("Error:", error);
      } else {
        setStatusMessage("Check your email for the sign in link!");
      }
    } catch (error) {
      setStatusMessage("Error sending link. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed text-[#332917] inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 font-gooper-semibold"
      onClick={onClose}
    >
      <div
        className="bg-[#E4B42E] p-8 rounded-3xl -rotate-1 "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sign In Form */}
        <div
          className="max-w-md mx-auto"
          style={{ filter: "url(#signin-rough-border)" }}
        >
          <h2 className="text-3xl mb-4">Sign In</h2>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full p-6 rounded-lg bg-[#E4B42E] text-[#332917] placeholder-[#866c3b] border border-dashed border-[#332917] outline-none text-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-6 rounded-xl bg-[#332917] text-[#E4B42E] text-xl"
              style={{ filter: "url(#signin-button-rough)" }}
            >
              {isLoading ? "Sending..." : "Get sign in link"}
            </button>
          </form>
        </div>
        {statusMessage && (
          <div
            className={`mt-4 p-4 rounded-3xl absolute -bottom-20 w-full left-0 ${
              statusMessage.includes("Error") ||
              statusMessage.includes("not found")
                ? "bg-red-900 text-red-400"
                : "bg-green-900 text-green-400"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
