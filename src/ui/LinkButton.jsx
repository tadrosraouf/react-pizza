import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LinkButton({ children, to, ...rest }) {
  const className = "text-sm text-blue-500 hover:text-blue-600";
  const navigate = useNavigate();
  if (to === "-1")
    return (
      <button onClick={() => navigate(-1)} className={className} {...rest}>
        {children}
      </button>
    );
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}

export default LinkButton;
