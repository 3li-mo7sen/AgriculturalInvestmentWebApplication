using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class InvestorService : IInvestorService
    {
        private readonly AppDbContext _context;

        public InvestorService(AppDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL =================
        public async Task<List<InvestorDto>> GetAllAsync()
        {
            return await _context.Investors
                .Select(i => new InvestorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Email,
                    Balance = i.Balance
                })
                .ToListAsync();
        }

        // ================= GET BY ID =================
        public async Task<InvestorDto?> GetByIdAsync(int id)
        {
            return await _context.Investors
                .Where(i => i.Id == id)
                .Select(i => new InvestorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Email,
                    Balance = i.Balance
                })
                .FirstOrDefaultAsync();
        }
    }
}