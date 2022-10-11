using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class UserV2 : UserBase
    {
        public bool HasProfile { get; set; }
    }
}