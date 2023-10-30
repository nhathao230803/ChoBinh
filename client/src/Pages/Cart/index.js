import classNames from "classnames/bind";
import { useEffect, useState, useRef } from "react";
import styles from "./Cart.module.scss";
import Header from "~/components/Layout/HeaderMember";
import Footer from "../../components/Layout/FooterMember";
import images from "~/assets/images";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveToCart, addCartCheckOut } from "~/Redux/cartSlice";
import { Link } from "react-router-dom";
import Check from "~/components/Popup/Check";
import { isEditable } from "@testing-library/user-event/dist/utils";
import { useMemo } from "react";

const cx = classNames.bind(styles);

function Cart() {
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState(""); // Show popup add to cart
  const [listChecked, setListChecked] = useState([]);

  const LIST_CART = useRef(() => {
    let arr = [];
    if (window.localStorage.getItem("cartItem")) {
      arr = JSON.parse(window.localStorage.getItem("cartItem"));
    }
    return arr;
  }, []);

  const shipping = useRef(100000);

  const [listCart, setListCart] = useState(LIST_CART.current());
  const [cartCheckOut, setCartCheckOut] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCart(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showCart]);

  // console.log(cartCheckOut);

  // Check LIST_CART in localStorage
  const handleDecrease = (cart_index, product_index) => {
    const temp = [...listCart];
    if (listCart[cart_index].data[product_index].quantity > 1)
      listCart[cart_index].data[product_index].quantity--;
    setListCart(temp);
  };
  const handleIncrease = (cart_index, product_index) => {
    const temp = [...listCart];
    listCart[cart_index].data[product_index].quantity++;
    setListCart(temp);
  };

  const deleteCart = (cart_index) => {
    const temp = [...listCart].filter((item, index) => index !== cart_index);
    setListCart(temp);
  };

  const handleDeleteCart = () => {
    setListCart([]);
  };

  const handleUpdateCart = () => {
    setShowCart(true);
    dispatch(
      saveToCart({
        listCart: listCart,
      })
    );
  };

  const handleClickAllProduct = (event, cart) => {
    let isSelected = event.target.checked;
    if (isSelected) {
      let user = cart.user;
      const list = cart.data.map((item) => {
        return {
          user: user,
          data: item,
        };
      });
      setCartCheckOut((prev) => [
        ...prev.filter((item) => item.user.userId !== user.userId),
        ...list,
      ]);
    } else {
      setCartCheckOut((prev) =>
        prev.filter((item) => item.user.userId !== cart.user.userId)
      );
    }
  };

  // console.log(cartCheckOut);

  const handleClickProduct = (event, user, product) => {
    let isSelected = event.target.checked;
    if (isSelected) {
      setCartCheckOut((prev) => [
        ...prev,
        {
          user: user,
          data: product,
        },
      ]);
    } else {
      setCartCheckOut((prev) =>
        prev.filter((item) => item.data.id !== product.id)
      );
    }
  };

  const totalCart = cartCheckOut.reduce(
    (total, currentValue) =>
      (total += currentValue.data.price * currentValue.data.quantity),
    0
  );

  let total = totalCart + shipping.current; //TotalCart + ship(100$)

  const handleCheckOut = () => {
    dispatch(addCartCheckOut(cartCheckOut));
  };

  return (
    <div className={cx("cart-wrapper")}>
      <Check
        title="The shopping cart has been updated"
        className={cx({
          "show-cart": showCart === true,
        })}
      />
      <Header />
      {/* Hero */}
      <div className={cx("cart-hero")}>
        <h2 className={cx("heading")}>WISHLIST</h2>
        <span>
          <span>Home - </span>
          <span className={cx("title")}>Wishlist</span>
        </span>
      </div>
      {/* Main */}
      <main className={cx("main-wrapper")}>
        {/* List table */}
        <div className={cx("list-table")}>
          <table className={cx("table")}>
            <thead className={cx("table-header")}>
              <tr>
                <th className={cx("table-item", "table-buy")}>BUY</th>
                <th className={cx("table-item", "table-image")}>IMAGE</th>
                <th className={cx("table-item", "table-product")}>PRODUCT</th>
                <th className={cx("table-item", "table-price")}>PRICE</th>
                <th className={cx("table-item", "table-quantity")}>QUANTITY</th>
                <th className={cx("table-item", "table-total")}>TOTAL</th>
                <th className={cx("table-item", "table-remove")}>REMOVE</th>
              </tr>
            </thead>
            <tbody className={cx("table-body")}>
              {listCart.map((cart, indexUser) => {
                return (
                  <>
                    <tr key={indexUser} className={cx("table-user")}>
                      <td className={cx("table-item")}>
                        <input
                          type="checkbox"
                          className={cx("checkbox")}
                          checked={
                            cartCheckOut.filter(
                              (item) => item.user.userId === cart.user.userId
                            ).length === cart.data.length
                          }
                          onChange={(event) =>
                            handleClickAllProduct(event, cart)
                          }
                        />
                      </td>
                      <tr className={cx("table-info")}>
                        <img src={cart.user.img} />
                        <span className={cx("table-name")}>
                          {cart.user.userName}
                        </span>
                      </tr>
                    </tr>
                    {cart.data.map((item, index) => {
                      return (
                        <tr key={index} className={cx("table-row")}>
                          <td className={cx("table-item")}>
                            <input
                              type="checkbox"
                              className={cx("checkbox")}
                              checked={cartCheckOut.some(
                                (pd) => pd.data.id === item.id
                              )}
                              onChange={(event) =>
                                handleClickProduct(event, cart.user, item)
                              }
                            />
                          </td>

                          <td className={cx("table-item", "table-image")}>
                            <div className={cx("image")}>
                              <img
                                src={item.img}
                                alt="cart"
                                className={cx("img")}
                              />
                            </div>
                          </td>
                          <td className={cx("table-item")}>{item.title}</td>
                          <td className={cx("table-item")}>
                            {`${item.price}`} <span>VND</span>{" "}
                          </td>
                          <td className={cx("table-item")}>
                            <div className={cx("quantity")}>
                              <span
                                className={cx("minus", "item")}
                                onClick={() => handleDecrease(indexUser, index)}
                              >
                                -
                              </span>
                              <div className={cx("input-number", "item")}>
                                {item.quantity}
                              </div>
                              <span
                                className={cx("plus", "item")}
                                onClick={() => handleIncrease(indexUser, index)}
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td className={cx("table-item")}>
                            {Math.round(item.price * item.quantity * 100) / 100}{" "}
                            <span>VND</span>
                          </td>
                          <td className={cx("remove")}>
                            <img
                              src={images.bin}
                              alt="bin"
                              className={cx("bin")}
                              onClick={() => deleteCart(index)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
          <div className={cx("table-footer")}>
            {/* Action left */}
            <div className={cx("action-left")}>
              <Link to="/shop">
                <div className={cx("action-item")}>CONTINUE SHOPPING</div>
              </Link>
              <div className={cx("action-item")} onClick={handleUpdateCart}>
                UPDATE SHOPPING CART
              </div>
            </div>
            {/* Action right */}
            <div className="action-right">
              <div className={cx("action-item")} onClick={handleDeleteCart}>
                CLEAR SHOPPING CART
              </div>
            </div>
          </div>
        </div>

        {/* Cart total */}
        <div className={cx("cart-total")}>
          <h3 className={cx("title")}>Cart Totals</h3>
          <div className={cx("content")}>
            {/* Menu */}
            <div className={cx("menu")}>
              <div className={cx("menu-left")}>
                <span>Sub Total</span>
                <div className={cx("border")}></div>
              </div>
              <div className={cx("menu-right")}>
                {totalCart} <span>VND</span>
              </div>
            </div>
            {/* Menu */}
            <div className={cx("menu")}>
              <div className={cx("menu-left")}>
                <span>Shipping</span>
                <div className={cx("border")}></div>
              </div>
              <div className={cx("menu-right")}>
                {shipping.current}
                <span style={{ marginLeft: 5 }}>VND</span>
              </div>
            </div>
            {/* Menu */}
            <div className={cx("menu")}>
              <div className={cx("menu-left")}>
                <span>Total</span>
                <div className={cx("border")}></div>
              </div>
              <div className={cx("menu-right", "total")}>
                {totalCart + shipping.current}
                <span style={{ marginLeft: 5 }}>VND</span>
              </div>
            </div>
          </div>
          {cartCheckOut.length === 0 && (
            <div className={cx("action")} onClick={handleCheckOut}>
              PROCEED TO CHECKOUT
            </div>
          )}
          {cartCheckOut.length > 0 && (
            <Link to="/checkout">
              <div className={cx("action")} onClick={handleCheckOut}>
                PROCEED TO CHECKOUT
              </div>
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;