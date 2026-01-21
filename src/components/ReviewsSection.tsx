import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight, Calendar, User, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReviewForm from "./ReviewForm";

interface Review {
  id: number;
  user_name: string | null;
  rating: number;
  review_text: string;
  photos: string[];
  visit_date: string;
  created_at: string;
}

interface ReviewsSectionProps {
  fortName: string;
}

export default function ReviewsSection({ fortName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<{
    averageRating: number;
    reviewCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<{[key: number]: number}>({});

  const fetchReviews = async () => {
    try {
      const [reviewsResponse, summaryResponse] = await Promise.all([
        fetch(`/api/reviews/fort/${encodeURIComponent(fortName)}`),
        fetch(`/api/reviews/fort/${encodeURIComponent(fortName)}/summary`)
      ]);

      const reviewsData = await reviewsResponse.json();
      const summaryData = await summaryResponse.json();

      if (reviewsData.success) {
        setReviews(reviewsData.data);
      }

      if (summaryData.success) {
        setSummary(summaryData.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fortName]);

  const nextPhoto = (reviewId: number, maxIndex: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [reviewId]: ((prev[reviewId] || 0) + 1) % maxIndex
    }));
  };

  const prevPhoto = (reviewId: number, maxIndex: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [reviewId]: ((prev[reviewId] || 0) - 1 + maxIndex) % maxIndex
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Review Deleted",
          description: "Your review has been deleted successfully.",
        });

        // Refresh reviews
        fetchReviews();
      } else {
        throw new Error(data.message || "Failed to delete review");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-500 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  Reviews & Photos
                  {summary.reviewCount > 0 && (
                    <Badge variant="secondary">
                      {summary.reviewCount} review{summary.reviewCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
                {summary.reviewCount > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(Math.round(summary.averageRating))}
                    <span className="text-lg font-semibold">
                      {summary.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({summary.reviewCount} review{summary.reviewCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ReviewForm 
              fortName={fortName} 
              onReviewSubmitted={fetchReviews}
            />
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-orange-100 text-orange-700">
                          {getInitials(review.user_name || 'Anonymous User')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{review.user_name || 'Anonymous User'}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {review.visit_date
                            ? `Visited on ${formatDate(review.visit_date)}`
                            : `Reviewed on ${formatDate(review.created_at)}`
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReview(review.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Review Text */}
                  {review.review_text && (
                    <p className="text-gray-700 leading-relaxed">
                      {review.review_text}
                    </p>
                  )}

                  {/* Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={review.photos[currentPhotoIndex[review.id] || 0]}
                          alt={`Photo by ${review.user_name || 'Anonymous User'}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        
                        {review.photos.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                              onClick={() => prevPhoto(review.id, review.photos.length)}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                              onClick={() => nextPhoto(review.id, review.photos.length)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                              <Badge variant="secondary" className="bg-black/50 text-white">
                                {(currentPhotoIndex[review.id] || 0) + 1} / {review.photos.length}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {review.photos.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {review.photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPhotoIndex(prev => ({
                                ...prev,
                                [review.id]: index
                              }))}
                              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                                index === (currentPhotoIndex[review.id] || 0)
                                  ? "border-orange-500"
                                  : "border-gray-200"
                              }`}
                            >
                              <img
                                src={photo}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your experience visiting {fortName}
            </p>
            <ReviewForm 
              fortName={fortName} 
              onReviewSubmitted={fetchReviews}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
