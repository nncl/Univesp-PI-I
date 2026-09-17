output "backend_url" {
  value       = local.backend_url
  description = "Public backend URL. Set this as the NEXT_PUBLIC_API_BASE_URL GitHub Actions repo variable."
}

output "frontend_url" {
  value       = local.frontend_url
  description = "Public URL of the application."
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "container_app_environment_name" {
  value = azurerm_container_app_environment.main.name
}

output "backend_container_app_name" {
  value = azurerm_container_app.backend.name
}

output "frontend_container_app_name" {
  value = azurerm_container_app.frontend.name
}

output "mysql_fqdn" {
  value       = azurerm_mysql_flexible_server.main.fqdn
  description = "MySQL Flexible Server hostname (for connecting a client directly, if my_ip_address is set)."
}

output "mysql_admin_password" {
  value       = random_password.db.result
  description = "Auto-generated MySQL admin password."
  sensitive   = true
}

output "azure_client_id" {
  value       = azurerm_user_assigned_identity.github_actions.client_id
  description = "Set as the AZURE_CLIENT_ID GitHub Actions repo variable."
}

output "azure_tenant_id" {
  value       = data.azurerm_client_config.current.tenant_id
  description = "Set as the AZURE_TENANT_ID GitHub Actions repo variable."
}

output "azure_subscription_id" {
  value       = data.azurerm_client_config.current.subscription_id
  description = "Set as the AZURE_SUBSCRIPTION_ID GitHub Actions repo variable."
}
