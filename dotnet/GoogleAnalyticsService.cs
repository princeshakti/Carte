using Google.Apis.AnalyticsReporting.v4;
using Google.Apis.AnalyticsReporting.v4.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class GoogleAnalyticsService : IGoogleAnalyticsService
    {
        private AnalyticsReportingService _service = null;
        private AppKeys _appKeys = null;
        private IWebHostEnvironment _environment;

        public GoogleAnalyticsService(IWebHostEnvironment environment, IOptions<AppKeys> AppKeys)
        {
            _appKeys = AppKeys.Value;
            _environment = environment;

            var credential = GoogleCredential.FromFile($"{_environment.WebRootPath}/ServiceAccount.json")
                .CreateScoped(new[] { AnalyticsReportingService.Scope.AnalyticsReadonly });

            _service = new AnalyticsReportingService(
                new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential
                });
        }

        public GetReportsResponse GetData(GoogleAnalyticsAddRequest model)
        {
            object[] metricsStrings = model.Metrics.Split(",");
            List<Metric> metrics = new List<Metric>();
            for (int i = 0; i < metricsStrings.Length; i++)
            {
                metrics.Add(new Metric { Expression = $"{metricsStrings[i]}" });
            }
            object[] dimensionsStrings = model.Dimensions.Split(",");
            List<Dimension> dimensions = new List<Dimension>();
            for (int i = 0; i < dimensionsStrings.Length; i++)
            {
                dimensions.Add(new Dimension { Name = $"{dimensionsStrings[i]}" });
            }

            var request = _service.Reports.BatchGet(new GetReportsRequest
            {
                ReportRequests = new[] {
                        new ReportRequest{
                            DateRanges = model.DateRanges,
                            Dimensions = dimensions,
                            Metrics = metrics,
                            ViewId = _appKeys.GoogleAnalyticsViewId,
                            OrderBys = model.Order
                        }
                    }
            });

            var response = request.Execute();
            return response;
        }
    }
}