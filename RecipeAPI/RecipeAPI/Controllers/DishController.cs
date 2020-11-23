using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RecipeAPI.Models;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishController : BaseController
    {
        private readonly DishContext _context;

        public DishController(DishContext context)
        {
            _context = context;
        }

        // GET: api/Dish
        [HttpGet]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<IEnumerable<Dish>>> GetDishes()
        { 
            int userId = GetUserId();

            return await _context.Dishes.Where(x => x.UserId == userId).ToListAsync();
        }

        // GET: api/Dish/5
        [HttpGet("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<Dish>> GetDish(long id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            int userId = GetUserId();

            if (dish == null)
            {
                return NotFound();
            }

            if (dish.UserId != userId)
            {
                return Unauthorized();
            }

            return dish;
        }

        // PUT: api/Dish/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<IActionResult> PutDish(long id)
        {
            /*
            if (id != dish.Id)
            {
                return BadRequest();
            }*/
            var dish = await _context.Dishes.FindAsync(id);
            int userId = GetUserId();

            if (dish.UserId != userId)
            {
                return Unauthorized();
            }

            _context.Entry(dish).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DishExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Dish
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<Dish>> PostDish(Dish dish)
        {
            //Add the userId from the token as a field
            dish.UserId = GetUserId();
            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDish", new { id = dish.Id }, dish);
        }

        // DELETE: api/Dish/5
        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<Dish>> DeleteDish(long id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
            {
                return NotFound();
            }

            int userId = GetUserId();

            if (dish.UserId != userId)
            {
                return Unauthorized();
            }

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();

            return dish;
        }

        private bool DishExists(long id)
        {
            return _context.Dishes.Any(e => e.Id == id);
        }

    }
}
