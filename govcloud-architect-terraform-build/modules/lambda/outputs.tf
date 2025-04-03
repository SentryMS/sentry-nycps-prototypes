
output "function_arns" {
  description = "ARNs of the created Lambda functions"
  value = {
    for name, _ in var.functions :
    name => aws_lambda_function.lambda[name].arn
  }
}

output "function_names" {
  description = "Names of the created Lambda functions"
  value = {
    for name, _ in var.functions :
    name => aws_lambda_function.lambda[name].function_name
  }
}
