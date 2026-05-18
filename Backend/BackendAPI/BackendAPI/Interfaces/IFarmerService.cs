using BackendAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendAPI.Interfaces
{
    public interface IFarmerService
    {
        Task<RoleDashboardDto> GetDashboardAsync();
        Task<WalletDto> GetWalletAsync();
        Task<List<ContractDto>> GetContractsAsync();

        // ======================== NEW NOTIFICATION METHODS ========================
        /// <summary>
        /// Retrieves all notifications targeted to the currently logged-in farmer.
        /// </summary>
        Task<List<NotificationDto>> GetNotificationsAsync();

        /// <summary>
        /// Fires an alert log into the database. Can be called anywhere across the application pipeline.
        /// </summary>
        Task CreateNotificationAsync(int userId, string title, string message, string type);

        /// <summary>
        /// Marks a specific notification as seen when dismissed or clicked on the top bar menu.
        /// </summary>
        Task<bool> MarkAsReadAsync(int notificationId);
    }
}