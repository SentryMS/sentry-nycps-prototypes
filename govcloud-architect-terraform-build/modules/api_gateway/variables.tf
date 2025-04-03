
variable "name" {
  description = "Name for the API Gateway"
  type        = string
}

variable "description" {
  description = "Description for the API Gateway"
  type        = string
}

variable "execution_role_arn" {
  description = "ARN of the execution role for API Gateway"
  type        = string
}
