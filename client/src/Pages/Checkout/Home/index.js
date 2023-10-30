import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import styles from "./Checkout.module.scss";
import Header from "~/components/Layout/HeaderMember";
import Footer from "~/components/Layout/FooterMember";
import InputItem from "~/components/Layout/Author/InputItem";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeAllCart } from "../../../Redux/cartSlice";

const cx = classNames.bind(styles);

const COUNTRY = [
  {
    title: "Viet Nam",
  },
  {
    title: "Foreign Nation",
  },
];

const LIST_SHIP = [
  {
    id: 1,
    name: "Express Delivery (100.000 VND)",
    value: 100000,
  },
  {
    id: 2,
    name: "Standard Delivery (50.000 VND)",
    value: 50000,
  },
];

const PAYMENT = [
  {
    id: 1,
    name: "Direct bank transfer",
    desc: "Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.",
  },
  {
    id: 2,
    name: "Check payments",
    desc: "Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.",
  },
];

// const ITEM = [
//   {
//     name: "Stella & Chewy's Wild weenies grain free chicken recipe freeze dried raw dog treats - 750 grams",
//     price: 16.66,
//   },
//   {
//     name: "Stella & Chewy's Wild weenies grain free chicken recipe freeze dried raw dog treats - 750 grams",
//     price: 16.66,
//   },
//   {
//     name: "Stella & Chewy's Wild weenies grain free chicken recipe freeze dried raw dog treats - 750 grams",
//     price: 16.66,
//   },
// ];

