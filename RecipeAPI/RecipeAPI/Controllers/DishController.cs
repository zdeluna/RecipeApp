using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.JsonPatch;
using RecipeAPI.Models;
using AutoMapper;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishController : BaseController
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public DishController(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
           
        }

        // GET: api/Dish
        [HttpGet]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<IEnumerable<Dish>>> GetDishes()
        { 
            int userId = GetUserId();

            return await _context.Dishes
                .Include(s => s.History)
                .AsNoTracking()
                .Where(x => x.UserID == userId)
                .ToListAsync();
        }

        // GET: api/Dish/5
        [HttpGet("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<DishResponse>> GetDish(long id)
        {
            var dish = await _context.Dishes
                .Include(s => s.History)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.ID == id);
           
            System.Diagnostics.Debugger.Break();
            if (dish == null)
            {
                return NotFound();
            }

            if (dish.UserID != GetUserId())
            {
                return Unauthorized();
            }


            return _mapper.Map<DishResponse>(dish);
        }

        // PATCH: api/Dish/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPatch("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<UpdateDishRequest>> PatchDish(long id, [FromBody] JsonPatchDocument<UpdateDishRequest> patchDish)
        {
            if (patchDish != null)
            {
                var dish = await _context.Dishes.FindAsync(id);

                if (dish == null)
                {
                    return NotFound();
                }
                int userId = GetUserId();

                if (dish.UserID != userId)
                {
                    return Unauthorized();
                }

                var updateDishRequest = _mapper.Map<UpdateDishRequest>(dish);
                patchDish.ApplyTo(updateDishRequest, ModelState);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _mapper.Map(updateDishRequest, dish);
                await _context.SaveChangesAsync();

                return NoContent();


            }
            else
            {
                return BadRequest(ModelState);
            }


        }

        // PUT: api/Dish/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, [FromBody] UpdateDishRequest updateDishRequest)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var dish = await _context.Dishes.FindAsync(id);
                if (dish == null) return NotFound();

                _mapper.Map(updateDishRequest, dish);

                await _context.SaveChangesAsync();

                return Ok(_mapper.Map<Dish, DishResponse>(dish));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DishExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return BadRequest("Error updating dish");
                }
            }

        }



        // POST: api/Dish
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<Dish>> PostDish(Dish dish)
        {
            //Add the userId from the token as a field
            dish.UserID = GetUserId();
            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();

            /*
            var history = new History[]
            {
                new History{DishID=dish.ID, Date="Saturday December 2nd"},
                new History{DishID=dish.ID, Date="Sunday December 3rd"}
            };

            _context.History.AddRange(history);*/
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDish", new { id = dish.ID }, dish);
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

            if (dish.UserID != userId)
            {
                return Unauthorized();
            }

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();

            return dish;
        }

        private bool DishExists(long id)
        {
            return _context.Dishes.Any(e => e.ID == id);
        }

    }
}
