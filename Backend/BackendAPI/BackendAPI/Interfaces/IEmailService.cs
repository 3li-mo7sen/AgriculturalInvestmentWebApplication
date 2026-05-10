using BackendAPI.DTOs;

namespace BackendAPI.Interfaces
{
    public interface IEmailService
    {
        Task SendEmail(EmailDTO emailDTO);
    }
}
