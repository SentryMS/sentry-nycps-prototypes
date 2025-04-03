// Work in progress: Index page content is subject to change.
// Authored by Kartik Shankar
// Authored date: March 30, 2025

import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">AWS GovCloud Terraform Architecture</h1>
        
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <p className="text-gray-700 mb-4">
              This project implements a comprehensive AWS GovCloud architecture using Terraform.
              The infrastructure follows security best practices for government cloud deployments 
              and includes various AWS services configured to work together in a secure environment.
            </p>
            <img 
              src="/placeholder.svg"
              alt="AWS GovCloud Architecture"
              className="w-full rounded-md shadow-md mb-4"
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Core Components</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>VPC with public and private subnets</li>
              <li>ECS clusters for containerized applications</li>
              <li>Container Registry for image management</li>
              <li>API Gateway for API management</li>
              <li>IoT Core for IoT device management</li>
              <li>MSK (Managed Streaming for Kafka)</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Security Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>IAM roles and policies with least privilege</li>
              <li>Security groups for network isolation</li>
              <li>GovCloud specific security configurations</li>
              <li>Encrypted storage and communications</li>
              <li>Secure authentication mechanisms</li>
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Data Components</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>DynamoDB for NoSQL data storage</li>
              <li>S3 buckets for object storage</li>
              <li>Lambda functions for serverless processing</li>
              <li>Data processing pipelines</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Configure AWS credentials for GovCloud</li>
              <li>Run <code className="bg-gray-100 px-1 rounded">terraform init</code></li>
              <li>Run <code className="bg-gray-100 px-1 rounded">terraform plan</code></li>
              <li>Apply with <code className="bg-gray-100 px-1 rounded">terraform apply</code></li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
