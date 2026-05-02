# Application secrets that humans must fill in after first apply.
#
# The secret is created with placeholder JSON values. Real values must be set
# manually in the AWS console (or via `aws secretsmanager put-secret-value`).
# `lifecycle.ignore_changes` tells Terraform NOT to overwrite the value on
# subsequent applies once it has been filled in.
#
# Keys consumed by the ECS backend task:
#   - DJANGO_SECRET_KEY
#   - DJANGO_ADMIN_USERNAME
#   - DJANGO_ADMIN_PASSWORD

resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.project_name}/prod/backend"
  description = "Django backend env vars. Fill values manually after first apply."

  tags = {
    Name = "${var.project_name}-backend-secret"
  }
}

resource "aws_secretsmanager_secret_version" "backend_initial" {
  secret_id = aws_secretsmanager_secret.backend.id

  secret_string = jsonencode({
    DJANGO_SECRET_KEY     = "sRl141g838HoIXWVabPRUZPNcT3ZtlHHhfs-nN5wkjde1F6lCJlxsUAqvsSb1XDA8VmtY1wk6deU-CGlLjqWVw"
    DJANGO_ADMIN_USERNAME = "FILL_ME_IN_AFTER_APPLY"
    DJANGO_ADMIN_PASSWORD = "FILL_ME_IN_AFTER_APPLY"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
