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
using RecipeAPI.Services;
using AutoMapper;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishController : BaseController
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly IDishService _dishService;

        public DishController(DatabaseContext context, IMapper mapper, IDishService dishService)
        {
            _context = context;
            _mapper = mapper;
            _dishService = dishService;
        }

        // GET: api/Dish
        [HttpGet]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<IEnumerable<Dish>>> GetDishes()
        {
            long userId = GetUserId();

            var dishes = await _dishService.GetAll(userId);

            return Ok(dishes);
        }

        // GET: api/Dish/5
        [HttpGet("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<DishResponse>> GetDish(long id)
        {
            var dish = await _dishService.GetById(id);

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

                await _dishService.UpdatePartOfDish(id, patchDish, ModelState);

                return NoContent();
            }
            else
            {
                return BadRequest(ModelState);
            }


        }

        // PUT: api/Dish/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, [FromBody] UpdateDishRequest updateDishRequest)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var dish = await _dishService.UpdateEntireDish(id,updateDishRequest);

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
        [HttpPost]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<Dish>> PostDish(Dish dish)
        {
            //Add the userId from the token as a field
            dish.UserID = GetUserId();
            var newDish = await _dishService.Add(dish);
                       

            return CreatedAtAction("GetDish", new { id = dish.ID }, newDish);
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

            await _dishService.Remove(id);

            return dish;
        }

        private bool DishExists(long id)
        {
            return _context.Dishes.Any(e => e.ID == id);
        }

    }
}
