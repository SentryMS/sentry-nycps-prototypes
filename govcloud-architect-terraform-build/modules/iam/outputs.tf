
output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "api_gateway_execution_role_arn" {
  description = "ARN of the API Gateway execution role"
  value       = aws_iam_role.api_gateway_execution_role.arn
}

output "iot_role_arn" {
  description = "ARN of the IoT role"
  value       = aws_iam_role.iot_role.arn
}

output "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_role.arn
}
