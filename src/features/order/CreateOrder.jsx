import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const {
    userName,
    status: addressStatus,
    position,
    address,
    error: errorAddrss,
  } = useSelector((state) => state.user);
  const isLoadingAdress = addressStatus === "loading";
  // const cart = fakeCart;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const dispatch = useDispatch();
  const formError = useActionData();

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  if (!cart.length) return <EmptyCart />;
  return (
    <div className="ty-6 px-4">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      {/* <Form method="POST" aciton="/order/new"> */}
      <Form method="POST" action="/order/new">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            defaultValue={userName}
            name="customer"
            required
            className="focus-ring w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring-yellow-400  md:px-6 md:py-3"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center ">
          <label>Phone number</label>
          <div className="grow">
            <input
              type="tel"
              name="phone"
              required
              className="focus-ring  w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none  focus:ring-yellow-400 md:px-6 md:py-3"
            />
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label>Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              defaultValue={address}
              disabled={isLoadingAdress}
              required
              className="focus-ring w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none  focus:ring-yellow-400 md:px-6 md:py-3"
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddrss}
              </p>
            )}
          </div>
          <span className="absolute right-[3px] top-[5%] z-50 sm:right-[5px] sm:top-[3px] ">
            {!position.latitude && !position.longtitude && (
              <Button
                disabled={isLoadingAdress || isSubmitting}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            )}
          </span>
          {formError?.phone && (
            <p className="mt-3 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {formError.phone}
            </p>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longtitude && position.latitude
                ? `${position.latitude}${position.longtitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? "placing order"
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  //making the priority ture or false and it on or not existent in raw data
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  const error = {};
  if (!isValidPhone(order.phone))
    error.phone = "please give a valid phone number";
  if (Object.keys(error).length > 0) return error;
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}
export default CreateOrder;
