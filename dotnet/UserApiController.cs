using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.User;
using Sabio.Models.Enums;
using Sabio.Models.Requests.User;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;
        private IOrgInviteService _orgInviteService = null;

        public UserApiController(IUserService service,
            IEmailService emailService,
            ILogger<UserApiController> logger,
            IOrgInviteService orgInviteService,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
            _orgInviteService = orgInviteService;
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int id = _service.Create(model);
                if (id > 0)
                {
                    string token = Guid.NewGuid().ToString();
                    int tokenType = (int)TokenType.NewUser;
                    _service.AddToken(token, id, tokenType);
                    _emailService.Confirm(model.Email, token);
                }
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.ToString());
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost("orgs")]
        public ActionResult<SuccessResponse> Add(int userId, int orgId)
        {
            ObjectResult result = null;
            try
            {
                _service.AddUserOrgs(userId, orgId);
                ItemResponse<int> response = new ItemResponse<int>();
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.ToString());
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("confirm/{token}")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ConfirmUser(string token)
        {
            int code = 200;

            BaseResponse response = null;
            try
            {
                _service.ConfirmUser(token);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse>> Login(UserLogin model)
        {
            int code = 200;
            BaseResponse response = null;
            bool success = false;

            try
            {
                success = await _service.LogInAsync(model.Email, model.Password);
                if (success == false)
                {
                    code = 404;
                    response = new ErrorResponse("Login Error");
                }
                else
                {
                    response = new SuccessResponse();
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<UserV2>> CurrentUserV2()
        {
            int code = 200;
            BaseResponse response = null;
            UserBase user = (UserBase)_authService.GetCurrentUser();
            try
            {
                UserV2 aUser = _service.HasProfile(user.Id, user);
                if (aUser == null)
                {
                    code = 404;
                    response = new ErrorResponse("User not found.");
                }
                else
                {
                    response = new ItemResponse<UserV2>() { Item = aUser };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("logout")]
        public async Task<ActionResult<SuccessResponse>> LogOut()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                await _authService.LogOutAsync();
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("invite/{token}")]
        public ActionResult<SuccessResponse> Invite(string token)
        {
            int code = 200;

            BaseResponse response = null;
            try
            {
                //select by token
                _orgInviteService.GetInviteByToken(token);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}