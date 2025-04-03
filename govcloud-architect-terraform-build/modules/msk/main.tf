
resource "aws_msk_cluster" "msk" {
  cluster_name           = var.cluster_name
  kafka_version          = var.kafka_version
  number_of_broker_nodes = var.number_of_nodes
  
  broker_node_group_info {
    instance_type   = var.instance_type
    client_subnets  = var.subnet_ids
    security_groups = [var.security_group_id]
    
    storage_info {
      ebs_storage_info {
        volume_size = var.ebs_volume_size
      }
    }
  }
  
  encryption_info {
    encryption_in_transit {
      client_broker = "TLS"
      in_cluster    = true
    }
  }
  
  logging_info {
    broker_logs {
      cloudwatch_logs {
        enabled   = true
        log_group = aws_cloudwatch_log_group.msk_logs.name
      }
    }
  }
  
  tags = {
    Name = var.cluster_name
  }
}

resource "aws_cloudwatch_log_group" "msk_logs" {
  name              = "/msk/${var.cluster_name}"
  retention_in_days = 7
}
