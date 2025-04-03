
output "repository_urls" {
  description = "URLs of the created ECR repositories"
  value = {
    for name in var.repository_names :
    name => aws_ecr_repository.repo[name].repository_url
  }
}
