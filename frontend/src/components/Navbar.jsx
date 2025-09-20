import { Link } from "react-router";
import { Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"; // ✅ add this import at top

import { useState } from "react";

import useAuthStore from "../stores/authStore";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white text-blue-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-lg sm:text-xl font-medium tracking-wide cursor-pointer">
            <Link to="/"><img src="./logo.png" alt="logo" width="125px" /></Link>
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to={"/profile"}>
                  <span className="text-blue-600">Hi, {user.username}</span>
                </Link>

                {/* Favourites Link */}
                <Link
                  to="/favourites"
                  className="flex items-center gap-1 text-yellow-500 font-medium cursor-pointer hover:text-yellow-600 transition"
                >
                  <StarBorderIcon fontSize="small" />
                  <span className="text-base sm:text-lg">Favourites</span>
                </Link>

                <Link
                  to="/drafts"
                  className="flex items-center gap-1 text-blue-500 font-medium cursor-pointer hover:text-blue-600 transition"
                >
                  <ArticleOutlinedIcon fontSize="small" />
                  <span className="text-base sm:text-lg">Drafts</span>
                </Link>

                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  component={Link}
                  to="/posts/new"
                  className="cursor-pointer"
                >
                  Create Post
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  onClick={logout}
                  className="cursor-pointer"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  color="primary"
                  size="medium"
                  component={Link}
                  to="/login"
                  className="cursor-pointer"
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  component={Link}
                  to="/register"
                  className="cursor-pointer"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <IconButton
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-3">
          {user ? (
            <>
              <span className="block text-blue-600">Hi, {user.username}</span>

              <Link
                to="/favourites"
                className="flex items-center gap-1 text-yellow-500 font-medium cursor-pointer hover:text-yellow-600 transition"
              >
                <StarBorderIcon fontSize="small" />
                <span>Favourites</span>
              </Link>

              <Link
                to="/drafts"
                className="flex items-center gap-1 text-blue-500 font-medium cursor-pointer hover:text-blue-600 transition"
              >
                <ArticleOutlinedIcon fontSize="small" />
                <span>Drafts</span>
              </Link>

              <div>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="medium"
                  component={Link}
                  to="/posts/new"
                  className="cursor-pointer"
                >
                  Create Post
                </Button>
              </div>
              <div>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  size="medium"
                  onClick={logout}
                  className="cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Button
                  fullWidth
                  variant="text"
                  color="primary"
                  size="medium"
                  component={Link}
                  to="/login"
                  className="cursor-pointer"
                >
                  Login
                </Button>
              </div>
              <div>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="medium"
                  component={Link}
                  to="/register"
                  className="cursor-pointer"
                >
                  Register
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
