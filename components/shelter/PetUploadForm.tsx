"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { CldUploadButton } from "next-cloudinary";
import { createPet } from "@/app/actions/pets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  shelterCity: string;
}

interface CloudinaryResult {
  info?: { secure_url: string } | string;
}

export function PetUploadForm({ shelterCity }: Props) {
  const [state, action, isPending] = useActionState(createPet, null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [formKey, setFormKey] = useState(0);

  // Reset form on success
  useEffect(() => {
    if (state?.success) {
      setPhotos([]);
      setFormKey((k) => k + 1);
    }
  }, [state]);

  function handleUploadSuccess(result: CloudinaryResult) {
    const info = result.info;
    if (info && typeof info === "object" && "secure_url" in info) {
      setPhotos((prev) => [...prev, info.secure_url]);
    }
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url));
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form key={formKey} action={action} className="space-y-5">
          {/* Hidden photos field */}
          <input type="hidden" name="photos" value={JSON.stringify(photos)} />

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
              Pet added successfully!
            </div>
          )}

          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Photos <span className="text-red-500">*</span></Label>
            <div className="flex flex-wrap gap-2 items-center">
              {photos.map((url) => (
                <div key={url} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Pet photo"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                <CldUploadButton
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleUploadSuccess}
                  options={{ multiple: true, maxFiles: 5, resourceType: "image" }}
                  className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors text-3xl cursor-pointer"
                >
                  +
                </CldUploadButton>
              ) : (
                <div className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 text-gray-300 text-3xl cursor-not-allowed" title="Cloudinary not configured">
                  +
                </div>
              )}
            </div>
            {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
              <p className="text-xs text-gray-400">Up to 5 photos. Click + to upload.</p>
            ) : (
              <p className="text-xs text-amber-600">
                Photo upload requires Cloudinary — add <code className="bg-amber-50 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> to your <code className="bg-amber-50 px-1 rounded">.env</code>.
              </p>
            )}
          </div>

          {/* Name + Type + Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" placeholder="Buddy" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
              <SelectField name="type" placeholder="Select type">
                <SelectItem value="DOG">Dog</SelectItem>
                <SelectItem value="CAT">Cat</SelectItem>
                <SelectItem value="RABBIT">Rabbit</SelectItem>
                <SelectItem value="BIRD">Bird</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectField>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input id="breed" name="breed" placeholder="Golden Retriever" />
            </div>
          </div>

          {/* Age + Size + Gender */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ageValue">Age <span className="text-red-500">*</span></Label>
              <Input
                id="ageValue"
                name="ageValue"
                type="number"
                min={0}
                max={300}
                placeholder="2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageUnit">Unit</Label>
              <SelectField name="ageUnit" placeholder="Unit" defaultValue="years">
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectField>
            </div>

            <div className="space-y-2">
              <Label>Size <span className="text-red-500">*</span></Label>
              <SelectField name="size" placeholder="Size">
                <SelectItem value="SMALL">Small</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LARGE">Large</SelectItem>
              </SelectField>
            </div>

            <div className="space-y-2">
              <Label>Gender <span className="text-red-500">*</span></Label>
              <SelectField name="gender" placeholder="Gender">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectField>
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={shelterCity}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell adopters about this pet's personality, habits, and any special needs..."
              rows={3}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Adding pet…" : "Add Pet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Small wrapper so Select works with server actions (value goes through hidden input)
function SelectField({
  name,
  placeholder,
  defaultValue,
  children,
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={ref} type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </>
  );
}
