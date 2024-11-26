'use client'

import { useEffect, useState } from 'react';
import { collection, getDocs, where, doc, query, orderBy, limit } from 'firebase/firestore';
import { ref, getStorage, getDownloadURL } from 'firebase/storage';
import { db } from '@utils/firebase';
import ProductCard from './common/ProductCard';
import './Styles/productlist.css';
import Loading from './common/Loading';

type Product = {
  id: string;
  name: string;
  Sales_Price: number;
  Eng_Name: string;
  email: string;
  Discount: string;
  UUID: string;
  imageUrl?: string;
  imageUrl2?: string; 
  Item_ID_Auto: number;
};

const orgDocId = "20241118-1530-SaluniFashion";

const defaultImageUrl = 'https://firebasestorage.googleapis.com/v0/b/freidea-pos-img/o/20241118-1530-SaluniFashion%2FImages%2Fdefault%2Fdefault.png?alt=media&token=1246d87a-6de4-4494-b59b-2965bc18d629';
const storage = getStorage();

async function getImageDownloadURL(imagePath: string): Promise<string> {
  if (!imagePath) {
    console.warn("Image path is missing, using default image.");
    return defaultImageUrl;
  }
  try {
    const imageRef = ref(storage, imagePath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error(`Error getting image download URL for path: ${imagePath}`, error);
    return defaultImageUrl;
  }
}

const ProductList = (props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const itemsRef = collection(doc(db, "organizations", orgDocId), "items");
        const filters = [
          where("ItemActiveMode", "==", 1),
          where("Deleted", "==", 0),
          where("ShowInSaleInvoice", "==", 1),
          where("Manufacturer", "==", props.category),
          where("Discount", props.order, "0"),
          orderBy(props.group, "desc"),
          limit(props.limits),
        ];
        if (props.category){
            filters.push(where("Manufacturer", "==", props.category));
        }


        if (props.type) {
          filters.push(where("Brand", "==", props.type));
        }

        const itemsQuery = query(itemsRef, ...filters);
        const querySnapshot = await getDocs(itemsQuery);
        const productsArray: Product[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Fetch images using Promise.all
        const updatedProducts = await Promise.all(
          productsArray.map(async (product) => {
            const ID = product.Item_ID_Auto.toString();
            const formattedProductId = ID.replace(/\//g, '_');
            const [imageUrl, imageUrl2] = await Promise.all([
              getImageDownloadURL(`gs://freidea-pos-img/${orgDocId}/Images/Products/Product_${formattedProductId}.png`),
              getImageDownloadURL(`gs://freidea-pos-img/${orgDocId}/Images/Products/Product2_${formattedProductId}.png`),
            ]);
            return { ...product, imageUrl, imageUrl2 };
          })
        );

        setProducts(updatedProducts);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [props.category, props.group, props.limits, props.order, props.type, props.width]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="card-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          Discount={product.Discount}
          Sales_Price={product.Sales_Price}
          Eng_Name={product.Eng_Name}
          UUID={product.UUID}
          imageUrl={product.imageUrl}
          imageUrl2={product.imageUrl2}
          width={200}
          height={200}
        />
      ))}
    </div>
  );
};

export default ProductList;
