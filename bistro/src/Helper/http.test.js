import { setUserToken, removeUserToken } from "./Storage";
function loadHttp(apiUrl = "https://api.example.com") {
  jest.resetModules();
  process.env.REACT_APP_API_URL = apiUrl;
  const axios = require("axios");
  const requests = [];
  axios.defaults.adapter = async (config) => {
    requests.push(config);
    return {
      data: { status: "success" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  return { http: require("./http").default, requests };
}
afterEach(() => {
  localStorage.clear();
  delete process.env.REACT_APP_API_URL;
});
test("uses configured API with request-time bearer token and clears it after logout", async () => {
  const { http, requests } = loadHttp();
  setUserToken("first-token");
  expect(await http.GET("menu")).toEqual({ status: "success" });
  removeUserToken();
  await http.GET("menu");
  expect(requests[0].baseURL).toBe("https://api.example.com/");
  expect(requests[0].headers.Authorization).toBe("Bearer first-token");
  expect(requests[1].headers.Authorization).toBeUndefined();
  expect(requests[0].withCredentials).toBe(false);
});
test("does not send bearer tokens to absolute URLs on another origin", async () => {
  const { http, requests } = loadHttp();
  setUserToken("private-token");
  await expect(http.GET("https://attacker.example/menu")).rejects.toThrow();
  expect(requests).toHaveLength(0);
});
test("all helper methods preserve body and response interfaces", async () => {
  const { http, requests } = loadHttp();
  for (const method of ["POST", "PUT", "PATCH"])
    expect(await http[method]("menu", { name: "Dinner" })).toEqual({
      status: "success",
    });
  expect(await http.DELETE("menu/1")).toEqual({ status: "success" });
  expect(requests.map((r) => r.method)).toEqual([
    "post",
    "put",
    "patch",
    "delete",
  ]);
});
test("invalid API configuration fails clearly", () => {
  for (const value of [
    "not a URL",
    "https://user:password@api.example.com",
    "https://api.example.com/path",
  ])
    expect(() => loadHttp(value)).toThrow(/REACT_APP_API_URL/);
});
test("corrupt saved authentication data does not crash guest routes", () => {
  localStorage.setItem("user", "broken-json");
  expect(require("./Storage").getAuthUser()).toBeUndefined();
});
test("wrong-current-password 401 preserves the signed-in session for retry", async () => {
  const { http } = loadHttp();
  setUserToken("still-valid-token");
  const adapter = async (config) => {
    const error = new Error("Incorrect password");
    error.config = config;
    error.response = { status: 401, data: { message: "Incorrect password" } };
    throw error;
  };
  await expect(
    http.PATCH("users/updatePassword", {}, { adapter }),
  ).rejects.toThrow("Incorrect password");
  expect(require("./Storage").getUserToken()).toBe("still-valid-token");
});
