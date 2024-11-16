'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Heart, Trash2, X } from 'lucide-react';
import Image from 'next/image';

interface WishlistItem {
  Item_Name: string;
  Sales_Price: string;
  imageUrl: string;
}

const FloatingWishlistButton: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const loadWishlist = () => {
    const itemsString = localStorage.getItem('wishlist');
    if (itemsString) {
      const storedItems: WishlistItem[] = JSON.parse(itemsString);
      setWishlistItems(storedItems);
    }
  };

  const removeFromWishlist = (indexToRemove: number) => {
    const updatedWishlist = wishlistItems.filter((_, index) => index !== indexToRemove);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="fixed bottom-4 right-4 md:bottom-5 md:right-5 z-50 bg-red-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={loadWishlist}
          >
            <Heart size={20} className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-4 md:p-6 w-[95%] max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-in-out z-50">
            <div className="sticky top-0 bg-white pb-4 z-10">
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 md:p-2 rounded-full shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 ease-in-out transform hover:rotate-90"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </Dialog.Close>
              <h2 className="text-lg md:text-xl font-bold text-center pt-2">Your Wish List</h2>
            </div>

            <div className="mt-2">
              {wishlistItems.length > 0 ? (
                <ul className="space-y-3 md:space-y-4">
                  {wishlistItems.map((item, index) => (
                    <li key={index} className="border p-3 md:p-4 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.Item_Name}
                            className="rounded-lg object-cover"
                            fill
                            sizes="(max-width: 768px) 48px, 64px"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="font-bold text-sm md:text-base truncate">
                            {item.Item_Name || 'Unnamed Item'}
                          </div>
                          <div className="text-gray-600 text-xs md:text-sm">
                            Price: {item.Sales_Price || 'N/A'}
                          </div>
                        </div>
                        <button
                          className="flex-shrink-0 text-red-600 hover:text-red-800 transition duration-300 ease-in-out p-2"
                          onClick={() => removeFromWishlist(index)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center text-sm md:text-base">
                  No items in your wishlist yet.
                </p>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default FloatingWishlistButton;