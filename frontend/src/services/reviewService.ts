export interface CreateReviewRequest {
  reviewedUser: string;
  role: 'provider' | 'seeker';
  rating: number;
  comment?: string;
  jobRequest?: string;
  serviceListing?: string;
}

export interface CreateReviewResponse {
  success: boolean;
  data?: {
    review: Record<string, unknown>;
  };
  message?: string;
}

export const createReview = async (
  data: CreateReviewRequest,
  accessToken: string
): Promise<CreateReviewResponse> => {
  try {
    console.log('Creating review with data:', data);
    
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    console.log('Review response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Review response error:', errorText);
      return {
        success: false,
        message: `HTTP ${response.status}: ${errorText}`
      };
    }

    const result = await response.json();
    console.log('Review response result:', result);
    return result;
  } catch (error) {
    console.error('Error creating review:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إنشاء التقييم'
    };
  }
};

export const getUserReviews = async (
  userId: string,
  role?: 'provider' | 'seeker',
  accessToken?: string
): Promise<Record<string, unknown>> => {
  try {
    const url = role 
      ? `/api/reviews/user/${userId}?role=${role}`
      : `/api/reviews/user/${userId}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting user reviews:', error);
    return {
      success: false,
      data: { reviews: [] }
    };
  }
}; 