function Checkout() {
  const dispatch = useDispatch();
  const LIST_CART = useRef(useSelector((state) => state.cart.cartCheckOut));
  const totalProduct = LIST_CART.current.reduce((total, currentValue) => {
    return total + currentValue.data.price * currentValue.data.quantity;
  }, 0);

  const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [company, setCompany] = useState("");
  // const [country, setCountry] = useState(COUNTRY[0]);
  const [streetAddress, setStreetAddress] = useState("");
  const [streetOptional, setStreetOptional] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  // const [email, setEmail] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [ship, setShip] = useState(LIST_SHIP[0]);
  const [coupon, setCoupon] = useState("");
  const [payment, setPayment] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [checkDelivery, setCheckDelivery] = useState(false);
  const [totalList, setTotalList] = useState(0);
  const [delivery, setDelivery] = useState([]);
  // console.log(checkbox);
  const [receiverAddress, setReciverAddress] = useState(
    streetOptional + streetAddress + city
  );
  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchData() {
      try {
        let res = await axios.get("http://localhost:3000/deliveries");
        setDelivery(res.data.data);
        if (res.data.data === null) {
          setCheckDelivery(false);
        } else {
          setCheckDelivery(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    console.log(checkDelivery);
    fetchData();
  }, []);

  useEffect(() => {
    if (ship !== "")
      setTotalList(totalProduct + ship.value + totalProduct / 10);
  }, [ship]);

  const handleCreateDelivery = async () => {
    const res = await axios.post("http://localhost:3000/deliveries", {
      receiverName: firstName,
      receiverAddress: receiverAddress,
      receiverPhone: phone,
    });
    if (res.data.code === 200) {
      console.log("Create Delivery");
    } else {
      console.log("Error");
    }
  };

  const handlePlaceOrder = async () => {
    const res = await axios.post("http://localhost:3000/orders", {
      deliveryId: delivery.id,
      Note: "lay gio hanh chinh",
      paymentMethod: "vnpay",
      products: LIST_CART.current.map((item) => {
        return {
          id: item.data.id,
          quantity: item.data.quantity,
        };
      }),
    });
    console.log(1);
    console.log(res.data.code);
    let check = false;
    if (res.data.code === 200) {
      const update = await axios
        .put("http://localhost:3000/products/decrease_product", {
          products: LIST_CART.current.map((item) => {
            return {
              id: item.data.id,
              quantity: item.data.quantity,
            };
          }),
        })
        .then(() => {
          window.localStorage.setItem("cartItem", JSON.stringify([]));
          dispatch(removeAllCart());
        });
    }
    // if (res.data.data.paymentMethod === "vnpay") {
    //   document.getElementById("payment").onsubmit();
    // }
  };

  return (
    <div className={cx("checkout-wrapper")}>
      {/* Header */}
      <Header />
      {/* Hero */}

      <div className={cx("checkout-hero")}>
        <h2 className={cx("heading")}>CHECKOUT</h2>
        <span>
          <span>Home - </span>
          <span className={cx("title")}>CheckOut</span>
        </span>
      </div>
      {/* Body */}
      <div className={cx("body")}>
        {/* Form left */}
        {checkDelivery === false && (
          <>
            <div className={cx("form-left")}>
              <h2 className={cx("heading")}>Billing Details</h2>
              {/* Form */}
              <div className={cx("form")}>
                {/* Row name */}
                <div className={cx("row")}>
                  {/* Full Name */}
                  <InputItem
                    type="text"
                    title="Full name (First and Last name) "
                    placeholder="Full name (First and Last name)"
                    value={firstName}
                    setValue={setFirstName}
                    className={cx("input-item")}
                  />
                </div>
                {/* Row address*/}
                <div className={cx("row", "col")}>
                  <InputItem
                    type="text"
                    title="Street address *"
                    placeholder="Street address"
                    value={streetAddress}
                    setValue={setStreetAddress}
                    className={cx("input-item")}
                  />
                  <InputItem
                    type="text"
                    title=""
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={streetOptional}
                    setValue={setStreetOptional}
                    className={cx("input-item")}
                  />
                </div>

                {/* Row tow/city*/}
                <div className={cx("row")}>
                  <InputItem
                    type="text"
                    title="Town / City *"
                    placeholder="Town / City"
                    value={city}
                    setValue={setCity}
                    className={cx("input-item")}
                  />
                </div>

                {/* Row phone*/}
                <div className={cx("row")}>
                  <InputItem
                    type="text"
                    title="Phone number *"
                    placeholder="Phone number"
                    value={phone}
                    setValue={setPhone}
                    className={cx("input-item")}
                  />
                </div>
                <div className={cx("action")} onClick={handleCreateDelivery}>
                  Create
                </div>
              </div>
            </div>
          </>
        )}
        {checkDelivery === true && (
          <>
            <div className={cx("form-left")}>
              <div className={cx("list")}>
                {/* List product */}
                <h2 className={cx("heading")}>Billing Details</h2>
                <div>{delivery.receiverName}</div>
                <div>{delivery.receiverAddress}</div>
                <div>{delivery.receiverPhone}</div>
              </div>
            </div>
          </>
        )}

        {/* Form right */}
        <div className={cx("form-right")}>
          {/* Box order*/}
          <div className={cx("box", "box-order")}>
            <h2 className={cx("heading")}>Your Order</h2>
            {/* Product */}
            <div className={cx("product")}>
              <h3 className={cx("title")}>Product</h3>
              <div className={cx("list")}>
                {/* List product */}
                {LIST_CART.current.map((item, index) => {
                  return (
                    <div key={index} className={cx("item")}>
                      <h3 className={cx("name")}>{item.data.title}</h3>
                      <div className={cx("price")}>
                        <span className={cx("name")}>
                          {Math.round(
                            item.data.price * item.data.quantity * 100
                          ) / 100}
                          <span> VND</span>
                        </span>
                        <span className={cx("vat")}>(ex. VAT)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Sub total */}
            <div className={cx("sub-total")}>
              <h3 className={cx("title")}>Subtotal</h3>
              <span className={cx("price")}>
                <span className={cx("name")}>{totalProduct} VND</span>
                <span className={cx("vat")}>(ex. VAT)</span>
              </span>
            </div>
            {/* Shipping */}
            <div className={cx("shipping")}>
              <h3 className={cx("title")}>Shipping</h3>
              <div className={cx("list-ship")}>
                {LIST_SHIP.map((item, index) => {
                  return (
                    <div key={index} className={cx("item")}>
                      <input
                        type="radio"
                        id={item.name}
                        checked={ship.id === item.id}
                        onChange={() => setShip(item)}
                      />
                      <label htmlFor={item.name} className={cx("name")}>
                        {item.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* VAT */}
            <div className={cx("vat-price")}>
              <h3 className={cx("title")}>VAT(10% totalProduct)</h3>
              <span className={cx("price")}>
                <span className={cx("name")}>{totalProduct / 10}</span>
              </span>
            </div>
            {/* Total */}
            <div className={cx("total")}>
              <h3 className={cx("title")}>Total</h3>
              <span className={cx("price")}>
                <span className={cx("name")}>{totalList} VND</span>
              </span>
            </div>
          </div>
          {/* Box coupon*/}
          <div className={cx("box", "box-coupon")}>
            <p className={cx("heading")}>
              If you have a coupon code, please apply it below.
            </p>
            <div className={cx("form")}>
              <InputItem
                placeholder="Coupon code"
                value={coupon}
                setValue={setCoupon}
                className={cx("input-item")}
              />
              <div className={cx("action")}>Apply</div>
            </div>
          </div>
          {/* Box payment */}
          <div className={cx("box", "box-payment")}>
            {/* Payment */}
            <div className={cx("payment")}>
              <div className={cx("list-payment")}>
                {PAYMENT.map((item, index) => {
                  return (
                    <div key={index} className={cx("item")}>
                      <section className={cx("select")}>
                        <input
                          type="radio"
                          id={item.name}
                          checked={payment.id === item.id}
                          onChange={() => setPayment(item)}
                        />
                        <label htmlFor={item.name} className={cx("name")}>
                          {item.name}
                        </label>
                      </section>
                      {payment.id === item.id && (
                        <section className={cx("desc")}>{item.desc}</section>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* policy */}
            <div className={cx("policy")}>
              <h3 className={cx("title")}>
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </h3>
            </div>
            {/* checkbox */}
            <div className={cx("checkbox")}>
              <input
                type="checkbox"
                id="checkbox"
                checked={checkbox}
                onChange={() => setCheckbox(!checkbox)}
              />
              <label htmlFor="checkbox" className={cx("title")}>
                I have read and agree to the website terms and conditions *
              </label>
            </div>

            {/* submit */}

            <div className={cx("submit")} onClick={handlePlaceOrder}>
              Place order
            </div>
            {/* <button onClick={handlePlaceOrder}>tinh tien</button>
             */}
            <form
              id="payment"
              method="POST"
              action="http://localhost:3000/vnpay/create_payment_url"
            >
              {/* Payment */}
              <input type="hidden" name="amount" value={totalList} />
              <input type="hidden" name="language" value="vn" />
              <input type="hidden" name="bankCode" value="" />
              {/* <input type="hidden" name="address" value={receiverAddress} /> */}
              {/* <input type="hidden" name="seller" value={} /> */}
              {/* create Order */}
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Checkout;
