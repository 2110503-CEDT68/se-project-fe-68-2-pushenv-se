# Known Frontend/Backend Contract Gaps

These are current production mismatches intentionally left unfixed by the test suite.

1. `RegisterForm` expects either `statusCode === 409` or an `"email already exists"` message for duplicate-email handling.
   - Backend behavior: `409` with `{ success: false, message: "Email already in use" }`
   - Effect: duplicate registration falls back to a toast instead of setting a field error.

2. `CompanyProfileSection` uploads a `FormData` payload with `logo`, but `/company/profile` only accepts JSON on the backend.
   - Backend behavior: multipart request falls into the controller catch path and returns `500 Server error`
   - Effect: logo upload always fails even though the UI presents it as supported.
