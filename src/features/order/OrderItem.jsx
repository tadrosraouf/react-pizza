import { formatCurrency } from "../../utils/helpers";
function OrderItem({ item, isLoadingIngredients, ingredients }) {
  // const { quantity, name, totalPrice } = item;

  return (
    <li key={item.id} className="space-y-1 py-3">
      <div className="flex items-center justify-between gap-2 text-sm">
        <p>
          <span className="font-bold">{item.quantity}&times;</span> {item.name}
        </p>
        <p className="font-bold">{formatCurrency(item.totalPrice)}</p>
      </div>
      <p className="text-sm capitalize italic text-stone-500">
        {isLoadingIngredients ? "loading...." : ingredients?.join(" ")}
      </p>
    </li>
  );
}

export default OrderItem;
