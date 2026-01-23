import config from "@/config";
import { getErrorMessage, getPaginationParams } from "@/utils";

describe("getErrormessage", () => {
  test("should return message from an Error instance", () => {
    const error = new Error("Something went wrong");
    expect(getErrorMessage(error)).toBe("Something went wrong");
  });

  test("should return message from an object with a message property", () => {
    const error = { message: "Custom error message" };
    expect(getErrorMessage(error)).toBe("Custom error message");
  });
});

describe("getPaginationParams", () => {
  test("should return default values when page and perPage are missing", () => {
    const req = { query: {} } as unknown as Request;
    expect(getPaginationParams(req as any)).toEqual({
      page: 1,
      perPage: config.defaultPageSize,
      limit: config.defaultPageSize,
      offset: 0,
    });
  });

  test("should parse valid page and perPage values", () => {
    const req = { query: { page: "2", perPage: "20" } } as unknown as Request;
    expect(getPaginationParams(req as any)).toEqual({
      page: 2,
      perPage: 20,
      limit: 20,
      offset: 20,
    });
  });
});
