terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Remote state lives in an Azure Storage Account (blob leases give us
  # locking for free — no DynamoDB-style table needed).
  #
  # The storage account itself can't be created by the config it will back,
  # so bootstrap it once with the CLI before the first `terraform init`:
  #
  #   az group create -n yara-tattoo-tfstate -l canadacentral
  #   az storage account create -n yaratattootfstateXXXX -g yara-tattoo-tfstate \
  #       -l canadacentral --sku Standard_LRS
  #
  #   Note: the storage account's region must be one your subscription is
  #   actually allowed to deploy to. New/student subscriptions can have a
  #   restricted region list until Azure's activation review clears — check
  #   Subscriptions > your subscription > Settings > Policies in the portal.
  #   az storage container create -n tfstate --account-name yaratattootfstateXXXX
  #
  # Then:
  #   terraform init \
  #     -backend-config="resource_group_name=yara-tattoo-tfstate" \
  #     -backend-config="storage_account_name=yaratattootfstateXXXX" \
  #     -backend-config="container_name=tfstate"
  backend "azurerm" {
    key = "yara-tattoo/prod/terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "main" {
  name     = "${var.project_name}-rg"
  location = var.location

  tags = {
    Project     = var.project_name
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}
