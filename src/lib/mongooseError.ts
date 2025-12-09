// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMongooseError(err: any): {
  status: number;
  body: { message: string; errors?: Record<string, string> };
} {
  // ValidationError (required, min, etc.)
  if (err?.name === "ValidationError" && err.errors) {
    const errors: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [path, detail] of Object.entries<any>(err.errors)) {
      errors[path] = detail?.message || "Invalid value";
    }
    return { status: 400, body: { message: "Validation failed", errors } };
  }

  // MongoDB duplicate key error code
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ") || "field";
    return {
      status: 409,
      body: {
        message: `Duplicate value for ${field}`,
        errors: { [field]: `${field} is already in use` },
      },
    };
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

  return { status: 500, body: { message: "Server error" } };
}
