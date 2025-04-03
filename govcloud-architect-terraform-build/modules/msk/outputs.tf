
output "bootstrap_brokers" {
  description = "Bootstrap brokers for the MSK cluster"
  value       = aws_msk_cluster.msk.bootstrap_brokers
}

output "bootstrap_brokers_tls" {
  description = "Bootstrap brokers for the MSK cluster (TLS)"
  value       = aws_msk_cluster.msk.bootstrap_brokers_tls
}

output "zookeeper_connect_string" {
  description = "Zookeeper connection string"
  value       = aws_msk_cluster.msk.zookeeper_connect_string
}
