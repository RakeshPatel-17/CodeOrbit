using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace NetApi.Services
{
    public class CloudflareR2Settings
    {
        public string AccessKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string ServiceURL { get; set; } = string.Empty;
        public string BucketName { get; set; } = string.Empty;
    }

    public class R2StorageService
    {
        private readonly AmazonS3Client _s3Client;
        private readonly string _bucketName;

        public R2StorageService(IOptions<CloudflareR2Settings> r2Settings)
        {
            var settings = r2Settings.Value;
            _bucketName = settings.BucketName;

            var config = new AmazonS3Config
            {
                ServiceURL = settings.ServiceURL,
                AuthenticationRegion = "auto" // R2 uses 'auto'
            };

            _s3Client = new AmazonS3Client(settings.AccessKey, settings.SecretKey, config);
        }

        public string GeneratePreSignedUrl(string objectKey, double expirationMinutes = 15)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Verb = HttpVerb.PUT // Usually PUT for uploads, GET for viewing
            };

            return _s3Client.GetPreSignedURL(request);
        }
    }
}