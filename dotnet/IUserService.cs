using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public interface IUserService
    {
        int Create(UserAddRequest model);

        void AddUserOrgs(int userId, int orgId);

        Task<bool> LogInAsync(string email, string password);

        Task<bool> LogInTest(string email, string password, int id, string[] roles = null);

        void ConfirmUser(string token);

        void AddToken(string token, int userId, int tokenType);

        void DeleteToken(string token);

        UserV2 HasProfile(int userId, UserBase user);
    }
}