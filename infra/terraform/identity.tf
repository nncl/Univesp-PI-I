# --- GitHub Actions OIDC federation ------------------------------------------
# Equivalent of the AWS IAM OIDC provider + deploy role: GitHub mints a short-
# lived token, Azure trusts it for this exact repo+branch, no long-lived
# secret ever lives in GitHub.
#
# Uses a User-Assigned Managed Identity rather than an Entra ID App
# Registration: creating an App Registration needs an Entra ID permission
# ("Users can register applications") that institutional/student tenants
# often disable for regular users. A UAMI supports the same OIDC federation
# but is an ordinary resource-group-scoped resource, so it works with just
# the Contributor-level access this subscription already grants.

resource "azurerm_user_assigned_identity" "github_actions" {
  name                = "${var.project_name}-github-actions"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
}

resource "azurerm_federated_identity_credential" "github" {
  name                = "github-actions-oidc"
  resource_group_name = azurerm_resource_group.main.name
  parent_id           = azurerm_user_assigned_identity.github_actions.id
  audience            = ["api://AzureADTokenExchange"]
  issuer              = "https://token.actions.githubusercontent.com"
  subject             = "repo:${var.github_owner}/${var.github_repo}:ref:refs/heads/${var.github_branch}"
}

# Least-privilege equivalent of the AWS role's ecr:*/ecs:UpdateService scope:
# "Container Apps Contributor" can create/update container apps and revisions
# but nothing else in the resource group (no networking, no IAM, no DB).
resource "azurerm_role_assignment" "github_actions_container_apps" {
  scope                = azurerm_resource_group.main.id
  role_definition_name = "Container Apps Contributor"
  principal_id         = azurerm_user_assigned_identity.github_actions.principal_id
}
