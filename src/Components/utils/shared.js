import cartService from "../../service/cartservice";
import { Role, RoutePaths } from "./enum";

const messages = {
    BOOK_DELETE: "Are you sure you want to delete this book?",
    USER_DELETE: "are you sure you want to delete the user?",
    CATEGORY_DELETE: "are you sure you want to delete this category?",
    UPDATED_SUCCESS: "Record updated successfully",
    UPDATED_FAIL: "Record cannot be updated",
    DELETE_SUCCESS: "Record deleted successfully",
    DELETE_FAIL: "Record cannot be deleted",
    ORDER_SUCCESS: "Your order is successfully placed",
};

const localStorageKeys = {
    USER: "user",
};

const NavigationItems = [
    {
        name: "Users",
        route: RoutePaths.user,
        access: [Role.Admin, Role.Seller, Role.Buyer],
    },
    {
        name: "Categories",
        route: RoutePaths.category,
        access: [Role.Admin, Role.Seller, Role.Buyer],
    },
    {
        name: "Books",
        route: RoutePaths.book,
        access: [Role.Admin, Role.Seller, Role.Buyer],
    },
    {
        name: "UpdateProfile",
        route: RoutePaths.updateprofile,
        access: [Role.Admin, Role.Seller, Role.Buyer],
    },
];


const addToCart = async (book, id) => {
  return cartService
    .add({
      userId: id,
      bookId: book.id,
      quantity: 1,
    })
    .then((res) => {
      return { error: false, message: "Item added in cart" };
    })
    .catch((e) => {
      // if (e.status === 500)
      //   return { error: true, message: "Item already in the cart" };
      // else return { error: true, message: "something went wrong" };
    });
};

const hasAccess = (pathname, user) => {
  const navItem = NavigationItems.find((x) => pathname.includes(x.route));
  if (navItem) {
    return (
      !navItem.access ||
      !!(navItem.access && navItem.access.includes(user.roleId))
    );
  }
  return true;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    messages,
    addToCart,
    hasAccess,
    localStorageKeys,
    NavigationItems,
};