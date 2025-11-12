// ParentComponent.jsx
import { useState } from "react";
import { ServiceDetails } from "./ServiceDetails"; // ✅ correct if exported with `export function`
import Checkout from "./Checkout";

export default function ParentComponent() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <>
      <ServiceDetails cartItems={cartItems} setCartItems={setCartItems} />
      <Checkout cartItems={cartItems} setCartItems={setCartItems} />
    </>
  );
}
