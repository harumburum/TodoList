using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using System.Security.Claims;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.ChangeTracking;
using Microsoft.Data.Entity.Internal;
using Microsoft.Framework.WebEncoders;
using TodoList.Web.Models;

namespace TodoList.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TodoController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public TodoController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IEnumerable<Todo>> Get()
        {
            var currentUser = await _userManager.FindByIdAsync(User.GetUserId());

            return _dbContext.Todos.ToList().Where(_ => _.User.Id == currentUser.Id);
        }

        [HttpPost]
        public async Task<Todo> Post([FromBody]Todo todo)
        {
            todo.User = await _userManager.FindByIdAsync(User.GetUserId());

            EntityEntry<Todo> entry = _dbContext.Todos.Add(todo);

            await _dbContext.SaveChangesAsync();

            return entry.Entity;
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put([FromBody]Todo todo)
        {
            var currentUser = await _userManager.FindByIdAsync(User.GetUserId());

            var entity = _dbContext.Todos.FirstOrDefault(_ => _.Id == todo.Id);
            if (entity == null)
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            if (entity.User.Id != currentUser.Id)
                return new HttpResponseMessage(HttpStatusCode.Unauthorized);

            entity.IsDone = todo.IsDone;
            await _dbContext.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpDelete("{id}")]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            var currentUser = await _userManager.FindByIdAsync(User.GetUserId());

            var entity = _dbContext.Todos.FirstOrDefault(_ => _.Id == id);
            if (entity == null)
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            if (entity.User.Id != currentUser.Id)
                return new HttpResponseMessage(HttpStatusCode.Unauthorized);

            _dbContext.Todos.Remove(entity);
            await _dbContext.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
