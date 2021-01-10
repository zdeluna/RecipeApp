using System;
using System.Collections.Generic;
using System.Linq;
using RecipeAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace RecipeAPI.Services
{
    public interface IRepository<TEntity>{
        Task<IEnumerable<TEntity>> GetAll();
        

    }


    public class Repository<TEntity>: IRepository<TEntity> where TEntity : class
    {
        DbSet<TEntity> _dbSet;
        private readonly DatabaseContext _context;

        public Repository(DatabaseContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }
        
        public async Task<IEnumerable<TEntity>> GetAll()
        {
            return await _dbSet.ToListAsync();
        }
    }
}
