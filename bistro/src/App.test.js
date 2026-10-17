import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Menu from "./Pages/Menu/Menu";
import Booking from "./Pages/Booking/Booking";
import Login from "./Pages/Login/Login";
import AdminMiddleware from "./Middleware/AdminMiddleware";
import AdminNav from "./Admin/components/AdminNav/AdminNav";
import GuestProfile from "./Middleware/GuestProfile";
import { setAuthUser, setUserToken } from "./Helper/Storage";
import http from "./Helper/http";
jest.mock("./Helper/http", () => ({ GET: jest.fn(), POST: jest.fn() }));
afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
function guard(element, user) {
  if (user) setAuthUser(user);
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/" element={<p>Public home</p>} />
        <Route element={element}>
          <Route path="/protected" element={<p>Protected content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}
test("anonymous users opening admin directly are redirected without a crash", () => {
  guard(<AdminMiddleware />);
  expect(screen.getByText("Public home")).toBeInTheDocument();
});
test("customers cannot open admin routes", () => {
  guard(<AdminMiddleware />, { role: "user" });
  expect(screen.getByText("Public home")).toBeInTheDocument();
});
test("administrators can open admin routes", () => {
  guard(<AdminMiddleware />, { role: "admin" });
  expect(screen.getByText("Protected content")).toBeInTheDocument();
});
test("profile routes require a logged-in user", () => {
  guard(<GuestProfile />);
  expect(screen.getByText("Public home")).toBeInTheDocument();
});
test("an empty database produces a useful menu empty state", async () => {
  http.GET.mockResolvedValue({ data: { data: [] } });
  render(<Menu />);
  expect(await screen.findByText("No items found")).toBeInTheDocument();
});
test("menu items render returned cloud image URLs", async () => {
  http.GET.mockResolvedValue({
    data: {
      data: [
        {
          _id: "1",
          name: "Test Dinner",
          description: "A sample test dinner description",
          price: 10,
          category: "Main Dishes",
          fileUrl: "https://res.cloudinary.com/test/menu.jpg",
        },
      ],
    },
  });
  render(<Menu />);
  expect(await screen.findByText("Test Dinner")).toBeInTheDocument();
  expect(screen.getByAltText("menu-img")).toHaveAttribute(
    "src",
    "https://res.cloudinary.com/test/menu.jpg",
  );
});
test("network errors show a helpful menu error", async () => {
  http.GET.mockRejectedValue(new Error("Network Error"));
  render(<Menu />);
  expect(
    await screen.findByText("Unable to reach the service. Please try again."),
  ).toBeInTheDocument();
});
test("customer booking form submits the existing API contract", async () => {
  setAuthUser({ _id: "1", role: "user" });
  http.POST.mockResolvedValue({ status: "success" });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    </Provider>,
  );
  for (const [label, value] of [
    ["Name", "Test Customer"],
    ["Phone", "01012345678"],
    ["Date", "2099-12-20"],
    ["Time", "18:30"],
    ["Total Persons", "2"],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Book Now" }));
  await waitFor(() =>
    expect(http.POST).toHaveBeenCalledWith(
      "bookings",
      expect.objectContaining({
        name: "Test Customer",
        date: "2099-12-20",
        numOfPersons: "2",
        time: expect.stringMatching(/6:30 PM/),
      }),
    ),
  );
});

test("login network failure shows a useful error without losing the form", async () => {
  http.POST.mockRejectedValue(new Error("Network Error"));
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>,
  );
  fireEvent.change(screen.getByLabelText("Email", { exact: true }), {
    target: { value: "unit@example.invalid" },
  });
  fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
    target: { value: "unit-test-input" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Login", exact: true }));
  await waitFor(() =>
    expect(store.getState().toast.msg).toBe(
      "Unable to reach the service. Please try again.",
    ),
  );
  expect(
    screen.getByRole("button", { name: "Login", exact: true }),
  ).toBeEnabled();
});

test("administrator logout clears both saved identity and bearer token", () => {
  setAuthUser({
    id: "unit-user",
    firstName: "Unit",
    lastName: "Admin",
    role: "admin",
  });
  setUserToken("unit-only-placeholder");
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/" element={<p>Signed out</p>} />
        <Route element={<AdminMiddleware />}>
          <Route path="/admin" element={<AdminNav />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button"));
  expect(localStorage.getItem("user") === null).toBe(true);
  expect(localStorage.getItem("user_token") === null).toBe(true);
});
