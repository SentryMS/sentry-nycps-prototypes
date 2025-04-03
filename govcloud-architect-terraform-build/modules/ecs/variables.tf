
variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_subnets" {
  description = "IDs of private subnets"
  type        = list(string)
}

variable "task_execution_role" {
  description = "ARN of the task execution role"
  type        = string
}

variable "app_cluster_sg_id" {
  description = "ID of the app cluster security group"
  type        = string
}

variable "web_cluster_sg_id" {
  description = "ID of the web cluster security group"
  type        = string
}

variable "app_ecr_repository_url" {
  description = "URL of the app ECR repository"
  type        = string
}

variable "web_ecr_repository_url" {
  description = "URL of the web ECR repository"
  type        = string
}
