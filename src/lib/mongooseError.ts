// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMongooseError(err: any): {
  status: number;
  body: { message: string; errors?: Record<string, string> };
} {
  // Check for E11000 in the top-level error or the cause property
  // Mongoose 6+ often wraps the MongoServerError in a MongooseError 'cause' property
  const errorObj =
    err.code === 11000 || err.code === "11000"
      ? err
      : err.cause?.code === 11000 || err.cause?.code === "11000"
        ? err.cause
        : null;

  if (errorObj) {
    // Attempt to extract the field name from keyValue or keyPattern
    const keyObj =
      errorObj.keyValue ||
      errorObj.errorResponse?.keyValue ||
      errorObj.keyPattern ||
      errorObj.errorResponse?.keyPattern ||
      {};
    const field = Object.keys(keyObj)[0] || "field";

    // Capitalize field name for message
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    return {
      status: 409, // Conflict
      body: {
        message: `${fieldName} is already in use`,
        errors: { [field]: `${fieldName} is already in use` },
      },
    };
  }

  // ValidationError (required, min, etc.)
  if (err?.name === "ValidationError" && err.errors) {
    const errors: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [path, detail] of Object.entries<any>(err.errors)) {
      errors[path] = detail?.message || "Invalid value";
    }
    return { status: 400, body: { message: "Validation failed", errors } };
  }

  // CastError (e.g., invalid ObjectId, wrong type)
  if (err?.name === "CastError") {
    const field = err.path ?? "value";
    return {
      status: 400,
      body: { message: "Invalid value", errors: { [field]: "Invalid value" } },
    };
  }

  // StrictModeError when unknown keys are present
  if (err?.name === "StrictModeError") {
    return { status: 400, body: { message: err.message } };
  }

  // Fallback for generic MongooseError
  if (err?.name === "MongooseError") {
    return {
      status: 400,
      body: { message: err.message },
    };
  }

  return { status: 500, body: { message: "Server error" } };
}
