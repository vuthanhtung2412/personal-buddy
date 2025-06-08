
import { Result, Ok, Err } from "@/types/result";

export async function tryCatch<T, E>(
  promise: Promise<T>,
  typeGuard?: (arg: unknown) => arg is E
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return new Ok(data);
  } catch (error: unknown) {
    if (typeGuard?.(error)) {
      return new Err(error); // error is E here
    }

    // error is unknown or not E
    throw error;
  }
}
