
import { Result, Ok, Err } from "@/types/result";

export async function tryCatch<T, E>(
  promise: Promise<T>,
  typeGuard?: (arg: unknown) => arg is E
): Promise<Result<T, E>> {
  try {
    console.log("Executing promise...");
    const data = await promise;
    return new Ok(data);
  } catch (error) {
    console.error("Caught error:", error);
    if (typeGuard) {
      if (typeGuard(error)) {
        return new Err(error); // error is E here
      } else {
        throw new Error("Caught error does not match type guard");
      }
    }
    return new Err(error as E);
  }
}
