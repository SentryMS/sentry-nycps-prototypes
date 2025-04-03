
output "bucket_names" {
  description = "Names of the created S3 buckets"
  value       = [for name in var.buckets : aws_s3_bucket.bucket[name].bucket]
}

output "bucket_arns" {
  description = "ARNs of the created S3 buckets"
  value       = [for name in var.buckets : aws_s3_bucket.bucket[name].arn]
}
