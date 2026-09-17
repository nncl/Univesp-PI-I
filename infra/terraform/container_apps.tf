resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project_name}-logs"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# No VNet integration: the Consumption workload profile (the default) runs
# on Azure-managed infrastructure and gives each app its own public HTTPS
# ingress, which is what stands in for the ALB here — no separate load
# balancer or NAT Gateway to pay for.
resource "azurerm_container_app_environment" "main" {
  name                       = "${var.project_name}-env"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  # Declared explicitly to match what Azure adds by default on new
  # environments — otherwise this shows as perpetual (harmless) drift on
  # every `terraform plan`.
  workload_profile {
    name                  = "Consumption"
    workload_profile_type = "Consumption"
  }
}

resource "random_password" "django_secret_key" {
  length  = 64
  special = true
}

# Computed from the environment's default domain (not from each other's
# resource) specifically to avoid a backend<->frontend circular dependency:
# each app's env vars need the *other* app's URL, and referencing a resource
# attribute — even name, which is already known — creates a dependency edge
# on that whole resource.
locals {
  backend_app_name  = "${var.project_name}-backend"
  frontend_app_name = "${var.project_name}-frontend"
  backend_url       = "https://${local.backend_app_name}.${azurerm_container_app_environment.main.default_domain}"
  frontend_url      = "https://${local.frontend_app_name}.${azurerm_container_app_environment.main.default_domain}"
}

# --- Backend (Django + Gunicorn) ---------------------------------------------

resource "azurerm_container_app" "backend" {
  name                         = local.backend_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  workload_profile_name        = "Consumption"

  secret {
    name  = "django-secret-key"
    value = random_password.django_secret_key.result
  }
  secret {
    name  = "django-admin-username"
    value = var.django_admin_username
  }
  secret {
    name  = "django-admin-password"
    value = var.django_admin_password
  }
  secret {
    name  = "database-password"
    value = random_password.db.result
  }

  # No registry block: the ghcr.io image is public (see the note on the
  # frontend app below), so Container Apps pulls it without credentials.
  # This also sidesteps a confirmed Azure Container Apps bug in this
  # environment where the `registries` field never persists — verified via
  # Terraform, the Azure CLI, and a raw ARM PATCH, all silently no-op.

  template {
    min_replicas = 0 # scale-to-zero: $0 compute while idle, small cold-start on the first request
    max_replicas = 1

    container {
      name = "backend"
      # Bootstrap placeholder (Microsoft's own public quickstart image) —
      # there's no real image in GHCR until the deploy workflow runs for the
      # first time. lifecycle.ignore_changes below stops Terraform from
      # reverting the image once CI takes over.
      image  = "mcr.microsoft.com/k8se/quickstart:latest"
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name  = "DJANGO_DEBUG"
        value = "false"
      }
      env {
        name  = "DJANGO_ALLOWED_HOSTS"
        value = "*"
      }
      env {
        name  = "CORS_ALLOWED_ORIGINS"
        value = local.frontend_url
      }
      env {
        name  = "DATABASE_HOST"
        value = azurerm_mysql_flexible_server.main.fqdn
      }
      env {
        name  = "DATABASE_PORT"
        value = "3306"
      }
      env {
        name  = "DATABASE_NAME"
        value = var.db_name
      }
      env {
        name  = "DATABASE_USER"
        value = var.db_username
      }
      env {
        name  = "DATABASE_SSL_REQUIRED"
        value = "true"
      }
      env {
        name  = "DJANGO_ADMIN_EMAIL"
        value = var.django_admin_email
      }
      env {
        name        = "DJANGO_SECRET_KEY"
        secret_name = "django-secret-key"
      }
      env {
        name        = "DJANGO_ADMIN_USERNAME"
        secret_name = "django-admin-username"
      }
      env {
        name        = "DJANGO_ADMIN_PASSWORD"
        secret_name = "django-admin-password"
      }
      env {
        name        = "DATABASE_PASSWORD"
        secret_name = "database-password"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8000
    transport        = "http"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  lifecycle {
    ignore_changes = [template[0].container[0].image]
  }
}

# --- Frontend (Next.js) -------------------------------------------------------
#
# NEXT_PUBLIC_API_BASE_URL is inlined into the JS bundle at *build time* by
# Next.js, so setting it as a runtime env var here would have no effect on
# the browser bundle. It's passed as a --build-arg in the GitHub Actions
# workflow instead (see .github/workflows/deploy.yml), from the
# NEXT_PUBLIC_API_BASE_URL repo variable — set that once to this backend's
# URL (`terraform output backend_url`) after the first apply.
#
# Both images must be set to Public visibility in GitHub's package settings
# after the first CI run publishes them (Profile/Org > Packages > each
# package > Package settings > Change visibility). No registry block here —
# see the comment on the backend app above for why.

resource "azurerm_container_app" "frontend" {
  name                         = local.frontend_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  workload_profile_name        = "Consumption"

  template {
    min_replicas = 0
    max_replicas = 1

    container {
      name = "frontend"
      # See the comment on the backend container above: bootstrap placeholder,
      # replaced by CI's first real deploy.
      image  = "mcr.microsoft.com/k8se/quickstart:latest"
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name  = "INTERNAL_API_BASE_URL"
        value = "${local.backend_url}/api"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    transport        = "http"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  lifecycle {
    ignore_changes = [template[0].container[0].image]
  }
}
