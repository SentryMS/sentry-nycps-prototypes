
output "table_arns" {
  description = "ARNs of the created DynamoDB tables"
  value = {
    for name, _ in var.tables :
    name => aws_dynamodb_table.table[name].arn
  }
}

output "iot_table_arn" {
  description = "ARN of the IoT data DynamoDB table"
  value       = aws_dynamodb_table.iot_data.arn
}
