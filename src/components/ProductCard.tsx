import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../lib/supabase';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0]);
  const availableColors = product.colors && product.colors.length > 0
    ? product.colors
    : [product.color || 'Default'];
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0]);
  const [isHovering, setIsHovering] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const displayPrice = product.price ? Math.floor(product.price as any) : 0;
  const discountedPrice = Math.floor(displayPrice * 0.5);
  const savings = displayPrice - discountedPrice;

  const handleAddToCart = async () => {
    try {
      await addToCart(product, 1, selectedSize, selectedColor || product.color || '');
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Failed to update wishlist');
    }
  };

  const handleOrder = () => {
    const whatsappLink = generateWhatsAppLink(
      product.name,
      selectedSize,
      selectedColor || product.color || '',
      displayPrice
    );
    window.open(whatsappLink, '_blank');
  };

  return (
    <div
      className="relative bg-[#ff3b30] rounded-[16px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={product.image_url || 'https://i.postimg.cc/FRkVjK26/316c4caea73bb89b04e80d7d08f6fa57.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovering ? 'scale-110' : 'scale-100'
          }`}
        />

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 ${
              isInWishlist(product.id)
                ? 'fill-red-500 text-red-500'
                : 'text-gray-700'
            }`}
          />
        </button>

        {isHovering && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent animate-fade-in flex flex-col justify-end p-2">
            <div className="text-white space-y-1">
              <h3 className="font-bold text-sm line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium line-through opacity-70">KSh {displayPrice.toLocaleString()}</span>
                <span className="text-sm font-bold text-green-400">KSh {discountedPrice.toLocaleString()}</span>
              </div>
              <div className="text-xs text-green-300 font-semibold">50% OFF - Save KSh {savings.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 space-y-1.5">
        <div>
          <h3 className="font-bold text-sm text-white line-clamp-2">
            {product.name}
          </h3>
          {product.color && (
            <p className="text-xs text-white/80 uppercase tracking-wide mt-0.5">
              {product.color}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium line-through text-white/60">KSh {displayPrice.toLocaleString()}</span>
          <span className="text-sm font-bold text-white">KSh {discountedPrice.toLocaleString()}</span>
          <span className="text-xs font-bold text-green-400">50% OFF</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-white">Color:</p>
          <div className="flex gap-1 flex-wrap">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-2 py-1 text-xs font-medium border rounded transition-all line-clamp-1 ${
                  selectedColor === color
                    ? 'border-white bg-white text-black'
                    : 'border-white/40 text-white hover:border-white'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <button
            onClick={handleAddToCart}
            className="py-1.5 bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors rounded-full flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3 h-3" />
            Add to Cart
          </button>
          <button
            onClick={handleOrder}
            className="py-1.5 bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors rounded-full"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
