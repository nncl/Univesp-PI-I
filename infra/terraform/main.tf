terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Remote state lives in S3 + DynamoDB.
  # The bucket name and lock table name must be passed via -backend-config on
  # `terraform init` because S3 backend blocks cannot interpolate variables.
  #
  # Example:
  #   terraform init \
  #     -backend-config="bucket=yara-tattoo-tfstate-XXXX" \
  #     -backend-config="dynamodb_table=yara-tattoo-tflock"
  backend "s3" {
    key     = "yara-tattoo/prod/terraform.tfstate"
    region  = "sa-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}
