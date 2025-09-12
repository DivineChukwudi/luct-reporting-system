import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import "./Checkout.css";

function Checkout() {
  const { products, updateProducts } = useContext(ProductContext);
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    // Prevent adding more than available stock
    const cartItem = cart.find((p) => p.id === product.id);
    const cartQty = cartItem ? cartItem.quantity : 0;

    if (cartQty + 1 > product.quantity) return;

    if (cartItem) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  // Complete sale
  const completeSale = () => {
    const updatedProducts = products.map((p) => {
      const soldItem = cart.find((c) => c.id === p.id);
      if (soldItem) {
        return { ...p, quantity: p.quantity - soldItem.quantity };
      }
      return p;
    });

    updateProducts(updatedProducts); // ✅ Fixed
    setCart([]);
    alert("Sale completed!");
  };

  // Calculate total
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      <div className="checkout-products">
        <h2>Available Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price (M)</th>
              <th>Stock</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.quantity <= 0}
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="checkout-cart">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.quantity}</td>
                  <td>{c.price * c.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(c.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h3>Total: M{total.toFixed(2)}</h3>
        <button onClick={completeSale} disabled={cart.length === 0}>
          Complete Sale
        </button>
      </div>
    </div>
  );
}

export default Checkout;
