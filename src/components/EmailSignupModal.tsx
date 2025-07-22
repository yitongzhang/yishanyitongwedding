"use client";

import Image from "next/image";
import SignInPrompt from "@/components/SignInPrompt";

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignupModal({ isOpen, onClose }: EmailSignupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
        >
          ×
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <Image
                src="/img/yishanandyitong.svg"
                alt="Yishan and Yitong"
                width={300}
                height={80}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Sign In Prompt */}
          <SignInPrompt 
            title="Sign In"
            message="Enter your email to access your wedding invitation and RSVP"
          />

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Only invited guests can access the wedding details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 