
output "api_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.api.id
}

output "invoke_url" {
  description = "URL to invoke the API Gateway"
  value       = "${aws_api_gateway_deployment.deployment.invoke_url}/${aws_api_gateway_resource.resource.path_part}"
}
