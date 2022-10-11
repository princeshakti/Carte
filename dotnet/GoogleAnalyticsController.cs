using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Requests;
using Sabio.Web.Models.Responses;
using Google.Apis.AnalyticsReporting.v4.Data;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/dashboard/analytics")]
    [ApiController]
    public class GoogleAnalyticsController : BaseApiController
    {
        private IGoogleAnalyticsService _service = null;

        public GoogleAnalyticsController(IGoogleAnalyticsService service, ILogger<GoogleAnalyticsController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost]
        public ActionResult GetData(GoogleAnalyticsAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                GetReportsResponse data = _service.GetData(model);
                response = new ItemResponse<GetReportsResponse> { Item = data };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}