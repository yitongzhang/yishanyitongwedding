"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface GuestInfoFormProps {
  user: User;
  onClose: () => void;
}

export default function GuestInfoForm({ user, onClose }: GuestInfoFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    plus_one: false,
    plus_one_name: "",
    attending: true,
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const supabase = createClient();

  // Load existing guest data
  useEffect(() => {
    const loadGuestData = async () => {
      const { data: guest } = await supabase
        .from("guests")
        .select("*")
        .eq("email", user.email!)
        .single();

      if (guest) {
        setFormData({
          name: guest.name || "",
          plus_one: guest.has_plus_one || false,
          plus_one_name: guest.plus_one_name || "",
          attending: guest.is_attending !== false,
          notes: guest.additional_notes || ""
        });
      }
    };

    loadGuestData();
  }, [user, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    try {
      const { error } = await supabase
        .from("guests")
        .update({
          name: formData.name,
          has_plus_one: formData.plus_one,
          plus_one_name: formData.plus_one_name,
          is_attending: formData.attending,
          additional_notes: formData.notes,
          has_rsvped: true,
          rsvp_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("email", user.email!);

      if (error) {
        setStatusMessage("Error saving information. Please try again.");
        console.error("Error:", error);
      } else {
        setStatusMessage("Information saved successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setStatusMessage("Error saving information. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto transition-all duration-300">
      <h2 className="text-3xl mb-4">So, are ya coming?</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="mb-6">
          <div 
            className="relative rounded-xl p-1 border border-dashed border-[#332917] text-[#332917] cursor-pointer"
            onClick={() => setFormData({ ...formData, attending: !formData.attending })}
          >
            <div className="relative flex">
              <div 
                className={`absolute top-0 h-full w-1/2 bg-[#332917] rounded-lg transition-transform duration-300 ${
                  formData.attending ? 'translate-x-0' : 'translate-x-full'
                }`}
              />
              <div className="relative z-10 flex w-full">
                <div className={`w-1/2 text-center p-3 text-xl font-bold transition-colors duration-300 ${
                  formData.attending ? 'text-[#D4A439]' : 'text-[#332917]'
                }`}>
                  Yes
                </div>
                <div className={`w-1/2 text-center p-3 text-xl font-bold transition-colors duration-300 ${
                  !formData.attending ? 'text-[#D4A439]' : 'text-[#332917]'
                }`}>
                  No
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-2">Your Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 rounded-t-lg bg-[#E4B42E] text-[#332917] placeholder-[#866c3b] border border-dashed border-[#332917] outline-none"
            placeholder="Full name"
            required
          />
        </div>
        {formData.attending && (
          <>
            <div className="!mt-0">
              <label className="flex items-center border-[#332917] rounded-b-lg px-2 py-2 bg-[#d4a82f] border-dashed border border-t-0">
                <input
                  type="checkbox"
                  checked={formData.plus_one}
                  onChange={(e) => setFormData({ ...formData, plus_one: e.target.checked })}
                  className="mr-2 accent-[#332917]"
                />
                I&apos;m bringing a plus one
              </label>
            </div>

            {formData.plus_one && (
              <>
                <div>
                  <label className="block mb-2">Plus One Name</label>
                  <input
                    type="text"
                    value={formData.plus_one_name}
                    onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                    className="w-full p-4 rounded-lg bg-[#E4B42E] text-[#332917] placeholder-[#866c3b] border border-dashed border-[#332917] outline-none text-xl"
                    placeholder="Their full name"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="block mb-2">Anything we should know?</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#E4B42E] text-[#332917] placeholder-[#866c3b] border border-dashed border-[#332917] outline-none text-xl"
            placeholder="Any dietary restrictions, allergies, or special requests"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-6 rounded-xl bg-[#332917] text-[#E4B42E] text-xl"
        >
          {isLoading ? "Saving..." : "Save RSVP"}
        </button>
      </form>

      {statusMessage && (
        <div
          className={`mt-4 p-4 rounded-3xl ${
            statusMessage.includes("Error")
              ? "bg-red-900 text-red-400"
              : "bg-green-900 text-green-400"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
} 