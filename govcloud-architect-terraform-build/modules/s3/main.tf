
resource "aws_s3_bucket" "bucket" {
  for_each = toset(var.buckets)
  
  bucket = each.value
  
  tags = {
    Name = each.value
  }
}

resource "aws_s3_bucket_ownership_controls" "ownership" {
  for_each = toset(var.buckets)
  
  bucket = aws_s3_bucket.bucket[each.value].id
  
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "acl" {
  for_each = toset(var.buckets)
  
  depends_on = [aws_s3_bucket_ownership_controls.ownership]
  
  bucket = aws_s3_bucket.bucket[each.value].id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "versioning" {
  for_each = toset(var.buckets)
  
  bucket = aws_s3_bucket.bucket[each.value].id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "encryption" {
  for_each = toset(var.buckets)
  
  bucket = aws_s3_bucket.bucket[each.value].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
