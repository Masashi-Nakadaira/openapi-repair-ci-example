# Suggested publication copy

AWS API Gateway REST ignores root-level OpenAPI security. This 30-second walkthrough uses a synthetic example to show a local, reviewable change: copy the root requirement to GET /pets while leaving POST’s explicit security: [] override untouched.

Try the same example: https://openapi-repair.pages.dev/?sample=root-security#checker

Actual UI screenshots, edited into a short walkthrough. No AWS call is made. The preview does not create an authorizer, guarantee import success, or prove authorization is secure.

# Accessible transcript

00:00–00:06 — Start with the synthetic example. The checker flags GET /pets because it inherits root security rather than stating the requirement explicitly on the operation.

00:06–00:12 — Select the explicit-copy preview. The eligible-operations checkbox covers operations that do not already have a security field. Existing public and custom overrides are preserved.

00:12–00:18 — Inspect the exact file changes. The full-file preview shows two lines added and zero removed.

00:18–00:24 — Keep the public override. GET /pets gains security: followed by - SampleKey: []. POST /pets keeps security: []. The original root security also stays in place.

00:24–00:30 — Review locally, then test separately. This change does not create an AWS authorizer or establish import or authorization success. Try the synthetic example using the linked demo.
