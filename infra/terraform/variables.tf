variable "aws_region" {
  type        = string
  default     = "sa-east-1"
  description = "AWS region for all resources."
}

variable "project_name" {
  type        = string
  default     = "yara-tattoo"
  description = "Used as a prefix for all named resources."
}

variable "github_owner" {
  type        = string
  description = "GitHub owner/organization (e.g. 'nncl')."
}

variable "github_repo" {
  type        = string
  description = "GitHub repository name (e.g. 'Univesp-PI-I')."
}

variable "github_branch" {
  type        = string
  default     = "main"
  description = "Branch allowed to assume the GitHub Actions deploy role via OIDC."
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR block for the VPC."
}

variable "db_instance_class" {
  type        = string
  default     = "db.t3.micro"
  description = "RDS instance class."
}

variable "db_allocated_storage" {
  type        = number
  default     = 20
  description = "RDS allocated storage in GB."
}

variable "db_name" {
  type        = string
  default     = "tattoo"
  description = "RDS initial database name."
}

variable "db_username" {
  type        = string
  default     = "tattoo"
  description = "RDS master username (password is auto-managed via Secrets Manager)."
}

variable "ecs_task_cpu" {
  type        = number
  default     = 256
  description = "Fargate task CPU units (1024 = 1 vCPU). 256 = 0.25 vCPU."
}

variable "ecs_task_memory" {
  type        = number
  default     = 512
  description = "Fargate task memory in MB."
}

variable "ecs_desired_count" {
  type        = number
  default     = 1
  description = "Desired number of running tasks per service."
}

variable "backend_image_tag" {
  type        = string
  default     = "latest"
  description = "Tag of the backend image to deploy."
}

variable "frontend_image_tag" {
  type        = string
  default     = "latest"
  description = "Tag of the frontend image to deploy."
}

variable "django_admin_email" {
  type        = string
  default     = "admin@example.com"
  description = "Non-sensitive admin email shown in Django."
}
