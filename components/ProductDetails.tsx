'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Image from 'next/image';
import SizeChart from './common/SizeChart';
import './Styles/productDetails.css';
import { formatPrice } from '../utils/price';
import { ref, getStorage, getDownloadURL } from 'firebase/storage';
import ProductDetailsLoading from './common/ProductDetailsLoading';
import { Heart } from 'lucide-react';
import Reviews from './Reviews';
import { getColorName } from '@utils/colorIdentifier';
// import colorNameList from "../src/data/colornames.json";
const orgDocId = "20241118-1530-SaluniFashion";
const storage = getStorage();

type ProductDetailsProps = {
  productId: string;

};

type Product = {
  Item_Name: string;
  description: string;
  Sales_Price: number;
  id: string;

  quantity: number;
  Cat_Name: string;
  src: string;
  UUID: string;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  sizeChart?: string;
  Remark: string;
  Item_ID_Auto: number;
  colorCodes: string;
  colorNames: string;
  color: string;
  code: string;
};

type ColorCodes = {

  code: string;
  color:string;
  url:string;


}


const defaultImageUrl = 'https://firebasestorage.googleapis.com/v0/b/freidea-pos-img/o/20241118-1530-SaluniFashion%2FImages%2Fdefault%2Fdefault.png?alt=media&token=1246d87a-6de4-4494-b59b-2965bc18d629';


