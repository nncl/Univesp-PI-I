output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "Public ALB DNS name."
}

output "alb_url" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "Public URL of the application."
}

output "ecr_backend_repository_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "Backend ECR repository URL."
}

output "ecr_frontend_repository_url" {
  value       = aws_ecr_repository.frontend.repository_url
  description = "Frontend ECR repository URL."
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_backend_service_name" {
  value = aws_ecs_service.backend.name
}

output "ecs_frontend_service_name" {
  value = aws_ecs_service.frontend.name
}

output "rds_endpoint" {
  value       = aws_db_instance.main.endpoint
  description = "RDS endpoint (host:port)."
  sensitive   = true
}

output "rds_master_user_secret_arn" {
  value       = aws_db_instance.main.master_user_secret[0].secret_arn
  description = "Secrets Manager ARN holding the RDS-managed master password."
}

output "backend_secret_arn" {
  value       = aws_secretsmanager_secret.backend.arn
  description = "Secrets Manager ARN holding Django env vars (fill values manually after first apply)."
}

output "github_actions_role_arn" {
  value       = aws_iam_role.github_actions.arn
  description = "Role ARN to set as the AWS_DEPLOY_ROLE_ARN GitHub Actions variable."
}
