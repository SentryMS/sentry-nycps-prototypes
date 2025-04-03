
output "app_cluster_sg_id" {
  description = "ID of the application cluster security group"
  value       = aws_security_group.app_cluster_sg.id
}

output "web_cluster_sg_id" {
  description = "ID of the web cluster security group"
  value       = aws_security_group.web_cluster_sg.id
}

output "msk_security_group_id" {
  description = "ID of the MSK security group"
  value       = aws_security_group.msk_sg.id
}

output "iot_security_group_id" {
  description = "ID of the IoT security group"
  value       = aws_security_group.iot_sg.id
}
