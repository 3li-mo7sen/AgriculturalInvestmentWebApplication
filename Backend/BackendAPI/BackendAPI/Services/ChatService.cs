using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ChatService
    {
        private readonly AppDbContext _context;

        public ChatService(AppDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET HISTORY
        // =========================================
        public async Task<object> GetHistoryAsync(int userId)
        {
            var history = await _context.ChatMessages
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.Message,
                    x.Response,
                    x.CreatedAt
                })
                .ToListAsync();

            return history;
        }

        // =========================================
        // SEND MESSAGE
        // =========================================
        public async Task<object> SendMessageAsync(int? userId, ChatRequest request)
        {
            bool isLoggedIn = userId != null;

            // AI CALL
            string aiResponse = await CallAI(request.Message);

            bool saveHistory = false;

            if (isLoggedIn)
            {
                var pref = await _context.UserChatPreferences
                    .FirstOrDefaultAsync(x => x.UserId == userId.Value);

                saveHistory = pref?.SaveHistory ?? false;
            }

            // SAVE CHAT
            if (saveHistory)
            {
                var chatMessage = new ChatMessage
                {
                    UserId = userId.Value,
                    Message = request.Message,
                    Response = aiResponse,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ChatMessages.Add(chatMessage);

                await _context.SaveChangesAsync();
            }

            return new
            {
                reply = aiResponse
            };
        }

        // =========================================
        // SET PREFERENCE
        // =========================================
        public async Task SetPreferenceAsync(int userId, bool saveHistory)
        {
            var pref = await _context.UserChatPreferences
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (pref == null)
            {
                pref = new UserChatPreference
                {
                    UserId = userId,
                    SaveHistory = saveHistory
                };

                _context.UserChatPreferences.Add(pref);
            }
            else
            {
                pref.SaveHistory = saveHistory;
            }

            await _context.SaveChangesAsync();
        }

        // =========================================
        // GET PREFERENCE
        // =========================================
        public async Task<bool> GetPreferenceAsync(int userId)
        {
            var pref = await _context.UserChatPreferences
                .FirstOrDefaultAsync(x => x.UserId == userId);

            return pref?.SaveHistory ?? false;
        }

        // =========================================
        // AI CALL
        // =========================================
        private async Task<string> CallAI(string message)
        {
            await Task.Delay(500);

            return $"AI Response For: {message}";
        }
    }
}