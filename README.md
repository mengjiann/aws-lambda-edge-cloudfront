# AWS Lambda Edge for Cloudfront
This is a Lambda@Edge function that is used to customize response body for Single Page Application (SPA) served through Cloudfront.

It allows returning static html for social sites (including Facebook, WhatsApp, Twitter) for rich social sharing (due to the nature of Single Page Application - SPA).

# Pre-requisite
- npm - can be installed via Homebrew `brew install node`
- gulp-cli - `npm install gulp-cli -g`


# Guide to prepare zip file for deployment
- Update the externalApi in the environment-config.json.
- `npm install`
- `gulp default --env {environment}` Environment: dev/ prod
- `archive.zip` will be created in the root folder and can be deployed to AWS Lambda

# Things to note
- Environment variables are not supported for the Lambda@Edge deployed to Cloudfront. Therefore, gulp is used to automate the task of replacing the env variables and also create the artifact for uploading. Or AWS System Manager Parameter Store can be used.
- AWS Lambda can only be deployed to (N. Virginia) Region.
- Only Node.js runtime supported at the time when this is written.
- Timeout of the lambda can be configured to 5 seconds.


# Reference
- https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html
- https://gulpjs.com/
- https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html