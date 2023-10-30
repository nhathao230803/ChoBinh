import classNames from "classnames/bind";
import styles from "./Product.module.scss";

import Header from "~/components/Layout/HeaderMember";
import Footer from "~/components/Layout/FooterMember";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartHide } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartShow } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Check from "~/components/Popup/Check";
import { addToCart } from "../../Redux/cartSlice";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import cookie from "js-cookie";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Product() {
  let params = useParams();
  const [userData, setUserData] = useState("");
  const [follow, setFollow] = useState(false);
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState({
    data: { quantity: 1 },
    user: {
      userId: "",
    },
  });
  const [showCart, setShowCart] = useState(""); // Show popup add to cart

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // fetchData
  useEffect(() => {
    try {
      const token = cookie.get("token");
      console.log(token);
      if (token) {
        const decodedUserData = jwtDecode(token);
        setUserData(decodedUserData);
        console.log(decodedUserData);
      }
    } catch (err) {
      console.log(err);
    }

    async function fetchData() {
      let res = await axios.get(`http://localhost:3000/products/${params.id}`);
      setProduct(res.data.data);
      setCart({
        data: {
          ...cart.data,
          id: res.data.data.id,
          img: `http://localhost:3000/${res.data.data.image}`,
          title: res.data.data.productName,
          price: res.data.data.price,
          desc: res.data.data.post.content,
        },
        user: {
          userId: res.data.data.post.userId,
          userName: res.data.data.post.user.userName,
        },
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCart(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showCart]);

  const handleFollow = () => {
    setFollow(!follow);
  };

  const handleDecrease = () => {
    if (cart.data.quantity - 1 > 0)
      setCart((prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            quantity: prev.data.quantity - 1,
          },
        };
      });
  };

  const handleIncrease = () => {
    if (cart.data.quantity + 1 <= product.quantity)
      setCart((prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            quantity: prev.data.quantity + 1,
          },
        };
      });
  };

  const handleAddtoCart = () => {
    setShowCart(true);
    dispatch(addToCart(cart));
  };

  return (
    <div className={cx("product-wrapper")}>
      <Check
        title="The product has been added to the cart"
        className={cx({
          "show-cart": showCart === true,
        })}
      />
      {/* Header */}
      <Header />
      {/* Hero */}
      <div className={cx("product-hero")}>
        <h2 className={cx("heading")}>PRODUCT DETAILS</h2>
        <span>
          <span>Home - </span>
          <span className={cx("title")}>Shopping</span>
        </span>
      </div>
      {/* Main */}
      <main className={cx("main")}>
        {/* Product */}
        <div className={cx("product")}>
          <div className={cx("images-product")}>
            <img
              src={`http://localhost:3000/${product.image}`}
              alt="Images"
              className={cx("img")}
            />
          </div>
          <div className={cx("property-product")}>
            <div>
              <h2 className={cx("name-product")}>{product.productName}</h2>
              <span className={cx("author")}>
                by
                <span className={cx("name")}>
                  {cart.user && cart.user.userName}
                </span>
              </span>
            </div>
            <span className={cx("price")}>
              {product.price}
              <span style={{ marginLeft: 5 }}>VND</span>
            </span>
            <span className={cx("")}>SKU: 12345</span>
            <div className={cx("availability")}>
              <span className={cx("title")}>Availability: </span>
              <span className={cx("number")}>
                {product.quantity} Left in Stock
              </span>
            </div>
            {/* Desc */}
            <p className={cx("desc")}>{cart.data.desc}</p>
            {/* Size */}
            <div className={cx("size")}>
              <span className={cx("title")}>Size: </span>
              <span className={cx("number-size")}>{product.size}</span>
            </div>
            {/* Qty */}
            {userData.id !== cart.user.userId && (
              <div className={cx("qty")}>
                <span className={cx("title")}>Qty: </span>
                <div className={cx("box-qty")}>
                  <span className={cx("minus")} onClick={handleDecrease}>
                    -
                  </span>
                  <span className={cx("number")}>{cart.data.quantity}</span>
                  <span className={cx("plus")} onClick={handleIncrease}>
                    +
                  </span>
                </div>
              </div>
            )}
            {userData.id !== cart.user.userId && (
              <>
                {/* Add to cart */}
                <div className={cx("action-cart")}>
                  <div className={cx("cart")} onClick={handleAddtoCart}>
                    ADD TO CART
                  </div>
                  <div className={cx("follow")} onClick={handleFollow}>
                    <FontAwesomeIcon
                      icon={faHeartHide}
                      className={cx("icon", {
                        hide: follow === false,
                      })}
                    />
                    <FontAwesomeIcon
                      icon={faHeartShow}
                      className={cx("icon", {
                        show: follow === true,
                      })}
                    />
                  </div>
                </div>
                {/* Add to cart */}
                <div className={cx("action-buy")}>
                  <div className={cx("buy")}>BUY IT NOW</div>
                </div>
              </>
            )}

            {userData.id === cart.user.userId && (
              <>
                {/* Add to cart */}
                <div className={cx("action-cart")}>
                  <Link to={`/updateproduct/${cart.data.id}`}>
                    <div className={cx("cart")}>UPDATE INFO</div>
                  </Link>
                  <div className={cx("follow")} onClick={handleFollow}>
                    <FontAwesomeIcon
                      icon={faHeartHide}
                      className={cx("icon", {
                        hide: follow === false,
                      })}
                    />
                    <FontAwesomeIcon
                      icon={faHeartShow}
                      className={cx("icon", {
                        show: follow === true,
                      })}
                    />
                  </div>
                </div>
                {/* Add to cart */}
                <div className={cx("action-buy")}>
                  <div className={cx("buy")}>SET UNAVAILABLE</div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Product;
