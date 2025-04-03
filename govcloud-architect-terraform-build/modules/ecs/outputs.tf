
output "app_cluster_id" {
  description = "ID of the app ECS cluster"
  value       = aws_ecs_cluster.app_cluster.id
}

output "web_cluster_id" {
  description = "ID of the web ECS cluster"
  value       = aws_ecs_cluster.web_cluster.id
}

output "app_cluster_url" {
  description = "URL of the app load balancer"
  value       = aws_lb.app_lb.dns_name
}

output "web_cluster_url" {
  description = "URL of the web load balancer"
  value       = aws_lb.web_lb.dns_name
}
