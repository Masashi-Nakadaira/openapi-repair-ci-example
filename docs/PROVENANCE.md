# Reviewed inputs and scope

Reviewed 2026-10-09. All API documents in this repository are synthetic examples.

## Public CLI

The CLI is downloaded from the existing maintainer distribution, not vendored or relicensed here:
https://openapi-repair.pages.dev/downloads/openapi-repair-cli-preview.zip

- Reported rule set: `aws-rest-oas30-2026-10-06`
- Archive SHA-256: `11be8c7fd679d8a65755fc9df77aed39f885dccac7cf18984dc9c03d971f4c6b`
- CLI SHA-256: `9ece1d612045122e9229be796db642111ff740e34422d549ae581f8d84414dbc`
- The archive's README and THIRD-PARTY-NOTICES are retained in `.tools/` after download
- The download URL can change its bytes; the recipe fails closed if it changes. A checksum verifies a reviewed artifact, not the truth of its diagnostics
- No open-source license is being newly assigned to the CLI or its dependencies by this example

## Actions

Full commit pins were verified against the official repositories:

- [actions/checkout v7.0.1](https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1)
- [actions/setup-node v7.1.0](https://github.com/actions/setup-node/commit/949feb2413d6458794dcd2491c4babbbce0c15c1)

## Why this check is bounded

[AWS documents](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-known-issues.html) that REST APIs do not apply root-level OpenAPI security. This example compares OpenAPI declarations, not the deployed AWS configuration. Exact operation copies preserve effective OpenAPI requirements, while a new empty operation security list permits anonymous access in the document.

The API-key example demonstrates declaration inheritance; API keys and usage plans are not a substitute for authentication/authorization. The example does not create a Lambda/Cognito authorizer, call AWS, or prove any request would be accepted or rejected. Test actual imports and authorization separately in a non-production account.