async function getImageDownloadURL(serverPath: string): Promise<string> {
  if (!serverPath) {
    console.warn("Image path is missing, using default image.");
    return defaultImageUrl;
  }
  try {
    const imageRef = ref(storage, serverPath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error(`Error getting image download URL for path: ${serverPath}`, error);
    return defaultImageUrl;
  }
}

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "sizeChart">("description");
  const [mainImage, setMainImage] = useState<string>('');
  const [thumbnail1, setThumbnail1] = useState<string>('');
  const [thumbnail2, setThumbnail2] = useState<string>('');
  const [thumbnail3, setThumbnail3] = useState<string>('');
  const [thumbnail4, setThumbnail4] = useState<string>('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [thumsizechart, setSizechart] = useState<string>('');
  const [colorNamesArray, setColorNamesArray] = useState<ColorCodes[]>([])

  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product document
        const productDocRef = doc(
          collection(doc(db, "organizations", orgDocId), "items"),
          productId
        );
        const productDoc = await getDoc(productDocRef);
  
        if (!productDoc.exists()) {
          console.error("Product not found");
          return;
        }
  
        const productData = productDoc.data() as Product;
        const ID = productData.Item_ID_Auto.toString();
  
        console.log("ID:", ID);
  
        // Get reference to Firestore collection
        const ImageRef = collection(doc(db, "organizations", orgDocId), "image_files");
  
        // Build queries for product images & size chart
        const ImageQuery = query(
          ImageRef,
          where("Item_AutoID", "==", ID),
          where("ImgSection", "==", "ITEM_IMAGE"),
          orderBy("ImgNo", "asc")
        );
  
        const SizeChartQuery = query(
          ImageRef,
          where("Item_AutoID", "==", ID),
          where("ImgSection", "==", "ITEM_SIZE_CHART")
        );
  
        // Fetch image data
        const imageSnapshot = await getDocs(ImageQuery);
        const sizeChartSnapshot = await getDocs(SizeChartQuery);
  
        // Prepare to store image URLs and color data
        const imageUrls: string[] = [];
        const colorNames: string[] = [];
        const colorCodes: string[] = [];
  
        if (!imageSnapshot.empty) {
          // Map image URLs and colors
          for (const imageDoc of imageSnapshot.docs) {
            const imageData = imageDoc.data();
            const serverPath = imageData.Server_Path;
            const colorName = imageData.ColorName || "Unknown Color";
            const colorCode = imageData.ColorCode || "Unknown Code";
  
            const downloadUrl = await getImageDownloadURL(`gs://freidea-pos-img/${serverPath}`);
            imageUrls.push(downloadUrl);
            colorNames.push(colorName);
            colorCodes.push(colorCode);
          }
        } else {
          console.warn("No images found for this product.");
        }
  
        // Combine colors and codes into a single array of objects
        const colorsArray = colorNames.map((colorName, index) => ({
          color: getColorName(colorCodes[index]),
          code: colorCodes[index],
          url: imageUrls[index] || defaultImageUrl,
        }));
  
        console.log("Colors Array:", colorsArray);
  
        // Get size chart URL (if any)
        let sizeChartUrl = defaultImageUrl; // Use a default placeholder
        if (!sizeChartSnapshot.empty) {
          const sizeChartData = sizeChartSnapshot.docs[0].data();
          const serverPath = sizeChartData.Server_Path;
          sizeChartUrl = await getImageDownloadURL(`gs://freidea-pos-img/${serverPath}`);
        }
  
        // Update product data with fallback for missing images
        productData.imageUrl = imageUrls[0] || defaultImageUrl;
        productData.imageUrl2 = imageUrls[1] || defaultImageUrl;
        productData.imageUrl3 = imageUrls[2] || defaultImageUrl;
        productData.imageUrl4 = imageUrls[3] || defaultImageUrl;
        productData.sizeChart = sizeChartUrl ||  defaultImageUrl;
  
        setProduct(productData);
        setMainImage(imageUrls[0] || defaultImageUrl);
        setThumbnail1(imageUrls[0] || defaultImageUrl);
        setThumbnail2(imageUrls[1] || defaultImageUrl);
        setThumbnail3(imageUrls[2] || defaultImageUrl);
        setThumbnail4(imageUrls[3] || defaultImageUrl);
        setSizechart(sizeChartUrl || defaultImageUrl);
  
        setColorNamesArray(colorsArray);
      } catch (error) {
        console.error("Error fetching product or images:", error);
      }
    };
  
    fetchProduct();
  }, [productId]);
  


  const handleImageClick = (src: string) => {
    setMainImage(src);
  };

  const handleSizeClick = (selectedSize: string) => {
    setSize(selectedSize);
  };

  const handleColorClick = (selectedColor: string ,  selectedUrl: string) => {
    setColor(selectedColor);
    setMainImage(selectedUrl);
  };

  if (!product) {
    return <ProductDetailsLoading />
  }

  const addToCart = (product: Product) => {
    console.log("Order is processing", product);

    let existingItems = localStorage.getItem('Items');
    let itemsArray;

    try {
      itemsArray = existingItems ? JSON.parse(existingItems) : [];
    } catch (error) {
      console.error("Error parsing existing items from localStorage", error);
      itemsArray = [];
    }

    if (!Array.isArray(itemsArray)) {
      itemsArray = [];
    }

    const productIndex = itemsArray.findIndex(item => item.UUID === product.UUID);

    if (productIndex > -1) {
      itemsArray[productIndex].quantity += 1;
      itemsArray[productIndex].selectedsize = size;
      itemsArray[productIndex].selectedcolor = color;
      console.log("Product quantity incremented");
    } else {
      itemsArray.push({ ...product, quantity: 1, selectedsize: size, selectedcolor: color });
      console.log("Product added to cart");
    }

    localStorage.setItem('Items', JSON.stringify(itemsArray));
    router.push('/product/cart');
  };

  const addToWishList = (product: Product) => {
    console.log("WishList is processing", product);

    let existingItems = localStorage.getItem('wishlist');
    let itemsArray;

    try {
      itemsArray = existingItems ? JSON.parse(existingItems) : [];
    } catch (error) {
      console.error("Error parsing existing items from localStorage", error);
      itemsArray = [];
    }

    if (!Array.isArray(itemsArray)) {
      itemsArray = [];
    }

    const productIndex = itemsArray.findIndex(item => item.UUID === product.UUID);

    if (productIndex > -1) {
      itemsArray[productIndex].quantity += 1;
      itemsArray[productIndex].selectedsize = size;
      itemsArray[productIndex].selectedcolor = color;
      console.log("Product quantity incremented");
    } else {
      itemsArray.push({ ...product, quantity: 1, selectedsize: size, selectedcolor: color });
      console.log("Product added to cart");
    }

    localStorage.setItem('wishlist', JSON.stringify(itemsArray));
  };



  console.log(colorNamesArray);
  


  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-4 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <Image
                alt="ecommerce"
                id="main"
                className="w-full sm:w-3/4 md:w-2/3 lg:w-full h-auto object-cover object-center rounded"
                src={mainImage}
                style={{ maxHeight: "500px", objectFit: "contain" }}
                width={500}
                height={500}
                priority
              />
              <div className="mainDiv mt-4">
                <Image
                  src={thumbnail1}
                  alt="Thumbnail 1"
                  onClick={() => handleImageClick(thumbnail1)}
                  className="w-24 h-auto cursor-pointer border-2 border-gray-300 mr-2 rounded"
                  style={{ width: "100px", marginRight: "10px", borderRadius: "10px" }}
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <Image
                  src={thumbnail2}
                  alt="Thumbnail 2"
                  onClick={() => handleImageClick(thumbnail2)}
                  className="w-24 h-auto cursor-pointer border-2 border-gray-300 mr-2 rounded"
                  style={{ width: "100px", marginRight: "10px", borderRadius: "10px" }}
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <Image
                  src={thumbnail3}
                  alt="Thumbnail 3"
                  onClick={() => handleImageClick(thumbnail3)}
                  className="w-24 h-auto cursor-pointer border-2 border-gray-300 mr-2 rounded"
                  style={{ width: "100px", marginRight: "10px", borderRadius: "10px" }}
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <Image
                  src={thumbnail4}
                  alt="Thumbnail 4"
                  onClick={() => handleImageClick(thumbnail4)}
                  className="w-24 h-auto cursor-pointer border-2 border-gray-300 mr-2 rounded"
                  style={{ width: "100px", marginRight: "10px", borderRadius: "10px" }}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest font-Roboto">
                {product.Cat_Name}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4 font-sans">
                {product.Item_Name}
              </h1>
              <div className="flex mb-4  border-gray-300">
                <a
                  className={`flex-grow py-2 text-lg px-1 font-Roboto cursor-pointer ${activeTab === "description"
                    ? "text-indigo-500 border-b-2 border-indigo-500"
                    : ""
                    }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </a>
                <a
                  className={`flex-grow py-2 text-lg px-1 font-Roboto cursor-pointer ${activeTab === "sizeChart"
                    ? "text-indigo-500 border-b-2 border-indigo-500"
                    : ""
                    }`}
                  onClick={() => setActiveTab("sizeChart")}
                >
                  Size Chart
                </a>
              </div>
              {activeTab === "sizeChart" && <div className='' > <Image
                src={thumsizechart}
                alt="Thumbnail 4"
                className="w-full"
                style={{ width: "800", marginLeft: "10px", borderRadius: "10px" }}
                width={600}
                height={600}
                loading="lazy"
              /></div>}
              {activeTab === "description" && (
                <>
                  <p className="leading-relaxed mb-4 font-sans">
                    {product.Remark}
                  </p>
                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500 font-Roboto text-sm">Size</span>
                    <span className="ml-auto text-gray-900 flex space-x-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((sizeOption) => (
                        <button
                          key={sizeOption}
                          className={`w-8 h-8 rounded-full border-2 ${size === sizeOption
                            ? 'border-blue-600 bg-blue-100 text-blue-600 shadow-lg'
                            : 'border-gray-300 bg-white text-gray-500'
                            } flex items-center justify-center hover:border-blue-500 hover:shadow-xl active:border-blue-700 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out`}
                          style={{ fontSize: '0.7rem' }} // Adjusted font size for better visibility
                          onClick={() => handleSizeClick(sizeOption)}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </span>
                  </div>

                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500 font-Roboto text-sm mar">Color</span>
                    <span className="ml-auto flex space-x-2">
                      {colorNamesArray.map((colorOption, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 ${color === colorOption.color ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300'} flex items-center justify-center transition-transform transform hover:scale-110 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          style={{ backgroundColor: colorOption.code }}
                          onClick={() => handleColorClick(colorOption.color , colorOption.url)}
                          aria-label={colorOption.code}
                          title={colorOption.code} // Add tooltip for better accessibility
                        >
                          {color === colorOption.code && (
                            <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </span>

                  </div>
                 
                  <div className="flex items-center justify-between mt-4">
                    <span className=" title-font font-medium  text-lg sm:text-2xl font-Roboto  tracking-tight  leading-none mb-2  text-red-600">
                      {formatPrice(product.Sales_Price)}
                    </span>

                    <div className="flex space-x-5">
                      <button className="btn btn-outline btn-primary  hover:btn-primary  text-sm sm:text-base  px-4 py-2 sm:px-6 sm:py-3  transition-all duration-300 ease-in-out  flex items-center justify-center gap-2 group" onClick={() => addToWishList(product)}>
                        <Heart
                          size={20}
                          className="
                     transform group-hover:scale-110 group-hover:fill-current
                     transition-all duration-300 ease-in-out "/>

                      </button>
                      <button className="btn btn-outline btn-primary  hover:btn-primary  text-sm sm:text-base  px-4 py-2 sm:px-6 sm:py-3  transition-all duration-300 ease-in-out  flex items-center justify-center gap-2 group" onClick={() => addToCart(product)}>
                        Add To
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 sm:h-6 sm:w-6 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13l-1.5-6M7 13H3m6 9a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Reviews productId={productId} />
        </div>

      </section>
    </>
  );
};

export default ProductDetails;
