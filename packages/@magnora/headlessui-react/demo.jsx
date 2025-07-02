import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Rating, 
  RatingDisplay, 
  Stars, 
  Star, 
  RatingCount,
  Button,
  Review,
  ReviewAvatar,
  ReviewAuthor,
  ReviewTitle,
  ReviewContent,
  ReviewDate,
  ReviewRating,
  ReviewActions,
  ReviewHelpfulButton,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  ReviewsList,
  ReviewsListHeader,
  ReviewsListItems,
  ReviewForm,
  ReviewFormField,
  ReviewFormLabel,
  ReviewFormInput,
  ReviewFormTextarea,
  ReviewFormRatingInput,
  ReviewFormSubmit,
  MagnoraProvider
} from './src/index.ts';

// Demo App Component
function DemoApp() {
  const [currentRating, setCurrentRating] = useState(0);
  const [reviews, setReviews] = useState([
    {
      id: '1',
      author: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0d6efd&color=fff',
      title: 'Amazing product!',
      content: 'This product exceeded my expectations. Highly recommended!',
      rating: 5,
      date: '2025-01-15',
      helpful: 12,
      verified: true
    },
    {
      id: '2', 
      author: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=6c757d&color=fff',
      title: 'Good value for money',
      content: 'Solid product with great features. Worth the purchase.',
      rating: 4,
      date: '2025-01-10',
      helpful: 8,
      verified: false
    }
  ]);

  const handleNewReview = (reviewData) => {
    const newReview = {
      id: Date.now().toString(),
      author: reviewData.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewData.name)}&background=198754&color=fff`,
      title: reviewData.title,
      content: reviewData.content,
      rating: reviewData.rating,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: false
    };
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <MagnoraProvider config={{ 
      apiKey: 'demo-key', 
      shopDomain: 'demo-shop.myshopify.com' 
    }}>
      <div style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#212529', marginBottom: '10px' }}>
            🚀 Magnora Headless UI Demo
          </h1>
          <p style={{ color: '#6c757d', fontSize: '18px' }}>
            Interactive demonstration of all components
          </p>
        </header>

        {/* Rating Components Section */}
        <Card style={{ marginBottom: '30px' }}>
          <CardHeader>
            <CardTitle>⭐ Rating Components</CardTitle>
            <CardDescription>Interactive rating system with React Aria</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '20px' }}>
              
              {/* Interactive Rating */}
              <div>
                <h4>Interactive Rating (Click to rate)</h4>
                <Rating value={currentRating} onChange={setCurrentRating}>
                  <Stars>
                    {[1, 2, 3, 4, 5].map(value => (
                      <Star key={value} value={value} />
                    ))}
                  </Stars>
                </Rating>
                <p>Current rating: {currentRating}/5</p>
              </div>

              {/* Display Rating */}
              <div>
                <h4>Display Rating (Read-only)</h4>
                <RatingDisplay value={4.5}>
                  <Stars>
                    {[1, 2, 3, 4, 5].map(value => (
                      <Star key={value} value={value} />
                    ))}
                  </Stars>
                  <RatingCount>(128 reviews)</RatingCount>
                </RatingDisplay>
              </div>

              {/* Half Star Rating */}
              <div>
                <h4>Half Star Precision</h4>
                <RatingDisplay value={3.7}>
                  <Stars precision={0.5}>
                    {[1, 2, 3, 4, 5].map(value => (
                      <Star key={value} value={value} />
                    ))}
                  </Stars>
                  <RatingCount>(64 reviews)</RatingCount>
                </RatingDisplay>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Components Section */}
        <Card style={{ marginBottom: '30px' }}>
          <CardHeader>
            <CardTitle>🔘 Button Components</CardTitle>
            <CardDescription>Headless buttons with React Aria interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button 
                variant="primary"
                onPress={() => alert('Primary button clicked!')}
              >
                Primary Button
              </Button>
              
              <Button 
                variant="secondary"
                onPress={() => alert('Secondary button clicked!')}
              >
                Secondary Button
              </Button>
              
              <Button 
                variant="ghost"
                isLoading={true}
              >
                Loading...
              </Button>
              
              <Button 
                variant="primary"
                isDisabled={true}
              >
                Disabled
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Review Components Section */}
        <Card style={{ marginBottom: '30px' }}>
          <CardHeader>
            <CardTitle>💬 Review Components</CardTitle>
            <CardDescription>Individual review display with all features</CardDescription>
          </CardHeader>
          <CardContent>
            <Review>
              <ReviewAvatar 
                src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=dc3545&color=fff"
                alt="Sarah Johnson"
              />
              <div>
                <ReviewAuthor>Sarah Johnson</ReviewAuthor>
                <ReviewTitle>Excellent quality and fast shipping!</ReviewTitle>
                <ReviewRating>
                  <RatingDisplay value={5}>
                    <Stars>
                      {[1, 2, 3, 4, 5].map(value => (
                        <Star key={value} value={value} />
                      ))}
                    </Stars>
                  </RatingDisplay>
                </ReviewRating>
                <ReviewContent>
                  I'm really impressed with this product. The quality is outstanding 
                  and it arrived much faster than expected. Will definitely order again!
                </ReviewContent>
                <ReviewDate>January 15, 2025</ReviewDate>
                <ReviewActions>
                  <ReviewHelpfulButton onPress={() => alert('Marked as helpful!')}>
                    👍 Helpful (15)
                  </ReviewHelpfulButton>
                  <Button variant="ghost" size="sm">
                    Reply
                  </Button>
                </ReviewActions>
              </div>
            </Review>
          </CardContent>
        </Card>

        {/* Reviews List Section */}
        <Card style={{ marginBottom: '30px' }}>
          <CardHeader>
            <CardTitle>📝 Reviews List</CardTitle>
            <CardDescription>Complete reviews management system</CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewsList>
              <ReviewsListHeader>
                <h3>Customer Reviews ({reviews.length})</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RatingDisplay value={4.2}>
                    <Stars>
                      {[1, 2, 3, 4, 5].map(value => (
                        <Star key={value} value={value} />
                      ))}
                    </Stars>
                  </RatingDisplay>
                  <span>4.2 out of 5</span>
                </div>
              </ReviewsListHeader>
              
              <ReviewsListItems>
                {reviews.map(review => (
                  <Review key={review.id}>
                    <ReviewAvatar src={review.avatar} alt={review.author} />
                    <div>
                      <ReviewAuthor>{review.author}</ReviewAuthor>
                      <ReviewTitle>{review.title}</ReviewTitle>
                      <ReviewRating>
                        <RatingDisplay value={review.rating}>
                          <Stars>
                            {[1, 2, 3, 4, 5].map(value => (
                              <Star key={value} value={value} />
                            ))}
                          </Stars>
                        </RatingDisplay>
                      </ReviewRating>
                      <ReviewContent>{review.content}</ReviewContent>
                      <ReviewDate>{review.date}</ReviewDate>
                      <ReviewActions>
                        <ReviewHelpfulButton>
                          👍 Helpful ({review.helpful})
                        </ReviewHelpfulButton>
                        {review.verified && (
                          <span style={{ 
                            color: '#198754', 
                            fontSize: '14px', 
                            fontWeight: '500' 
                          }}>
                            ✅ Verified Purchase
                          </span>
                        )}
                      </ReviewActions>
                    </div>
                  </Review>
                ))}
              </ReviewsListItems>
            </ReviewsList>
          </CardContent>
        </Card>

        {/* Review Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>✍️ Review Form</CardTitle>
            <CardDescription>Add a new review with validation</CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewForm onSubmit={handleNewReview}>
              <ReviewFormField>
                <ReviewFormLabel htmlFor="name">Your Name *</ReviewFormLabel>
                <ReviewFormInput 
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your full name"
                />
              </ReviewFormField>

              <ReviewFormField>
                <ReviewFormLabel htmlFor="email">Email *</ReviewFormLabel>
                <ReviewFormInput 
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                />
              </ReviewFormField>

              <ReviewFormField>
                <ReviewFormLabel htmlFor="title">Review Title *</ReviewFormLabel>
                <ReviewFormInput 
                  id="title"
                  name="title"
                  required
                  placeholder="Summarize your experience"
                />
              </ReviewFormField>

              <ReviewFormField>
                <ReviewFormLabel>Rating *</ReviewFormLabel>
                <ReviewFormRatingInput name="rating" required />
              </ReviewFormField>

              <ReviewFormField>
                <ReviewFormLabel htmlFor="content">Your Review *</ReviewFormLabel>
                <ReviewFormTextarea 
                  id="content"
                  name="content"
                  required
                  placeholder="Share your detailed experience..."
                  rows={4}
                />
              </ReviewFormField>

              <ReviewFormSubmit>Submit Review</ReviewFormSubmit>
            </ReviewForm>
          </CardContent>
        </Card>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px',
          color: '#6c757d',
          borderTop: '1px solid #dee2e6'
        }}>
          <p>
            🎉 All components are <strong>headless</strong>, <strong>accessible</strong>, 
            and ready for your custom styling!
          </p>
          <p>
            <strong>Bundle size:</strong> ~51KB | <strong>Components:</strong> 30+ | 
            <strong>React Aria:</strong> ✅ | <strong>TypeScript:</strong> ✅
          </p>
        </footer>
      </div>
    </MagnoraProvider>
  );
}

// Render the demo
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DemoApp />); 