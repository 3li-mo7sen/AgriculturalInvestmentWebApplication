using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using MimeKit;
using MailKit.Net.Smtp;

namespace BackendAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;
        public EmailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }


        public async Task SendEmail(EmailDTO emailDTO)
        {
            var message = new MimeMessage();

            message.From.Add(new MailboxAddress("Fadell Ramadan",configuration["EmailSetting:From"]));

            message.Subject = emailDTO.Subject;

            message.To.Add(new MailboxAddress( emailDTO.To,emailDTO.To));

            message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = emailDTO.Content
            };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                await smtp.ConnectAsync(
                    configuration["EmailSetting:Smtp"],
                    int.Parse(configuration["EmailSetting:Port"]),
                    MailKit.Security.SecureSocketOptions.StartTls);

                await smtp.AuthenticateAsync(
                    configuration["EmailSetting:Username"],
                    configuration["EmailSetting:Password"]);

                await smtp.SendAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
