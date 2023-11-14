import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";
function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();
  function hanldeDelete(pizzaId) {
    console.log(pizzaId);
    dispatch(deleteItem(pizzaId));
  }
  return (
    <Button type="small" onClick={() => hanldeDelete(pizzaId)}>
      Delete
    </Button>
  );
}

export default DeleteItem;
