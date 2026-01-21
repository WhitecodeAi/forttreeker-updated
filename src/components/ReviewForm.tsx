import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReviewFormProps {
  fortName: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ fortName, onReviewSubmitted }: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: "",
    visit_date: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 5 photos",
        variant: "destructive",
      });
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    // Cleanup preview URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("fort_name", fortName);
      submitFormData.append("rating", formData.rating.toString());
      submitFormData.append("review_text", formData.review_text);
      submitFormData.append("visit_date", formData.visit_date);

      // Add photos
      selectedFiles.forEach((file) => {
        submitFormData.append("photos", file);
      });

      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        credentials: "include",
        body: submitFormData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted and will be visible after admin approval.",
        });

        // Reset form
        setFormData({ rating: 0, review_text: "", visit_date: "" });
        setSelectedFiles([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        setIsOpen(false);

        // Callback to parent component
        onReviewSubmitted?.();
      } else {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove authentication check - anyone can submit reviews

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Star className="mr-2 h-4 w-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review {fortName}</DialogTitle>
          <DialogDescription>
            Share your experience and photos to help other trekkers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`p-1 transition-colors ${
                    star <= formData.rating
                      ? "text-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review_text">Your Review</Label>
            <Textarea
              id="review_text"
              placeholder="Share your experience visiting this fort..."
              value={formData.review_text}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, review_text: e.target.value }))
              }
              rows={4}
            />
          </div>

          {/* Visit Date */}
          <div className="space-y-2">
            <Label htmlFor="visit_date">Visit Date (Optional)</Label>
            <Input
              id="visit_date"
              type="date"
              value={formData.visit_date}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, visit_date: e.target.value }))
              }
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional - Max 5)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <label className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500">
                    Upload photos
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB each
                </p>
              </div>
            </div>

            {/* Preview images */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
