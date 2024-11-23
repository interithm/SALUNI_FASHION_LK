// 'use client'
// import React, { useState } from 'react';
// import { Star, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
//
// const CustomerReviews = () => {
//
//     const reviews = [
//         {
//             id: 1,
//             name: "Emily Parker",
//             image: "/api/placeholder/300/400",
//             rating: 5,
//             date: "March 15, 2024",
//             review: "Absolutely love my new summer dress! The quality is amazing and it fits perfectly. Will definitely be shopping here again!",
//             outfit: "Floral Summer Dress",
//             instagram: "@emily.styles"
//         },
//         {
//             id: 2,
//             name: "Sophie Chen",
//             image: "/api/placeholder/300/400",
//             rating: 5,
//             date: "March 10, 2024",
//             review: "The blazer I ordered is exactly what I was looking for. Perfect for both work and casual outings.",
//             outfit: "Classic Black Blazer",
//             instagram: "@sophiestyle"
//         },
//         {
//             id: 3,
//             name: "Maria Rodriguez",
//             image: "/api/placeholder/300/400",
//             rating: 5,
//             date: "March 5, 2024",
//             review: "Such a great shopping experience! The owner helped me pick the perfect outfit for my event.",
//             outfit: "Evening Ensemble",
//             instagram: "@maria.fashion"
//         }
//     ];
//
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [selectedReview, setSelectedReview] = useState(null);
//
//     const nextReview = () => {
//         setCurrentIndex((prev) => (prev + 1) % reviews.length);
//     };
//
//     const prevReview = () => {
//         setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
//     };
//
//     const renderStars = (rating) => {
//         return [...Array(5)].map((_, index) => (
//             <Star
//                 key={index}
//                 className={`w-4 h-4 ${
//                     index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
//                 }`}
//             />
//         ));
//     };
//
//     return (
//         <div className="bg-base-100 py-16">
//             <div className="container mx-auto px-4">
//                 {/* Section Header */}
//                 {/*<div className="text-center mb-12">*/}
//                     {/*<h2 className="text-3xl font-bold mb-4">Our Lovely Customers</h2>*/}
//                     {/*<p className="text-base-content/70">*/}
//                     {/*    See how our customers style their favorite pieces*/}
//                     {/*</p>*/}
//                 {/*</div>*/}
//
//                 {/* Photo Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
//                     {reviews.map((review) => (
//                         <div
//                             key={review.id}
//                             className="relative group cursor-pointer"
//                             onClick={() => setSelectedReview(review)}
//                         >
//                             <img
//                                 src={review.image}
//                                 alt={`${review.name} wearing ${review.outfit}`}
//                                 className="w-full h-64 object-cover rounded-lg"
//                             />
//                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
//                                 <div className="text-white text-center p-4">
//                                     <p className="font-semibold">{review.outfit}</p>
//                                     <p className="text-sm">{review.instagram}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//
//                 {/* Reviews Carousel */}
//                 <div className="max-w-4xl mx-auto">
//                     <div className="relative">
//                         <div className="card bg-base-200 shadow-xl">
//                             <div className="card-body">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div>
//                                         <h3 className="font-bold">{reviews[currentIndex].name}</h3>
//                                         <div className="flex items-center gap-1 mt-1">
//                                             {renderStars(reviews[currentIndex].rating)}
//                                         </div>
//                                     </div>
//                                     <span className="text-sm text-base-content/70">
//                     {reviews[currentIndex].date}
//                   </span>
//                                 </div>
//                                 <p className="text-lg mb-4">{reviews[currentIndex].review}</p>
//                                 <div className="flex items-center gap-2 text-sm text-base-content/70">
//                                     <Instagram className="w-4 h-4" />
//                                     {reviews[currentIndex].instagram}
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Navigation Buttons */}
//                         <button
//                             onClick={prevReview}
//                             className="btn btn-circle btn-sm absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4"
//                         >
//                             <ChevronLeft className="w-4 h-4" />
//                         </button>
//                         <button
//                             onClick={nextReview}
//                             className="btn btn-circle btn-sm absolute right-0 top-1/2 -translate-y-1/2 translate-x-4"
//                         >
//                             <ChevronRight className="w-4 h-4" />
//                         </button>
//                     </div>
//
//                     {/* Review Navigation Dots */}
//                     <div className="flex justify-center gap-2 mt-6">
//                         {reviews.map((_, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => setCurrentIndex(index)}
//                                 className={`w-2 h-2 rounded-full ${
//                                     currentIndex === index ? 'bg-primary' : 'bg-base-300'
//                                 }`}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Modal for Selected Review */}
//             {selectedReview && (
//                 <div className="modal modal-open">
//                     <div className="modal-box max-w-3xl">
//                         <div className="flex gap-6 flex-col md:flex-row">
//                             <img
//                                 src={selectedReview.image}
//                                 alt={`${selectedReview.name} wearing ${selectedReview.outfit}`}
//                                 className="w-full md:w-1/2 h-96 object-cover rounded-lg"
//                             />
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-lg mb-2">{selectedReview.name}</h3>
//                                 <div className="flex items-center gap-1 mb-4">
//                                     {renderStars(selectedReview.rating)}
//                                 </div>
//                                 <p className="mb-4">{selectedReview.review}</p>
//                                 <div className="flex items-center gap-2 text-sm text-base-content/70">
//                                     <Instagram className="w-4 h-4" />
//                                     {selectedReview.instagram}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="modal-action">
//                             <button
//                                 className="btn"
//                                 onClick={() => setSelectedReview(null)}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default CustomerReviews;