// components/header.tsx
import Link from "next/link";
import { useStore } from "@/store";
import Logo from "./atoms/Logo";

const Header = () => {
  const { isLoggedIn, setLoggedIn, userId } = useStore();
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <header className="w-full bg-white">
      <div className="container mx-auto py-2 px-4 lg:px-0 flex justify-between items-center">
        <Link href={"/"}>
          <Logo />
        </Link>

        <div className="flex items-center">
          {userId && <p className="mr-8 font-semibold">{userId}</p>}
          {isLoggedIn && (
            <button onClick={handleLogout} className="btn-border">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
