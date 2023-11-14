import { Link } from "react-router-dom";
function Button({ children, disabled, to, type, ...rest }) {
  const base =
    "text-tone-800 text-sm foucs:outline-none inline-block rounded-full bg-yellow-400  font-semibold uppercase tracking-wide transition-colors duration-300 hover:bg-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed";
  const styles = {
    primary: base + " px-4 py-3 md:px-6 md :py-4",
    small: base + " px-4 py-2 md:px-5 md:py-2.5 text-xs",
    secondary:
      "text-tone-800 text-sm foucs:outline-none inline-block rounded-full border-2 border-stone-300 font-semibold uppercase tracking-wide transition-colors duration-300 hover:bg-stone-300 focus:ring focus:ring-stone-300 focusring-offset-2 disabled:cursor-not-allowed px-4 py-3 md:px-6 md:py-3.5 hover:text-stone-800",
    round: base + " px-2.5 py-1 md:px-3.5 md:py-2 text-sm",
  };

  // const className =
  //   "text-tone-800 foucs:outline-none inline-block rounded-full bg-yellow-400 px-4 py-3 font-semibold uppercase tracking-wide transition-colors duration-300 hover:bg-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed sm:px-6 sm:py-4";
  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  // if (onClick)
  //   return (
  //     <button disabled={disabled} className={styles[type]} onClick={onClick}>
  //       {children}
  //     </button>
  //   );
  return (
    <button disabled={disabled} className={styles[type]} {...rest}>
      {children}
    </button>
  );
}

export default Button;
