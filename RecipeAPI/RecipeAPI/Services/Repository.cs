using System;
using System.Collections.Generic;
using System.Linq;
using RecipeAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace RecipeAPI.Services
{
    public interface IRepository<TEntity>{
        public IQueryable<TEntity> GetAll();
        Task<TEntity> GetById(long id);
        Task<TEntity> Add(TEntity entity);
        Task<TEntity> Remove(long id);


    }


    public class Repository<TEntity>: IRepository<TEntity> where TEntity : class, new()
    {
        DbSet<TEntity> _dbSet;
        private readonly DatabaseContext _context;

        public Repository(DatabaseContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }
        
        public IQueryable<TEntity> GetAll()
        {
            return _context.Set<TEntity>();
        }

        public async Task<TEntity> GetById(long id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<TEntity> Add(TEntity entity)
        {
            _dbSet.Add(entity);

            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<TEntity> Remove(long id)
        {
            var entity  = await _dbSet.FindAsync(id);
            if (entity == null)
            {
                return null;
            }

            _dbSet.Remove(entity);
            
            await _context.SaveChangesAsync();

            return entity;
        }
    }
}
