
variable "functions" {
  description = "Lambda functions to create"
  type = map(object({
    handler    = string
    runtime    = string
    source_dir = string
  }))
}

variable "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  type        = string
}
