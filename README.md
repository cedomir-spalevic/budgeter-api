# budgeter-api

![Deploy main branch](https://github.com/cedomir-spalevic/budgeter-api/workflows/Deploy%20main%20branch/badge.svg)

API for Budgeter mobile app

## How to run

```
   # Install modules
   npm install

   # Run app
   npm start
```

## Building Infrastructure

We are using `terraform` to build our infrastructure. Right now, we are only using GCP as a provider.

NOTE: The order we apply our resources does not matter to terraform

### Steps for running terraform

```
# validate your configuration
terraform validate

# make your infrastructure updates within your provider
terraform apply

# display your infrastructure state
terraform show

# display any outputs
terraform output

# delete your resources
terraform destroy
```

