// Work in progress: Terraform outputs are subject to change.
// Authored by Kartik Shankar
// Authored date: March 27, 2025

output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.vpc.vpc_id
}

output "app_cluster_url" {
  description = "URL of the app cluster"
  value       = module.ecs_clusters.app_cluster_url
}

output "web_cluster_url" {
  description = "URL of the web cluster"
  value       = module.ecs_clusters.web_cluster_url
}

output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = module.api_gateway.invoke_url
}

output "ecr_repository_urls" {
  description = "URLs of the ECR repositories"
  value       = module.ecr.repository_urls
}

output "dynamodb_table_arns" {
  description = "ARNs of the DynamoDB tables"
  value       = module.dynamodb.table_arns
}

output "s3_bucket_names" {
  description = "Names of the created S3 buckets"
  value       = module.s3.bucket_names
}

output "iot_endpoint" {
  description = "IoT Core endpoint"
  value       = module.iot_core.endpoint
}

output "msk_bootstrap_brokers" {
  description = "MSK bootstrap brokers"
  value       = module.msk.bootstrap_brokers
}
