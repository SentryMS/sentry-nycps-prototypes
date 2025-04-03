
output "endpoint" {
  description = "IoT Core endpoint"
  value       = data.aws_iot_endpoint.endpoint.endpoint_address
}

# Data source to get the IoT endpoint
data "aws_iot_endpoint" "endpoint" {
  endpoint_type = "iot:Data-ATS"
}
