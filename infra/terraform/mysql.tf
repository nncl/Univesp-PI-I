# There's no VNet in this setup (Container Apps' Consumption plan doesn't
# need one, and skipping it avoids NAT Gateway-style charges), so the
# database is reached over its public endpoint instead of AWS RDS's
# private-subnet-only model. TLS is enforced (require_secure_transport) and
# the backend connects with ssl_mode=REQUIRED (see DATABASE_SSL_REQUIRED in
# ecs.tf) to compensate. Acceptable for an academic-scope project; a VNet-
# integrated Container Apps environment + private-access Flexible Server
# would be the production-grade equivalent of the AWS setup.
resource "random_password" "db" {
  length  = 32
  special = false # Flexible Server rejects some special characters
}

resource "azurerm_mysql_flexible_server" "main" {
  # Not "${var.project_name}-db": a first attempt to create that name in
  # canadacentral hit ProvisionNotSupportedForRegion, and Azure left a stale
  # name reservation behind that kept 409-conflicting on retries in the
  # correct region (southafricanorth) even though the resource itself was
  # never actually visible via `az mysql flexible-server list`.
  name                = "${var.project_name}-mysql"
  resource_group_name = azurerm_resource_group.main.name
  # Deliberately not azurerm_resource_group.main.location: MySQL Flexible
  # Server capacity for this subscription/SKU isn't available in every
  # region on the subscription's allowed-region list (var.location), so the
  # database gets its own region. Resources within one resource group can
  # span regions with no downside.
  location = var.db_location

  sku_name = var.db_sku_name
  version  = "8.0.21"

  administrator_login    = var.db_username
  administrator_password = random_password.db.result

  storage {
    size_gb = var.db_storage_gb
  }

  backup_retention_days = 7

  tags = {
    Name = "${var.project_name}-db"
  }
}

resource "azurerm_mysql_flexible_database" "main" {
  name                = var.db_name
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}

resource "azurerm_mysql_flexible_server_configuration" "require_secure_transport" {
  name                = "require_secure_transport"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  value               = "ON"
}

# Lets Container Apps (which don't have fixed outbound IPs on the
# Consumption plan) reach the server. Scoped to "other Azure resources", not
# the whole internet.
resource "azurerm_mysql_flexible_server_firewall_rule" "allow_azure_services" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_mysql_flexible_server_firewall_rule" "allow_my_ip" {
  count               = var.my_ip_address != null ? 1 : 0
  name                = "AllowMyIp"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = var.my_ip_address
  end_ip_address      = var.my_ip_address
}
